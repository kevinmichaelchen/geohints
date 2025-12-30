/**
 * Geomastr.com scraper using Effect Stream processing.
 *
 * Scrapes geographic hint images from geomastr.com with proper
 * rate limiting, error handling, and deduplication.
 *
 * @module geomastr
 */

import { Effect, Stream, Schema, Chunk } from "effect";
import * as cheerio from "cheerio";
import { HttpService } from "../services/http-service";
import { StorageService } from "../services/storage-service";
import { ParseError } from "../services/errors";
import { ScraperConfig } from "../config/scraper-config";
import { Category, CountryCode, ManifestEntry, Manifest, Url } from "../../../shared/src/schemas";

// ---------------------------------------------------------------------------
// Site-specific Schemas
// ---------------------------------------------------------------------------

/**
 * Parsed country data from geomastr page.
 */
const GeomastrCountry = Schema.Struct({
  name: Schema.String,
  code: Schema.String,
  images: Schema.Array(Schema.String),
});
type GeomastrCountry = typeof GeomastrCountry.Type;

// ---------------------------------------------------------------------------
// HTML Parsing
// ---------------------------------------------------------------------------

// Map our category names to geomastr URL paths (they use different naming)
const CATEGORY_TO_PATH: Record<string, string> = {
  bollards: "bollards",
  "license-plates": "licenseplates",
  "road-lines": "roadlines",
  "street-signs": "streetsigns",
  "utility-poles": "utilitypoles",
};

// Common country name to ISO code mappings
const COUNTRY_CODES: Record<string, string> = {
  "united states": "US",
  usa: "US",
  "united kingdom": "GB",
  uk: "GB",
  "south korea": "KR",
  "north korea": "KP",
  "south africa": "ZA",
  "new zealand": "NZ",
  "czech republic": "CZ",
  czechia: "CZ",
  uae: "AE",
  "united arab emirates": "AE",
  austria: "AT",
  australia: "AU",
  germany: "DE",
  france: "FR",
  spain: "ES",
  italy: "IT",
  netherlands: "NL",
  belgium: "BE",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  finland: "FI",
  poland: "PL",
  portugal: "PT",
  switzerland: "CH",
  ireland: "IE",
  greece: "GR",
  japan: "JP",
  china: "CN",
  india: "IN",
  brazil: "BR",
  argentina: "AR",
  mexico: "MX",
  canada: "CA",
  russia: "RU",
};

/**
 * Extract country code from country name or slug.
 */
const getCountryCode = (name: string): string => {
  const lower = name.toLowerCase().trim();
  return COUNTRY_CODES[lower] ?? name.slice(0, 2).toUpperCase();
};

/**
 * Extract country name from image URL path.
 * e.g., /assets/media/bollards/austria.jpg -> "Austria"
 */
