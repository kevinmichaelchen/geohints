import { component$ } from "@builder.io/qwik";
import { getFlagEmoji, getCountryName } from "~/lib/utils";
import type { CharacterEntries } from "~/lib/types";

interface CharacterGridProps {
  characters: CharacterEntries;
}

export const CharacterGrid = component$<CharacterGridProps>(
  ({ characters }) => {
    return (
      <div class="grid grid-cols-1 gap-y-5 md:gap-y-10 lg:gap-y-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(characters).map(([char, codes], i) => (
          <div key={i}>
            <div class="text-3xl lg:text-5xl lg:mb-5">{char}</div>
            <ul>
              {codes.map((code, j) => (
                <li key={j}>
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
  },
);
