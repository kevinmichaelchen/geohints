import {
  europeCentralEasternChars,
  europeNorthernChars,
} from "~/data/languages";
import type { CharacterEntries, CountryCode } from "./types";

const characterToCountriesMap = new Map<string, CountryCode[]>();

function processRegion(entries: CharacterEntries): void {
  for (const [charPair, countries] of Object.entries(entries)) {
    for (const char of charPair) {
      const existing = characterToCountriesMap.get(char) || [];
      const newCountries = countries.filter((c) => !existing.includes(c));
      if (newCountries.length > 0) {
        characterToCountriesMap.set(char, [...existing, ...newCountries]);
      }
    }
  }
}

processRegion(europeNorthernChars);
processRegion(europeCentralEasternChars);

export function findCountriesForCharacter(char: string): CountryCode[] {
  return characterToCountriesMap.get(char) || [];
}

export function getAllMappedCharacters(): string[] {
  return Array.from(characterToCountriesMap.keys());
}

export function getCharacterRarity(char: string): number {
  const countries = findCountriesForCharacter(char);
  return countries.length;
}

export const COUNTRY_NAMES: Record<CountryCode, string> = {
  al: "Albania",
  bg: "Bulgaria",
  cz: "Czech Republic",
  dk: "Denmark",
  ee: "Estonia",
  fi: "Finland",
  hr: "Croatia",
  hu: "Hungary",
  is: "Iceland",
  lt: "Lithuania",
  lv: "Latvia",
  me: "Montenegro",
  mk: "North Macedonia",
  no: "Norway",
  pl: "Poland",
  ro: "Romania",
  rs: "Serbia",
  ru: "Russia",
  se: "Sweden",
  si: "Slovenia",
  sk: "Slovakia",
  tr: "Turkey",
  ua: "Ukraine",
};

export function getCountryName(code: CountryCode): string {
  return COUNTRY_NAMES[code] || code.toUpperCase();
}