const extractCountryFromPath = (path: string): string => {
  const filename = path.split("/").pop() ?? "";
  // Remove extension and trailing numbers (austria2.jpg -> austria)
  const slug = filename.replace(/\d*\.\w+$/, "");
  // Convert slug to title case (united-states -> United States)
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Parse country data from geomastr HTML.
 * Geomastr uses H3 headings like "### Austria Bollards" with images in /assets/media/{category}/
 */
const parseCountryData = Effect.fn("Geomastr.parseCountryData")(function* (
  html: string,
  category: Category,
) {
  yield* Effect.annotateCurrentSpan("category", category);

  const $ = cheerio.load(html);
  // Use mutable arrays during parsing, convert to GeomastrCountry at the end
  const countryMap = new Map<string, { name: string; code: string; images: string[] }>();

  // Category path in URLs - use mapping since geomastr uses different naming
  const categoryPath = CATEGORY_TO_PATH[category] ?? category;

  // Find all images that are in the category directory
  $("img").each((_, img) => {
    const src = $(img).attr("src") ?? $(img).attr("data-src") ?? "";

    // Check if this is an image for our category
    if (src.includes(`/assets/media/${categoryPath}/`) || src.includes(`/${categoryPath}/`)) {
      const fullUrl = src.startsWith("http") ? src : `https://geomastr.com${src}`;
      const countryName = extractCountryFromPath(src);
      const countryCode = getCountryCode(countryName);

      // Group images by country
      const existing = countryMap.get(countryCode);
      if (existing) {
        existing.images.push(fullUrl);
      } else {
        countryMap.set(countryCode, {
          name: countryName,
          code: countryCode,
          images: [fullUrl],
        });
      }
    }
  });

  // Convert map to array (types are compatible with GeomastrCountry)
  const countries: GeomastrCountry[] = Array.from(countryMap.values());

  // Fallback: try to find all images if no category-specific images found
  if (countries.length === 0) {
    const allImages: string[] = [];
    $("img").each((_, img) => {
      const src = $(img).attr("src") ?? $(img).attr("data-src");
      if (src && !src.includes("/flags/")) {
        const fullUrl = src.startsWith("http") ? src : `https://geomastr.com${src}`;
        allImages.push(fullUrl);
      }
    });

    if (allImages.length > 0) {
      countries.push({
        name: "Unknown",
        code: "XX",
        images: allImages,
      });
    }
  }

  yield* Effect.annotateCurrentSpan("countryCount", countries.length);

  if (countries.length === 0) {
    return yield* Effect.fail(
      new ParseError({
        source: `geomastr/${category}`,
        message: "No country data found in HTML",
      }),
    );
  }

  return countries as readonly GeomastrCountry[];
});

// ---------------------------------------------------------------------------
// Image Processing
// ---------------------------------------------------------------------------

/**
 * Download and process a single image.
 */
const processImage = Effect.fn("Geomastr.processImage")(function* (
  category: Category,
  country: GeomastrCountry,
  imageUrl: string,
  index: number,
) {
  yield* Effect.annotateCurrentSpan("category", category);
  yield* Effect.annotateCurrentSpan("country", country.name);
  yield* Effect.annotateCurrentSpan("imageUrl", imageUrl);
  yield* Effect.annotateCurrentSpan("index", index);

  const http = yield* HttpService;
  const storage = yield* StorageService;

  // Download image
  const imageData = yield* http.fetchImage(imageUrl);

  // Compute content hash for deduplication
  const contentHash = yield* storage.hashContent(imageData);

  // Generate unique ID
  const id = `${category}-geomastr-${country.code.toLowerCase()}-${index}`;

  // Generate file paths
  const basePath = `${category}/${country.code.toLowerCase()}`;
  const filename = `${contentHash.slice(0, 8)}`;

  // For now, save original image (TODO: add image processing for variants)
  const originalPath = `${basePath}/${filename}.webp`;
  yield* storage.saveImage(originalPath, imageData);

  // Create manifest entry
  const countryCode = country.code.toUpperCase().slice(0, 2) as CountryCode;
  const sourceUrl = imageUrl as Url;

  return new ManifestEntry({
    id,
    category,
    source: "geomastr",
    country: country.name,
    countryCode,
    sourceUrl,
    contentHash,
    variants: {
      "400w": `${basePath}/${filename}-400w.webp`,
      "800w": `${basePath}/${filename}-800w.webp`,
      "1200w": `${basePath}/${filename}-1200w.webp`,
    },
    scrapedAt: new Date(),
  });
});

// ---------------------------------------------------------------------------
// Main Scraper
// ---------------------------------------------------------------------------

/**
 * Scrape a category from geomastr.com.
 *
 * Uses Stream-based processing for efficient handling of multiple images.
 */
export const scrapeGeomastr = Effect.fn("Geomastr.scrape")(function* (category: Category) {
  yield* Effect.annotateCurrentSpan("category", category);
  yield* Effect.annotateCurrentSpan("source", "geomastr");

  const http = yield* HttpService;
  const storage = yield* StorageService;
  const config = yield* ScraperConfig;

  yield* Effect.log(`Scraping ${category} from geomastr.com...`);

  // Fetch category page
  const categoryUrl = `https://geomastr.com/${category}`;
  const html = yield* http.fetchHtml(categoryUrl);

  // Parse country data
  const countries = yield* parseCountryData(html, category);
  yield* Effect.log(`Found ${countries.length} countries`);

  // Read existing manifest for deduplication
  const existingManifest = yield* storage.readManifest().pipe(
    Effect.catchAll(() =>
      Effect.succeed(
        new Manifest({
          version: 1,
          lastUpdated: new Date(),
          entries: [],
        }),
      ),
    ),
  );
  const existingHashes = new Set(existingManifest.entries.map((e: ManifestEntry) => e.contentHash));

  // Count total images for progress tracking
  const totalImages = countries.reduce((sum, c) => sum + c.images.length, 0);
  const logInterval = Math.max(5, Math.floor(totalImages / 20)); // Log every 5% or 5 images
  let processed = 0;
  let succeeded = 0;
  let skipped = 0;
  let failed = 0;

  yield* Effect.log(`Processing ${totalImages} images from ${countries.length} countries...`);

  // Stream process all images
  const entries = yield* Stream.fromIterable(countries).pipe(
    // Flatten to (country, imageUrl, index) tuples
    Stream.flatMap((country) =>
      Stream.fromIterable(country.images).pipe(
        Stream.zipWithIndex,
        Stream.map(([imageUrl, index]) => ({
          country,
          imageUrl,
          index,
        })),
      ),
    ),
    // Process each image with controlled concurrency
    Stream.mapEffect(
      ({ country, imageUrl, index }) =>
        processImage(category, country, imageUrl, index).pipe(
          // Skip if already exists (deduplication)
          Effect.filterOrFail(
            (entry) => !existingHashes.has(entry.contentHash),
            () =>
              new ParseError({
                source: imageUrl,
                message: "Duplicate image (already in manifest)",
              }),
          ),
          Effect.tap(() => {
            succeeded++;
            return Effect.void;
          }),
          // Catch individual errors and continue
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              if (error._tag === "ParseError" && error.message.includes("Duplicate")) {
                skipped++;
              } else {
                failed++;
                yield* Effect.logWarning(`Skipping ${imageUrl}: ${error._tag}`);
              }
              return null as ManifestEntry | null;
            }),
          ),
          // Log progress periodically
          Effect.tap(() => {
            processed++;
            if (processed % logInterval === 0 || processed === totalImages) {
              const pct = Math.round((processed / totalImages) * 100);
              return Effect.log(
                `Progress: ${processed}/${totalImages} (${pct}%) - ` +
                  `new: ${succeeded}, skipped: ${skipped}, failed: ${failed}`,
              );
            }
            return Effect.void;
          }),
        ),
      { concurrency: config.concurrency },
    ),
    // Filter out nulls (failed/skipped images)
    Stream.filter((entry): entry is ManifestEntry => entry !== null),
    Stream.runCollect,
  );

  yield* Effect.annotateCurrentSpan("entriesScraped", Chunk.size(entries));
  yield* Effect.annotateCurrentSpan("skipped", skipped);
  yield* Effect.annotateCurrentSpan("failed", failed);
  yield* Effect.log(
    `Completed: ${Chunk.size(entries)} new images scraped, ${skipped} skipped, ${failed} failed`,
  );

  return entries;
});

