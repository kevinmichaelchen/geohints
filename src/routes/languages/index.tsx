import { component$ } from "@builder.io/qwik";

const chars = {
  Áá: ["is"],
  Åå: ["dk", "fi", "no", "se"],
  Ää: ["ee", "fi", "se"],
  Āā: ["lv"],
  Ąą: ["lt"],
  Čč: ["lv", "lt"],
  Ðð: ["is"],
  Ėė: ["lt"],
  Éé: ["is", "no"],
  Ēē: ["lv"],
  Ęę: ["lt"],
  Ģģ: ["lv"],
  Íí: ["is"],
  Īī: ["lv"],
  Įį: ["lt"],
  Ķķ: ["lv"],
  Ļļ: ["lv"],
  Ņņ: ["lv"],
  Øø: ["dk", "no"],
  Óó: ["is"],
  Öö: ["ee", "fi", "is", "se"],
  Õõ: ["ee"],
  Qq: ["dk", "ee", "fi", "no", "se"],
  Šš: ["ee", "lv", "lt"],
  Úú: ["is"],
  Üü: ["ee"],
  Ūū: ["lv", "lt"],
  Ųų: ["lt"],
  Xx: ["dk", "ee", "fi", "is", "no", "se"],
  Yy: ["dk", "ee", "fi", "is", "lt", "no", "se"],
  Ýý: ["is"],
  Ww: ["dk", "ee", "fi", "no", "se"],
  Žž: ["ee", "lv", "lt"],
  Ææ: ["dk", "is", "no"],
  Þþ: ["is"],
};

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default component$(() => {
  return (
    <div class="space-y-10">
      {Object.entries(chars).map((e, i) => (
        <div key={i}>
          <div class="text-3xl">{e[0]}</div>
          <ul>
            {e[1].map((code, i) => (
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
