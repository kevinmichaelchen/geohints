/**
 * Storage service using @effect/platform FileSystem.
 *
 * Provides file system operations with proper error handling
 * and SHA-256 hashing for content deduplication.
 *
 * @module storage-service
 */

import { Context, Effect, Layer, Schema, pipe } from "effect"
import * as FileSystem from "@effect/platform/FileSystem"
import * as Path from "@effect/platform/Path"
import { ScraperConfig } from "../config/scraper-config"
import { FsError, ParseError } from "./errors"
import type { Sha256Hash } from "../../../shared/src/schemas/manifest"
import { Manifest, emptyManifest } from "../../../shared/src/schemas/manifest"

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

/**
 * Storage service interface.
 */
export interface StorageServiceShape {
  /**
   * Save binary image data to a file.
   */
  readonly saveImage: (
    relativePath: string,
    data: Uint8Array
  ) => Effect.Effect<void, FsError>

  /**
   * Read the manifest file.
   */
  readonly readManifest: () => Effect.Effect<Manifest, FsError | ParseError>

  /**
   * Write the manifest file.
   */
  readonly writeManifest: (manifest: Manifest) => Effect.Effect<void, FsError>

  /**
   * Compute SHA-256 hash of binary data.
   */
  readonly hashContent: (data: Uint8Array) => Effect.Effect<Sha256Hash>

  /**
   * Check if a file exists.
   */
  readonly exists: (relativePath: string) => Effect.Effect<boolean, FsError>

  /**
   * Ensure a directory exists.
   */
  readonly ensureDir: (relativePath: string) => Effect.Effect<void, FsError>

  /**
   * Get the full path for a relative path.
   */
  readonly resolvePath: (relativePath: string) => Effect.Effect<string>
}

// ---------------------------------------------------------------------------
// Service Tag
// ---------------------------------------------------------------------------

/**
 * StorageService tag.
 */
export class StorageService extends Context.Tag("@geohints/StorageService")<
  StorageService,
  StorageServiceShape
>() {
  /**
   * Live layer requiring ScraperConfig, FileSystem, and Path.
   */
  static readonly layer = Layer.effect(
    StorageService,
    Effect.gen(function* () {
      const config = yield* ScraperConfig
      const fs = yield* FileSystem.FileSystem
      const pathService = yield* Path.Path

      const resolvePath = (relativePath: string): Effect.Effect<string> =>
        Effect.succeed(pathService.join(config.outputDir, relativePath))

      const ensureDir = (relativePath: string): Effect.Effect<void, FsError> =>
        Effect.gen(function* () {
          const fullPath = yield* resolvePath(relativePath)
          yield* pipe(
            fs.makeDirectory(fullPath, { recursive: true }),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: fullPath,
                  operation: "mkdir",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )
        })

      const exists = (relativePath: string): Effect.Effect<boolean, FsError> =>
        Effect.gen(function* () {
          const fullPath = yield* resolvePath(relativePath)
          return yield* pipe(
            fs.exists(fullPath),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: fullPath,
                  operation: "read",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )
        })

      const saveImage = (
        relativePath: string,
        data: Uint8Array
      ): Effect.Effect<void, FsError> =>
        Effect.gen(function* () {
          const fullPath = yield* resolvePath(relativePath)
          const dir = pathService.dirname(fullPath)

          // Ensure directory exists
          yield* pipe(
            fs.makeDirectory(dir, { recursive: true }),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: dir,
                  operation: "mkdir",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )

          // Write file
          yield* pipe(
            fs.writeFile(fullPath, data),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: fullPath,
                  operation: "write",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )
        })

      const readManifest = (): Effect.Effect<Manifest, FsError | ParseError> =>
        Effect.gen(function* () {
          const fullPath = yield* resolvePath("manifest.json")

          const fileExists = yield* pipe(
            fs.exists(fullPath),
            Effect.catchAll(() => Effect.succeed(false))
          )

          if (!fileExists) {
            return emptyManifest()
          }

          const content = yield* pipe(
            fs.readFileString(fullPath),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: fullPath,
                  operation: "read",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )

          const json = yield* pipe(
            Effect.try(() => JSON.parse(content)),
            Effect.catchAll((error) =>
              Effect.fail(
                new ParseError({
                  source: fullPath,
                  message: "Invalid JSON",
                  cause: error,
                })
              )
            )
          )

          const manifest = yield* pipe(
            Schema.decodeUnknown(Manifest)(json),
            Effect.catchAll((error) =>
              Effect.fail(
                new ParseError({
                  source: fullPath,
                  message: "Invalid manifest schema",
                  cause: error,
                })
              )
            )
          )

          return manifest
        })

      const writeManifest = (manifest: Manifest): Effect.Effect<void, FsError> =>
        Effect.gen(function* () {
          const fullPath = yield* resolvePath("manifest.json")
          const dir = pathService.dirname(fullPath)

          // Ensure directory exists
          yield* pipe(
            fs.makeDirectory(dir, { recursive: true }),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: dir,
                  operation: "mkdir",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )

          // Serialize manifest
          const content = JSON.stringify(manifest, null, 2)

          // Write file
          yield* pipe(
            fs.writeFileString(fullPath, content),
            Effect.catchAll((error) =>
              Effect.fail(
                new FsError({
                  path: fullPath,
                  operation: "write",
                  message: String(error),
                  cause: error,
                })
              )
            )
          )
        })

      const hashContent = (data: Uint8Array): Effect.Effect<Sha256Hash> =>
        Effect.gen(function* () {
          // Use Web Crypto API (available in Node.js)
          // Copy to a new ArrayBuffer to ensure compatibility
          const buffer = new Uint8Array(data).buffer
          const hashBuffer = yield* Effect.promise(() =>
            globalThis.crypto.subtle.digest("SHA-256", buffer)
          )
          const hashArray = new Uint8Array(hashBuffer)
          const hashHex = Array.from(hashArray)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
          // Cast is safe because we know the hash is 64 hex characters
          return hashHex as Sha256Hash
        })

      return {
        saveImage,
        readManifest,
        writeManifest,
        hashContent,
        exists,
        ensureDir,
        resolvePath,
      }
    })
  )
}
