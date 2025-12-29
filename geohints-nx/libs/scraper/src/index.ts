/**
 * GeoHints Scraper Library
 *
 * Effect-based scraping infrastructure for GeoGuessr hint images.
 *
 * @module @geohints/scraper
 */

// Config
export { ScraperConfig } from "./config/scraper-config"
export type { ScraperConfigShape } from "./config/scraper-config"

// Services
export { HttpService } from "./services/http-service"
export type { HttpServiceShape } from "./services/http-service"

export { StorageService } from "./services/storage-service"
export type { StorageServiceShape } from "./services/storage-service"

// Errors
export {
  NetworkError,
  TimeoutError,
  HttpError,
  FsError,
  ParseError,
} from "./services/errors"
export type {
  HttpServiceError,
  StorageServiceError,
  ScraperError,
} from "./services/errors"

// Scrapers
export { scrapeGeomastr, scrapeAllGeomastr } from "./scrapers/geomastr"
