import { component$ } from "@builder.io/qwik";
import { getFlagEmoji, getCountryName } from "~/lib/utils";
import { useIsInitialLoad } from "~/lib/hooks";
import type { CharacterEntry } from "~/lib/types";

interface HighlightTextProps {
  text: string;
  query: string;
}

const HighlightText = component$<HighlightTextProps>(({ text, query }) => {
  if (!query) {
    return <span>{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <span>
      {before}
      <mark class="bg-qwik-light-blue/40 text-white rounded px-0.5">{match}</mark>
      {after}
    </span>
  );
});

interface CharacterGridProps {
  characters: CharacterEntry[];
  highlightQuery?: string;
}

export const CharacterGrid = component$<CharacterGridProps>(
  ({ characters, highlightQuery = "" }) => {
    const isInitialLoad = useIsInitialLoad();

    return (
      <div class="@container grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 @xl:grid-cols-7 @2xl:grid-cols-8 @sm:gap-3">
        {characters.map((entry, i) => {
          // Only animate on initial load, instant on SPA navigation
          const entranceStyle = isInitialLoad
            ? {
                opacity: 0,
                animation: `fade-in-up 0.25s ease-out ${(i % 16) * 0.02}s forwards`,
              }
            : {};

          return (
            <div
              key={i}
              class="group relative rounded-md bg-qwik-dirty-black/60 p-3 transition-all duration-200 hover:bg-qwik-dirty-black hover:shadow-lg hover:shadow-black/20"
              style={entranceStyle}
            >
              <div
                class="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style="background: linear-gradient(135deg, rgba(24,182,246,0.3), rgba(172,127,244,0.3)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                aria-hidden="true"
              />

              <div class="text-2xl @sm:text-3xl font-bold mb-2 text-qwik-light-blue group-hover:text-white transition-colors duration-200">
                <HighlightText text={entry.chars} query={highlightQuery} />
              </div>

              <div class="space-y-0.5">
                {entry.countries.map((code, j) => (
                  <div key={j} class="flex items-center gap-1.5 text-xs text-gray-300">
                    <span class="text-sm">{getFlagEmoji(code)}</span>
                    <span class="truncate">
                      <HighlightText text={getCountryName(code)} query={highlightQuery} />
                    </span>
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
