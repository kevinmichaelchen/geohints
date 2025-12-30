/**
 * Follow cars data generated from scraped images
 * Generated: 2025-12-30T05:04:01.544Z
 * Total: 25 countries, 76 images
 */

import { enrichWithMeta, getContinents, type CountryMeta } from "./country-meta";

export const R2_BASE_URL = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev";

/** Feature-specific data for follow cars */
interface FollowCarData {
  /** Image content hashes (first 8 chars) */
  images: string[];
}

/** Follow car country with full metadata */
export type FollowCarCountry = CountryMeta & FollowCarData;

/**
 * Raw follow car data - just country codes and their image hashes
 * Country metadata (name, continent, regions) comes from country-meta.ts
 */
const followCarData: Record<string, FollowCarData> = {
  BW: { images: ["61afd9f1"] },
  BG: { images: ["8356be77"] },
  CA: { images: ["4825b2d0"] },
  CC: { images: ["6ba89dd3"] },
  CR: { images: ["905108eb", "01889a1c"] },
  DK: { images: ["8ff2037e"] },
  IE: { images: ["987fc9e3", "07a8a486", "35b4afdb"] },
  IL: { images: ["58dc9ffe", "af8853e9"] },
  IT: { images: ["eafd2fa3", "5f63d7c8"] },
  JP: { images: ["aea388d5"] },
  JO: { images: ["7ee8b75e", "ce849531"] },
  KE: { images: ["243bed95", "3fa4424f", "e2ef15ab", "d5612362", "7b8940ac", "b6957c08"] },
  MY: { images: ["7589cfb1"] },
  MN: { images: ["b96e273f"] },
  ME: { images: ["beddc36d"] },
  NG: {
    images: [
      "aef63ea7",
      "164ca3a0",
      "a5a48175",
      "21724179",
      "c982cf4a",
      "fd42b636",
      "6c367396",
      "4e81c437",
      "4d2e781f",
      "048f6fba",
      "4ea02673",
      "800a1c99",
      "b65bb026",
      "06ec86d1",
      "79a69d87",
      "618a6ef7",
      "f71968cb",
      "cf2d81aa",
    ],
  },
  NO: { images: ["a96566ed"] },
  PS: { images: ["8a39312e", "58b17da5", "b24697c0"] },
  PH: { images: ["503282a6"] },
  RU: { images: ["6adca507"] },
  ZA: { images: ["b9def49a"] },
  ES: { images: ["31c30585"] },
  TN: {
    images: [
      "1aa31f30",
      "6ae5eb13",
      "1782596a",
      "d0526933",
      "171847c4",
      "256f9054",
      "effcb28c",
      "2b3314a9",
      "7b80c386",
      "a0ce1456",
    ],
  },
  GB: { images: ["ea465adf", "744222f7"] },
  US: {
    images: [
      "66e09dbb",
      "edc7f976",
      "26160d37",
      "45a65585",
      "bbe72e87",
      "def7e94e",
      "1b58e049",
      "d9d26ed7",
      "746e20a8",
      "5d33b929",
      "437c7af5",
      "1451ee9d",
    ],
  },
};

/** Follow car countries with full metadata, sorted by name */
export const followCarCountries: FollowCarCountry[] = enrichWithMeta(followCarData);

/** All continents that have follow car data */
export const continents = getContinents();

/**
 * Get R2 URL for a follow car image
 */
export function getFollowCarImageUrl(
  countryCode: string,
  hash: string,
  size: 400 | 800 | 1200 = 800,
): string {
  const cc = countryCode.toLowerCase();
  return `${R2_BASE_URL}/follow-cars/${cc}/${hash}-${size}w.webp`;
}

/**
 * Get srcset for a follow car image
 */
export function getFollowCarSrcset(countryCode: string, hash: string): string {
  const cc = countryCode.toLowerCase();
  const base = `${R2_BASE_URL}/follow-cars/${cc}/${hash}`;
  return `${base}-400w.webp 400w, ${base}-800w.webp 800w, ${base}-1200w.webp 1200w`;
}
