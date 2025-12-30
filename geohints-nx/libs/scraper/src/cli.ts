/**
 * CLI for the geohints scraper using @effect/cli.
 *
 * Usage:
 *   tsx cli.ts scrape --category bollards
 *   tsx cli.ts scrape --all
 *   tsx cli.ts stats
 *
 * @module cli
 */

import { Command, Options } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { NodeHttpClient } from "@effect/platform-node"
import * as NodeFileSystem from "@effect/platform-node/NodeFileSystem"
import * as NodePath from "@effect/platform-node/NodePath"
import { Effect, Layer } from "effect"
import { ScraperConfig } from "./config/scraper-config"
import { HttpService } from "./services/http-service"
import { StorageService } from "./services/storage-service"
import { scrapeGeomastr, scrapeAllGeomastr } from "./scrapers/geomastr"
import { scrapeGeohints, scrapeAllGeohints } from "./scrapers/geohints"
import { ImageService } from "./services/image-service"
import { R2Service } from "./services/r2-service"
import { CATEGORIES, type Category, type Source } from "../../shared/src/schemas/category"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { NodeCommandExecutor } from "@effect/platform-node"

// ---------------------------------------------------------------------------
// Layer Composition
// ---------------------------------------------------------------------------

/**
 * Full runtime layer with all dependencies.
 *
 * Layer composition order:
 * 1. Base platform layers (FileSystem, Path, HttpClient)
 * 2. Configuration layer
 * 3. Service layers (HttpService, StorageService)
 */
const PlatformLayer = Layer.mergeAll(
  NodeHttpClient.layer,
  NodeFileSystem.layer,
  NodePath.layer
)

const ConfigLayer = ScraperConfig.layer

// HttpService needs: HttpClient, ScraperConfig
const HttpServiceLayer = HttpService.layer.pipe(
  Layer.provide(PlatformLayer),
  Layer.provide(ConfigLayer)
)

// StorageService needs: FileSystem, Path, ScraperConfig
const StorageServiceLayer = StorageService.layer.pipe(
  Layer.provide(PlatformLayer),
  Layer.provide(ConfigLayer)
)

// ImageService is standalone (uses Sharp)
const ImageServiceLayer = ImageService.layer

// CommandExecutor for process spawning
const CommandExecutorLayer = NodeCommandExecutor.layer

// R2Service needs: ScraperConfig, CommandExecutor
const R2ServiceLayer = R2Service.layer.pipe(
  Layer.provide(ConfigLayer),
  Layer.provide(CommandExecutorLayer)
)

// Combine all layers
const MainLayer = Layer.mergeAll(
  PlatformLayer,
  ConfigLayer,
  HttpServiceLayer,
  StorageServiceLayer,
  ImageServiceLayer,
  R2ServiceLayer,
  CommandExecutorLayer
)

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

/**
 * Scrape command - scrapes images from sources.
 */
const scrapeCommand = Command.make(
  "scrape",
  {
    category: Options.optional(
      Options.choice("category", CATEGORIES as unknown as readonly string[])
    ),
    all: Options.boolean("all").pipe(Options.withDefault(false)),
    source: Options.choice("source", ["geomastr", "geohints", "plonkit"]).pipe(
      Options.withDefault("geomastr")
    ),
  },
  ({ category, all, source }) =>
    Effect.gen(function* () {
      yield* Effect.log(`Starting scraper...`)
      yield* Effect.log(`Source: ${source}`)

      const src = source as Source

      if (all) {
        yield* Effect.log(`Scraping all categories from ${source}...`)
        const manifest = src === "geohints"
          ? yield* scrapeAllGeohints()
          : yield* scrapeAllGeomastr()
        yield* Effect.log(`Done! Total entries: ${manifest.entries.length}`)
      } else if (category._tag === "Some") {
        const cat = category.value as Category
        const storage = yield* StorageService
        yield* Effect.log(`Scraping category: ${cat} from ${source}`)
        const entries = src === "geohints"
          ? yield* scrapeGeohints(cat)
          : yield* scrapeGeomastr(cat)

        // Update manifest with new entries
        const existingManifest = yield* storage.readManifest()
        const newManifest = existingManifest.merge(Array.from(entries))
        yield* storage.writeManifest(newManifest)

        yield* Effect.log(`Done! Scraped ${entries.length} images, manifest now has ${newManifest.entries.length} total entries`)
      } else {
        yield* Effect.logError(
          "Please specify --category <name> or --all"
        )
      }
    }).pipe(Effect.provide(MainLayer))
)

