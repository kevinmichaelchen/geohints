# Image Optimization Specification

## Overview
All images in the GeoHints project MUST be WEBP-optimized with proper srcset variants before upload or commit.

## Requirements

### Format
- **MUST** be WEBP format (not just renamed JPG/PNG)
- **MUST** use Sharp for conversion (not imagemin or other tools)
- **MUST** validate actual file type matches extension

### srcset Variants
Every image MUST have these variants generated:
- `{name}-400w.webp` - 400px width (mobile/thumbnail)
- `{name}-800w.webp` - 800px width (tablet/medium)
- `{name}-1200w.webp` - 1200px width (desktop/large)

### Quality Settings
- **Original**: 95 quality (high fidelity backup)
- **srcset variants**: 82 quality (balance of quality/size)
- **NEVER** upscale images beyond original dimensions

### File Naming Convention
```
{category}/{country_code}/{hash}-{width}w.webp
```
Example: `bollards/at/abc123-800w.webp`

### Validation Checklist
Before upload to R2:
- [ ] File is actual WEBP (verify with `file` command)
- [ ] All 3 srcset variants exist
- [ ] File size is reasonable (< 500KB for 1200w typically)
- [ ] Image dimensions match expected width

### Qwik Integration
Use `@unpic/qwik` Image component for rendering:
```tsx
import { Image } from "@unpic/qwik";

<Image
  src={cdnUrl}
  width={800}
  height={600}
  layout="constrained"
  alt={description}
/>
```

See: https://qwik.dev/docs/integrations/image-optimization/

## Anti-Patterns (NEVER DO)

1. **NEVER** save raw downloaded bytes with `.webp` extension
2. **NEVER** commit unoptimized images to git
3. **NEVER** upload unoptimized images to R2
4. **NEVER** use base64 encoded images in code
5. **NEVER** skip srcset generation

## Implementation

### Effect Service
```typescript
// libs/scraper/src/services/image-service.ts
export class ImageService extends Context.Tag("@geohints/ImageService")<...>() {
  processImage: (data: Uint8Array) => Effect.Effect<ProcessedImage>
  validateWebp: (path: string) => Effect.Effect<boolean>
  generateSrcset: (input: string) => Effect.Effect<SrcsetVariants>
}
```

### Pipeline Flow
```
Download → Validate → Convert to WEBP → Generate srcset → Hash → Update manifest → Upload to R2
```

### R2 Upload Service
```typescript
// libs/scraper/src/services/r2-service.ts
export class R2Service extends Context.Tag("@geohints/R2Service")<...>() {
  upload: (localPath: string, r2Key: string) => Effect.Effect<UploadResult>
  exists: (r2Key: string) => Effect.Effect<boolean>
  uploadMany: (files: readonly { localPath: string; r2Key: string }[]) => Effect.Effect<UploadStats>
}
```

## R2 Upload Requirements

### Bucket Configuration
- **Bucket Name**: `geohints-images`
- **Public URL**: `https://pub-3d7bacd76def438caae68643612e60f9.r2.dev`

### R2 Key Structure
```
{category}/{country_code}/{hash}-{width}w.webp
```
Example: `bollards/at/abc123-800w.webp`

### Upload Process
1. Read manifest to get list of entries
2. Build list of files (4 per entry: original + 3 srcset variants)
3. Check if each file already exists in R2 (skip if present)
4. Upload with `npx wrangler r2 object put`
5. Track upload statistics (uploaded/skipped/failed)

### CLI Commands
```bash
# Upload all images
pnpm tsx libs/scraper/src/cli.ts upload --all

# Upload specific category
pnpm tsx libs/scraper/src/cli.ts upload --category bollards

# Dry run (show what would be uploaded)
pnpm tsx libs/scraper/src/cli.ts upload --all --dry-run
```

### Concurrency
- Default: 3 concurrent uploads
- Configurable via `SCRAPER_CONCURRENCY` env var
- Uses exponential backoff retry for transient failures

## Dependencies
- `sharp` - Image processing (MUST use, fastest and most reliable)
- `@effect/platform` - File system operations and command execution
- `wrangler` - Cloudflare R2 CLI (must be authenticated)
