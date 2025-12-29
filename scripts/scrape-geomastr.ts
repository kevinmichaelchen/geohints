/**
 * Scraper for geomastr.com
 *
 * Image URL patterns:
 * - Bollards: /assets/media/bollards/{country}.jpg
 * - License plates: /assets/media/license-plates/{country}.jpg
 * - etc.
 */

import * as cheerio from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';
import { addImage } from './process-images.js';
import type { Category } from './types.js';

const BASE_URL = 'https://geomastr.com';

// Map geomastr category paths to our categories
const CATEGORY_MAP: Record<string, Category> = {
  bollards: 'bollards',
  'license-plates': 'license-plates',
  'road-lines': 'road-lines',
  'street-signs': 'street-signs',
  'fuel-stations': 'fuel-stations',
  flags: 'flags',
  domains: 'domains',
};

// Country name to ISO code mapping (comprehensive)
const COUNTRY_CODES: Record<string, string> = {
  // A
  albania: 'al',
  'american-samoa': 'as',
  americansamoa: 'as',
  andorra: 'ad',
  argentina: 'ar',
  australia: 'au',
  austria: 'at',
  // B
  bangladesh: 'bd',
  belgium: 'be',
  bermuda: 'bm',
  bhutan: 'bt',
  bolivia: 'bo',
  botswana: 'bw',
  brazil: 'br',
  bulgaria: 'bg',
  // C
  cambodia: 'kh',
  canada: 'ca',
  chile: 'cl',
  china: 'cn',
  'christmas-island': 'cx',
  christmasisland: 'cx',
  colombia: 'co',
  croatia: 'hr',
  curacao: 'cw',
  'czech-republic': 'cz',
  czechrepublic: 'cz',
  czechia: 'cz',
  // D
  denmark: 'dk',
  'dominican-republic': 'do',
  dominicanrepublic: 'do',
  // E
  ecuador: 'ec',
  eswatini: 'sz',
  estonia: 'ee',
  // F
  'faroe-islands': 'fo',
  faroeislands: 'fo',
  finland: 'fi',
  france: 'fr',
  // G
  germany: 'de',
  ghana: 'gh',
  gibraltar: 'gi',
  greece: 'gr',
  greenland: 'gl',
  guam: 'gu',
  guatemala: 'gt',
  // H
  hungary: 'hu',
  // I
  iceland: 'is',
  india: 'in',
  indonesia: 'id',
  ireland: 'ie',
  'isle-of-man': 'im',
  isleofman: 'im',
  israel: 'il',
  italy: 'it',
  // J
  japan: 'jp',
  jersey: 'je',
  jordan: 'jo',
  // K
  kenya: 'ke',
  korea: 'kr',
  kyrgyzstan: 'kg',
  // L
  laos: 'la',
  latvia: 'lv',
  lesotho: 'ls',
  lithuania: 'lt',
  luxembourg: 'lu',
  // M
  madagascar: 'mg',
  malaysia: 'my',
  malta: 'mt',
  mexico: 'mx',
  monaco: 'mc',
  mongolia: 'mn',
  montenegro: 'me',
  // N
  netherlands: 'nl',
  'new-zealand': 'nz',
  newzealand: 'nz',
  nigeria: 'ng',
  'north-macedonia': 'mk',
  northmacedonia: 'mk',
  'northern-mariana-islands': 'mp',
  northernmarianaislands: 'mp',
  norway: 'no',
  // P
  peru: 'pe',
  philippines: 'ph',
  poland: 'pl',
  portugal: 'pt',
  'puerto-rico': 'pr',
  puertorico: 'pr',
  // Q
  qatar: 'qa',
  // R
  romania: 'ro',
  russia: 'ru',
  rwanda: 'rw',
  // S
  'san-marino': 'sm',
  sanmarino: 'sm',
  senegal: 'sn',
  serbia: 'rs',
  singapore: 'sg',
  slovakia: 'sk',
  slovenia: 'si',
  'south-africa': 'za',
  southafrica: 'za',
  'south-korea': 'kr',
  southkorea: 'kr',
  spain: 'es',
  'sri-lanka': 'lk',
  srilanka: 'lk',
  sweden: 'se',
  switzerland: 'ch',
  taiwan: 'tw',
  thailand: 'th',
  turkey: 'tr',
  // T
  tanzania: 'tz',
  tunisia: 'tn',
  // U
  uganda: 'ug',
  ukraine: 'ua',
  'united-arab-emirates': 'ae',
  unitedarabemirates: 'ae',
  uae: 'ae',
  'united-kingdom': 'gb',
  unitedkingdom: 'gb',
  uk: 'gb',
  'united-states': 'us',
  unitedstates: 'us',
  usa: 'us',
  uruguay: 'uy',
  'us-virgin-islands': 'vi',
  usvirginislands: 'vi',
  // V
  vietnam: 'vn',
};

