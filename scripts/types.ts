/**
 * Shared types for image scraping and processing pipeline
 */

export type Category =
  | 'bollards'
  | 'license-plates'
  | 'road-lines'
  | 'street-signs'
  | 'fuel-stations'
  | 'utility-poles'
  | 'follow-cars'
  | 'flags'
  | 'driving-side'
  | 'domains'
  | 'area-codes';

export type Source = 'plonkit' | 'geomastr' | 'geohints' | 'original';

export interface ScrapedImage {
  /** Category the image belongs to */
  category: Category;
  /** ISO 3166-1 alpha-2 country code (lowercase) */
  countryCode: string;
  /** Source site */
  source: Source;
  /** Original URL where image was found */
  originalUrl: string;
  /** Local path after download */
  localPath?: string;
  /** Optional description */
  description?: string;
  /** Image hash for deduplication */
  hash?: string;
}

export interface ManifestEntry {
  /** Source site identifier */
  source: Source;
  /** Original URL */
  originalUrl: string;
  /** When the image was scraped */
  scrapedAt: string;
  /** Optional description */
  description?: string;
  /** SHA-256 hash of original image */
  hash?: string;
  /** Whether srcset sizes have been generated */
  processed?: boolean;
  /** Whether uploaded to R2 */
  uploaded?: boolean;
}

export interface Manifest {
  /** Version of manifest schema */
  version: number;
  /** Last updated timestamp */
  updatedAt: string;
  /** Map of image key to entry */
  entries: Record<string, ManifestEntry>;
}

export interface ProcessedImage {
  /** Base key (e.g., "bollards/de/de-001") */
  key: string;
  /** Paths to generated srcset images */
  sizes: {
    small: string;  // 400w
    medium: string; // 800w
    large: string;  // 1200w
  };
}

export const SRCSET_WIDTHS = [400, 800, 1200] as const;
export type SrcsetWidth = typeof SRCSET_WIDTHS[number];

export const CATEGORIES: Category[] = [
  'bollards',
  'license-plates',
  'road-lines',
  'street-signs',
  'fuel-stations',
  'utility-poles',
  'follow-cars',
  'flags',
  'driving-side',
  'domains',
  'area-codes',
];
