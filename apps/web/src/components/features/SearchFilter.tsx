import { component$, type Signal } from "@builder.io/qwik";
import { LuSearch } from "@qwikest/icons/lucide";

export type ScriptFilter = "all" | "latin" | "cyrillic";

interface SearchFilterProps {
  searchQuery: Signal<string>;
  scriptFilter: Signal<ScriptFilter>;
  showScriptFilter?: boolean;
}

export const SearchFilter = component$<SearchFilterProps>(
  ({ searchQuery, scriptFilter, showScriptFilter = false }) => {
    return (
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <LuSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-burnt-sienna/60 w-5 h-5 transition-colors duration-200 peer-focus:text-burnt-sienna" />
          <input
            type="text"
            data-search-input
            placeholder="Search characters or countries... (Press / to focus)"
            value={searchQuery.value}
            onInput$={(e) => {
              searchQuery.value = (e.target as HTMLInputElement).value;
            }}
            onKeyDown$={(e) => {
              if (e.key === "Escape") {
                searchQuery.value = "";
                (e.target as HTMLInputElement).blur();
              }
            }}
            class="peer w-full pl-10 pr-4 py-3 bg-parchment-light border border-burnt-sienna/30 rounded-sm text-ink placeholder-ink-faded/60 focus:outline-none focus:border-burnt-sienna focus:ring-2 focus:ring-burnt-sienna/20 transition-all duration-200"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            aria-label="Search characters or countries"
          />
        </div>

        {showScriptFilter && (
          <div class="flex gap-2" role="group" aria-label="Filter by script type">
            {(["all", "latin", "cyrillic"] as const).map((option) => (
              <button
                key={option}
                onClick$={() => {
                  scriptFilter.value = option;
                }}
                aria-pressed={scriptFilter.value === option}
                class={[
                  "min-h-[44px] px-4 py-3 rounded-sm capitalize transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-burnt-sienna/30",
                  scriptFilter.value === option
                    ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                    : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
                ]}
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
