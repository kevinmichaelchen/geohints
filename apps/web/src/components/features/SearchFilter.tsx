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
          <LuSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 peer-focus:text-qwik-light-blue" />
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
            class="peer w-full pl-10 pr-4 py-3 bg-qwik-dirty-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-qwik-light-blue focus:ring-2 focus:ring-qwik-light-blue/30 transition-all duration-200"
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
                  "min-h-[44px] px-4 py-3 rounded-lg capitalize transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-qwik-light-blue/50",
                  scriptFilter.value === option
                    ? "bg-qwik-light-blue text-white shadow-lg shadow-qwik-light-blue/20"
                    : "bg-qwik-dirty-black text-gray-400 hover:text-white hover:bg-qwik-dirty-black/80",
                ]}
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
