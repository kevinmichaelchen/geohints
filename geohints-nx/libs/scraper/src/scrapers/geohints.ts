/**
 * Geohints.com scraper using Effect Stream processing.
 *
 * Scrapes geographic hint images from geohints.com with proper
 * rate limiting, error handling, and deduplication.
 *
 * URL Pattern: /meta/{camelCaseName}
 * Image CDN: https://ocsc00skc0wokcs8kw8g8k84.geohints.com/storage/{category}/
 *
 * @module geohints
 */

import { Effect, Stream, Chunk } from "effect"
import * as cheerio from "cheerio"
import { HttpService } from "../services/http-service"
import { StorageService } from "../services/storage-service"
import { ParseError, type HttpServiceError, type StorageServiceError } from "../services/errors"
import { ScraperConfig } from "../config/scraper-config"
import {
  Category,
  CountryCode,
  ManifestEntry,
  Manifest,
  Url,
} from "../../../shared/src/schemas"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GEOHINTS_BASE_URL = "https://geohints.com"
const GEOHINTS_CDN_URL = "https://ocsc00skc0wokcs8kw8g8k84.geohints.com/storage"

/**
 * Map from our kebab-case categories to geohints.com camelCase URL paths.
 */
const CATEGORY_TO_PATH: Record<string, string> = {
  "bollards": "bollards",
  "license-plates": "licensePlates",
  "road-lines": "lines",
  "street-signs": "signs",
  "utility-poles": "utilityPoles",
  "phone-booths": "phoneNumbers",
  "post-boxes": "postBoxes",
  "traffic-lights": "trafficLights",
  "house-numbers": "houseNumbers",
  "follow-cars": "followCars",
  "google-cars": "googleVehicles/cars",
  "architecture": "architecture",
  "scripts": "languages",
  "languages": "languages",
  "speed-limits": "signs/speed",
}

/**
 * Categories available on geohints.com.
 */
