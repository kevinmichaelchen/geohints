/**
 * Scraper for geohints.com
 *
 * URL patterns:
 * - Bollards: /meta/bollards
 * - License Plates: /meta/licensePlates
 * - Lines: /meta/lines
 * - Follow Cars: /meta/followCars
 * - etc.
 */

import * as cheerio from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';
import { addImage } from './process-images.js';
import type { Category } from './types.js';

const BASE_URL = 'https://geohints.com';

// Map geohints paths to our categories
const CATEGORY_MAP: Record<string, Category> = {
  bollards: 'bollards',
  licensePlates: 'license-plates',
  lines: 'road-lines',
  followCars: 'follow-cars',
  utilityPoles: 'utility-poles',
  flags: 'flags',
  domains: 'domains',
};

// Country name to ISO code mapping
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
  czechia: 'cz',
  'czech republic': 'cz',
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
  'south korea': 'kr',
  korea: 'kr',
  latvia: 'lv',
  lithuania: 'lt',
  malaysia: 'my',
  mexico: 'mx',
  netherlands: 'nl',
  'new zealand': 'nz',
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
  'south africa': 'za',
  spain: 'es',
  sweden: 'se',
  switzerland: 'ch',
  taiwan: 'tw',
  thailand: 'th',
  turkey: 'tr',
  ukraine: 'ua',
  'united kingdom': 'gb',
  uk: 'gb',
  'united states': 'us',
  usa: 'us',
  uruguay: 'uy',
  vietnam: 'vn',
  kenya: 'ke',
  nigeria: 'ng',
  ghana: 'gh',
  senegal: 'sn',
  uganda: 'ug',
  bangladesh: 'bd',
  mongolia: 'mn',
  cambodia: 'th',
  laos: 'la',
  myanmar: 'mm',
  nepal: 'np',
  'sri lanka': 'lk',
  pakistan: 'pk',
};

/**
 * Normalize country name
 */
function normalizeCountry(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Get ISO country code from name
 */
function getCountryCode(name: string): string | null {
  const normalized = normalizeCountry(name);
  return COUNTRY_CODES[normalized] || null;
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
 * Scrape a category page from geohints
 */
async function scrapeCategory(geohintsCategory: string): Promise<void> {
  const category = CATEGORY_MAP[geohintsCategory];
  if (!category) {
    console.error(`Unknown category: ${geohintsCategory}`);
    return;
  }

  console.log(`\n=== Scraping ${category} from geohints.com ===\n`);

  const url = `${BASE_URL}/meta/${geohintsCategory}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // geohints uses different structures per category
  // Look for country sections with images
  const sections = $('[class*="country"], [data-country], article, section').toArray();

  for (const section of sections) {
    const $section = $(section);

    // Try to find country name
    const countryName =
      $section.attr('data-country') ||
      $section.find('h2, h3, h4, .country-name').first().text().trim();

    if (!countryName) continue;

    const countryCode = getCountryCode(countryName);
    if (!countryCode) {
      console.log(`  Unknown country: ${countryName}`);
      continue;
    }

    // Find all images in this section
    const images = $section.find('img').toArray();

    for (const img of images) {
      const $img = $(img);
      const src = $img.attr('src') || $img.attr('data-src');
      if (!src) continue;

      // Skip small icons, flags, etc.
      if (src.includes('flag') || src.includes('icon') || src.includes('avatar')) {
        continue;
      }

      const imageUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
      const ext = path.extname(imageUrl).split('?')[0] || '.jpg';
      const tempPath = path.join(
        config.scrapedDir,
        'temp',
        `geohints-${countryCode}-${Date.now()}${ext}`
      );

      try {
        console.log(`Downloading: ${countryName} - ${path.basename(src)}`);
        await downloadImage(imageUrl, tempPath);
        await addImage(tempPath, category, countryCode, 'geohints', imageUrl);
        await fs.unlink(tempPath);
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
  console.log('Usage: tsx scrape-geohints.ts <command>');
  console.log('Commands:');
  console.log('  all            - Scrape all categories');
  console.log('  bollards       - Scrape bollards only');
  console.log('  licensePlates  - Scrape license plates only');
  console.log('  lines          - Scrape road lines only');
  console.log('  followCars     - Scrape follow cars only');
  console.log('  utilityPoles   - Scrape utility poles only');
  console.log('  flags          - Scrape flags only');
}
