import type { CharacterEntries, CharacterEntry } from "./types";
import { getCountryName } from "./utils";

export function entriesToArray(entries: CharacterEntries): CharacterEntry[] {
  return Object.entries(entries).map(([chars, countries]) => ({
    chars,
    countries,
  }));
}

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;

export function isCyrillic(str: string): boolean {
  return CYRILLIC_REGEX.test(str);
}

export function filterCharacters(
  characters: CharacterEntry[],
  query: string,
  scriptFilter: "all" | "latin" | "cyrillic",
): CharacterEntry[] {
  const normalizedQuery = query.toLowerCase().trim();

  return characters.filter((entry) => {
    if (scriptFilter === "latin" && isCyrillic(entry.chars)) return false;
    if (scriptFilter === "cyrillic" && !isCyrillic(entry.chars)) return false;

    if (!normalizedQuery) return true;

    if (entry.chars.toLowerCase().includes(normalizedQuery)) return true;

    if (entry.countries.some((code) => code.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    if (entry.countries.some((code) => getCountryName(code).toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    return false;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, '<mark class="bg-qwik-light-blue/30 text-white">$1</mark>');
}
