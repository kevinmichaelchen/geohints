/**
 * Configuration for scraping and image processing
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

export const config = {
  /** Directory for scraped images (gitignored) */
  scrapedDir: path.join(ROOT_DIR, 'scraped-images'),

  /** Manifest file location */
  manifestPath: path.join(ROOT_DIR, 'scraped-images', 'manifest.json'),

  /** R2 bucket name */
  r2Bucket: 'geohints-images',

  /** R2 account ID (from env) */
  r2AccountId: process.env.R2_ACCOUNT_ID || '',

  /** R2 access key ID (from env) */
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',

  /** R2 secret access key (from env) */
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',

  /** Public URL for R2 images */
  r2PublicUrl: process.env.R2_PUBLIC_URL || 'https://pub-xxx.r2.dev',

  /** WEBP quality (0-100) */
  webpQuality: 82,

  /** Srcset widths to generate */
  srcsetWidths: [400, 800, 1200] as const,

  /** Request delay to avoid rate limiting (ms) */
  requestDelay: 500,

  /** Max concurrent downloads */
  maxConcurrent: 3,

  /** User agent for requests */
  userAgent: 'GeoHints-Scraper/1.0 (Educational project)',
} as const;

export const sourceUrls = {
  plonkit: 'https://www.plonkit.net',
  geomastr: 'https://geomastr.com',
  geohints: 'https://geohints.com',
} as const;

/**
 * Map source category URLs to our category names
 */
export const categoryMappings: Record<string, Record<string, string>> = {
  plonkit: {
    '/bollards': 'bollards',
    '/plates': 'license-plates',
    '/road-markings': 'road-lines',
    '/signs': 'street-signs',
    '/poles': 'utility-poles',
    '/coverage': 'follow-cars',
  },
  geomastr: {
    // Will map after auditing
  },
  geohints: {
    // Will map after auditing
  },
};
