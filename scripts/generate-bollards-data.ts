/**
 * Generate bollards data file from manifest for use in the Qwik app
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

interface ManifestEntry {
  source: string;
  originalUrl: string;
  scrapedAt: string;
  hash?: string;
  processed?: boolean;
  uploaded?: boolean;
}

interface Manifest {
  version: number;
  updatedAt: string;
  entries: Record<string, ManifestEntry>;
}

// Country code to name mapping
const COUNTRY_NAMES: Record<string, string> = {
  ad: 'Andorra',
  ae: 'United Arab Emirates',
  al: 'Albania',
  ar: 'Argentina',
  at: 'Austria',
  au: 'Australia',
  bd: 'Bangladesh',
  be: 'Belgium',
  bg: 'Bulgaria',
  bm: 'Bermuda',
  bo: 'Bolivia',
  br: 'Brazil',
  bw: 'Botswana',
  ca: 'Canada',
  ch: 'Switzerland',
  cl: 'Chile',
  co: 'Colombia',
  cx: 'Christmas Island',
  cz: 'Czechia',
  de: 'Germany',
  dk: 'Denmark',
  do: 'Dominican Republic',
  ec: 'Ecuador',
  ee: 'Estonia',
  es: 'Spain',
  fi: 'Finland',
  fo: 'Faroe Islands',
  fr: 'France',
  gb: 'United Kingdom',
  gh: 'Ghana',
  gl: 'Greenland',
  gr: 'Greece',
  gt: 'Guatemala',
  gu: 'Guam',
  hr: 'Croatia',
  hu: 'Hungary',
  id: 'Indonesia',
  ie: 'Ireland',
  il: 'Israel',
  im: 'Isle of Man',
  in: 'India',
  is: 'Iceland',
  it: 'Italy',
  je: 'Jersey',
  jp: 'Japan',
  ke: 'Kenya',
  kg: 'Kyrgyzstan',
  kh: 'Cambodia',
  kr: 'South Korea',
  la: 'Laos',
  lk: 'Sri Lanka',
  ls: 'Lesotho',
  lt: 'Lithuania',
  lu: 'Luxembourg',
  lv: 'Latvia',
  mc: 'Monaco',
  me: 'Montenegro',
  mk: 'North Macedonia',
  mn: 'Mongolia',
  mt: 'Malta',
  mx: 'Mexico',
  my: 'Malaysia',
  nl: 'Netherlands',
  no: 'Norway',
  nz: 'New Zealand',
  pe: 'Peru',
  ph: 'Philippines',
  pl: 'Poland',
  pr: 'Puerto Rico',
  pt: 'Portugal',
  ro: 'Romania',
  rs: 'Serbia',
  ru: 'Russia',
  se: 'Sweden',
  sg: 'Singapore',
  si: 'Slovenia',
  sk: 'Slovakia',
  sm: 'San Marino',
  sn: 'Senegal',
  sz: 'Eswatini',
  th: 'Thailand',
  tn: 'Tunisia',
  tr: 'Turkey',
  tw: 'Taiwan',
  ua: 'Ukraine',
  us: 'United States',
  uy: 'Uruguay',
  vn: 'Vietnam',
  za: 'South Africa',
};

// Continent mapping
const CONTINENTS: Record<string, string> = {
  ad: 'Europe', ae: 'Asia', al: 'Europe', ar: 'South America', at: 'Europe',
  au: 'Oceania', bd: 'Asia', be: 'Europe', bg: 'Europe', bm: 'North America',
  bo: 'South America', br: 'South America', bw: 'Africa', ca: 'North America',
  ch: 'Europe', cl: 'South America', co: 'South America', cx: 'Oceania',
  cz: 'Europe', de: 'Europe', dk: 'Europe', do: 'North America',
  ec: 'South America', ee: 'Europe', es: 'Europe', fi: 'Europe', fo: 'Europe',
  fr: 'Europe', gb: 'Europe', gh: 'Africa', gl: 'North America', gr: 'Europe',
  gt: 'North America', gu: 'Oceania', hr: 'Europe', hu: 'Europe', id: 'Asia',
  ie: 'Europe', il: 'Asia', im: 'Europe', in: 'Asia', is: 'Europe', it: 'Europe',
  je: 'Europe', jp: 'Asia', ke: 'Africa', kg: 'Asia', kh: 'Asia', kr: 'Asia',
  la: 'Asia', lk: 'Asia', ls: 'Africa', lt: 'Europe', lu: 'Europe', lv: 'Europe',
  mc: 'Europe', me: 'Europe', mk: 'Europe', mn: 'Asia', mt: 'Europe',
  mx: 'North America', my: 'Asia', nl: 'Europe', no: 'Europe', nz: 'Oceania',
  pe: 'South America', ph: 'Asia', pl: 'Europe', pr: 'North America',
  pt: 'Europe', ro: 'Europe', rs: 'Europe', ru: 'Europe', se: 'Europe',
  sg: 'Asia', si: 'Europe', sk: 'Europe', sm: 'Europe', sn: 'Africa',
  sz: 'Africa', th: 'Asia', tn: 'Africa', tr: 'Asia', tw: 'Asia', ua: 'Europe',
  us: 'North America', uy: 'South America', vn: 'Asia', za: 'Africa',
};

async function generate() {
  // Read manifest
  const manifestPath = path.join(ROOT_DIR, 'scraped-images', 'manifest.json');
  const manifestData = await fs.readFile(manifestPath, 'utf-8');
  const manifest: Manifest = JSON.parse(manifestData);

  // Group by country
  const countryImages: Record<string, number[]> = {};

  for (const key of Object.keys(manifest.entries)) {
    if (!key.startsWith('bollards/')) continue;

    // Parse key: bollards/us/us-001
    const parts = key.split('/');
    const countryCode = parts[1];
    const filename = parts[2];
    const seqMatch = filename.match(/-(\d+)$/);
    if (!seqMatch) continue;

    const seq = parseInt(seqMatch[1], 10);

    if (!countryImages[countryCode]) {
      countryImages[countryCode] = [];
    }
    countryImages[countryCode].push(seq);
  }

  // Sort sequences and build data
  const countries = Object.entries(countryImages)
    .map(([code, sequences]) => ({
      code: code.toUpperCase(),
      name: COUNTRY_NAMES[code] || code.toUpperCase(),
      continent: CONTINENTS[code] || 'Unknown',
      images: sequences.sort((a, b) => a - b),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Generate TypeScript file
  const output = `/**
 * Bollard data generated from scraped images
 * Generated: ${new Date().toISOString()}
 * Total: ${countries.length} countries, ${Object.values(countryImages).flat().length} images
 */

