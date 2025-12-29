import { component$ } from "@builder.io/qwik";
import { getFlagEmoji, getCountryName } from "~/lib/utils";
import type { CharacterEntry } from "~/lib/types";

interface CharacterGridProps {
  characters: CharacterEntry[];
}

export const CharacterGrid = component$<CharacterGridProps>(
  ({ characters }) => {
    return (
      <div class="@container grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 @xl:grid-cols-7 @2xl:grid-cols-8 @sm:gap-3">
        {characters.map((entry, i) => {
          const animationDelay = `${0.2 + (i % 16) * 0.025}s`;

          return (
            <div
              key={i}
              class="group relative rounded-md bg-qwik-dirty-black/60 p-3 transition-all duration-200 hover:bg-qwik-dirty-black hover:shadow-lg hover:shadow-black/20 opacity-0"
              style={{
                animation: `fade-in-up 0.3s ease-out ${animationDelay} forwards`,
              }}
            >
              <div
                class="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style="background: linear-gradient(135deg, rgba(24,182,246,0.3), rgba(172,127,244,0.3)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                aria-hidden="true"
              />

              <div class="text-2xl @sm:text-3xl font-bold mb-2 text-qwik-light-blue group-hover:text-white transition-colors duration-200">
                {entry.chars}
              </div>

              <div class="space-y-0.5">
                {entry.countries.map((code, j) => (
                  <div
                    key={j}
                    class="flex items-center gap-1.5 text-xs text-gray-300"
                  >
                    <span class="text-sm">{getFlagEmoji(code)}</span>
                    <span class="truncate">{getCountryName(code)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
