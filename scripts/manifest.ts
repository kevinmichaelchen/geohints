/**
 * Manifest manager for tracking scraped images
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';
import type { Manifest, ManifestEntry, Category, Source } from './types.js';

const MANIFEST_VERSION = 1;

/**
 * Load manifest from disk, creating if doesn't exist
 */
export async function loadManifest(): Promise<Manifest> {
  try {
    const data = await fs.readFile(config.manifestPath, 'utf-8');
    return JSON.parse(data) as Manifest;
  } catch {
    // Create new manifest
    const manifest: Manifest = {
      version: MANIFEST_VERSION,
      updatedAt: new Date().toISOString(),
      entries: {},
    };
    await saveManifest(manifest);
    return manifest;
  }
}

/**
 * Save manifest to disk
 */
export async function saveManifest(manifest: Manifest): Promise<void> {
  manifest.updatedAt = new Date().toISOString();
  await fs.mkdir(path.dirname(config.manifestPath), { recursive: true });
  await fs.writeFile(config.manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Generate a unique key for an image
 * Format: {category}/{countryCode}/{countryCode}-{sequence}
 */
export function generateImageKey(
  category: Category,
  countryCode: string,
  sequence: number
): string {
  const seq = String(sequence).padStart(3, '0');
  const cc = countryCode.toLowerCase();
  return `${category}/${cc}/${cc}-${seq}`;
}

/**
 * Get next sequence number for a country in a category
 */
export function getNextSequence(
  manifest: Manifest,
  category: Category,
  countryCode: string
): number {
  const cc = countryCode.toLowerCase();
  const prefix = `${category}/${cc}/${cc}-`;

  let maxSeq = 0;
  for (const key of Object.keys(manifest.entries)) {
    if (key.startsWith(prefix)) {
      const seqStr = key.slice(prefix.length);
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  return maxSeq + 1;
}

/**
 * Check if an image already exists by hash
 */
export function findByHash(manifest: Manifest, hash: string): string | null {
  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (entry.hash === hash) {
      return key;
    }
  }
  return null;
}

/**
 * Add or update an entry in the manifest
 */
export function addEntry(
  manifest: Manifest,
  key: string,
  entry: ManifestEntry
): void {
  manifest.entries[key] = entry;
}

/**
 * Get all entries for a category
 */
export function getEntriesByCategory(
  manifest: Manifest,
  category: Category
): Array<[string, ManifestEntry]> {
  return Object.entries(manifest.entries).filter(([key]) =>
    key.startsWith(`${category}/`)
  );
}

/**
 * Get all entries for a country in a category
 */
export function getEntriesByCountry(
  manifest: Manifest,
  category: Category,
  countryCode: string
): Array<[string, ManifestEntry]> {
  const cc = countryCode.toLowerCase();
  return Object.entries(manifest.entries).filter(([key]) =>
    key.startsWith(`${category}/${cc}/`)
  );
}

/**
 * Get manifest statistics
 */
export function getStats(manifest: Manifest): {
  total: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
  processed: number;
  uploaded: number;
} {
  const byCategory: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let processed = 0;
  let uploaded = 0;

  for (const [key, entry] of Object.entries(manifest.entries)) {
    const category = key.split('/')[0];
    byCategory[category] = (byCategory[category] || 0) + 1;
    bySource[entry.source] = (bySource[entry.source] || 0) + 1;
    if (entry.processed) processed++;
    if (entry.uploaded) uploaded++;
  }

  return {
    total: Object.keys(manifest.entries).length,
    byCategory,
    bySource,
    processed,
    uploaded,
  };
}
