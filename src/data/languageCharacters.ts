// Define types for our language character data structure
export interface CharacterGroup {
  id: string; // Unique identifier
  name: string; // Display name
  characters: LanguageCharacter[];
}

export interface LanguageCharacter {
  id: string; // Unique identifier
  char: string; // The actual character(s)
  countries: string[]; // Country codes where this character is used
  description?: string; // Optional description
}

// European character groups
export const europeanCharGroups: CharacterGroup[] = [
  {
    id: "european-latin",
    name: "Latin Alphabet Characters",
    characters: [
      {
        id: "aa-umlaut",
        char: "Ää",
        countries: ["ee", "fi", "se", "sk"],
        description: "A with umlaut",
      },
      {
        id: "aa-ring",
        char: "Åå",
        countries: ["dk", "fi", "no", "se"],
        description: "A with ring",
      },
      {
        id: "aa-macron",
        char: "Āā",
        countries: ["lv"],
        description: "A with macron",
      },
      {
        id: "oo-umlaut",
        char: "Öö",
        countries: ["ee", "fi", "is", "se", "hu", "tr"],
        description: "O with umlaut",
      },
      {
        id: "oo-stroke",
        char: "Øø",
        countries: ["dk", "no"],
        description: "O with stroke",
      },
      {
        id: "ae-ligature",
        char: "Ææ",
        countries: ["dk", "is", "no"],
        description: "AE ligature",
      },
      {
        id: "cc-caron",
        char: "Čč",
        countries: ["lv", "lt", "cz", "hr", "sk", "si"],
        description: "C with caron",
      },
      {
        id: "ss-caron",
        char: "Šš",
        countries: ["ee", "lv", "lt", "cz", "hr", "me", "rs", "sk", "si"],
        description: "S with caron",
      },
      {
        id: "zz-caron",
        char: "Žž",
        countries: ["ee", "lv", "lt", "cz", "hr", "me", "rs", "sk", "si"],
        description: "Z with caron",
      },
      {
        id: "thorn",
        char: "Þþ",
        countries: ["is"],
        description: "Thorn (th sound)",
      },
      {
        id: "eth",
        char: "Ðð",
        countries: ["is"],
        description: "Eth (voiced th sound)",
      },
    ],
  },
  {
    id: "european-cyrillic",
    name: "Cyrillic Characters",
    characters: [
      {
        id: "cyrillic-be",
        char: "Бб",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Be",
      },
      {
        id: "cyrillic-ge",
        char: "Гг",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Ge",
      },
      {
        id: "cyrillic-de",
        char: "Дд",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter De",
      },
      {
        id: "cyrillic-zhe",
        char: "Жж",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Zhe",
      },
      {
        id: "cyrillic-ze",
        char: "Зз",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Ze",
      },
      {
        id: "cyrillic-i",
        char: "Ии",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter I",
      },
      {
        id: "cyrillic-tse",
        char: "Цц",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Tse",
      },
      {
        id: "cyrillic-che",
        char: "Чч",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Che",
      },
      {
        id: "cyrillic-sha",
        char: "Шш",
        countries: ["bg", "me", "mk", "ru", "rs", "ua"],
        description: "Cyrillic letter Sha",
      },
      {
        id: "cyrillic-shcha",
        char: "Щщ",
        countries: ["bg", "ru", "ua"],
        description: "Cyrillic letter Shcha",
      },
      {
        id: "cyrillic-yu",
        char: "Юю",
        countries: ["bg", "ru", "ua"],
        description: "Cyrillic letter Yu",
      },
      {
        id: "cyrillic-ya",
        char: "Яя",
        countries: ["bg", "ru", "ua"],
        description: "Cyrillic letter Ya",
      },
    ],
  },
  {
    id: "european-baltic",
    name: "Baltic Special Characters",
    characters: [
      {
        id: "baltic-a-macron",
        char: "Āā",
        countries: ["lv"],
        description: "A with macron (Latvian)",
      },
      {
        id: "baltic-c-caron",
        char: "Čč",
        countries: ["lv", "lt"],
        description: "C with caron (Latvian, Lithuanian)",
      },
      {
        id: "baltic-e-macron",
        char: "Ēē",
        countries: ["lv"],
        description: "E with macron (Latvian)",
      },
      {
        id: "baltic-g-cedilla",
        char: "Ģģ",
        countries: ["lv"],
        description: "G with cedilla (Latvian)",
      },
      {
        id: "baltic-i-macron",
        char: "Īī",
        countries: ["lv"],
        description: "I with macron (Latvian)",
      },
      {
        id: "baltic-k-cedilla",
        char: "Ķķ",
        countries: ["lv"],
        description: "K with cedilla (Latvian)",
      },
      {
        id: "baltic-l-cedilla",
        char: "Ļļ",
        countries: ["lv"],
        description: "L with cedilla (Latvian)",
      },
      {
        id: "baltic-n-cedilla",
        char: "Ņņ",
        countries: ["lv"],
        description: "N with cedilla (Latvian)",
      },
      {
        id: "baltic-s-caron",
        char: "Šš",
        countries: ["lv", "lt"],
        description: "S with caron (Latvian, Lithuanian)",
      },
      {
        id: "baltic-u-macron",
        char: "Ūū",
        countries: ["lv", "lt"],
        description: "U with macron (Latvian, Lithuanian)",
      },
      {
        id: "baltic-z-caron",
        char: "Žž",
        countries: ["lv", "lt"],
        description: "Z with caron (Latvian, Lithuanian)",
      },
      {
        id: "baltic-a-ogonek",
        char: "Ąą",
        countries: ["lt"],
        description: "A with ogonek (Lithuanian)",
      },
      {
        id: "baltic-e-dot",
        char: "Ėė",
        countries: ["lt"],
        description: "E with dot above (Lithuanian)",
      },
      {
        id: "baltic-e-ogonek",
        char: "Ęę",
        countries: ["lt"],
        description: "E with ogonek (Lithuanian)",
      },
      {
        id: "baltic-i-ogonek",
        char: "Įį",
        countries: ["lt"],
        description: "I with ogonek (Lithuanian)",
      },
      {
        id: "baltic-u-ogonek",
        char: "Ųų",
        countries: ["lt"],
        description: "U with ogonek (Lithuanian)",
      },
    ],
  },
  {
    id: "european-nordic",
    name: "Nordic Special Characters",
    characters: [
      {
        id: "nordic-a-ring",
        char: "Åå",
        countries: ["dk", "fi", "no", "se"],
        description: "A with ring (Danish, Finnish, Norwegian, Swedish)",
      },
      {
        id: "nordic-ae",
        char: "Ææ",
        countries: ["dk", "is", "no"],
        description: "AE ligature (Danish, Icelandic, Norwegian)",
      },
      {
        id: "nordic-o-stroke",
        char: "Øø",
        countries: ["dk", "no"],
        description: "O with stroke (Danish, Norwegian)",
      },
      {
        id: "nordic-o-umlaut",
        char: "Öö",
        countries: ["fi", "is", "se"],
        description: "O with umlaut (Finnish, Icelandic, Swedish)",
      },
      {
        id: "nordic-a-umlaut",
        char: "Ää",
        countries: ["fi", "se"],
        description: "A with umlaut (Finnish, Swedish)",
      },
      {
        id: "icelandic-eth",
        char: "Ðð",
        countries: ["is"],
        description: "Eth (Icelandic)",
      },
      {
        id: "icelandic-thorn",
        char: "Þþ",
        countries: ["is"],
        description: "Thorn (Icelandic)",
      },
    ],
  },
];

// Helper function to get country name from code
export function getCountryName(code: string): string {
  return (
    new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ||
    code
  );
}

// Helper function to get flag emoji from country code
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Helper function to search across all character groups
export function searchCharacters(query: string): LanguageCharacter[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  const results: LanguageCharacter[] = [];

  europeanCharGroups.forEach((group) => {
    group.characters.forEach((character) => {
      // Search in character itself
      if (character.char.toLowerCase().includes(searchTerm)) {
        results.push(character);
        return;
      }

      // Search in description
      if (character.description?.toLowerCase().includes(searchTerm)) {
        results.push(character);
        return;
      }

      // Search in country names
      for (const code of character.countries) {
        const countryName = getCountryName(code).toLowerCase();
        if (
          countryName.includes(searchTerm) ||
          code.toLowerCase().includes(searchTerm)
        ) {
          results.push(character);
          return; // Avoid duplicates
        }
      }
    });
  });

  return results;
}
