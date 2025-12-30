/**
 * Image processing service using Sharp and Effect.
 *
 * Handles WEBP conversion and srcset generation per .kiro/specs/image-optimization.md
 *
 * @module image-service
 */

import { Context, Effect, Layer } from "effect";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Srcset variants for responsive images.
 */
export interface SrcsetVariants {
  readonly "400w": Uint8Array;
  readonly "800w": Uint8Array;
  readonly "1200w": Uint8Array;
}

/**
 * Fully processed image with all variants.
 */
export interface ProcessedImage {
  readonly original: Uint8Array;
  readonly variants: SrcsetVariants;
  readonly metadata: {
    readonly width: number;
    readonly height: number;
    readonly format: string;
  };
}

/**
 * Image processing error.
 */
export class ImageError {
  readonly _tag = "ImageError";
  constructor(
    readonly message: string,
    readonly cause?: unknown,
  ) {}
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ORIGINAL_QUALITY = 95;
const SRCSET_QUALITY = 82;

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

export interface ImageServiceShape {
  /**
   * Process raw image data into WEBP with srcset variants.
   */
  readonly processImage: (data: Uint8Array) => Effect.Effect<ProcessedImage, ImageError>;

  /**
   * Validate that a buffer is actual WEBP format.
   */
  readonly validateWebp: (data: Uint8Array) => Effect.Effect<boolean, ImageError>;

  /**
   * Convert any image format to WEBP.
   */
  readonly toWebp: (data: Uint8Array, quality?: number) => Effect.Effect<Uint8Array, ImageError>;

  /**
   * Generate a single srcset variant at specified width.
   */
  readonly resizeToWidth: (
    data: Uint8Array,
    width: number,
    quality?: number,
  ) => Effect.Effect<Uint8Array, ImageError>;
}

// ---------------------------------------------------------------------------
// Service Tag
// ---------------------------------------------------------------------------

export class ImageService extends Context.Tag("@geohints/ImageService")<
  ImageService,
  ImageServiceShape
>() {
  static readonly layer = Layer.succeed(
    ImageService,
    (() => {
      const toWebp = (
        data: Uint8Array,
        quality: number = ORIGINAL_QUALITY,
      ): Effect.Effect<Uint8Array, ImageError> =>
        Effect.tryPromise({
          try: async () => {
            const result = await sharp(Buffer.from(data)).webp({ quality }).toBuffer();
            return new Uint8Array(result);
          },
          catch: (error) => new ImageError("Failed to convert to WEBP", error),
        });

      const resizeToWidth = (
        data: Uint8Array,
        width: number,
        quality: number = SRCSET_QUALITY,
      ): Effect.Effect<Uint8Array, ImageError> =>
        Effect.tryPromise({
          try: async () => {
            const image = sharp(Buffer.from(data));
            const metadata = await image.metadata();

            // Don't upscale
            const targetWidth = metadata.width && metadata.width < width ? metadata.width : width;

            const result = await image
              .resize({ width: targetWidth, withoutEnlargement: true })
              .webp({ quality })
              .toBuffer();

            return new Uint8Array(result);
          },
          catch: (error) => new ImageError(`Failed to resize to ${width}px`, error),
        });

      const validateWebp = (data: Uint8Array): Effect.Effect<boolean, ImageError> =>
        Effect.tryPromise({
          try: async () => {
            const metadata = await sharp(Buffer.from(data)).metadata();
            return metadata.format === "webp";
          },
          catch: (error) => new ImageError("Failed to validate WEBP format", error),
        });

      const processImage = (data: Uint8Array): Effect.Effect<ProcessedImage, ImageError> =>
        Effect.gen(function* () {
          // Get original metadata
          const metadata = yield* Effect.tryPromise({
            try: async () => {
              const meta = await sharp(Buffer.from(data)).metadata();
              return {
                width: meta.width ?? 0,
                height: meta.height ?? 0,
                format: meta.format ?? "unknown",
              };
            },
            catch: (error) => new ImageError("Failed to read image metadata", error),
          });

          // Convert original to high-quality WEBP
          const original = yield* toWebp(data, ORIGINAL_QUALITY);

          // Generate srcset variants
          const [small, medium, large] = yield* Effect.all([
            resizeToWidth(data, 400),
            resizeToWidth(data, 800),
            resizeToWidth(data, 1200),
          ]);

          return {
            original,
            variants: {
              "400w": small,
              "800w": medium,
              "1200w": large,
            },
            metadata,
          };
        });

      return {
        processImage,
        validateWebp,
        toWebp,
        resizeToWidth,
      };
    })(),
  );
}