const GEOHINTS_CATEGORIES: readonly Category[] = [
  "bollards",
  "license-plates",
  "road-lines",
  "utility-poles",
  "post-boxes",
  "traffic-lights",
  "house-numbers",
  "follow-cars",
  "architecture",
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GeohintImage {
  readonly country: string
  readonly countryCode: string
  readonly imageUrl: string
  readonly metadata?: string
}

// ---------------------------------------------------------------------------
// HTML Parsing
// ---------------------------------------------------------------------------

/**
 * Extract country code from country name using common mappings.
 */
const extractCountryCode = (countryName: string): string => {
  const name = countryName.toLowerCase().trim()

  // Common country name to code mappings
  const mappings: Record<string, string> = {
    "united states": "US",
    "usa": "US",
    "united kingdom": "GB",
    "uk": "GB",
    "south korea": "KR",
    "north korea": "KP",
    "south africa": "ZA",
    "new zealand": "NZ",
    "czech republic": "CZ",
    "czechia": "CZ",
    "uae": "AE",
    "united arab emirates": "AE",
  }

  if (mappings[name]) {
    return mappings[name]
  }

  // Default: first two letters uppercase
  return countryName.slice(0, 2).toUpperCase()
}

/**
 * Parse image data from geohints HTML.
 * Geohints uses a flat structure with images referencing their CDN.
 */
const parseGeohintImages = (
  html: string,
  category: Category
): Effect.Effect<readonly GeohintImage[], ParseError> =>
  Effect.gen(function* () {
    const $ = cheerio.load(html)
    const images: GeohintImage[] = []
    const cdnPath = CATEGORY_TO_PATH[category] ?? category

    // Find all images that reference the geohints CDN
    $("img").each((_, element) => {
      const $img = $(element)
      const src = $img.attr("src") ?? $img.attr("data-src") ?? ""

      if (src.includes(GEOHINTS_CDN_URL) || src.includes("/storage/")) {
        const fullUrl = src.startsWith("http") ? src : `${GEOHINTS_BASE_URL}${src}`

        // Try to extract country from URL path or filename
        // e.g., /storage/licensePlates/South_Africa_Eastern_Cape.jpg
        const filename = src.split("/").pop() ?? ""
        const countryMatch = filename.match(/^([A-Za-z_]+)(?:_\d+)?\./)
        const country = countryMatch
          ? countryMatch[1].replace(/_/g, " ")
          : "Unknown"

        // Look for nearby text that might indicate country
        const parentText = $img.parent().text().trim()
        const headerText = $img.closest("section, div").find("h2, h3, h4").first().text().trim()

        const countryName = headerText || country
        const countryCode = extractCountryCode(countryName)

        images.push({
          country: countryName,
          countryCode,
          imageUrl: fullUrl,
          metadata: parentText.slice(0, 100),
        })
      }
    })

    // Also find images with relative paths matching the category
    $(`img[src*="${cdnPath}"], img[data-src*="${cdnPath}"]`).each((_, element) => {
      const $img = $(element)
      const src = $img.attr("src") ?? $img.attr("data-src") ?? ""

      if (!src.includes(GEOHINTS_CDN_URL)) {
        const fullUrl = src.startsWith("http") ? src : `${GEOHINTS_CDN_URL}/${cdnPath}/${src.split("/").pop()}`

        const filename = src.split("/").pop() ?? ""
        const country = filename.replace(/[-_]/g, " ").replace(/\.\w+$/, "")
        const countryCode = extractCountryCode(country)

        images.push({
          country,
          countryCode,
          imageUrl: fullUrl,
        })
      }
    })

    if (images.length === 0) {
      return yield* Effect.fail(
        new ParseError({
          source: `geohints/${category}`,
          message: "No images found in HTML",
        })
      )
    }

    // Deduplicate by URL
    const uniqueImages = Array.from(
      new Map(images.map((img) => [img.imageUrl, img])).values()
    )

    return uniqueImages
  })

// ---------------------------------------------------------------------------
// Image Processing
// ---------------------------------------------------------------------------

/**
 * Download and process a single image from geohints.
 */
const processGeohintImage = (
  category: Category,
  image: GeohintImage,
  index: number
): Effect.Effect<
  ManifestEntry,
  HttpServiceError | StorageServiceError | ParseError,
  HttpService | StorageService | ScraperConfig
> =>
  Effect.gen(function* () {
    const http = yield* HttpService
    const storage = yield* StorageService

    // Download image
    const imageData = yield* http.fetchImage(image.imageUrl)

    // Compute content hash for deduplication
    const contentHash = yield* storage.hashContent(imageData)

    // Generate unique ID
    const id = `${category}-geohints-${image.countryCode.toLowerCase()}-${index}`

    // Generate file paths
    const basePath = `${category}/${image.countryCode.toLowerCase()}`
    const filename = contentHash.slice(0, 8)

    // Save original image
    const originalPath = `${basePath}/${filename}.webp`
    yield* storage.saveImage(originalPath, imageData)

    // Create manifest entry
    const countryCode = image.countryCode.toUpperCase().slice(0, 2) as CountryCode
    const sourceUrl = image.imageUrl as Url

    return new ManifestEntry({
      id,
      category,
      source: "geohints",
      country: image.country,
      countryCode,
      sourceUrl,
      contentHash,
      variants: {
        "400w": `${basePath}/${filename}-400w.webp`,
        "800w": `${basePath}/${filename}-800w.webp`,
        "1200w": `${basePath}/${filename}-1200w.webp`,
      },
      scrapedAt: new Date(),
    })
  })

// ---------------------------------------------------------------------------
// Main Scraper
// ---------------------------------------------------------------------------

/**
 * Scrape a category from geohints.com.
 */
export const scrapeGeohints = (
  category: Category
): Effect.Effect<
  Chunk.Chunk<ManifestEntry>,
  HttpServiceError | StorageServiceError | ParseError,
  HttpService | StorageService | ScraperConfig
> =>
  Effect.gen(function* () {
    const http = yield* HttpService
    const storage = yield* StorageService
    const config = yield* ScraperConfig

    const urlPath = CATEGORY_TO_PATH[category]
    if (!urlPath) {
      return yield* Effect.fail(
        new ParseError({
          source: `geohints/${category}`,
          message: `Category ${category} not available on geohints.com`,
        })
      )
    }

    yield* Effect.log(`Scraping ${category} from geohints.com...`)

    // Fetch category page
    const categoryUrl = `${GEOHINTS_BASE_URL}/meta/${urlPath}`
    yield* Effect.log(`Fetching: ${categoryUrl}`)

    const html = yield* http.fetchHtml(categoryUrl)

    // Parse images
    const images = yield* parseGeohintImages(html, category)
    yield* Effect.log(`Found ${images.length} images`)

    // Read existing manifest for deduplication
    const existingManifest = yield* storage.readManifest().pipe(
      Effect.catchAll(() =>
        Effect.succeed(
          new Manifest({
            version: 1,
            lastUpdated: new Date(),
            entries: [],
          })
        )
      )
    )
    const existingHashes = new Set(
      existingManifest.entries.map((e: ManifestEntry) => e.contentHash)
    )

    // Stream process all images
    const entries = yield* Stream.fromIterable(images).pipe(
      Stream.zipWithIndex,
      Stream.mapEffect(
        ([image, index]) =>
          processGeohintImage(category, image, index).pipe(
            Effect.tap((entry) =>
              Effect.log(`Processed: ${entry.country} - ${entry.id}`)
            ),
            // Skip if already exists (deduplication)
            Effect.filterOrFail(
              (entry) => !existingHashes.has(entry.contentHash),
              () =>
                new ParseError({
                  source: image.imageUrl,
                  message: "Duplicate image (already in manifest)",
                })
            ),
            // Catch individual errors and continue
            Effect.catchAll((error) =>
              Effect.gen(function* () {
                yield* Effect.logWarning(`Skipping ${image.imageUrl}: ${error._tag}`)
                return null as ManifestEntry | null
              })
            )
          ),
        { concurrency: config.concurrency }
      ),
      Stream.filter((entry): entry is ManifestEntry => entry !== null),
      Stream.runCollect
    )

    yield* Effect.log(`Scraped ${Chunk.size(entries)} new images`)

    return entries
  })

/**
 * Scrape all categories from geohints.com.
 */
export const scrapeAllGeohints = (): Effect.Effect<
  Manifest,
  HttpServiceError | StorageServiceError | ParseError,
  HttpService | StorageService | ScraperConfig
> =>
  Effect.gen(function* () {
    const storage = yield* StorageService

    yield* Effect.log(
      `Scraping ${GEOHINTS_CATEGORIES.length} categories from geohints.com...`
    )

    // Process each category sequentially to avoid overwhelming the server
    const allEntries = yield* Effect.forEach(
      GEOHINTS_CATEGORIES,
      (category) =>
        scrapeGeohints(category).pipe(
          Effect.catchAll((error) =>
            Effect.gen(function* () {
              yield* Effect.logWarning(`Failed to scrape ${category}: ${error._tag}`)
              return Chunk.empty<ManifestEntry>()
            })
          )
        ),
      { concurrency: 1 }
    )

    // Combine all entries
    const entries = allEntries.flatMap((chunk) => Chunk.toArray(chunk))

    // Read existing manifest and merge
    const existingManifest = yield* storage.readManifest().pipe(
      Effect.catchAll(() =>
        Effect.succeed(
          new Manifest({
            version: 1,
            lastUpdated: new Date(),
            entries: [],
          })
        )
      )
    )

    const newManifest = existingManifest.merge(entries)

    // Save updated manifest
    yield* storage.writeManifest(newManifest)

    yield* Effect.log(
      `Manifest updated: ${newManifest.entries.length} total entries`
    )

    return newManifest
  })
