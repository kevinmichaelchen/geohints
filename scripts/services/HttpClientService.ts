/**
 * Effect-based HTTP client service with retry/backoff for scraping infrastructure.
 *
 * This module provides a properly typed HTTP client service using Effect patterns:
 * - Retry logic with exponential backoff
 * - Rate limiting (configurable delay between requests)
 * - Proper error types tracked in the Effect error channel
 * - Configuration via Effect Layer/Context
 *
 * @module HttpClientService
 */

import {
  Context,
  Data,
  Duration,
  Effect,
  Layer,
  Schedule,
  pipe,
} from "effect";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import { NodeHttpClient, NodeFileSystem, NodePath } from "@effect/platform-node";

// ---------------------------------------------------------------------------
// Error Types
// ---------------------------------------------------------------------------

/** Network-level error (connection refused, DNS failure, etc.) */
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly url: string;
  readonly cause: unknown;
}> {}

/** HTTP timeout error */
export class TimeoutError extends Data.TaggedError("TimeoutError")<{
  readonly url: string;
  readonly timeoutMs: number;
}> {}

/** HTTP response error (non-2xx status) */
export class HttpError extends Data.TaggedError("HttpError")<{
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
}> {}

/** File system error during download */
export class FsError extends Data.TaggedError("FsError")<{
  readonly path: string;
  readonly cause: unknown;
}> {}

/** Union type of all HTTP client errors */
export type HttpClientServiceError = NetworkError | TimeoutError | HttpError;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Configuration for the HTTP client service */
export interface HttpClientConfig {
  /** User agent string for requests */
  readonly userAgent: string;
  /** Delay between requests for rate limiting (milliseconds) */
  readonly requestDelayMs: number;
  /** Maximum number of retry attempts */
  readonly maxRetries: number;
  /** Initial delay for exponential backoff (milliseconds) */
  readonly initialBackoffMs: number;
  /** Maximum backoff delay (milliseconds) */
  readonly maxBackoffMs: number;
  /** Request timeout (milliseconds) */
  readonly timeoutMs: number;
}

/** Default HTTP client configuration */
export const defaultConfig: HttpClientConfig = {
  userAgent: "GeoHints-Scraper/1.0 (Educational project)",
  requestDelayMs: 500,
  maxRetries: 3,
  initialBackoffMs: 1000,
  maxBackoffMs: 30000,
  timeoutMs: 30000,
};

/** Context tag for HTTP client configuration */
export class HttpClientConfigService extends Context.Tag(
  "HttpClientConfigService"
)<HttpClientConfigService, HttpClientConfig>() {}

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

/** HTTP client service interface */
export interface HttpClientService {
  /** Fetch HTML content from a URL */
  readonly fetchHtml: (
    url: string
  ) => Effect.Effect<string, HttpClientServiceError>;

  /** Fetch binary image data from a URL */
  readonly fetchImage: (
    url: string
  ) => Effect.Effect<Uint8Array, HttpClientServiceError>;

  /** Download an image to a file path */
  readonly downloadImage: (
    url: string,
    destPath: string
  ) => Effect.Effect<void, HttpClientServiceError | FsError>;
}

/** Context tag for HTTP client service */
export class HttpClientServiceTag extends Context.Tag("HttpClientService")<
  HttpClientServiceTag,
  HttpClientService
>() {}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Maps platform HTTP client errors to our domain errors
 */
const mapHttpError = (
  url: string,
  error: HttpClientError.HttpClientError
): HttpClientServiceError => {
  if (error._tag === "RequestError") {
    return new NetworkError({ url, cause: error.error });
  }
  if (error._tag === "ResponseError") {
    const response = error.response;
    return new HttpError({
      url,
      status: response.status,
      statusText: String(response.status),
    });
  }
  return new NetworkError({ url, cause: error });
};

/**
 * Creates the retry schedule with exponential backoff
 */
const makeRetrySchedule = (config: HttpClientConfig) =>
  pipe(
    Schedule.exponential(Duration.millis(config.initialBackoffMs), 2),
    Schedule.either(Schedule.spaced(Duration.millis(config.maxBackoffMs))),
    Schedule.upTo(Duration.millis(config.maxBackoffMs * config.maxRetries)),
    Schedule.intersect(Schedule.recurs(config.maxRetries))
  );

/**
 * Creates a rate limiting effect (delay before request)
 */
const rateLimit = (config: HttpClientConfig) =>
  Effect.sleep(Duration.millis(config.requestDelayMs));

/**
 * Live implementation of the HTTP client service
 */
