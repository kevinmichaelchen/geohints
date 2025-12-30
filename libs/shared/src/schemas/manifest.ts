/**
 * Manifest schema definitions for tracking scraped images.
 *
 * Uses Effect Schema with branded types for type safety and
 * Schema.Class for data models with methods.
 *
 * @module manifest
 */

import { Schema } from "effect";
import { Category, Source } from "./category";

// ---------------------------------------------------------------------------
// Branded Types
// ---------------------------------------------------------------------------

/**
 * Branded URL type - ensures string matches URL pattern.
 */
export const Url = Schema.String.pipe(Schema.pattern(/^https?:\/\/.+/), Schema.brand("Url"));
export type Url = typeof Url.Type;

/**
 * Branded SHA-256 hash type - ensures 64 hex characters.
 */
export const Sha256Hash = Schema.String.pipe(
  Schema.pattern(/^[a-f0-9]{64}$/),
  Schema.brand("Sha256Hash"),
);
export type Sha256Hash = typeof Sha256Hash.Type;

/**
 * ISO 3166-1 alpha-2 country code (2 uppercase letters).
 */
export const CountryCode = Schema.String.pipe(
  Schema.pattern(/^[A-Z]{2}$/),
  Schema.brand("CountryCode"),
);
export type CountryCode = typeof CountryCode.Type;

// ---------------------------------------------------------------------------
// Image Variants
// ---------------------------------------------------------------------------

/**
 * Responsive image variants at different widths.
 */
export const ImageVariants = Schema.Struct({
  /** 400px wide variant path */
  "400w": Schema.String,
  /** 800px wide variant path */
  "800w": Schema.String,
  /** 1200px wide variant path */
  "1200w": Schema.String,
});
export type ImageVariants = typeof ImageVariants.Type;

// ---------------------------------------------------------------------------
// Manifest Entry
// ---------------------------------------------------------------------------

/**
 * A single scraped image entry in the manifest.
 *
 * Uses Schema.Class to provide validation + serialization + methods.
 */
export class ManifestEntry extends Schema.Class<ManifestEntry>("ManifestEntry")({
  /** Unique identifier for this entry */
  id: Schema.String,
  /** Category of geographic hint */
  category: Category,
  /** Source website */
  source: Source,
  /** Country name */
  country: Schema.String,
  /** ISO 3166-1 alpha-2 country code */
  countryCode: CountryCode,
  /** Original source URL */
  sourceUrl: Url,
  /** SHA-256 hash of original image content for deduplication */
  contentHash: Sha256Hash,
  /** R2 paths for responsive image variants */
  variants: ImageVariants,
  /** Timestamp when image was scraped */
  scrapedAt: Schema.Date,
}) {
  /**
   * Generate srcset string for responsive images.
   */
  get srcset(): string {
    const baseUrl = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev";
    return [
      `${baseUrl}/${this.variants["400w"]} 400w`,
      `${baseUrl}/${this.variants["800w"]} 800w`,
      `${baseUrl}/${this.variants["1200w"]} 1200w`,
    ].join(", ");
  }

  /**
   * Get the default image URL (800w variant).
   */
  get defaultUrl(): string {
    const baseUrl = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev";
    return `${baseUrl}/${this.variants["800w"]}`;
  }

  /**
   * Create a unique key for deduplication.
   */
  get dedupeKey(): string {
    return this.contentHash;
  }
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

/**
 * The complete manifest containing all scraped images.
 */
export class Manifest extends Schema.Class<Manifest>("Manifest")({
  /** Manifest format version */
  version: Schema.Number,
  /** Last update timestamp */
  lastUpdated: Schema.Date,
  /** All manifest entries */
  entries: Schema.Array(ManifestEntry),
}) {
  /**
   * Group entries by category.
   */
  get byCategory(): Partial<Record<Category, readonly ManifestEntry[]>> {
    const groups: Partial<Record<Category, ManifestEntry[]>> = {};
    this.entries.forEach((entry) => {
      const cat = entry.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat]!.push(entry);
    });
    return groups;
  }

  /**
   * Group entries by source.
   */
  get bySource(): Partial<Record<Source, readonly ManifestEntry[]>> {
    const groups: Partial<Record<Source, ManifestEntry[]>> = {};
    this.entries.forEach((entry) => {
      const src = entry.source;
      if (!groups[src]) groups[src] = [];
      groups[src]!.push(entry);
    });
    return groups;
  }

  /**
   * Group entries by country code.
   */
  get byCountry(): Record<string, readonly ManifestEntry[]> {
    const groups: Record<string, ManifestEntry[]> = {};
    this.entries.forEach((entry) => {
      const code = entry.countryCode;
      if (!groups[code]) groups[code] = [];
      groups[code]!.push(entry);
    });
    return groups;
  }

  /**
   * Get all unique country codes.
   */
  get countryCodes(): readonly string[] {
    return [...new Set(this.entries.map((e) => e.countryCode))];
  }

  /**
   * Get all unique categories present in manifest.
   */
  get categories(): readonly Category[] {
    return [...new Set(this.entries.map((e) => e.category))];
  }

  /**
   * Get entries for a specific category and optionally country.
   */
  filter(category: Category, countryCode?: string): readonly ManifestEntry[] {
    return this.entries.filter(
      (e) =>
        e.category === category && (countryCode === undefined || e.countryCode === countryCode),
    );
  }

  /**
   * Check if an entry with the given content hash already exists.
   */
  hasHash(hash: Sha256Hash): boolean {
    return this.entries.some((e) => e.contentHash === hash);
  }

  /**
   * Add entries, deduplicating by content hash.
   */
  merge(newEntries: readonly ManifestEntry[]): Manifest {
    const existingHashes = new Set(this.entries.map((e) => e.contentHash));
    const uniqueNew = newEntries.filter((e) => !existingHashes.has(e.contentHash));
    return new Manifest({
      version: this.version,
      lastUpdated: new Date(),
      entries: [...this.entries, ...uniqueNew],
    });
  }
}

// ---------------------------------------------------------------------------
// Factory Functions
// ---------------------------------------------------------------------------

/**
 * Create an empty manifest.
 */
export const emptyManifest = (): Manifest =>
  new Manifest({
    version: 1,
    lastUpdated: new Date(),
    entries: [],
  });