/**
 * Scrape all categories from geomastr.com.
 */
export const scrapeAllGeomastr = Effect.fn("Geomastr.scrapeAll")(function* () {
  yield* Effect.annotateCurrentSpan("source", "geomastr");

  const storage = yield* StorageService;

  // Categories available on geomastr
  const geomastrCategories: readonly Category[] = [
    "bollards",
    "license-plates",
    "road-lines",
    "street-signs",
    "utility-poles",
    "guardrails",
    "road-markings",
  ];

  yield* Effect.annotateCurrentSpan("categoryCount", geomastrCategories.length);
  yield* Effect.log(`Scraping ${geomastrCategories.length} categories from geomastr.com...`);

  // Track progress across categories
  const total = geomastrCategories.length;
  let completed = 0;
  let categoryFailed = 0;

  // Process each category sequentially to avoid overwhelming the server
  const allEntries = yield* Effect.forEach(
    geomastrCategories,
    (category) =>
      scrapeGeomastr(category).pipe(
        Effect.tap((entries) =>
          Effect.gen(function* () {
            completed++;
            yield* Effect.log(
              `Category progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%) - ` +
                `completed: ${category} with ${Chunk.size(entries)} new images`,
            );
          }),
        ),
        Effect.catchAll((error) =>
          Effect.gen(function* () {
            completed++;
            categoryFailed++;
            yield* Effect.logWarning(
              `Category progress: ${completed}/${total} - failed: ${category} (${error._tag})`,
            );
            return Chunk.empty<ManifestEntry>();
          }),
        ),
      ),
    { concurrency: 1 },
  );

  // Combine all entries
  const entries = allEntries.flatMap((chunk) => Chunk.toArray(chunk));

  // Read existing manifest and merge
  const existingManifest = yield* storage.readManifest().pipe(
    Effect.catchAll(() =>
      Effect.succeed(
        new Manifest({
          version: 1,
          lastUpdated: new Date(),
          entries: [],
        }),
      ),
    ),
  );

  const newManifest = existingManifest.merge(entries);

  // Save updated manifest
  yield* storage.writeManifest(newManifest);

  yield* Effect.annotateCurrentSpan("totalEntries", newManifest.entries.length);
  yield* Effect.annotateCurrentSpan("newEntries", entries.length);
  yield* Effect.annotateCurrentSpan("categoriesFailed", categoryFailed);
  yield* Effect.log(
    `Completed: ${entries.length} new images from ${total - categoryFailed} categories, ` +
      `${categoryFailed} categories failed, ${newManifest.entries.length} total entries`,
  );

  return newManifest;
});