/**
 * Stats command - shows manifest statistics.
 */
const statsCommand = Command.make("stats", {}, () =>
  Effect.gen(function* () {
    const storage = yield* StorageService

    const manifest = yield* storage.readManifest()

    yield* Effect.log(`\n=== Manifest Statistics ===`)
    yield* Effect.log(`Version: ${manifest.version}`)
    yield* Effect.log(`Last Updated: ${manifest.lastUpdated.toISOString()}`)
    yield* Effect.log(`Total Entries: ${manifest.entries.length}`)
    yield* Effect.log(`\n--- By Category ---`)

    const byCategory = manifest.byCategory
    for (const category of manifest.categories) {
      const entries = byCategory[category] ?? []
      yield* Effect.log(`  ${category}: ${entries.length}`)
    }

    yield* Effect.log(`\n--- By Country ---`)
    const byCountry = manifest.byCountry
    const countries = Object.keys(byCountry).sort()
    for (const country of countries.slice(0, 10)) {
      const entries = byCountry[country] ?? []
      yield* Effect.log(`  ${country}: ${entries.length}`)
    }
    if (countries.length > 10) {
      yield* Effect.log(`  ... and ${countries.length - 10} more countries`)
    }

    yield* Effect.log(`\n--- Unique Countries ---`)
    yield* Effect.log(`  Total: ${manifest.countryCodes.length}`)
  }).pipe(Effect.provide(MainLayer))
)

/**
 * Process command - converts existing images to WEBP with srcset variants.
 */
const processCommand = Command.make(
  "process",
  {
    dryRun: Options.boolean("dry-run").pipe(Options.withDefault(false)),
  },
  ({ dryRun }) =>
    Effect.gen(function* () {
      const imageService = yield* ImageService
      const storage = yield* StorageService
      const config = yield* ScraperConfig

      yield* Effect.log(`Processing images in ${config.outputDir}...`)
      if (dryRun) {
        yield* Effect.log(`(Dry run - no files will be modified)`)
      }

      // Find all image files that need processing
      const baseDir = config.outputDir
      let processed = 0
      let skipped = 0
      let errors = 0

      // Walk the directory recursively
      const walkDir = async (dir: string): Promise<string[]> => {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        const files: string[] = []
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            files.push(...(await walkDir(fullPath)))
          } else if (entry.name.endsWith(".webp") && !entry.name.includes("-400w") && !entry.name.includes("-800w") && !entry.name.includes("-1200w") && !entry.name.includes("-original")) {
            files.push(fullPath)
          }
        }
        return files
      }

      const files = yield* Effect.promise(() => walkDir(baseDir))
      yield* Effect.log(`Found ${files.length} images to process`)

      for (const filePath of files) {
        const relativePath = path.relative(baseDir, filePath)

        try {
          // Read the raw file
          const rawData = yield* Effect.promise(() => fs.readFile(filePath))

          // Validate it's not already proper WEBP with variants
          const dir = path.dirname(filePath)
          const basename = path.basename(filePath, ".webp")
          const variant400 = path.join(dir, `${basename}-400w.webp`)

          const hasVariants = yield* Effect.promise(async () => {
            try {
              await fs.access(variant400)
              return true
            } catch {
              return false
            }
          })

          if (hasVariants) {
            skipped++
            continue
          }

          if (dryRun) {
            yield* Effect.log(`Would process: ${relativePath}`)
            processed++
            continue
          }

          // Process the image
          const processedImage = yield* imageService.processImage(new Uint8Array(rawData))

          // Compute hash for naming
          const hash = yield* storage.hashContent(new Uint8Array(rawData))
          const shortHash = hash.slice(0, 8)

          // Save the processed variants
          const originalPath = path.join(dir, `${shortHash}-original.webp`)
          const path400 = path.join(dir, `${shortHash}-400w.webp`)
          const path800 = path.join(dir, `${shortHash}-800w.webp`)
          const path1200 = path.join(dir, `${shortHash}-1200w.webp`)

          yield* Effect.promise(() => fs.writeFile(originalPath, processedImage.original))
          yield* Effect.promise(() => fs.writeFile(path400, processedImage.variants["400w"]))
          yield* Effect.promise(() => fs.writeFile(path800, processedImage.variants["800w"]))
          yield* Effect.promise(() => fs.writeFile(path1200, processedImage.variants["1200w"]))

          // Remove old file
          yield* Effect.promise(() => fs.unlink(filePath))

          processed++
          if (processed % 50 === 0) {
            yield* Effect.log(`Processed ${processed}/${files.length} images...`)
          }
        } catch (error) {
          yield* Effect.logWarning(`Failed to process ${relativePath}: ${error}`)
          errors++
        }
      }

      yield* Effect.log(`\n=== Processing Complete ===`)
      yield* Effect.log(`Processed: ${processed}`)
      yield* Effect.log(`Skipped (already done): ${skipped}`)
      yield* Effect.log(`Errors: ${errors}`)
    }).pipe(Effect.provide(MainLayer))
)

