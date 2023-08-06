import { component$ } from "@builder.io/qwik";

const chars = {
  Ää: ["sk"],
  Áá: ["cz", "hu", "sk"],
  Ăă: ["ro"],
  Ââ: ["ro"],
  Ąą: ["pl"],
  Ćć: ["hr", "me", "pl", "rs"],
  Čč: ["cz", "hr", "sk", "si"],
  Çç: ["al", "mk", "tr"],
  Ďď: ["cz", "sk"],
  Đđ: ["hr", "me"],
  Ёё: ["al", "mk", "ru"],
  Éé: ["cz", "hu", "sk"],
  Ěě: ["cz"],
  Ęę: ["pl"],
  Ğğ: ["tr"],
  Ii: [
    "al",
    "cz",
    "hr",
    "hu",
    "me",
    "mk",
    "pl",
    "ro",
    "rs",
    "sk",
    "si",
    "tr",
    "ua",
  ],
  Її: ["ua"],
  Íí: ["cz", "hu", "sk"],
  Îî: ["ro"],
  Jj: ["al", "cz", "hr", "hu", "me", "mk", "pl", "ro", "rs", "sk", "si"],
  Ќќ: ["mk"],
  Ĺĺ: ["sk"],
  Ľľ: ["sk"],
  Łł: ["pl"],
  Ňň: ["cz", "sk"],
  Öö: ["hu", "tr"],
  Óó: ["cz", "hu", "pl", "sk"],
  Őő: ["hu"],
  Ôô: ["sk"],
  Qq: ["al", "cz", "hu", "mk", "ro"],
  Ŕŕ: ["sk"],
  Řř: ["cz"],
  Ѕѕ: ["al", "cz", "hr", "hu", "me", "mk", "pl", "ro", "rs", "sk", "si", "tr"],
  Šš: ["cz", "hr", "me", "rs", "sk", "si"],
  Śś: ["me", "pl"],
  Șș: ["ro", "tr"],
  Ťť: ["cz", "sk"],
  Țț: ["ro"],
  Üü: ["hu", "tr"],
  Úú: ["cz", "hu", "sk"],
  Űű: ["hu"],
  Ůů: ["cz"],
  Ww: ["pl", "ro", "sk"],
  Хх: ["al", "bg", "cz", "hu", "me", "mk", "ro", "ru", "rs", "sk", "ua"],
  Yy: ["al", "bg", "cz", "hu", "me", "mk", "pl", "ro", "ru", "sk", "tr", "ua"],
  Ýý: ["cz", "sk"],
  Żż: ["pl"],
  Źź: ["me", "pl"],
  Žž: ["cz", "hr", "me", "rs", "sk", "si"],
  Бб: ["bg", "me", "mk", "ru", "rs", "ua"],
  Цц: ["bg", "me", "mk", "ru", "rs", "ua"],
  Џџ: ["me", "mk", "rs"],
  Чч: ["bg", "me", "mk", "ru", "rs", "ua"],
  Дд: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ћћ: ["me", "rs"],
  Ђђ: ["me", "rs"],
  Єє: ["ua"],
  Ээ: ["ru"],
  Ии: ["bg", "me", "mk", "ru", "rs", "ua"],
  Йй: ["bg", "ru", "ua"],
  Фф: ["bg", "me", "mk", "ru", "rs", "ua"],
  Гг: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ѓѓ: ["mk"],
  Ґґ: ["ua"],
  Зз: ["bg", "me", "mk", "ru", "rs", "ua"],
  З́з́: ["me", "mk"],
  Шш: ["bg", "me", "mk", "ru", "rs", "ua"],
  Щщ: ["bg", "ru", "ua"],
  Юю: ["bg", "ru", "ua"],
  Яя: ["bg", "ru", "ua"],
  Ьь: ["bg", "ru", "ua"],
  Ъъ: ["bg", "ru"],
  Ыы: ["ru"],
  Љљ: ["me", "mk", "rs"],
  Њњ: ["me", "mk", "rs"],
};

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default component$(() => {
  return (
    <div class="space-y-10">
      {Object.entries(chars).map((e, i) => (
        <div key={i}>
          <div class="text-3xl">{e[0]}</div>
          <ul>
            {e[1].map((code: string, i) => (
              <li key={i}>
                <div class="flex flex-row space-between items-center space-x-3">
                  <span>
                    {new Intl.DisplayNames(["en"], { type: "region" }).of(
                      code.toUpperCase()
                    )}
                  </span>
                  <span class="text-3xl">{getFlagEmoji(code)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
});
