import { component$ } from "@builder.io/qwik";
import { getFlagEmoji, getCountryName } from "~/lib/utils";
import { europeNorthernChars } from "~/data/languages";

export default component$(() => {
  return (
    <div class="grid grid-cols-1 gap-y-5 md:gap-y-10 lg:gap-y-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Object.entries(europeNorthernChars).map((e, i) => (
        <div key={i}>
          <div class="text-3xl lg:text-5xl lg:mb-5">{e[0]}</div>
          <ul>
            {e[1].map((code: string, i) => (
              <li key={i}>
                <div class="flex flex-row space-between items-center space-x-3">
                  <span>{getCountryName(code)}</span>
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