/**
 * Upload command - uploads processed images to R2.
 */
const uploadCommand = Command.make(
  "upload",
  {
    category: Options.optional(
      Options.choice("category", CATEGORIES as unknown as readonly string[])
    ),
    all: Options.boolean("all").pipe(Options.withDefault(false)),
    dryRun: Options.boolean("dry-run").pipe(Options.withDefault(false)),
  },
  ({ category, all, dryRun }) =>
    Effect.gen(function* () {
      const storage = yield* StorageService
      const r2 = yield* R2Service
      const config = yield* ScraperConfig

      yield* Effect.log(`Starting upload to R2...`)
      if (dryRun) {
        yield* Effect.log(`(Dry run - no files will be uploaded)`)
      }

      // Read manifest to get list of entries
      const manifest = yield* storage.readManifest()

      // Filter entries if category specified
      const entries = category._tag === "Some"
        ? manifest.entries.filter(e => e.category === category.value)
        : all
        ? manifest.entries
        : []

      if (entries.length === 0 && !all && category._tag === "None") {
        yield* Effect.logError("Please specify --category <name> or --all")
        return
      }

      yield* Effect.log(`Found ${entries.length} entries to upload`)

      // Build list of files to upload from entries
      const files: { localPath: string; r2Key: string }[] = []

      for (const entry of entries) {
        const basePath = `${config.outputDir}/${entry.category}/${entry.countryCode.toLowerCase()}`
        const hash = entry.contentHash.slice(0, 8)

        // Add all variant files
        for (const width of ["400w", "800w", "1200w", "original"]) {
          const filename = `${hash}-${width}.webp`
          const localPath = `${basePath}/${filename}`
          const r2Key = `${entry.category}/${entry.countryCode.toLowerCase()}/${filename}`
          files.push({ localPath, r2Key })
        }
      }

      yield* Effect.log(`Total files to process: ${files.length}`)

      if (dryRun) {
        // Just show what would be uploaded
        for (const file of files.slice(0, 10)) {
          yield* Effect.log(`Would upload: ${file.localPath} -> ${file.r2Key}`)
        }
        if (files.length > 10) {
          yield* Effect.log(`... and ${files.length - 10} more files`)
        }
        return
      }

      // Perform uploads
      const stats = yield* r2.uploadMany(files)

      yield* Effect.log(`\n=== Upload Complete ===`)
      yield* Effect.log(`Uploaded: ${stats.uploaded}`)
      yield* Effect.log(`Skipped (already exists): ${stats.skipped}`)
      yield* Effect.log(`Failed: ${stats.failed}`)
      yield* Effect.log(`Total: ${stats.total}`)
    }).pipe(Effect.provide(MainLayer))
)

// ---------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------

const mainCommand = Command.make("geohints-scraper").pipe(
  Command.withDescription("GeoHints image scraper using Effect-TS"),
  Command.withSubcommands([scrapeCommand, statsCommand, processCommand, uploadCommand])
)

const cli = Command.run(mainCommand, {
  name: "geohints-scraper",
  version: "2.0.0",
})

// Run the CLI
const program = cli(process.argv).pipe(Effect.provide(NodeContext.layer))
NodeRuntime.runMain(program)
