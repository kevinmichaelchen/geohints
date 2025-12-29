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
          <LuSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
            class="w-full pl-10 pr-4 py-3 bg-qwik-dirty-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-qwik-light-blue"
            aria-label="Search characters or countries"
          />
        </div>

        {showScriptFilter && (
          <div class="flex gap-2">
            {(["all", "latin", "cyrillic"] as const).map((option) => (
              <button
                key={option}
                onClick$={() => {
                  scriptFilter.value = option;
                }}
                class={[
                  "px-4 py-2 rounded-lg capitalize transition-colors",
                  scriptFilter.value === option
                    ? "bg-qwik-light-blue text-white"
                    : "bg-qwik-dirty-black text-gray-400 hover:text-white",
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
