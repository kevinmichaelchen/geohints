/**
 * Country lookup utilities
 * Provides case-insensitive lookup and flexible URL handling
 */

import { bollardCountries, type BollardCountry } from "./bollards";
import { getCountryMeta, type CountryMeta } from "./country-meta";

/**
 * Map for case-insensitive country lookup by ISO code
 */
const countryByCode = new Map<string, BollardCountry>(
  bollardCountries.map((c) => [c.code.toLowerCase(), c]),
);

/**
 * Find a country by its ISO code (case-insensitive)
 * @param code - ISO 3166-1 alpha-2 country code (e.g., "US", "us", "In")
 * @returns The country data or undefined if not found
 */
export function findCountryByCode(code: string): BollardCountry | undefined {
  return countryByCode.get(code.toLowerCase());
}

/**
 * Get all available country codes (lowercase)
 */
export function getAllCountryCodes(): string[] {
  return bollardCountries.map((c) => c.code.toLowerCase());
}

/**
 * Check if a code is a valid country code
 */
export function isValidCountryCode(code: string): boolean {
  return countryByCode.has(code.toLowerCase());
}

// Re-export types and utilities from country-meta
export { getCountryMeta, type CountryMeta };
export type { BollardCountry };
