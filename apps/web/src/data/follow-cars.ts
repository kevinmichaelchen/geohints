/**
 * Follow cars data generated from scraped images
 * Generated: 2025-12-30T05:04:01.544Z
 * Total: 25 countries, 76 images
 */

export const R2_BASE_URL = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev";

export interface FollowCarCountry {
  /** ISO 3166-1 alpha-2 country code (uppercase) */
  code: string;
  /** Country name */
  name: string;
  /** Continent */
  continent: string;
  /** Image content hashes (first 8 chars) */
  images: string[];
}

export const followCarCountries: FollowCarCountry[] = [
  { code: "BW", name: "Botswana", continent: "Africa", images: ["61afd9f1"] },
  { code: "BG", name: "Bulgaria", continent: "Europe", images: ["8356be77"] },
  { code: "CA", name: "Canada", continent: "North America", images: ["4825b2d0"] },
  { code: "CC", name: "Cocos (Keeling) Islands", continent: "Oceania", images: ["6ba89dd3"] },
  { code: "CR", name: "Costa Rica", continent: "North America", images: ["905108eb", "01889a1c"] },
  { code: "DK", name: "Denmark", continent: "Europe", images: ["8ff2037e"] },
  {
    code: "IE",
    name: "Ireland",
    continent: "Europe",
    images: ["987fc9e3", "07a8a486", "35b4afdb"],
  },
  { code: "IL", name: "Israel", continent: "Asia", images: ["58dc9ffe", "af8853e9"] },
  { code: "IT", name: "Italy", continent: "Europe", images: ["eafd2fa3", "5f63d7c8"] },
  { code: "JP", name: "Japan", continent: "Asia", images: ["aea388d5"] },
  { code: "JO", name: "Jordan", continent: "Asia", images: ["7ee8b75e", "ce849531"] },
  {
    code: "KE",
    name: "Kenya",
    continent: "Africa",
    images: ["243bed95", "3fa4424f", "e2ef15ab", "d5612362", "7b8940ac", "b6957c08"],
  },
  { code: "MY", name: "Malaysia", continent: "Asia", images: ["7589cfb1"] },
  { code: "MN", name: "Mongolia", continent: "Asia", images: ["b96e273f"] },
  { code: "ME", name: "Montenegro", continent: "Europe", images: ["beddc36d"] },
  {
    code: "NG",
    name: "Nigeria",
    continent: "Africa",
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
  { code: "NO", name: "Norway", continent: "Europe", images: ["a96566ed"] },
  {
    code: "PS",
    name: "Palestine",
    continent: "Asia",
    images: ["8a39312e", "58b17da5", "b24697c0"],
  },
  { code: "PH", name: "Philippines", continent: "Asia", images: ["503282a6"] },
  { code: "RU", name: "Russia", continent: "Europe", images: ["6adca507"] },
  { code: "ZA", name: "South Africa", continent: "Africa", images: ["b9def49a"] },
  { code: "ES", name: "Spain", continent: "Europe", images: ["31c30585"] },
  {
    code: "TN",
    name: "Tunisia",
    continent: "Africa",
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
  { code: "GB", name: "United Kingdom", continent: "Europe", images: ["ea465adf", "744222f7"] },
  {
    code: "US",
    name: "United States",
    continent: "North America",
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
];

export const continents = [...new Set(followCarCountries.map((c) => c.continent))].sort();

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
