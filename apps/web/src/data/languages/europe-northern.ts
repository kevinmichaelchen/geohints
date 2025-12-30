import type { CharacterEntries } from "~/lib/types";

// Source: https://geomastr.com/alphabets/europe/
// Countries: dk (Denmark), ee (Estonia), fi (Finland), is (Iceland),
//            lt (Lithuania), lv (Latvia), no (Norway), se (Sweden)
export const europeNorthernChars: CharacterEntries = {
  // Scandinavian (Danish, Norwegian, Swedish, Finnish)
  Åå: ["dk", "fi", "no", "se"],
  Ææ: ["dk", "is", "no"],
  Øø: ["dk", "no"],
  Ää: ["ee", "fi", "se"],
  Öö: ["ee", "fi", "is", "se"],

  // Icelandic unique
  Áá: ["is"],
  Ðð: ["is"],
  Éé: ["is"],
  Íí: ["is"],
  Óó: ["is"],
  Úú: ["is"],
  Ýý: ["is"],
  Þþ: ["is"],

  // Estonian unique
  Õõ: ["ee"],
  Üü: ["ee"],
  Šš: ["ee", "lv", "lt"],
  Žž: ["ee", "lv", "lt"],

  // Latvian unique (macrons and cedillas)
  Āā: ["lv"],
  Čč: ["lv", "lt"],
  Ēē: ["lv"],
  Ģģ: ["lv"],
  Īī: ["lv"],
  Ķķ: ["lv"],
  Ļļ: ["lv"],
  Ņņ: ["lv"],
  Ūū: ["lv", "lt"],

  // Lithuanian unique (ogoneks and overdots)
  Ąą: ["lt"],
  Ėė: ["lt"],
  Ęę: ["lt"],
  Įį: ["lt"],
  Ųų: ["lt"],
};
