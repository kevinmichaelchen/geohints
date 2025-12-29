# Foundation & Cleanup - Design

## Overview

This spec establishes the foundational architecture and code patterns for the GeoHints application.

## Architecture

### Current State

```
src/
├── components/
│   ├── router-head/
│   └── starter/           # Mixed useful + unused components
│       ├── counter/       # Unused
│       ├── footer/        # Keep (modify)
│       ├── gauge/         # Unused
│       ├── header/        # Keep (modify)
│       ├── hero/          # Replace
│       ├── icons/         # Keep (rename)
│       ├── infobox/       # Unused
│       └── next-steps/    # Unused
├── routes/
│   ├── demo/              # Remove entirely
│   ├── follow/            # Keep
│   └── languages/         # Keep (refactor)
└── media/                 # thunder.png unused
```

### Target State

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── RouterHead.tsx
│   ├── ui/
│   │   └── CountryFlag.tsx
│   └── features/
│       └── CharacterGrid.tsx
├── data/
│   ├── countries.ts           # Master country list
│   └── languages/
│       ├── europe-northern.ts
│       └── europe-central-eastern.ts
├── lib/
│   ├── utils.ts               # getFlagEmoji, etc.
│   └── types.ts               # Shared TypeScript types
├── routes/
│   ├── follow/
│   ├── languages/
│   ├── index.tsx
│   └── layout.tsx
└── media/
    └── logo.svg               # New GeoHints logo
```

## Component Design

### Shared Utilities (`src/lib/utils.ts`)

```typescript
/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji
 */
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Get display name for country code
 */
export function getCountryName(countryCode: string, locale = "en"): string {
  return (
    new Intl.DisplayNames([locale], { type: "region" }).of(
      countryCode.toUpperCase(),
    ) ?? countryCode
  );
}
```

### Shared Types (`src/lib/types.ts`)

```typescript
/** ISO 3166-1 alpha-2 country code (lowercase) */
export type CountryCode = string;

/** Character entry mapping special characters to countries */
export interface CharacterEntry {
  /** The character(s), e.g., "Åå" */
  chars: string;
  /** List of country codes where this character appears */
  countries: CountryCode[];
}

/** Language/alphabet data for a region */
export interface LanguageRegion {
  id: string;
  name: string;
  characters: CharacterEntry[];
}
```

### Data Structure (`src/data/languages/europe-northern.ts`)

```typescript
import type { LanguageRegion } from "~/lib/types";

export const europeNorthern: LanguageRegion = {
  id: "europe-northern",
  name: "Northern Europe (Nordic / Baltic)",
  characters: [
    { chars: "Áá", countries: ["is"] },
    { chars: "Åå", countries: ["dk", "fi", "no", "se"] },
    { chars: "Ää", countries: ["ee", "fi", "se"] },
    // ... rest of data
  ],
};
```

### CharacterGrid Component

```typescript
interface CharacterGridProps {
  characters: CharacterEntry[];
  searchQuery?: string;
}
```

Renders the grid of characters with country flags. Accepts optional `searchQuery` for future filtering (Spec 03).

## Navigation Updates

### Header Links

```typescript
const navLinks = [
  { label: "Follow Cars", href: "/follow", icon: LuCar },
  { label: "Languages", href: "/languages", icon: LuLanguages },
  // Future: { label: 'Analyze', href: '/analyze', icon: LuSearch },
  // Future: { label: 'Meta', href: '/meta', icon: LuLayers },
];
```

### Use Qwik Link Component

Replace all `<a href="...">` with `<Link href="...">` from `@builder.io/qwik-city` for SPA navigation.

## Branding

### Logo Requirements

- Simple, recognizable icon + wordmark
- Works on dark background (current theme)
- SVG format for scalability
- Suggested concept: Globe/map pin + "GeoHints" text

### Meta Tags

```typescript
export const head: DocumentHead = {
  title: "GeoHints - GeoGuessr Learning Tool",
  meta: [
    {
      name: "description",
      content:
        "Learn to identify countries in GeoGuessr with language characters, follow cars, and visual clues.",
    },
    { property: "og:title", content: "GeoHints" },
    { property: "og:description", content: "..." },
    { property: "og:image", content: "/og-image.png" },
  ],
};
```

## CSS Cleanup

### Issues to Fix

1. Duplicate `html` and `body` rules in `global.css`
2. Mixed styling approaches (Tailwind + CSS modules + inline)

### Approach

- Keep Tailwind for utility classes
- Keep CSS modules for component-specific styles
- Remove inline styles where possible
- Clean up duplicate global rules
