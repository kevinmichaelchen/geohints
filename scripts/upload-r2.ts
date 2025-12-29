/**
 * Upload processed images to Cloudflare R2
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { config } from './config.js';
import { loadManifest, saveManifest } from './manifest.js';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2AccessKeyId,
    secretAccessKey: config.r2SecretAccessKey,
  },
});

/**
 * Check if an object exists in R2
 */
async function objectExists(key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: config.r2Bucket,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload a single file to R2
 */
async function uploadFile(localPath: string, r2Key: string): Promise<boolean> {
  try {
    const fileContent = await fs.readFile(localPath);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: config.r2Bucket,
        Key: r2Key,
        Body: fileContent,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return true;
  } catch (err) {
    console.error(`Failed to upload ${r2Key}:`, err);
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

    // Check if already uploaded
    if (await objectExists(r2Key)) {
      console.log(`  Skip (exists): ${r2Key}`);
      continue;
    }

    // Check if local file exists
    try {
      await fs.access(localPath);
    } catch {
      console.error(`  Missing local file: ${localPath}`);
      allSuccess = false;
      continue;
    }

    const success = await uploadFile(localPath, r2Key);
    if (success) {
      console.log(`  Uploaded: ${r2Key}`);
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
  if (!config.r2AccountId || !config.r2AccessKeyId || !config.r2SecretAccessKey) {
    console.error('Error: R2 credentials not configured');
    console.error('Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables');
    process.exit(1);
  }

  const manifest = await loadManifest();
  let uploaded = 0;
  let failed = 0;

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (entry.uploaded) continue;
    if (!entry.processed) {
      console.log(`Skipping unprocessed: ${key}`);
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
}

/**
 * Upload a specific category
 */
async function uploadCategory(category: string): Promise<void> {
  if (!config.r2AccountId || !config.r2AccessKeyId || !config.r2SecretAccessKey) {
    console.error('Error: R2 credentials not configured');
    process.exit(1);
  }

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

// CLI
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'all') {
  uploadAll();
} else if (command === 'category' && arg) {
  uploadCategory(arg);
} else {
  console.log('Usage: tsx upload-r2.ts <command> [args]');
  console.log('Commands:');
  console.log('  all              - Upload all unuploaded images');
  console.log('  category <name>  - Upload images from a specific category');
  console.log('\nEnvironment variables required:');
  console.log('  R2_ACCOUNT_ID');
  console.log('  R2_ACCESS_KEY_ID');
  console.log('  R2_SECRET_ACCESS_KEY');
}
