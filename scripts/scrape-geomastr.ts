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

// Country name to ISO code mapping (common ones)
const COUNTRY_CODES: Record<string, string> = {
  albania: 'al',
  argentina: 'ar',
  australia: 'au',
  austria: 'at',
  belgium: 'be',
  brazil: 'br',
  bulgaria: 'bg',
  canada: 'ca',
  chile: 'cl',
  china: 'cn',
  colombia: 'co',
  croatia: 'hr',
  'czech-republic': 'cz',
  czechia: 'cz',
  denmark: 'dk',
  ecuador: 'ec',
  estonia: 'ee',
  finland: 'fi',
  france: 'fr',
  germany: 'de',
  greece: 'gr',
  hungary: 'hu',
  india: 'in',
  indonesia: 'id',
  ireland: 'ie',
  israel: 'il',
  italy: 'it',
  japan: 'jp',
  'south-korea': 'kr',
  korea: 'kr',
  latvia: 'lv',
  lithuania: 'lt',
  malaysia: 'my',
  mexico: 'mx',
  netherlands: 'nl',
  'new-zealand': 'nz',
  norway: 'no',
  peru: 'pe',
  philippines: 'ph',
  poland: 'pl',
  portugal: 'pt',
  romania: 'ro',
  russia: 'ru',
  singapore: 'sg',
  slovakia: 'sk',
  slovenia: 'si',
  'south-africa': 'za',
  spain: 'es',
  sweden: 'se',
  switzerland: 'ch',
  taiwan: 'tw',
  thailand: 'th',
  turkey: 'tr',
  ukraine: 'ua',
  'united-kingdom': 'gb',
  uk: 'gb',
  'united-states': 'us',
  usa: 'us',
  uruguay: 'uy',
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
 */
async function scrapeCategory(geomastrCategory: string): Promise<void> {
  const category = CATEGORY_MAP[geomastrCategory];
  if (!category) {
    console.error(`Unknown category: ${geomastrCategory}`);
    return;
  }

  console.log(`\n=== Scraping ${category} from geomastr.com ===\n`);

  const url = `${BASE_URL}/${geomastrCategory}/`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Find all country sections
  const countryLinks = $('a[href^="/country/"]');
  const seenCountries = new Set<string>();

  for (const link of countryLinks.toArray()) {
    const $link = $(link);
    const countryHref = $link.attr('href');
    if (!countryHref) continue;

    // Extract country name from href
    const countrySlug = countryHref.replace('/country/', '').replace('/', '');
    if (seenCountries.has(countrySlug)) continue;
    seenCountries.add(countrySlug);

    const countryCode = getCountryCode(countrySlug);
    if (!countryCode) {
      console.log(`  Unknown country: ${countrySlug}`);
      continue;
    }

    // Find images near this link (within same parent section)
    const $parent = $link.closest('div, section, article');
    const images = $parent.find(`img[src*="${geomastrCategory}"]`);

    for (const img of images.toArray()) {
      const $img = $(img);
      const src = $img.attr('src');
      if (!src) continue;

      const imageUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
      const tempPath = path.join(config.scrapedDir, 'temp', `${countrySlug}-${Date.now()}.jpg`);

      try {
        console.log(`Downloading: ${countrySlug} - ${path.basename(src)}`);
        await downloadImage(imageUrl, tempPath);
        await addImage(tempPath, category, countryCode, 'geomastr', imageUrl);
        await fs.unlink(tempPath); // Clean up temp file
      } catch (err) {
        console.error(`  Failed: ${err}`);
      }
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
