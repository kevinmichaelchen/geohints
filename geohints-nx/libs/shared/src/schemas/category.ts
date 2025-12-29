/**
 * Category and Source schema definitions using Effect Schema.
 *
 * @module category
 */

import { Schema } from "effect"

/**
 * Categories of geographic hints that can be scraped.
 * These represent visual identifiers used in GeoGuessr.
 */
export const Category = Schema.Literal(
  "bollards",
  "license-plates",
  "road-lines",
  "street-signs",
  "utility-poles",
  "phone-booths",
  "post-boxes",
  "crosswalks",
  "guardrails",
  "road-markings",
  "traffic-lights",
  "house-numbers",
  "follow-cars",
  "google-cars",
  "vegetation",
  "architecture",
  "road-surfaces",
  "road-signs",
  "speed-limits",
  "languages",
  "scripts"
)
export type Category = typeof Category.Type

/**
 * Array of all category values for iteration.
 */
export const CATEGORIES = [
  "bollards",
  "license-plates",
  "road-lines",
  "street-signs",
  "utility-poles",
  "phone-booths",
  "post-boxes",
  "crosswalks",
  "guardrails",
  "road-markings",
  "traffic-lights",
  "house-numbers",
  "follow-cars",
  "google-cars",
  "vegetation",
  "architecture",
  "road-surfaces",
  "road-signs",
  "speed-limits",
  "languages",
  "scripts",
] as const

/**
 * Sources from which geographic hints can be scraped.
 */
export const Source = Schema.Literal("geomastr", "geohints", "plonkit")
export type Source = typeof Source.Type

/**
 * Array of all source values for iteration.
 */
export const SOURCES = ["geomastr", "geohints", "plonkit"] as const
