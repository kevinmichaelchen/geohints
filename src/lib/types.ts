export type CountryCode = string;

export type CharacterEntries = Record<string, CountryCode[]>;

export interface LanguageRegion {
  name: string;
  href: string;
  description?: string;
}
