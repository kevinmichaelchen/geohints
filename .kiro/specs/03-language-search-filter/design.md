# Language Search & Filter - Design

## Overview

Add client-side search and filter functionality to the language character grid.

## Architecture

### Component Hierarchy

```
LanguagePage
├── SearchFilter (new)
│   ├── SearchInput
│   └── ScriptToggle
├── ResultsCount (new)
└── CharacterGrid (updated)
    └── CharacterEntry (updated - highlight support)
```

### State Management

Using Qwik's `useSignal` for reactive state:

```typescript
// In LanguagePage component
const searchQuery = useSignal("");
const scriptFilter = useSignal<"all" | "latin" | "cyrillic">("all");

// Computed filtered results
const filteredCharacters = useComputed$(() => {
  return filterCharacters(characters, searchQuery.value, scriptFilter.value);
});
```

## Component Design

### SearchFilter Component (`src/components/features/SearchFilter.tsx`)

```typescript
import { component$, type Signal } from '@builder.io/qwik';
import { LuSearch } from '@qwikest/icons/lucide';

interface SearchFilterProps {
  searchQuery: Signal<string>;
  scriptFilter: Signal<'all' | 'latin' | 'cyrillic'>;
  showScriptFilter?: boolean;
}

export const SearchFilter = component$<SearchFilterProps>(
  ({ searchQuery, scriptFilter, showScriptFilter = false }) => {
    return (
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div class="relative flex-1">
          <LuSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search characters or countries... (Press / to focus)"
            value={searchQuery.value}
            onInput$={(e) => {
              searchQuery.value = (e.target as HTMLInputElement).value;
            }}
            onKeyDown$={(e) => {
              if (e.key === 'Escape') {
                searchQuery.value = '';
                (e.target as HTMLInputElement).blur();
              }
            }}
            class="w-full pl-10 pr-4 py-3 bg-[var(--qwik-dirty-black)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--qwik-light-blue)]"
            aria-label="Search characters or countries"
          />
        </div>

        {/* Script Filter (only for pages with mixed scripts) */}
        {showScriptFilter && (
          <div class="flex gap-2">
            {(['all', 'latin', 'cyrillic'] as const).map((option) => (
              <button
                key={option}
                onClick$={() => { scriptFilter.value = option; }}
                class={[
                  'px-4 py-2 rounded-lg capitalize transition-colors',
                  scriptFilter.value === option
                    ? 'bg-[var(--qwik-light-blue)] text-white'
                    : 'bg-[var(--qwik-dirty-black)] text-gray-400 hover:text-white',
                ]}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
```

### Filter Logic (`src/lib/search.ts`)

```typescript
import type { CharacterEntry } from "./types";
import { getCountryName } from "./utils";

/** Check if a character string is Cyrillic */
export function isCyrillic(str: string): boolean {
  return /[\u0400-\u04FF]/.test(str);
}

/** Filter characters based on search query and script filter */
export function filterCharacters(
  characters: CharacterEntry[],
  query: string,
  scriptFilter: "all" | "latin" | "cyrillic",
): CharacterEntry[] {
  const normalizedQuery = query.toLowerCase().trim();

  return characters.filter((entry) => {
    // Script filter
    if (scriptFilter === "latin" && isCyrillic(entry.chars)) return false;
    if (scriptFilter === "cyrillic" && !isCyrillic(entry.chars)) return false;

    // If no search query, include all (after script filter)
    if (!normalizedQuery) return true;

    // Match against character
    if (entry.chars.toLowerCase().includes(normalizedQuery)) return true;

    // Match against country codes
    if (entry.countries.some((code) => code.includes(normalizedQuery)))
      return true;

    // Match against country names
    if (
      entry.countries.some((code) =>
        getCountryName(code).toLowerCase().includes(normalizedQuery),
      )
    )
      return true;

    return false;
  });
}

/** Highlight matching text */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-[var(--qwik-light-blue)]/30 text-white">$1</mark>',
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

### Updated CharacterGrid Component

```typescript
interface CharacterGridProps {
  characters: CharacterEntry[];
  searchQuery?: string;
}

export const CharacterGrid = component$<CharacterGridProps>(
  ({ characters, searchQuery = '' }) => {
    return (
      <>
        {characters.length === 0 ? (
          <div class="text-center py-12 text-gray-400">
            <p class="text-xl">No characters found</p>
            <p class="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 gap-y-5 md:gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {characters.map((entry, i) => (
              <CharacterEntry
                key={i}
                entry={entry}
                highlightQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </>
    );
  }
);
```

### Keyboard Shortcut Handler

Add to the layout or page component:

```typescript
// Global "/" to focus search
useOnDocument(
  "keydown",
  $((event: KeyboardEvent) => {
    if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
      event.preventDefault();
      document.querySelector<HTMLInputElement>("[data-search-input]")?.focus();
    }
  }),
);
```

## URL State (Optional Enhancement)

Persist search in URL for shareability:

```typescript
import { useLocation, useNavigate } from "@builder.io/qwik-city";

// Read initial value from URL
const location = useLocation();
const searchQuery = useSignal(location.url.searchParams.get("q") || "");

// Update URL when search changes (debounced)
useTask$(({ track }) => {
  const query = track(() => searchQuery.value);
  // Update URL without navigation
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }
  window.history.replaceState({}, "", url.toString());
});
```

## Visual Design

### Search Input

- Full width on mobile, max-width on desktop
- Dark background matching theme
- Light blue focus border
- Search icon on left
- Clear button on right when has value

### Script Filter Buttons

- Pill-style toggle buttons
- Active state: Light blue background
- Inactive state: Dark background, gray text

### Results Count

- Subtle text below search
- Format: "Showing X of Y characters"
- Announce to screen readers when count changes