/**
 * Normalize country name to slug
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get ISO country code from name
 */
function getCountryCode(name: string): string | null {
  const slug = toSlug(name);
  return COUNTRY_CODES[slug] || null;
}

/**
 * Fetch HTML from URL with delay
 */
async function fetchPage(url: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, config.requestDelay));

  const response = await fetch(url, {
    headers: {
      'User-Agent': config.userAgent,
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.text();
}

/**
 * Download image to temp file
 */
async function downloadImage(url: string, tempPath: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, config.requestDelay));

  const response = await fetch(url, {
    headers: {
      'User-Agent': config.userAgent,
      Accept: 'image/*',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  const buffer = await response.arrayBuffer();
  await fs.mkdir(path.dirname(tempPath), { recursive: true });
  await fs.writeFile(tempPath, Buffer.from(buffer));
}

/**
 * Scrape a category page from geomastr
 *
 * Strategy: Find all images matching /assets/media/{category}/*.jpg pattern
 * and extract country from filename
 */
async function scrapeCategory(geomastrCategory: string): Promise<void> {
  const category = CATEGORY_MAP[geomastrCategory];
  if (!category) {
    console.error(`Unknown category: ${geomastrCategory}`);
    return;
  }

  console.log(`\n=== Scraping ${category} from geomastr.com ===\n`);

  const url = `${BASE_URL}/${geomastrCategory}/`;
  console.log(`Fetching: ${url}`);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Find all images - geomastr uses /assets/media/{category}/{country}.jpg pattern
  const imagePattern = `/assets/media/${geomastrCategory}/`;
  const images = $(`img[src*="${imagePattern}"], img[data-src*="${imagePattern}"]`);

  console.log(`Found ${images.length} images matching pattern`);

  const seenUrls = new Set<string>();

  for (const img of images.toArray()) {
    const $img = $(img);
    const src = $img.attr('src') || $img.attr('data-src');
    if (!src || seenUrls.has(src)) continue;
    seenUrls.add(src);

    // Extract country from filename: /assets/media/bollards/germany.jpg -> germany
    // Also handles variants like germany2.jpg, australia3.jpg
    const match = src.match(/\/assets\/media\/[^/]+\/([a-z-]+?)(\d*)\.(?:jpg|png|webp)/i);
    if (!match) {
      console.log(`  Could not parse: ${src}`);
      continue;
    }

    const countrySlug = match[1].toLowerCase();
    const countryCode = getCountryCode(countrySlug);

    if (!countryCode) {
      console.log(`  Unknown country: ${countrySlug}`);
      continue;
    }

    const imageUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
    const tempPath = path.join(config.scrapedDir, 'temp', `${countrySlug}-${Date.now()}.jpg`);

    try {
      console.log(`Downloading: ${countrySlug} (${countryCode})`);
      await downloadImage(imageUrl, tempPath);
      await addImage(tempPath, category, countryCode, 'geomastr', imageUrl);
      await fs.unlink(tempPath);
    } catch (err) {
      console.error(`  Failed: ${err}`);
    }
  }
}

/**
 * Scrape all categories
 */
async function scrapeAll(): Promise<void> {
  for (const category of Object.keys(CATEGORY_MAP)) {
    try {
      await scrapeCategory(category);
    } catch (err) {
      console.error(`Failed to scrape ${category}:`, err);
    }
  }
}

// CLI
const command = process.argv[2];

if (command === 'all') {
  scrapeAll();
} else if (command && CATEGORY_MAP[command]) {
  scrapeCategory(command);
} else {
  console.log('Usage: tsx scrape-geomastr.ts <command>');
  console.log('Commands:');
  console.log('  all                - Scrape all categories');
  console.log('  bollards           - Scrape bollards only');
  console.log('  license-plates     - Scrape license plates only');
  console.log('  road-lines         - Scrape road lines only');
  console.log('  street-signs       - Scrape street signs only');
  console.log('  fuel-stations      - Scrape fuel stations only');
  console.log('  flags              - Scrape flags only');
}
