/**
 * Bollard data generated from scraped images
 * Generated: 2025-12-29T17:06:13.533Z
 * Total: 88 countries, 154 images
 */

import { enrichWithMeta, getContinents, type CountryMeta } from "./country-meta";

export const R2_BASE_URL = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev";

/** Feature-specific data for bollards */
interface BollardData {
  /** Image sequence numbers */
  images: number[];
}

/** Bollard country with full metadata */
export type BollardCountry = CountryMeta & BollardData;

/**
 * Raw bollard data - just country codes and their images
 * Country metadata (name, continent, regions) comes from country-meta.ts
 */
const bollardData: Record<string, BollardData> = {
  AL: { images: [1] },
  AD: { images: [1, 2] },
  AR: { images: [1] },
  AU: { images: [1, 2, 3, 4, 5, 6] },
  AT: { images: [1, 2, 3, 4, 5, 6] },
  BD: { images: [1] },
  BE: { images: [1, 2, 3] },
  BM: { images: [1] },
  BO: { images: [1] },
  BW: { images: [1, 2] },
  BR: { images: [1, 2] },
  BG: { images: [1] },
  KH: { images: [1, 2] },
  CA: { images: [1, 2, 3, 4, 5] },
  CL: { images: [1, 2] },
  CX: { images: [1] },
  CO: { images: [1] },
  HR: { images: [1] },
  CZ: { images: [1] },
  DK: { images: [1, 2, 3] },
  DO: { images: [1] },
  EC: { images: [1, 2] },
  EE: { images: [1] },
  SZ: { images: [1] },
  FO: { images: [1] },
  FI: { images: [1] },
  FR: { images: [1, 2] },
  DE: { images: [1] },
  GH: { images: [1] },
  GR: { images: [1] },
  GL: { images: [1] },
  GU: { images: [1] },
  GT: { images: [1] },
  HU: { images: [1, 2] },
  IS: { images: [1] },
  IN: { images: [1, 2, 3] },
  ID: { images: [1, 2] },
  IE: { images: [1] },
  IM: { images: [1] },
  IL: { images: [1] },
  IT: { images: [1, 2] },
  JP: { images: [1, 2, 3] },
  JE: { images: [1] },
  KE: { images: [1, 2] },
  KG: { images: [1] },
  LA: { images: [1] },
  LV: { images: [1] },
  LS: { images: [1] },
  LT: { images: [1] },
  LU: { images: [1, 2] },
  MY: { images: [1, 2, 3, 4] },
  MT: { images: [1] },
  MX: { images: [1] },
  MN: { images: [1] },
  ME: { images: [1] },
  NL: { images: [1, 2, 3] },
  NZ: { images: [1] },
  MK: { images: [1, 2, 3, 4] },
  NO: { images: [1] },
  PE: { images: [1] },
  PH: { images: [1, 2] },
  PL: { images: [1, 2] },
  PT: { images: [1, 2] },
  PR: { images: [1] },
  RO: { images: [1] },
  RU: { images: [1, 2] },
  SM: { images: [1] },
  SN: { images: [1, 2, 3] },
  RS: { images: [1, 2] },
  SG: { images: [1] },
  SK: { images: [1] },
  SI: { images: [1, 2] },
  ZA: { images: [1] },
  KR: { images: [1] },
  ES: { images: [1, 2] },
  LK: { images: [1, 2] },
  SE: { images: [1, 2, 3, 4, 5] },
  CH: { images: [1, 2] },
  TW: { images: [1] },
  TH: { images: [1] },
  TN: { images: [1] },
  TR: { images: [1, 2] },
  UA: { images: [1, 2] },
  AE: { images: [1] },
  GB: { images: [1, 2, 3] },
  US: { images: [1, 2, 3, 4, 5, 6] },
  UY: { images: [1] },
  VN: { images: [1] },
};

/** Bollard countries with full metadata, sorted by name */
export const bollardCountries: BollardCountry[] = enrichWithMeta(bollardData);

/** All continents that have bollard data */
export const continents = getContinents();

/**
 * Get R2 URL for a bollard image
 */
export function getBollardImageUrl(
  countryCode: string,
  sequence: number,
  size: 400 | 800 | 1200 = 800,
): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, "0");
  return `${R2_BASE_URL}/bollards/${cc}/${cc}-${seq}-${size}w.webp`;
}

/**
 * Get srcset for a bollard image
 */
export function getBollardSrcset(countryCode: string, sequence: number): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, "0");
  const base = `${R2_BASE_URL}/bollards/${cc}/${cc}-${seq}`;
  return `${base}-400w.webp 400w, ${base}-800w.webp 800w, ${base}-1200w.webp 1200w`;
}
