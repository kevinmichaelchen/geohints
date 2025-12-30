/**
 * Centralized country metadata
 * Single source of truth for country names, continents, and regional associations
 */

export interface CountryMeta {
  /** ISO 3166-1 alpha-2 country code (uppercase) */
  code: string;
  /** Country name */
  name: string;
  /** Primary continent (used for display grouping) */
  continent: string;
  /** Additional regions for filtering (e.g., "Central America", "Middle East") */
  regions?: string[];
}

/**
 * Country metadata indexed by ISO code
 * Add `regions` array for countries that should appear in multiple filter categories
 */
export const countryMeta: Record<string, CountryMeta> = {
  // Africa
  BW: { code: "BW", name: "Botswana", continent: "Africa" },
  SZ: { code: "SZ", name: "Eswatini", continent: "Africa" },
  GH: { code: "GH", name: "Ghana", continent: "Africa" },
  KE: { code: "KE", name: "Kenya", continent: "Africa" },
  LS: { code: "LS", name: "Lesotho", continent: "Africa" },
  NG: { code: "NG", name: "Nigeria", continent: "Africa" },
  SN: { code: "SN", name: "Senegal", continent: "Africa" },
  ZA: { code: "ZA", name: "South Africa", continent: "Africa" },
  TN: { code: "TN", name: "Tunisia", continent: "Africa" },

  // Asia
  BD: { code: "BD", name: "Bangladesh", continent: "Asia" },
  KH: { code: "KH", name: "Cambodia", continent: "Asia" },
  IN: { code: "IN", name: "India", continent: "Asia" },
  ID: { code: "ID", name: "Indonesia", continent: "Asia" },
  IL: { code: "IL", name: "Israel", continent: "Asia", regions: ["Middle East", "Europe"] },
  JP: { code: "JP", name: "Japan", continent: "Asia" },
  JO: { code: "JO", name: "Jordan", continent: "Asia", regions: ["Middle East"] },
  KG: { code: "KG", name: "Kyrgyzstan", continent: "Asia" },
  LA: { code: "LA", name: "Laos", continent: "Asia" },
  MY: { code: "MY", name: "Malaysia", continent: "Asia" },
  MN: { code: "MN", name: "Mongolia", continent: "Asia" },
  PS: { code: "PS", name: "Palestine", continent: "Asia", regions: ["Middle East"] },
  PH: { code: "PH", name: "Philippines", continent: "Asia" },
  SG: { code: "SG", name: "Singapore", continent: "Asia" },
  KR: { code: "KR", name: "South Korea", continent: "Asia" },
  LK: { code: "LK", name: "Sri Lanka", continent: "Asia" },
  TW: { code: "TW", name: "Taiwan", continent: "Asia" },
  TH: { code: "TH", name: "Thailand", continent: "Asia" },
  TR: { code: "TR", name: "Turkey", continent: "Asia", regions: ["Europe", "Middle East"] },
  AE: { code: "AE", name: "United Arab Emirates", continent: "Asia", regions: ["Middle East"] },
  VN: { code: "VN", name: "Vietnam", continent: "Asia" },

  // Europe
  AL: { code: "AL", name: "Albania", continent: "Europe" },
  AD: { code: "AD", name: "Andorra", continent: "Europe" },
  AT: { code: "AT", name: "Austria", continent: "Europe" },
  BE: { code: "BE", name: "Belgium", continent: "Europe" },
  BG: { code: "BG", name: "Bulgaria", continent: "Europe" },
  HR: { code: "HR", name: "Croatia", continent: "Europe" },
  CZ: { code: "CZ", name: "Czechia", continent: "Europe" },
  DK: { code: "DK", name: "Denmark", continent: "Europe" },
  EE: { code: "EE", name: "Estonia", continent: "Europe" },
  FO: { code: "FO", name: "Faroe Islands", continent: "Europe" },
  FI: { code: "FI", name: "Finland", continent: "Europe" },
  FR: { code: "FR", name: "France", continent: "Europe" },
  DE: { code: "DE", name: "Germany", continent: "Europe" },
  GR: { code: "GR", name: "Greece", continent: "Europe" },
  HU: { code: "HU", name: "Hungary", continent: "Europe" },
  IS: { code: "IS", name: "Iceland", continent: "Europe" },
  IE: { code: "IE", name: "Ireland", continent: "Europe" },
  IM: { code: "IM", name: "Isle of Man", continent: "Europe" },
  IT: { code: "IT", name: "Italy", continent: "Europe" },
  JE: { code: "JE", name: "Jersey", continent: "Europe" },
  LV: { code: "LV", name: "Latvia", continent: "Europe" },
  LT: { code: "LT", name: "Lithuania", continent: "Europe" },
  LU: { code: "LU", name: "Luxembourg", continent: "Europe" },
  MT: { code: "MT", name: "Malta", continent: "Europe" },
  ME: { code: "ME", name: "Montenegro", continent: "Europe" },
  NL: { code: "NL", name: "Netherlands", continent: "Europe" },
  MK: { code: "MK", name: "North Macedonia", continent: "Europe" },
  NO: { code: "NO", name: "Norway", continent: "Europe" },
  PL: { code: "PL", name: "Poland", continent: "Europe" },
  PT: { code: "PT", name: "Portugal", continent: "Europe" },
  RO: { code: "RO", name: "Romania", continent: "Europe" },
  RU: { code: "RU", name: "Russia", continent: "Europe", regions: ["Asia"] },
  SM: { code: "SM", name: "San Marino", continent: "Europe" },
  RS: { code: "RS", name: "Serbia", continent: "Europe" },
  SK: { code: "SK", name: "Slovakia", continent: "Europe" },
  SI: { code: "SI", name: "Slovenia", continent: "Europe" },
  ES: { code: "ES", name: "Spain", continent: "Europe" },
  SE: { code: "SE", name: "Sweden", continent: "Europe" },
  CH: { code: "CH", name: "Switzerland", continent: "Europe" },
  UA: { code: "UA", name: "Ukraine", continent: "Europe" },
  GB: { code: "GB", name: "United Kingdom", continent: "Europe" },

  // North America
  BM: { code: "BM", name: "Bermuda", continent: "North America" },
  CA: { code: "CA", name: "Canada", continent: "North America" },
  CR: {
    code: "CR",
    name: "Costa Rica",
    continent: "North America",
    regions: ["Central America", "Latin America"],
  },
  DO: {
    code: "DO",
    name: "Dominican Republic",
    continent: "North America",
    regions: ["Caribbean", "Latin America"],
  },
  GL: { code: "GL", name: "Greenland", continent: "North America" },
  GT: {
    code: "GT",
    name: "Guatemala",
    continent: "North America",
    regions: ["Central America", "Latin America"],
  },
  MX: { code: "MX", name: "Mexico", continent: "North America", regions: ["Latin America"] },
  PR: {
    code: "PR",
    name: "Puerto Rico",
    continent: "North America",
    regions: ["Caribbean", "Latin America"],
  },
  US: { code: "US", name: "United States", continent: "North America" },

  // Oceania
  AU: { code: "AU", name: "Australia", continent: "Oceania" },
  CX: { code: "CX", name: "Christmas Island", continent: "Oceania" },
  CC: { code: "CC", name: "Cocos (Keeling) Islands", continent: "Oceania" },
  GU: { code: "GU", name: "Guam", continent: "Oceania" },
  NZ: { code: "NZ", name: "New Zealand", continent: "Oceania" },

  // South America
  AR: { code: "AR", name: "Argentina", continent: "South America", regions: ["Latin America"] },
  BO: { code: "BO", name: "Bolivia", continent: "South America", regions: ["Latin America"] },
  BR: { code: "BR", name: "Brazil", continent: "South America", regions: ["Latin America"] },
  CL: { code: "CL", name: "Chile", continent: "South America", regions: ["Latin America"] },
  CO: { code: "CO", name: "Colombia", continent: "South America", regions: ["Latin America"] },
  EC: { code: "EC", name: "Ecuador", continent: "South America", regions: ["Latin America"] },
  PE: { code: "PE", name: "Peru", continent: "South America", regions: ["Latin America"] },
  UY: { code: "UY", name: "Uruguay", continent: "South America", regions: ["Latin America"] },
};

