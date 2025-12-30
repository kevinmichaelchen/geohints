/**
 * HTTP service using @effect/platform.
 *
 * Provides rate-limited, retry-enabled HTTP fetching with proper
 * error types tracked in the Effect error channel.
 *
 * @module http-service
 */

import { Context, Duration, Effect, Layer, Schedule, Stream, pipe } from "effect";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientError from "@effect/platform/HttpClientError";
import { ScraperConfig } from "../config/scraper-config";
import { HttpError, NetworkError, TimeoutError, type HttpServiceError } from "./errors";

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

/**
 * HTTP service interface.
 */
export interface HttpServiceShape {
  /**
   * Fetch HTML content from a URL.
   */
  readonly fetchHtml: (url: string) => Effect.Effect<string, HttpServiceError>;

  /**
   * Fetch binary image data from a URL.
   */
  readonly fetchImage: (url: string) => Effect.Effect<Uint8Array, HttpServiceError>;

  /**
   * Fetch multiple URLs with controlled concurrency.
   */
  readonly fetchMany: <A, E>(
    urls: readonly string[],
    f: (url: string) => Effect.Effect<A, E>,
  ) => Stream.Stream<A, E>;
}

// ---------------------------------------------------------------------------
// Service Tag
// ---------------------------------------------------------------------------

/**
 * HttpService tag.
 */
export class HttpService extends Context.Tag("@geohints/HttpService")<
  HttpService,
  HttpServiceShape
>() {
  /**
   * Live layer requiring ScraperConfig and HttpClient.
   */
  static readonly layer = Layer.effect(
    HttpService,
    Effect.gen(function* () {
      const config = yield* ScraperConfig;
      const client = yield* HttpClient.HttpClient;

      // Create retry schedule with exponential backoff
      const retrySchedule = pipe(
        Schedule.exponential(Duration.millis(1000), 2),
        Schedule.intersect(Schedule.recurs(config.maxRetries)),
      );

      // Map platform errors to domain errors
      const mapError = (url: string, error: HttpClientError.HttpClientError): HttpServiceError => {
        if (error._tag === "RequestError") {
          return new NetworkError({
            url,
            message: String(error.reason),
            cause: error,
          });
        }
        if (error._tag === "ResponseError") {
          return new HttpError({
            url,
            status: error.response.status,
            statusText: String(error.response.status),
          });
        }
        return new NetworkError({
          url,
          message: "Unknown HTTP error",
          cause: error,
        });
      };

      // Core fetch function with rate limiting and retry
      const fetchWithRetry = <A>(
        url: string,
        accept: string,
        extractBody: (
          response: HttpClientResponse.HttpClientResponse,
        ) => Effect.Effect<A, HttpClientError.ResponseError>,
      ): Effect.Effect<A, HttpServiceError> =>
        Effect.gen(function* () {
          yield* Effect.annotateCurrentSpan("url", url);
          yield* Effect.annotateCurrentSpan("accept", accept);

          // Rate limit: delay before request
          yield* Effect.sleep(Duration.millis(config.requestDelayMs));

          const request = pipe(
            HttpClientRequest.get(url),
            HttpClientRequest.setHeader("User-Agent", config.userAgent),
            HttpClientRequest.setHeader("Accept", accept),
          );

          const response = yield* pipe(
            client.execute(request),
            Effect.timeout(Duration.millis(config.timeoutMs)),
            Effect.flatMap((maybeResponse) =>
              maybeResponse === undefined
                ? Effect.fail(new TimeoutError({ url, timeoutMs: config.timeoutMs }))
                : Effect.succeed(maybeResponse),
            ),
            Effect.mapError((error) => {
              if (error instanceof TimeoutError) {
                return error;
              }
              return mapError(url, error as HttpClientError.HttpClientError);
            }),
          );

          // Check for non-2xx status
          if (response.status < 200 || response.status >= 300) {
            return yield* Effect.fail(
              new HttpError({
                url,
                status: response.status,
                statusText: String(response.status),
              }),
            );
          }

          const body = yield* pipe(
            extractBody(response),
            Effect.mapError((error) => mapError(url, error)),
          );

          return body;
        }).pipe(
          Effect.retry(retrySchedule),
          Effect.catchAll((error) => Effect.fail(error)),
        );

      const fetchHtml = Effect.fn("HttpService.fetchHtml")(function* (url: string) {
        yield* Effect.annotateCurrentSpan("url", url);
        return yield* fetchWithRetry(
          url,
          "text/html,application/xhtml+xml",
          (response) => response.text,
        );
      });

      const fetchImage = Effect.fn("HttpService.fetchImage")(function* (url: string) {
        yield* Effect.annotateCurrentSpan("url", url);
        return yield* fetchWithRetry(url, "image/*", (response) =>
          response.arrayBuffer.pipe(Effect.map((buffer) => new Uint8Array(buffer as ArrayBuffer))),
        );
      });

      const fetchMany = <A, E>(
        urls: readonly string[],
        f: (url: string) => Effect.Effect<A, E>,
      ): Stream.Stream<A, E> =>
        Stream.fromIterable(urls).pipe(Stream.mapEffect(f, { concurrency: config.concurrency }));

      return {
        fetchHtml,
        fetchImage,
        fetchMany,
      };
    }),
  );
}
