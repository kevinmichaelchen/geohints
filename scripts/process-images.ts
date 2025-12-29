/**
 * Image processing pipeline using Sharp
 * Converts images to WEBP and generates srcset sizes
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import crypto from 'node:crypto';
import { config } from './config.js';
import {
  loadManifest,
  saveManifest,
  getNextSequence,
  findByHash,
  addEntry,
  generateImageKey,
  getStats,
} from './manifest.js';
import type { Category, Source, ManifestEntry, ProcessedImage } from './types.js';

/**
 * Calculate SHA-256 hash of a file
 */
export async function hashFile(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Process a single image: convert to WEBP and generate srcset sizes
 */
export async function processImage(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<ProcessedImage> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const sizes: ProcessedImage['sizes'] = {
    small: '',
    medium: '',
    large: '',
  };

  await fs.mkdir(outputDir, { recursive: true });

  for (const width of config.srcsetWidths) {
    const outputPath = path.join(outputDir, `${baseName}-${width}w.webp`);

    // Don't upscale images
    const targetWidth = metadata.width && metadata.width < width
      ? metadata.width
      : width;

    await image
      .clone()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: config.webpQuality })
      .toFile(outputPath);

    if (width === 400) sizes.small = outputPath;
    else if (width === 800) sizes.medium = outputPath;
    else if (width === 1200) sizes.large = outputPath;
  }

  return {
    key: path.join(path.basename(path.dirname(outputDir)), path.basename(outputDir), baseName),
    sizes,
  };
}

/**
 * Add a new image to the collection
 */
export async function addImage(
  inputPath: string,
  category: Category,
  countryCode: string,
  source: Source,
  originalUrl: string,
  description?: string
): Promise<{ key: string; duplicate: boolean }> {
  const manifest = await loadManifest();

  // Check for duplicate by hash
  const hash = await hashFile(inputPath);
  const existingKey = findByHash(manifest, hash);
  if (existingKey) {
    console.log(`  Duplicate found: ${existingKey}`);
    return { key: existingKey, duplicate: true };
  }

  // Get next sequence number
  const sequence = getNextSequence(manifest, category, countryCode);
  const key = generateImageKey(category, countryCode, sequence);
  const cc = countryCode.toLowerCase();
  const baseName = `${cc}-${String(sequence).padStart(3, '0')}`;

  // Output directory
  const outputDir = path.join(config.scrapedDir, category, cc);

  // Save original
  const originalPath = path.join(outputDir, `${baseName}-original.webp`);
  await fs.mkdir(outputDir, { recursive: true });

  // Convert to WEBP if not already
  await sharp(inputPath)
    .webp({ quality: 95 }) // High quality for original
    .toFile(originalPath);

  // Generate srcset sizes
  await processImage(originalPath, outputDir, baseName);

  // Add to manifest
  const entry: ManifestEntry = {
    source,
    originalUrl,
    scrapedAt: new Date().toISOString(),
    description,
    hash,
    processed: true,
    uploaded: false,
  };
  addEntry(manifest, key, entry);
  await saveManifest(manifest);

  console.log(`  Added: ${key}`);
  return { key, duplicate: false };
}

/**
 * Process all unprocessed images in the manifest
 */
export async function processAllUnprocessed(): Promise<void> {
  const manifest = await loadManifest();
  let processed = 0;

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (entry.processed) continue;

    const [category, cc, filename] = key.split('/');
    const baseName = filename;
    const outputDir = path.join(config.scrapedDir, category, cc);
    const originalPath = path.join(outputDir, `${baseName}-original.webp`);

    try {
      await processImage(originalPath, outputDir, baseName);
      entry.processed = true;
      processed++;
      console.log(`Processed: ${key}`);
    } catch (err) {
      console.error(`Failed to process ${key}:`, err);
    }
  }

  if (processed > 0) {
    await saveManifest(manifest);
    console.log(`\nProcessed ${processed} images`);
  } else {
    console.log('No unprocessed images found');
  }
}

/**
 * Show manifest statistics
 */
export async function showStats(): Promise<void> {
  const manifest = await loadManifest();
  const stats = getStats(manifest);

  console.log('\n=== Image Manifest Statistics ===\n');
  console.log(`Total images: ${stats.total}`);
  console.log(`Processed: ${stats.processed}`);
  console.log(`Uploaded: ${stats.uploaded}`);

  console.log('\nBy Category:');
  for (const [cat, count] of Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log('\nBy Source:');
  for (const [src, count] of Object.entries(stats.bySource).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${src}: ${count}`);
  }
}

// CLI
const command = process.argv[2];

if (command === 'process') {
  processAllUnprocessed();
} else if (command === 'stats') {
  showStats();
} else {
  console.log('Usage: tsx process-images.ts <command>');
  console.log('Commands:');
  console.log('  process - Process all unprocessed images');
  console.log('  stats   - Show manifest statistics');
}
