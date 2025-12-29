# Text Analyzer - Design

## Overview

A standalone page at `/analyze` that accepts text input and identifies possible countries based on character analysis.

## Page Layout

```
┌─────────────────────────────────────────────────────────┐
│                      Header                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │                                                  │   │
│   │         Paste or type text here...              │   │
│   │                                                  │   │
│   │                                                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
│   [Simple ○] [Advanced ○]                    [Analyze]  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   Found Characters: Ø, Å, Æ                             │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Norway                                   95% [copy]│   │
│   │     Matched: Ø, Å, Æ                            │   │
│   ├─────────────────────────────────────────────────┤   │
│   │ Denmark                                  85% [copy]│   │
│   │     Matched: Ø, Å, Æ                            │   │
│   ├─────────────────────────────────────────────────┤   │
│   │ Iceland                                  40% [copy]│   │
│   │     Matched: Æ                                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                      Footer                              │
└─────────────────────────────────────────────────────────┘
```

## Analysis Algorithm

### Simple Mode (MVP)

```typescript
interface AnalysisResult {
  countryCode: string;
  countryName: string;
  confidence: number; // 0-100
  matchedCharacters: string[];
}

function analyzeTextSimple(text: string): AnalysisResult[] {
  // 1. Extract unique non-ASCII characters from input
  const uniqueChars = extractUniqueCharacters(text);

  // 2. For each character, find which countries use it
  const countryMatches = new Map<string, Set<string>>();

  for (const char of uniqueChars) {
    const countries = findCountriesForCharacter(char);
    for (const country of countries) {
      if (!countryMatches.has(country)) {
        countryMatches.set(country, new Set());
      }
      countryMatches.get(country)!.add(char);
    }
  }

  // 3. Calculate confidence based on:
  //    - Number of matched characters
  //    - Uniqueness of characters (Þ is more unique than Ö)
  const results: AnalysisResult[] = [];

  for (const [code, chars] of countryMatches) {
    const matchedChars = Array.from(chars);
    const confidence = calculateConfidence(matchedChars, code);

    results.push({
      countryCode: code,
      countryName: getCountryName(code),
      confidence,
      matchedCharacters: matchedChars,
    });
  }

  // 4. Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}
```

### Confidence Calculation

```typescript
function calculateConfidence(
  matchedChars: string[],
  countryCode: string,
): number {
  let score = 0;

  for (const char of matchedChars) {
    // Get how many countries use this character
    const countriesUsingChar = findCountriesForCharacter(char).length;

    // Rarer characters = higher score
    // If only 1 country uses it: +50 points
    // If 2-3 countries: +30 points
    // If 4-6 countries: +15 points
    // If 7+ countries: +5 points
    if (countriesUsingChar === 1) {
      score += 50;
    } else if (countriesUsingChar <= 3) {
      score += 30;
    } else if (countriesUsingChar <= 6) {
      score += 15;
    } else {
      score += 5;
    }
  }

  // Normalize to 0-100 (cap at 100)
  return Math.min(100, score);
}
```

### Advanced Mode (Future Enhancement)

- Consider character frequency (how often each char appears)
- Consider character position patterns
- Consider word patterns and common endings
- Weight by coverage likelihood (some countries have more Street View)

## Component Design

### TextAnalyzer Page (`src/routes/analyze/index.tsx`)

