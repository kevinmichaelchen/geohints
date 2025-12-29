import type { CharacterEntries } from "~/lib/types";

// Source: https://geomastr.com/alphabets/europe/
// Latin: al, cz, hr, hu, pl, ro, sk, si, tr
// Cyrillic: bg, mk, ru, ua
// Both: me, rs
export const europeCentralEasternChars: CharacterEntries = {
  // Latin characters
  Ăă: ["ro"],
  Ââ: ["ro"],
  Áá: ["cz", "hu", "sk"],
  Ää: ["sk"],
  Ąą: ["pl"],
  Çç: ["al", "tr"],
  Ćć: ["hr", "me", "pl", "rs"],
  Čč: ["cz", "hr", "me", "rs", "sk", "si"],
  Ďď: ["cz", "sk"],
  Đđ: ["hr", "me", "rs"],
  Ëë: ["al"],
  Ěě: ["cz"],
  Éé: ["cz", "hu", "sk"],
  Ęę: ["pl"],
  Ğğ: ["tr"],
  Íí: ["cz", "hu", "sk"],
  Îî: ["ro"],
  İi: ["tr"],
  Ĺĺ: ["sk"],
  Ľľ: ["sk"],
  Łł: ["pl"],
  Ńń: ["pl"],
  Ňň: ["cz", "sk"],
  Óó: ["cz", "hu", "pl", "sk"],
  Öö: ["hu", "tr"],
  Őő: ["hu"],
  Ôô: ["sk"],
  Řř: ["cz"],
  Ŕŕ: ["sk"],
  Śś: ["me", "pl"],
  Šš: ["cz", "hr", "me", "rs", "sk", "si"],
  Șș: ["ro"],
  Şş: ["tr"],
  Ťť: ["cz", "sk"],
  Țț: ["ro"],
  Úú: ["cz", "hu", "sk"],
  Üü: ["hu", "tr"],
  Űű: ["hu"],
  Ůů: ["cz"],
  Ýý: ["cz", "sk"],
  Źź: ["me", "pl"],
  Żż: ["pl"],
  Žž: ["cz", "hr", "me", "rs", "sk", "si"],

  // Cyrillic characters - common
  Аа: ["bg", "me", "mk", "ru", "rs", "ua"],
  Бб: ["bg", "me", "mk", "ru", "rs", "ua"],
  Вв: ["bg", "me", "mk", "ru", "rs", "ua"],
  Гг: ["bg", "me", "mk", "ru", "rs", "ua"],
  Дд: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ее: ["bg", "me", "mk", "ru", "rs", "ua"],
  Жж: ["bg", "me", "mk", "ru", "rs", "ua"],
  Зз: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ии: ["bg", "me", "mk", "ru", "rs", "ua"],
  Кк: ["bg", "me", "mk", "ru", "rs", "ua"],
  Лл: ["bg", "me", "mk", "ru", "rs", "ua"],
  Мм: ["bg", "me", "mk", "ru", "rs", "ua"],
  Нн: ["bg", "me", "mk", "ru", "rs", "ua"],
  Оо: ["bg", "me", "mk", "ru", "rs", "ua"],
  Пп: ["bg", "me", "mk", "ru", "rs", "ua"],
  Рр: ["bg", "me", "mk", "ru", "rs", "ua"],
  Сс: ["bg", "me", "mk", "ru", "rs", "ua"],
  Тт: ["bg", "me", "mk", "ru", "rs", "ua"],
  Уу: ["bg", "me", "mk", "ru", "rs", "ua"],
  Фф: ["bg", "me", "mk", "ru", "rs", "ua"],
  Хх: ["bg", "me", "mk", "ru", "rs", "ua"],
  Цц: ["bg", "me", "mk", "ru", "rs", "ua"],
  Чч: ["bg", "me", "mk", "ru", "rs", "ua"],
  Шш: ["bg", "me", "mk", "ru", "rs", "ua"],

  // Cyrillic - Bulgarian/Russian/Ukrainian
  Йй: ["bg", "ru", "ua"],
  Щщ: ["bg", "ru", "ua"],
  Ъъ: ["bg", "ru"],
  Ьь: ["bg", "ru", "ua"],
  Юю: ["bg", "ru", "ua"],
  Яя: ["bg", "ru", "ua"],

  // Cyrillic - Russian only
  Ёё: ["ru"],
  Ыы: ["ru"],
  Ээ: ["ru"],

  // Cyrillic - Ukrainian only
  Єє: ["ua"],
  Іі: ["ua"],
  Її: ["ua"],
  Ґґ: ["ua"],

  // Cyrillic - Macedonian only
  Ѓѓ: ["mk"],
  Ќќ: ["mk"],
  Ѕѕ: ["mk"],

  // Cyrillic - Serbian/Montenegrin/Macedonian
  Љљ: ["me", "mk", "rs"],
  Њњ: ["me", "mk", "rs"],
  Џџ: ["me", "mk", "rs"],
  Ћћ: ["me", "rs"],
  Ђђ: ["me", "rs"],
};