/**
 * Get country metadata by code
 */
export function getCountryMeta(code: string): CountryMeta | undefined {
  return countryMeta[code.toUpperCase()];
}

/**
 * Get all unique continents from the metadata
 */
export function getContinents(): string[] {
  return [...new Set(Object.values(countryMeta).map((c) => c.continent))].sort();
}

/**
 * Get all unique regions (continents + additional regions) from the metadata
 */
export function getAllRegions(): string[] {
  const regions = new Set<string>();
  for (const country of Object.values(countryMeta)) {
    regions.add(country.continent);
    if (country.regions) {
      for (const region of country.regions) {
        regions.add(region);
      }
    }
  }
  return [...regions].sort();
}

/**
 * Check if a country matches a region filter
 * Matches if: region is null (show all), matches primary continent, or matches any additional region
 */
export function matchesRegion(country: CountryMeta, region: string | null): boolean {
  if (!region) return true;
  if (country.continent === region) return true;
  return country.regions?.includes(region) ?? false;
}

/**
 * Enrich feature-specific data with country metadata
 * @param featureData - Record of country codes to feature-specific data
 * @returns Array of countries with full metadata merged with feature data
 */
export function enrichWithMeta<T extends object>(
  featureData: Record<string, T>,
): (CountryMeta & T)[] {
  return Object.entries(featureData)
    .map(([code, data]) => {
      const meta = countryMeta[code];
      if (!meta) {
        console.warn(`Unknown country code: ${code}`);
        return null;
      }
      return { ...meta, ...data };
    })
    .filter((item): item is CountryMeta & T => item !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}