const make = Effect.gen(function* () {
  const config = yield* HttpClientConfigService;
  const client = yield* HttpClient.HttpClient;
  const fs = yield* FileSystem.FileSystem;
  const pathService = yield* Path.Path;

  const retrySchedule = makeRetrySchedule(config);

  /**
   * Core fetch function with retry, rate limiting, and error mapping
   */
  const fetchWithRetry = <A>(
    url: string,
    accept: string,
    extractBody: (
      response: HttpClientResponse.HttpClientResponse
    ) => Effect.Effect<A, HttpClientError.ResponseError>
  ): Effect.Effect<A, HttpClientServiceError> =>
    Effect.gen(function* () {
      // Rate limit: delay before making request
      yield* rateLimit(config);

      const request = pipe(
        HttpClientRequest.get(url),
        HttpClientRequest.setHeader("User-Agent", config.userAgent),
        HttpClientRequest.setHeader("Accept", accept)
      );

      const response = yield* pipe(
        client.execute(request),
        Effect.timeout(Duration.millis(config.timeoutMs)),
        Effect.flatMap((maybeResponse) =>
          maybeResponse === undefined
            ? Effect.fail(new TimeoutError({ url, timeoutMs: config.timeoutMs }))
            : Effect.succeed(maybeResponse)
        ),
        Effect.mapError((error) => {
          if (error instanceof TimeoutError) {
            return error;
          }
          return mapHttpError(url, error as HttpClientError.HttpClientError);
        })
      );

      // Check for non-2xx status
      if (response.status < 200 || response.status >= 300) {
        return yield* Effect.fail(
          new HttpError({
            url,
            status: response.status,
            statusText: String(response.status),
          })
        );
      }

      const body = yield* pipe(
        extractBody(response),
        Effect.mapError((error) => mapHttpError(url, error))
      );

      return body;
    }).pipe(
      Effect.retry(retrySchedule),
      Effect.catchAll((error) => Effect.fail(error))
    );

  const fetchHtml = (
    url: string
  ): Effect.Effect<string, HttpClientServiceError> =>
    fetchWithRetry(
      url,
      "text/html,application/xhtml+xml",
      (response) => response.text
    );

  const fetchImage = (
    url: string
  ): Effect.Effect<Uint8Array, HttpClientServiceError> =>
    fetchWithRetry(url, "image/*", (response) => response.arrayBuffer.pipe(
      Effect.map((buffer) => new Uint8Array(buffer))
    ));

  const downloadImage = (
    url: string,
    destPath: string
  ): Effect.Effect<void, HttpClientServiceError | FsError> =>
    Effect.gen(function* () {
      const imageData = yield* fetchImage(url);

      // Ensure directory exists
      const dir = pathService.dirname(destPath);
      yield* pipe(
        fs.makeDirectory(dir, { recursive: true }),
        Effect.catchAll((error) =>
          Effect.fail(new FsError({ path: dir, cause: error }))
        )
      );

      // Write file
      yield* pipe(
        fs.writeFile(destPath, imageData),
        Effect.catchAll((error) =>
          Effect.fail(new FsError({ path: destPath, cause: error }))
        )
      );
    });

  return {
    fetchHtml,
    fetchImage,
    downloadImage,
  } satisfies HttpClientService;
});

// ---------------------------------------------------------------------------
// Layers
// ---------------------------------------------------------------------------

/** Layer providing default configuration */
export const HttpClientConfigLive = Layer.succeed(
  HttpClientConfigService,
  defaultConfig
);

/** Layer for custom configuration */
export const HttpClientConfigLayer = (config: HttpClientConfig) =>
  Layer.succeed(HttpClientConfigService, config);

/** Live layer for the HTTP client service (requires HttpClient and Config) */
export const HttpClientServiceLive = Layer.effect(HttpClientServiceTag, make);

/** Complete live layer with all dependencies for Node.js */
export const HttpClientServiceNodeLive = pipe(
  HttpClientServiceLive,
  Layer.provide(HttpClientConfigLive),
  Layer.provide(NodeHttpClient.layer),
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(NodePath.layer)
);

/** Create a complete layer with custom configuration */
export const HttpClientServiceNodeLayer = (config: HttpClientConfig) =>
  pipe(
    HttpClientServiceLive,
    Layer.provide(HttpClientConfigLayer(config)),
    Layer.provide(NodeHttpClient.layer),
    Layer.provide(NodeFileSystem.layer),
    Layer.provide(NodePath.layer)
  );

// ---------------------------------------------------------------------------
// Test / Demo
// ---------------------------------------------------------------------------

const testProgram = Effect.gen(function* () {
  const httpClient = yield* HttpClientServiceTag;

  console.log("Testing HttpClientService...\n");

  // Test 1: Fetch HTML from example.com
  console.log("1. Fetching HTML from example.com...");
  const html = yield* pipe(
    httpClient.fetchHtml("https://example.com"),
    Effect.tap((content) =>
      Effect.sync(() => {
        console.log(`   Success! Received ${content.length} characters`);
        console.log(`   Title contains 'Example': ${content.includes("Example Domain")}`);
      })
    ),
    Effect.catchAll((error) =>
      Effect.sync(() => {
        console.log(`   Error: ${error._tag} - ${JSON.stringify(error)}`);
        return "";
      })
    )
  );

  // Test 2: Test error handling with invalid URL
  console.log("\n2. Testing error handling with non-existent domain...");
  yield* pipe(
    httpClient.fetchHtml("https://this-domain-does-not-exist-12345.com"),
    Effect.tap(() =>
      Effect.sync(() => console.log("   Unexpected success!"))
    ),
    Effect.catchTag("NetworkError", (error) =>
      Effect.sync(() => {
        console.log(`   Correctly caught NetworkError for: ${error.url}`);
      })
    ),
    Effect.catchAll((error) =>
      Effect.sync(() => {
        console.log(`   Caught error: ${error._tag}`);
      })
    )
  );

  // Test 3: Test with 404
  console.log("\n3. Testing 404 error handling...");
  yield* pipe(
    httpClient.fetchHtml("https://example.com/this-page-does-not-exist"),
    Effect.tap(() =>
      Effect.sync(() => console.log("   Unexpected success!"))
    ),
    Effect.catchTag("HttpError", (error) =>
      Effect.sync(() => {
        console.log(`   Correctly caught HttpError: status ${error.status}`);
      })
    ),
    Effect.catchAll((error) =>
      Effect.sync(() => {
        console.log(`   Caught error: ${error._tag}`);
      })
    )
  );

  console.log("\nAll tests completed!");

  return html.length > 0;
});

// Run test when executed directly
const main = pipe(
  testProgram,
  Effect.provide(HttpClientServiceNodeLive),
  Effect.runPromise
);

// Only run if this is the main module
if (process.argv[1]?.endsWith("HttpClientService.ts")) {
  main
    .then((success) => {
      console.log(`\nTest suite ${success ? "PASSED" : "FAILED"}`);
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
