/**
 * Upload processed images to Cloudflare R2 using Wrangler CLI
 * (Uses OAuth token, no need for separate R2 API keys)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { config } from './config.js';
import { loadManifest, saveManifest } from './manifest.js';

const BUCKET = 'geohints-images';

/**
 * Upload a single file to R2 using wrangler
 */
async function uploadFile(localPath: string, r2Key: string): Promise<boolean> {
  try {
    // Check if local file exists
    await fs.access(localPath);

    // Use wrangler to upload (--remote flag is required)
    execSync(
      `pnpm wrangler r2 object put "${BUCKET}/${r2Key}" --file="${localPath}" --content-type="image/webp" --remote`,
      { stdio: 'pipe' }
    );

    return true;
  } catch (err) {
    console.error(`Failed to upload ${r2Key}:`, (err as Error).message);
    return false;
  }
}

/**
 * Upload all srcset sizes for an image
 */
async function uploadImageSet(
  category: string,
  countryCode: string,
  baseName: string
): Promise<boolean> {
  const localDir = path.join(config.scrapedDir, category, countryCode);
  let allSuccess = true;

  for (const width of config.srcsetWidths) {
    const filename = `${baseName}-${width}w.webp`;
    const localPath = path.join(localDir, filename);
    const r2Key = `${category}/${countryCode}/${filename}`;

    const success = await uploadFile(localPath, r2Key);
    if (success) {
      console.log(`  ✓ ${r2Key}`);
    } else {
      allSuccess = false;
    }
  }

  return allSuccess;
}

/**
 * Upload all unuploaded images from manifest
 */
async function uploadAll(): Promise<void> {
  const manifest = await loadManifest();
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  const entries = Object.entries(manifest.entries);
  console.log(`Found ${entries.length} images in manifest\n`);

  for (const [key, entry] of entries) {
    if (entry.uploaded) {
      skipped++;
      continue;
    }
    if (!entry.processed) {
      console.log(`Skipping unprocessed: ${key}`);
      skipped++;
      continue;
    }

    const [category, countryCode, filename] = key.split('/');
    const baseName = filename;

    console.log(`Uploading: ${key}`);
    const success = await uploadImageSet(category, countryCode, baseName);

    if (success) {
      entry.uploaded = true;
      uploaded++;
    } else {
      failed++;
    }
  }

  await saveManifest(manifest);

  console.log(`\n=== Upload Complete ===`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
}

/**
 * Upload a specific category
 */
async function uploadCategory(category: string): Promise<void> {
  const manifest = await loadManifest();
  let uploaded = 0;

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (!key.startsWith(`${category}/`)) continue;
    if (entry.uploaded) continue;
    if (!entry.processed) continue;

    const [, countryCode, filename] = key.split('/');
    const baseName = filename;

    console.log(`Uploading: ${key}`);
    const success = await uploadImageSet(category, countryCode, baseName);

    if (success) {
      entry.uploaded = true;
      uploaded++;
    }
  }

  await saveManifest(manifest);
  console.log(`\nUploaded ${uploaded} images from ${category}`);
}

/**
 * Reset all upload flags in manifest
 */
async function resetUploadFlags(): Promise<void> {
  const manifest = await loadManifest();
  let count = 0;

  for (const entry of Object.values(manifest.entries)) {
    if (entry.uploaded) {
      entry.uploaded = false;
      count++;
    }
  }

  await saveManifest(manifest);
  console.log(`Reset upload flag for ${count} images`);
}

// CLI
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'all') {
  uploadAll();
} else if (command === 'category' && arg) {
  uploadCategory(arg);
} else if (command === 'reset') {
  resetUploadFlags();
} else {
  console.log('Usage: tsx upload-wrangler.ts <command> [args]');
  console.log('Commands:');
  console.log('  all              - Upload all unuploaded images');
  console.log('  category <name>  - Upload images from a specific category');
  console.log('  reset            - Reset all upload flags');
}
