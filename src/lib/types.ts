export type CountryCode = string;

export type CharacterEntries = Record<string, CountryCode[]>;

export interface CharacterEntry {
  chars: string;
  countries: CountryCode[];
}

export interface LanguageRegion {
  name: string;
  href: string;
  description?: string;
}