```typescript
import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { TextInput } from '~/components/features/TextInput';
import { AnalysisResults } from '~/components/features/AnalysisResults';
import { analyzeText } from '~/lib/analyzer';

export default component$(() => {
  const inputText = useSignal('');
  const analysisMode = useSignal<'simple' | 'advanced'>('simple');
  const results = useSignal<AnalysisResult[]>([]);
  const foundCharacters = useSignal<string[]>([]);

  // Debounced analysis
  useTask$(({ track, cleanup }) => {
    const text = track(() => inputText.value);
    const mode = track(() => analysisMode.value);

    const timeout = setTimeout(() => {
      const { results: analysisResults, characters } = analyzeText(text, mode);
      results.value = analysisResults;
      foundCharacters.value = characters;
    }, 300);

    cleanup(() => clearTimeout(timeout));
  });

  return (
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-2">Text Analyzer</h1>
      <p class="text-gray-400 mb-6">
        Paste text to identify possible countries based on unique characters.
      </p>

      <TextInput value={inputText} />

      <ModeToggle mode={analysisMode} />

      {foundCharacters.value.length > 0 && (
        <FoundCharacters characters={foundCharacters.value} />
      )}

      <AnalysisResults results={results.value} />
    </div>
  );
});
```

### TextInput Component

```typescript
export const TextInput = component$<{ value: Signal<string> }>(({ value }) => {
  return (
    <textarea
      value={value.value}
      onInput$={(e) => {
        value.value = (e.target as HTMLTextAreaElement).value;
      }}
      placeholder="Paste or type text here..."
      class="w-full h-40 p-4 bg-[var(--qwik-dirty-black)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--qwik-light-blue)] resize-y"
      aria-label="Text to analyze"
    />
  );
});
```

### AnalysisResults Component

```typescript
export const AnalysisResults = component$<{ results: AnalysisResult[] }>(
  ({ results }) => {
    if (results.length === 0) {
      return (
        <div class="text-center py-8 text-gray-400">
          <p>Enter text above to see country matches</p>
        </div>
      );
    }

    return (
      <div class="space-y-3">
        {results.map((result) => (
          <CountryResult key={result.countryCode} result={result} />
        ))}
      </div>
    );
  }
);
```

### CountryResult Component

```typescript
export const CountryResult = component$<{ result: AnalysisResult }>(
  ({ result }) => {
    const copied = useSignal(false);

    const copyToClipboard = $(() => {
      navigator.clipboard.writeText(result.countryName);
      copied.value = true;
      setTimeout(() => { copied.value = false; }, 2000);
    });

    return (
      <div class="flex items-center justify-between p-4 bg-[var(--qwik-dirty-black)] rounded-lg">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{getFlagEmoji(result.countryCode)}</span>
          <div>
            <div class="font-semibold">{result.countryName}</div>
            <div class="text-sm text-gray-400">
              Matched: {result.matchedCharacters.join(', ')}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <ConfidenceBadge confidence={result.confidence} />
          <button
            onClick$={copyToClipboard}
            class="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Copy country name"
          >
            {copied.value ? '✓' : '📋'}
          </button>
        </div>
      </div>
    );
  }
);
```

### ConfidenceBadge Component

```typescript
export const ConfidenceBadge = component$<{ confidence: number }>(
  ({ confidence }) => {
    const colorClass =
      confidence >= 80 ? 'bg-green-600' :
      confidence >= 50 ? 'bg-yellow-600' :
      'bg-gray-600';

    return (
      <span class={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
        {confidence}%
      </span>
    );
  }
);
```

## Data Requirements

### Character -> Country Mapping

Need to create a reverse lookup from the language data:

```typescript
// src/lib/character-map.ts

import { europeNorthern } from "~/data/languages/europe-northern";
import { europeCentralEastern } from "~/data/languages/europe-central-eastern";

// Build reverse map: character -> countries
export const characterToCountries = new Map<string, string[]>();

function processRegion(region: LanguageRegion) {
  for (const entry of region.characters) {
    // Handle both upper and lower case
    for (const char of entry.chars) {
      const existing = characterToCountries.get(char) || [];
      const newCountries = entry.countries.filter((c) => !existing.includes(c));
      characterToCountries.set(char, [...existing, ...newCountries]);
    }
  }
}

processRegion(europeNorthern);
processRegion(europeCentralEastern);
// ... add more regions as they're created
```

## Route Structure

```
src/routes/analyze/
└── index.tsx
```

Add to header navigation and landing page categories.
