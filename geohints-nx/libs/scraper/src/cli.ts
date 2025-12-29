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
import { CATEGORIES, type Category } from "../../shared/src/schemas/category"

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

// Combine all layers
const MainLayer = Layer.mergeAll(
  PlatformLayer,
  ConfigLayer,
  HttpServiceLayer,
  StorageServiceLayer
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

      if (all) {
        yield* Effect.log(`Scraping all categories...`)
        const manifest = yield* scrapeAllGeomastr()
        yield* Effect.log(`Done! Total entries: ${manifest.entries.length}`)
      } else if (category._tag === "Some") {
        const cat = category.value as Category
        yield* Effect.log(`Scraping category: ${cat}`)
        const entries = yield* scrapeGeomastr(cat)
        yield* Effect.log(`Done! Scraped ${entries.length} images`)
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

// ---------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------

const mainCommand = Command.make("geohints-scraper").pipe(
  Command.withDescription("GeoHints image scraper using Effect-TS"),
  Command.withSubcommands([scrapeCommand, statsCommand])
)

const cli = Command.run(mainCommand, {
  name: "geohints-scraper",
  version: "2.0.0",
})

// Run the CLI
const program = cli(process.argv).pipe(Effect.provide(NodeContext.layer))
NodeRuntime.runMain(program)
