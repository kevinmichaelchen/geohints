/**
 * Effect-based File System Service
 *
 * Provides a type-safe wrapper around @effect/platform-node's FileSystem
 * with proper error handling and JSON file operations with Schema validation.
 *
 * @module FileSystemService
 */

import { FileSystem } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { Context, Data, Effect, Layer, pipe } from "effect";
import * as Schema from "effect/Schema";
import * as path from "node:path";

// =============================================================================
// Error Types
// =============================================================================

/**
 * Base file system error type with tagged union discrimination
 */
export type FsError = FileNotFoundError | PermissionError | FileExistsError | FsUnknownError;

/**
 * Thrown when attempting to read a file that does not exist
 */
export class FileNotFoundError extends Data.TaggedError("FileNotFoundError")<{
  readonly path: string;
  readonly operation: string;
  readonly cause?: unknown;
}> {
  override get message(): string {
    return `File not found: ${this.path} (during ${this.operation})`;
  }
}

/**
 * Thrown when file access is denied due to permissions
 */
export class PermissionError extends Data.TaggedError("PermissionError")<{
  readonly path: string;
  readonly operation: string;
  readonly cause?: unknown;
}> {
  override get message(): string {
    return `Permission denied: ${this.path} (during ${this.operation})`;
  }
}

/**
 * Thrown when attempting to create a file/directory that already exists
 */
export class FileExistsError extends Data.TaggedError("FileExistsError")<{
  readonly path: string;
  readonly operation: string;
  readonly cause?: unknown;
}> {
  override get message(): string {
    return `File already exists: ${this.path} (during ${this.operation})`;
  }
}

/**
 * Catch-all error for unexpected file system failures
 */
export class FsUnknownError extends Data.TaggedError("FsUnknownError")<{
  readonly path: string;
  readonly operation: string;
  readonly cause?: unknown;
}> {
  override get message(): string {
    return `File system error: ${this.path} (during ${this.operation})`;
  }
}

/**
 * Error thrown when JSON parsing or Schema validation fails
 */
export class ParseError extends Data.TaggedError("ParseError")<{
  readonly path: string;
  readonly reason: string;
  readonly cause?: unknown;
}> {
  override get message(): string {
    return `Parse error in ${this.path}: ${this.reason}`;
  }
}

// =============================================================================
// Error Mapping
// =============================================================================

/**
 * Maps PlatformError to our domain-specific FsError types
 */
const mapPlatformError = (
  filePath: string,
  operation: string
) => (error: FileSystem.PlatformError.PlatformError): FsError => {
  if (error._tag === "SystemError") {
    switch (error.reason) {
      case "NotFound":
        return new FileNotFoundError({ path: filePath, operation, cause: error });
      case "PermissionDenied":
        return new PermissionError({ path: filePath, operation, cause: error });
      case "AlreadyExists":
        return new FileExistsError({ path: filePath, operation, cause: error });
      default:
        return new FsUnknownError({ path: filePath, operation, cause: error });
    }
  }
  return new FsUnknownError({ path: filePath, operation, cause: error });
};

// =============================================================================
// Service Definition
// =============================================================================

/**
 * FileSystemService interface defining all available operations
 */
export interface FileSystemService {
  /**
   * Read file contents as a UTF-8 string
   */
  readonly readFile: (filePath: string) => Effect.Effect<string, FsError>;

  /**
   * Write string content to a file (creates parent directories if needed)
   */
  readonly writeFile: (filePath: string, content: string) => Effect.Effect<void, FsError>;

  /**
   * Read and parse a JSON file, validating against a Schema
   */
  readonly readJson: <A, I>(
    filePath: string,
    schema: Schema.Schema<A, I>
  ) => Effect.Effect<A, FsError | ParseError>;

  /**
   * Write data to a JSON file with pretty formatting
   */
  readonly writeJson: (filePath: string, data: unknown) => Effect.Effect<void, FsError>;

  /**
   * Ensure a directory exists, creating it recursively if needed
   */
  readonly ensureDir: (dirPath: string) => Effect.Effect<void, FsError>;

  /**
   * Check if a file or directory exists
   */
  readonly exists: (filePath: string) => Effect.Effect<boolean, FsError>;

  /**
   * Copy a file from source to destination
   */
  readonly copyFile: (src: string, dest: string) => Effect.Effect<void, FsError>;

  /**
   * Remove a file or directory
   */
  readonly remove: (filePath: string, options?: { readonly recursive?: boolean }) => Effect.Effect<void, FsError>;

