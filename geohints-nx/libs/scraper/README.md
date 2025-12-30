# @geohints/scraper

Effect-based image scraping and processing pipeline for GeoHints.

## Features

- Scrape images from geomastr.com and geohints.com
- WEBP optimization with Sharp (srcset variants: 400w, 800w, 1200w)
- R2 upload with retry and concurrency control
- Content-hash deduplication
- Manifest tracking

## Usage

```bash
# Scrape a category
pnpm tsx libs/scraper/src/cli.ts scrape --source geomastr --category bollards

# Scrape all categories from all sources
pnpm tsx libs/scraper/src/cli.ts scrape --all

# Process images (convert to WEBP, generate srcset)
pnpm tsx libs/scraper/src/cli.ts process

# Upload to R2
pnpm tsx libs/scraper/src/cli.ts upload --all

# Dry run upload
pnpm tsx libs/scraper/src/cli.ts upload --all --dry-run

# View stats
pnpm tsx libs/scraper/src/cli.ts stats
```

## Architecture

```
src/
├── cli.ts              # CLI entry point
├── config/
│   └── scraper-config.ts
├── scrapers/
│   ├── geohints.ts     # geohints.com scraper
│   └── geomastr.ts     # geomastr.com scraper
└── services/
    ├── errors.ts       # Domain errors
    ├── http-service.ts # HTTP client with retry
    ├── image-service.ts # Sharp WEBP processing
    ├── r2-service.ts   # Cloudflare R2 upload
    └── storage-service.ts # Local file system
```

## Pipeline

```
Scrape → Validate → Convert to WEBP → Generate srcset → Hash → Update manifest → Upload to R2
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `R2_BUCKET_NAME` | `geohints-images` | R2 bucket name |
| `R2_PUBLIC_URL` | `https://pub-...r2.dev` | Public bucket URL |
| `SCRAPER_CONCURRENCY` | `3` | Concurrent operations |
| `SCRAPER_DELAY_MS` | `500` | Delay between requests |
| `SCRAPER_OUTPUT_DIR` | `./scraped-images` | Local output directory |
