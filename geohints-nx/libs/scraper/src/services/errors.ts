/**
 * Domain error types for the scraper services.
 *
 * Uses Effect's Data.TaggedError for proper error handling
 * and pattern matching.
 *
 * @module errors
 */

import { Data } from "effect"

/**
 * Network-level error (connection refused, DNS failure, etc.)
 */
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly url: string
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * HTTP timeout error.
 */
export class TimeoutError extends Data.TaggedError("TimeoutError")<{
  readonly url: string
  readonly timeoutMs: number
}> {}

/**
 * HTTP response error (non-2xx status).
 */
export class HttpError extends Data.TaggedError("HttpError")<{
  readonly url: string
  readonly status: number
  readonly statusText: string
}> {}

/**
 * File system error.
 */
export class FsError extends Data.TaggedError("FsError")<{
  readonly path: string
  readonly operation: "read" | "write" | "mkdir" | "delete"
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Parse/validation error.
 */
export class ParseError extends Data.TaggedError("ParseError")<{
  readonly source: string
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Union of all HTTP-related errors.
 */
export type HttpServiceError = NetworkError | TimeoutError | HttpError

/**
 * Union of all storage-related errors.
 */
export type StorageServiceError = FsError

/**
 * Union of all scraper errors.
 */
export type ScraperError =
  | NetworkError
  | TimeoutError
  | HttpError
  | FsError
  | ParseError
