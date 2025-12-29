import {
  findCountriesForCharacter,
  getAllMappedCharacters,
  getCountryName,
} from "./character-map";
import type { CountryCode } from "./types";

export interface AnalysisResult {
  countryCode: CountryCode;
  countryName: string;
  confidence: number;
  matchedCharacters: string[];
}

export interface AnalysisOutput {
  results: AnalysisResult[];
  characters: string[];
}

const ASCII_BASIC = /^[\x00-\x7F]$/;
const mappedCharSet = new Set(getAllMappedCharacters());

export function extractUniqueCharacters(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const char of text) {
    if (ASCII_BASIC.test(char)) continue;
    if (seen.has(char)) continue;
    if (!mappedCharSet.has(char)) continue;

    seen.add(char);
    result.push(char);
  }

  return result;
}

function calculateConfidence(matchedChars: string[]): number {
  let score = 0;

  for (const char of matchedChars) {
    const countriesUsingChar = findCountriesForCharacter(char).length;

    if (countriesUsingChar === 1) {
      score += 50;
    } else if (countriesUsingChar <= 3) {
      score += 30;
    } else if (countriesUsingChar <= 6) {
      score += 15;
    } else {
      score += 5;
    }
  }

  return Math.min(100, score);
}

export function analyzeText(
  text: string,
  _mode: "simple" | "advanced" = "simple",
): AnalysisOutput {
  const uniqueChars = extractUniqueCharacters(text);

  if (uniqueChars.length === 0) {
    return { results: [], characters: [] };
  }

  const countryMatches = new Map<CountryCode, Set<string>>();

  for (const char of uniqueChars) {
    const countries = findCountriesForCharacter(char);
    for (const country of countries) {
      if (!countryMatches.has(country)) {
        countryMatches.set(country, new Set());
      }
      countryMatches.get(country)!.add(char);
    }
  }

  const results: AnalysisResult[] = [];

  for (const [code, chars] of countryMatches) {
    const matchedChars = Array.from(chars);
    const confidence = calculateConfidence(matchedChars);

    results.push({
      countryCode: code,
      countryName: getCountryName(code),
      confidence,
      matchedCharacters: matchedChars,
    });
  }

  results.sort((a, b) => b.confidence - a.confidence);

  return { results, characters: uniqueChars };
}
