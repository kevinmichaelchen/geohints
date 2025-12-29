# Image Management - Requirements

## Overview

Define standards for storing, naming, and serving images from Cloudflare R2 to ensure consistency, prevent collisions, and optimize delivery across all content categories.

## Storage Architecture

### R2 Bucket Structure

```
geohints-images/
├── bollards/
│   ├── de/
│   │   ├── de-001-400w.webp
│   │   ├── de-001-800w.webp
│   │   ├── de-001-1200w.webp
│   │   └── ...
│   └── fr/
│       └── ...
├── driving-side/
│   └── ...
├── domains/
│   └── ...
├── follow-cars/
│   └── ...
├── license-plates/
│   └── ...
├── road-lines/
│   └── ...
├── street-signs/
│   └── ...
├── fuel-stations/
│   └── ...
├── flags/
│   └── ...
└── utility-poles/
    └── ...
```

## Naming Conventions

### Image File Names

Pattern: `{country-code}-{sequence}-{width}w.webp`

| Component | Format | Example |
|-----------|--------|---------|
| country-code | ISO 3166-1 alpha-2 lowercase | `de`, `fr`, `us` |
| sequence | 3-digit zero-padded | `001`, `002`, `042` |
| width | srcset width designation | `400w`, `800w`, `1200w` |

Examples:
- `de-001-400w.webp` - Germany bollard #1, small
- `de-001-800w.webp` - Germany bollard #1, medium
- `de-001-1200w.webp` - Germany bollard #1, large

### Srcset Sizes

| Size | Width | Use Case |
|------|-------|----------|
| Small | 400w | Mobile, thumbnails |
| Medium | 800w | Tablet, grid cards |
| Large | 1200w | Desktop, detail views |

### Source Attribution

Maintain a manifest file to track image provenance:

```typescript
// scraped-images/manifest.json
{
  "bollards/de/de-001": {
    "source": "plonkit",
    "originalUrl": "https://plonkit.net/...",
    "scrapedAt": "2025-01-15T10:30:00Z",
    "description": "White rectangular bollard"
  }
}
```

Source identifiers:
- `plonkit` - plonkit.net
- `geomastr` - geomastr.com
- `geohints` - geohints.com
- `original` - our own content

## Content Requirements

### CR-01: Image Quality

- Format: WEBP only (no fallbacks needed for modern browsers)
- Quality: 80-85% compression (balance quality/size)
- Aspect ratio: Preserve original, crop only if necessary

### CR-02: Srcset Generation

THE SYSTEM SHALL generate 3 sizes for each source image:
- 400w: max-width 400px, maintain aspect ratio
- 800w: max-width 800px, maintain aspect ratio
- 1200w: max-width 1200px, maintain aspect ratio

### CR-03: Deduplication

- WHEN scraping THE SYSTEM SHALL hash images to detect duplicates
- WHEN a duplicate is found THE SYSTEM SHALL keep earliest source
- THE SYSTEM SHALL log duplicate detections for review

## Technical Requirements

### TR-01: R2 Configuration

```
Bucket name: geohints-images
Region: auto (Cloudflare chooses optimal)
Public access: enabled via custom domain
Custom domain: images.geohints.app (or similar)
```

### TR-02: URL Structure

Final URLs will follow pattern:
```
https://images.geohints.app/{category}/{country}/{filename}
```

Example:
```
https://images.geohints.app/bollards/de/de-001-800w.webp
```

### TR-03: Local Development

During scraping, images stored in `/scraped-images/` (gitignored):
```
scraped-images/
├── manifest.json
├── bollards/
│   └── de/
│       ├── de-001-original.webp  # Source before resize
│       ├── de-001-400w.webp
│       ├── de-001-800w.webp
│       └── de-001-1200w.webp
```

### TR-04: Upload Pipeline

1. Scrape original image
2. Convert to WEBP if not already
3. Generate 3 srcset sizes
4. Upload to R2 with correct path
5. Update manifest with metadata
6. Delete local files after successful upload

## Collision Prevention

### Across Sources

Since multiple competitors may have the same country/category images:
- Sequence numbers are global per country/category
- First image scraped gets `001`, regardless of source
- Manifest tracks which source each image came from
- Visual deduplication during scraping prevents true duplicates

### Naming Conflicts

To avoid conflicts when the same country appears in different categories:
- Category is the top-level directory
- Country code is a subdirectory
- Never mix categories in same directory

## Migration from Existing Images

Current images in `/public/images/` will be:
1. Catalogued in manifest
2. Converted to new naming convention
3. Uploaded to R2
4. Code updated to use R2 URLs
5. Local copies removed from repo