  /**
   * List contents of a directory
   */
  readonly readDirectory: (dirPath: string) => Effect.Effect<readonly string[], FsError>;
}

/**
 * FileSystemService Context Tag
 */
export class FileSystemServiceTag extends Context.Tag("@geohints/FileSystemService")<
  FileSystemServiceTag,
  FileSystemService
>() {}

// =============================================================================
// Service Implementation
// =============================================================================

/**
 * Create the FileSystemService implementation using @effect/platform FileSystem
 */
const makeFileSystemService = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;

  const readFile = (filePath: string): Effect.Effect<string, FsError> =>
    pipe(
      fs.readFileString(filePath, "utf8"),
      Effect.mapError(mapPlatformError(filePath, "readFile"))
    );

  const writeFile = (filePath: string, content: string): Effect.Effect<void, FsError> =>
    pipe(
      Effect.gen(function* () {
        // Ensure parent directory exists
        const dir = path.dirname(filePath);
        yield* fs.makeDirectory(dir, { recursive: true }).pipe(
          Effect.catchTag("SystemError", (e) =>
            e.reason === "AlreadyExists" ? Effect.void : Effect.fail(e)
          )
        );
        // Write the file
        yield* fs.writeFileString(filePath, content);
      }),
      Effect.mapError(mapPlatformError(filePath, "writeFile"))
    );

  const readJson = <A, I>(
    filePath: string,
    schema: Schema.Schema<A, I>
  ): Effect.Effect<A, FsError | ParseError> =>
    pipe(
      readFile(filePath),
      Effect.flatMap((content) =>
        pipe(
          Effect.try({
            try: () => JSON.parse(content) as unknown,
            catch: (error) =>
              new ParseError({
                path: filePath,
                reason: error instanceof Error ? error.message : "Invalid JSON",
                cause: error,
              }),
          }),
          Effect.flatMap((parsed) =>
            pipe(
              Schema.decodeUnknown(schema)(parsed),
              Effect.mapError(
                (error) =>
                  new ParseError({
                    path: filePath,
                    reason: `Schema validation failed: ${error.message}`,
                    cause: error,
                  })
              )
            )
          )
        )
      )
    );

  const writeJson = (filePath: string, data: unknown): Effect.Effect<void, FsError> =>
    writeFile(filePath, JSON.stringify(data, null, 2) + "\n");

  const ensureDir = (dirPath: string): Effect.Effect<void, FsError> =>
    pipe(
      fs.makeDirectory(dirPath, { recursive: true }),
      Effect.catchTag("SystemError", (e) =>
        e.reason === "AlreadyExists" ? Effect.void : Effect.fail(e)
      ),
      Effect.mapError(mapPlatformError(dirPath, "ensureDir"))
    );

  const exists = (filePath: string): Effect.Effect<boolean, FsError> =>
    pipe(
      fs.exists(filePath),
      Effect.mapError(mapPlatformError(filePath, "exists"))
    );

  const copyFile = (src: string, dest: string): Effect.Effect<void, FsError> =>
    pipe(
      Effect.gen(function* () {
        // Ensure destination directory exists
        const destDir = path.dirname(dest);
        yield* fs.makeDirectory(destDir, { recursive: true }).pipe(
          Effect.catchTag("SystemError", (e) =>
            e.reason === "AlreadyExists" ? Effect.void : Effect.fail(e)
          )
        );
        // Copy the file
        yield* fs.copyFile(src, dest);
      }),
      Effect.mapError(mapPlatformError(src, "copyFile"))
    );

  const remove = (
    filePath: string,
    options?: { readonly recursive?: boolean }
  ): Effect.Effect<void, FsError> =>
    pipe(
      fs.remove(filePath, { recursive: options?.recursive ?? false }),
      Effect.mapError(mapPlatformError(filePath, "remove"))
    );

  const readDirectory = (dirPath: string): Effect.Effect<readonly string[], FsError> =>
    pipe(
      fs.readDirectory(dirPath),
      Effect.mapError(mapPlatformError(dirPath, "readDirectory"))
    );

  return FileSystemServiceTag.of({
    readFile,
    writeFile,
    readJson,
    writeJson,
    ensureDir,
    exists,
    copyFile,
    remove,
    readDirectory,
  });
});

// =============================================================================
// Layers
// =============================================================================

/**
 * Live layer that provides the FileSystemService using Node.js file system
 */
