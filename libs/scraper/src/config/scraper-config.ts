/**
 * Scraper configuration using Effect Config and Redacted.
 *
 * All secrets are wrapped in Redacted to prevent accidental logging.
 * Configuration is loaded from environment variables with sensible defaults.
 *
 * @module scraper-config
 */

import { Config, Context, Effect, Layer, Redacted } from "effect";

// ---------------------------------------------------------------------------
// Configuration Interface
// ---------------------------------------------------------------------------

/**
 * Scraper configuration values.
 */
export interface ScraperConfigShape {
  /** Public R2 bucket URL for serving images */
  readonly r2BucketUrl: string;
  /** R2 access key ID (redacted) */
  readonly r2AccessKeyId: Redacted.Redacted<string>;
  /** R2 secret access key (redacted) */
  readonly r2SecretAccessKey: Redacted.Redacted<string>;
  /** R2 account ID (redacted) */
  readonly r2AccountId: Redacted.Redacted<string>;
  /** R2 bucket name */
  readonly r2BucketName: string;
  /** Delay between requests in milliseconds */
  readonly requestDelayMs: number;
  /** Maximum retry attempts */
  readonly maxRetries: number;
  /** Concurrent requests limit */
  readonly concurrency: number;
  /** Request timeout in milliseconds */
  readonly timeoutMs: number;
  /** User agent string */
  readonly userAgent: string;
  /** Local directory for scraped images */
  readonly outputDir: string;
}

// ---------------------------------------------------------------------------
// Service Tag
// ---------------------------------------------------------------------------

/**
 * ScraperConfig service tag.
 *
 * Usage:
 * ```typescript
 * Effect.gen(function* () {
 *   const config = yield* ScraperConfig
 *   console.log(config.r2BucketUrl)
 *   // Access secrets with Redacted.value()
 *   const apiKey = Redacted.value(config.r2AccessKeyId)
 * })
 * ```
 */
export class ScraperConfig extends Context.Tag("@geohints/ScraperConfig")<
  ScraperConfig,
  ScraperConfigShape
>() {
  /**
   * Live layer that loads configuration from environment variables.
   */
  static readonly layer = Layer.effect(
    ScraperConfig,
    Effect.gen(function* () {
      const r2BucketUrl = yield* Config.string("R2_PUBLIC_URL").pipe(
        Config.orElse(() => Config.succeed("https://pub-3d7bacd76def438caae68643612e60f9.r2.dev")),
      );

      const r2AccessKeyId = yield* Config.redacted("R2_ACCESS_KEY_ID").pipe(
        Config.orElse(() => Config.succeed(Redacted.make(""))),
      );

      const r2SecretAccessKey = yield* Config.redacted("R2_SECRET_ACCESS_KEY").pipe(
        Config.orElse(() => Config.succeed(Redacted.make(""))),
      );

      const r2AccountId = yield* Config.redacted("R2_ACCOUNT_ID").pipe(
        Config.orElse(() => Config.succeed(Redacted.make(""))),
      );

      const r2BucketName = yield* Config.string("R2_BUCKET_NAME").pipe(
        Config.orElse(() => Config.succeed("geohints-images")),
      );

      const requestDelayMs = yield* Config.integer("SCRAPER_DELAY_MS").pipe(
        Config.orElse(() => Config.succeed(500)),
      );

      const maxRetries = yield* Config.integer("SCRAPER_MAX_RETRIES").pipe(
        Config.orElse(() => Config.succeed(3)),
      );

      const concurrency = yield* Config.integer("SCRAPER_CONCURRENCY").pipe(
        Config.orElse(() => Config.succeed(3)),
      );

      const timeoutMs = yield* Config.integer("SCRAPER_TIMEOUT_MS").pipe(
        Config.orElse(() => Config.succeed(30000)),
      );

      const userAgent = yield* Config.string("SCRAPER_USER_AGENT").pipe(
        Config.orElse(() => Config.succeed("GeoHints-Scraper/2.0 (Educational project)")),
      );

      const outputDir = yield* Config.string("SCRAPER_OUTPUT_DIR").pipe(
        Config.orElse(() => Config.succeed("./scraped-images")),
      );

      return {
        r2BucketUrl,
        r2AccessKeyId,
        r2SecretAccessKey,
        r2AccountId,
        r2BucketName,
        requestDelayMs,
        maxRetries,
        concurrency,
        timeoutMs,
        userAgent,
        outputDir,
      };
    }),
  );

  /**
   * Test layer with hardcoded values for testing.
   */
  static readonly testLayer = Layer.succeed(ScraperConfig, {
    r2BucketUrl: "https://test-bucket.example.com",
    r2AccessKeyId: Redacted.make("test-access-key"),
    r2SecretAccessKey: Redacted.make("test-secret-key"),
    r2AccountId: Redacted.make("test-account-id"),
    r2BucketName: "test-bucket",
    requestDelayMs: 100,
    maxRetries: 1,
    concurrency: 1,
    timeoutMs: 5000,
    userAgent: "Test-Scraper/1.0",
    outputDir: "./test-output",
  });
}