export const R2_BASE_URL = 'https://pub-3d7bacd76def438caae68643612e60f9.r2.dev';

export interface BollardCountry {
  /** ISO 3166-1 alpha-2 country code (uppercase) */
  code: string;
  /** Country name */
  name: string;
  /** Continent */
  continent: string;
  /** Image sequence numbers */
  images: number[];
}

export const bollardCountries: BollardCountry[] = ${JSON.stringify(countries, null, 2)};

export const continents = [...new Set(bollardCountries.map(c => c.continent))].sort();

/**
 * Get R2 URL for a bollard image
 */
export function getBollardImageUrl(
  countryCode: string,
  sequence: number,
  size: 400 | 800 | 1200 = 800
): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, '0');
  return \`\${R2_BASE_URL}/bollards/\${cc}/\${cc}-\${seq}-\${size}w.webp\`;
}

/**
 * Get srcset for a bollard image
 */
export function getBollardSrcset(countryCode: string, sequence: number): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, '0');
  const base = \`\${R2_BASE_URL}/bollards/\${cc}/\${cc}-\${seq}\`;
  return \`\${base}-400w.webp 400w, \${base}-800w.webp 800w, \${base}-1200w.webp 1200w\`;
}
`;

  // Write to src/data/bollards.ts
  const outputPath = path.join(ROOT_DIR, 'src', 'data', 'bollards.ts');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output);

  console.log(`Generated ${outputPath}`);
  console.log(`  Countries: ${countries.length}`);
  console.log(`  Total images: ${Object.values(countryImages).flat().length}`);
}

generate().catch(console.error);