export const FileSystemServiceLive: Layer.Layer<FileSystemServiceTag> = Layer.effect(
  FileSystemServiceTag,
  makeFileSystemService
).pipe(Layer.provide(NodeFileSystem.layer));

/**
 * Full layer including Node.js file system dependency
 */
export const FileSystemServiceLayer: Layer.Layer<FileSystemServiceTag> =
  FileSystemServiceLive;

// =============================================================================
// Convenience Accessors
// =============================================================================

/**
 * Access the FileSystemService from context
 */
export const FileSystemService = FileSystemServiceTag;

// =============================================================================
// Test Runner
// =============================================================================

/**
 * Simple test to verify the service works correctly
 */
const runTests = Effect.gen(function* () {
  const fsService = yield* FileSystemServiceTag;

  console.log("Testing FileSystemService...\n");

  // Test 1: ensureDir
  console.log("1. Testing ensureDir...");
  const testDir = "/tmp/geohints-fs-test";
  yield* fsService.ensureDir(testDir);
  console.log(`   Created directory: ${testDir}`);

  // Test 2: writeFile
  console.log("2. Testing writeFile...");
  const testFile = `${testDir}/test.txt`;
  yield* fsService.writeFile(testFile, "Hello, Effect!");
  console.log(`   Wrote file: ${testFile}`);

  // Test 3: readFile
  console.log("3. Testing readFile...");
  const content = yield* fsService.readFile(testFile);
  console.log(`   Read content: "${content}"`);

  // Test 4: exists
  console.log("4. Testing exists...");
  const fileExists = yield* fsService.exists(testFile);
  const missingExists = yield* fsService.exists(`${testDir}/missing.txt`);
  console.log(`   ${testFile} exists: ${fileExists}`);
  console.log(`   missing.txt exists: ${missingExists}`);

  // Test 5: writeJson / readJson
  console.log("5. Testing writeJson and readJson...");
  const TestSchema = Schema.Struct({
    name: Schema.String,
    count: Schema.Number,
    active: Schema.Boolean,
  });
  const testData = { name: "test", count: 42, active: true };
  const jsonFile = `${testDir}/test.json`;
  yield* fsService.writeJson(jsonFile, testData);
  const parsed = yield* fsService.readJson(jsonFile, TestSchema);
  console.log(`   Wrote and read JSON: ${JSON.stringify(parsed)}`);

  // Test 6: copyFile
  console.log("6. Testing copyFile...");
  const copiedFile = `${testDir}/copied.txt`;
  yield* fsService.copyFile(testFile, copiedFile);
  const copiedContent = yield* fsService.readFile(copiedFile);
  console.log(`   Copied file content: "${copiedContent}"`);

  // Test 7: readDirectory
  console.log("7. Testing readDirectory...");
  const files = yield* fsService.readDirectory(testDir);
  console.log(`   Directory contents: ${files.join(", ")}`);

  // Test 8: remove
  console.log("8. Testing remove...");
  yield* fsService.remove(testDir, { recursive: true });
  const dirStillExists = yield* fsService.exists(testDir);
  console.log(`   Removed directory. Still exists: ${dirStillExists}`);

  // Test 9: Error handling - FileNotFoundError
  console.log("9. Testing error handling (FileNotFoundError)...");
  const notFoundResult = yield* pipe(
    fsService.readFile("/nonexistent/path/file.txt"),
    Effect.catchTag("FileNotFoundError", (e) =>
      Effect.succeed(`Caught expected error: ${e._tag}`)
    )
  );
  console.log(`   ${notFoundResult}`);

  // Test 10: Error handling - ParseError
  console.log("10. Testing error handling (ParseError)...");
  yield* fsService.ensureDir(testDir);
  yield* fsService.writeFile(`${testDir}/bad.json`, "{ invalid json }");
  const parseResult = yield* pipe(
    fsService.readJson(`${testDir}/bad.json`, TestSchema),
    Effect.catchTag("ParseError", (e) =>
      Effect.succeed(`Caught expected error: ${e._tag}`)
    )
  );
  console.log(`    ${parseResult}`);

  // Cleanup
  yield* fsService.remove(testDir, { recursive: true });

  console.log("\nAll tests passed!");
});

// Run tests when executed directly
const main = pipe(
  runTests,
  Effect.provide(FileSystemServiceLayer),
  Effect.catchAll((error) => {
    console.error("Test failed:", error);
    return Effect.fail(error);
  })
);

// Check if running as main module
const isMainModule = process.argv[1]?.includes("FileSystemService");
if (isMainModule) {
  Effect.runPromise(main).catch(console.error);
}
