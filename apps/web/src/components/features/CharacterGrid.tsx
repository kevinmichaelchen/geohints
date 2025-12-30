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
      <mark class="bg-antique-gold/40 text-ink rounded px-0.5">{match}</mark>
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
              class="group relative rounded-sm bg-parchment-light p-3 border border-burnt-sienna/15 shadow-sm transition-all duration-200 hover:shadow-md hover:border-burnt-sienna/30"
              style={entranceStyle}
            >
              {/* Vintage border on hover */}
              <div
                class="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style="background: linear-gradient(135deg, rgba(184,134,11,0.4), rgba(139,69,19,0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                aria-hidden="true"
              />

              <div
                class="text-2xl @sm:text-3xl font-bold mb-2 text-burnt-sienna group-hover:text-antique-gold transition-colors duration-200"
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              >
                <HighlightText text={entry.chars} query={highlightQuery} />
              </div>

              <div class="space-y-0.5">
                {entry.countries.map((code, j) => (
                  <div key={j} class="flex items-center gap-1.5 text-xs text-ink-faded">
                    <span class="text-sm">{getFlagEmoji(code)}</span>
                    <span class="truncate" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
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
