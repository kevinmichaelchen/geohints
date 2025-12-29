# Image Management - Design

## Implementation Approach

### Phase 1: Infrastructure Setup

1. **Create R2 Bucket**
   - Use Wrangler CLI to create `geohints-images` bucket
   - Configure public access
   - Set up custom domain (optional, can use R2.dev initially)

2. **Scraping Directory**
   - Create `/scraped-images/` directory structure
   - Initialize `manifest.json`
   - Ensure gitignore is in place

### Phase 2: Scraping Pipeline

```typescript
// scripts/scrape-images.ts

interface ScrapedImage {
  category: Category;
  countryCode: string;
  source: 'plonkit' | 'geomastr' | 'geohints' | 'original';
  originalUrl: string;
  description?: string;
}

interface ManifestEntry {
  source: string;
  originalUrl: string;
  scrapedAt: string;
  description?: string;
  hash?: string;  // For deduplication
}
```

### Phase 3: Image Processing

Use Sharp for image processing:

```typescript
import sharp from 'sharp';

const SIZES = [400, 800, 1200] as const;

async function processImage(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<void> {
  const image = sharp(inputPath);

  for (const width of SIZES) {
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`${outputDir}/${baseName}-${width}w.webp`);
  }
}
```

### Phase 4: R2 Upload

```typescript
// scripts/upload-to-r2.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadImage(
  localPath: string,
  r2Key: string
): Promise<void> {
  const fileContent = await fs.readFile(localPath);

  await r2.send(new PutObjectCommand({
    Bucket: 'geohints-images',
    Key: r2Key,
    Body: fileContent,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}
```

## Component Integration

### Image Component Usage

```tsx
import { Image } from '@unpic/qwik';

// R2 base URL (configure via env)
const R2_BASE = 'https://images.geohints.app';

interface HintImageProps {
  category: string;
  countryCode: string;
  sequence: number;
  alt: string;
}

export const HintImage = component$<HintImageProps>(
  ({ category, countryCode, sequence, alt }) => {
    const seq = String(sequence).padStart(3, '0');
    const base = `${R2_BASE}/${category}/${countryCode}/${countryCode}-${seq}`;

    return (
      <Image
        src={`${base}-800w.webp`}
        srcset={`${base}-400w.webp 400w, ${base}-800w.webp 800w, ${base}-1200w.webp 1200w`}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
        width={800}
        height={500}
        alt={alt}
        layout="constrained"
      />
    );
  }
);
```

## Data Model Updates

Update hint data to reference R2 images:

```typescript
// Before (local images)
const bollard = {
  country: 'DE',
  images: ['/images/bollards/de-1.webp', '/images/bollards/de-2.webp'],
};

// After (R2 references)
const bollard = {
  country: 'DE',
  images: [1, 2, 3],  // Just sequence numbers
  // Full URL constructed at render time
};
```

## Environment Configuration

```bash
# .env.local (gitignored)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=geohints-images

# Public URL (after custom domain setup)
PUBLIC_R2_URL=https://images.geohints.app
```

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm scrape:plonkit` | Scrape images from plonkit.net |
| `pnpm scrape:geomastr` | Scrape images from geomastr.com |
| `pnpm scrape:geohints` | Scrape images from geohints.com |
| `pnpm images:process` | Convert scraped images to WEBP + srcset |
| `pnpm images:upload` | Upload processed images to R2 |
| `pnpm images:sync` | Full pipeline: scrape → process → upload |

## Testing Strategy

1. **Local development**: Use `/scraped-images/` directly
2. **CI/CD**: Images served from R2
3. **Fallback**: If R2 URL fails, log error (no local fallback)
