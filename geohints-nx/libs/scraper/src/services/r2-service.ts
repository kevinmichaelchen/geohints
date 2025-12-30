/**
 * R2 upload service using Effect Command for wrangler CLI.
 *
 * Uploads processed WEBP images to Cloudflare R2 storage.
 * Uses wrangler r2 object put for uploads.
 *
 * @module r2-service
 */

import { Context, Effect, Layer, Stream, Schedule, pipe } from "effect"
import { Command, CommandExecutor } from "@effect/platform"
import { ScraperConfig } from "../config/scraper-config"
import { Data } from "effect"

// ---------------------------------------------------------------------------
// Error Types
// ---------------------------------------------------------------------------

/**
 * R2 upload error.
 */
export class R2UploadError extends Data.TaggedError("R2UploadError")<{
  readonly localPath: string
  readonly r2Key: string
  readonly exitCode: number
  readonly stderr: string
}> {}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Upload result for a single file.
 */
export interface UploadResult {
  readonly localPath: string
  readonly r2Key: string
  readonly success: boolean
}

/**
 * Batch upload statistics.
 */
export interface UploadStats {
  readonly uploaded: number
  readonly skipped: number
  readonly failed: number
  readonly total: number
}

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

export interface R2ServiceShape {
  /**
   * Upload a single file to R2.
   */
  readonly upload: (
    localPath: string,
    r2Key: string
  ) => Effect.Effect<UploadResult, R2UploadError>

  /**
   * Check if an object exists in R2.
   */
  readonly exists: (r2Key: string) => Effect.Effect<boolean>

  /**
   * Upload multiple files with bounded concurrency.
   */
  readonly uploadMany: (
    files: readonly { localPath: string; r2Key: string }[]
  ) => Effect.Effect<UploadStats>

  /**
   * List objects in R2 bucket with prefix.
   */
  readonly list: (prefix: string) => Effect.Effect<readonly string[]>
}

// ---------------------------------------------------------------------------
// Service Tag
// ---------------------------------------------------------------------------

export class R2Service extends Context.Tag("@geohints/R2Service")<
  R2Service,
  R2ServiceShape
>() {
  static readonly layer = Layer.effect(
    R2Service,
    Effect.gen(function* () {
      const config = yield* ScraperConfig
      const executor = yield* CommandExecutor.CommandExecutor

      // Retry schedule for transient failures
      const retrySchedule = Schedule.exponential("1 second").pipe(
        Schedule.compose(Schedule.recurs(config.maxRetries))
      )

      const upload = (
        localPath: string,
        r2Key: string
      ): Effect.Effect<UploadResult, R2UploadError> =>
        pipe(
          Effect.gen(function* () {
            // Build wrangler command
            const command = Command.make(
              "npx",
              "wrangler",
              "r2",
              "object",
              "put",
              `${config.r2BucketName}/${r2Key}`,
              `--file=${localPath}`,
              "--content-type=image/webp"
            )

            // Execute command and get exit code
            const exitCode = yield* pipe(
              executor.start(command),
              Effect.flatMap((process) => process.exitCode)
            )

            if (exitCode !== 0) {
              return yield* Effect.fail(
                new R2UploadError({
                  localPath,
                  r2Key,
                  exitCode,
                  stderr: `Exit code: ${exitCode}`,
                })
              )
            }

            return { localPath, r2Key, success: true } as UploadResult
          }),
          Effect.scoped,
          Effect.retry(retrySchedule),
          Effect.catchAll(() =>
            Effect.succeed({ localPath, r2Key, success: false } as UploadResult)
          )
        )

      const exists = (r2Key: string): Effect.Effect<boolean> =>
        pipe(
          Effect.gen(function* () {
            const command = Command.make(
              "npx",
              "wrangler",
              "r2",
              "object",
              "get",
              `${config.r2BucketName}/${r2Key}`,
              "--pipe"
            )

            const exitCode = yield* pipe(
              executor.start(command),
              Effect.flatMap((process) => process.exitCode)
            )

            return exitCode === 0
          }),
          Effect.scoped,
          Effect.catchAll(() => Effect.succeed(false))
        )

      const uploadMany = (
        files: readonly { localPath: string; r2Key: string }[]
      ): Effect.Effect<UploadStats> =>
        Effect.gen(function* () {
          let uploaded = 0
          let skipped = 0
          let failed = 0
          let processed = 0
          const total = files.length
          const logInterval = Math.max(10, Math.floor(total / 20)) // Log every 5% or 10 files

          yield* Effect.log(`Starting upload of ${total} files...`)

          yield* Stream.fromIterable(files).pipe(
            Stream.mapEffect(
              ({ localPath, r2Key }) =>
                pipe(
                  Effect.gen(function* () {
                    // Skip existence check for speed - just upload and let R2 overwrite
                    // This is much faster than 2 wrangler calls per file
                    const result = yield* upload(localPath, r2Key)
                    if (result.success) {
                      uploaded++
                    } else {
                      failed++
                    }
                    return { ...result, skipped: false }
                  }),
                  Effect.tap(() => {
                    processed++
                    // Log progress periodically
                    if (processed % logInterval === 0 || processed === total) {
                      return Effect.log(
                        `Progress: ${processed}/${total} (${Math.round(processed / total * 100)}%) - ` +
                        `uploaded: ${uploaded}, failed: ${failed}`
                      )
                    }
                    return Effect.void
                  }),
                  Effect.catchAll(() => {
                    failed++
                    processed++
                    return Effect.succeed({ localPath, r2Key, success: false, skipped: false })
                  })
                ),
              { concurrency: config.concurrency }
            ),
            Stream.runDrain
          )

          return { uploaded, skipped, failed, total: files.length }
        })

      const list = (prefix: string): Effect.Effect<readonly string[]> =>
        pipe(
          Effect.gen(function* () {
            const command = Command.make(
              "npx",
              "wrangler",
              "r2",
              "object",
              "list",
              config.r2BucketName,
              `--prefix=${prefix}`
            )

            const result = yield* pipe(
              executor.start(command),
              Effect.flatMap((process) =>
                Effect.all({
                  exitCode: process.exitCode,
                  stdout: Effect.map(
                    Stream.runCollect(process.stdout),
                    (chunks) => {
                      const decoder = new TextDecoder()
                      let text = ""
                      for (const chunk of chunks) {
                        text += decoder.decode(chunk, { stream: true })
                      }
                      text += decoder.decode()
                      return text
                    }
                  ),
                })
              )
            )

            if (result.exitCode !== 0) {
              return [] as readonly string[]
            }

            // Parse JSON output from wrangler
            try {
              const parsed = JSON.parse(result.stdout)
              return (parsed.objects ?? []).map((obj: { key: string }) => obj.key) as readonly string[]
            } catch {
              return [] as readonly string[]
            }
          }),
          Effect.scoped,
          Effect.catchAll(() => Effect.succeed([] as readonly string[]))
        )

      return {
        upload,
        exists,
        uploadMany,
        list,
      }
    })
  )
}
