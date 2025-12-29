import { $, component$, useSignal } from "@builder.io/qwik";
import type { AnalysisResult } from "~/lib/analyzer";
import { getFlagEmoji } from "~/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge = component$<ConfidenceBadgeProps>(({ confidence }) => {
  const colorClass =
    confidence >= 80
      ? "bg-green-600"
      : confidence >= 50
        ? "bg-yellow-600"
        : "bg-gray-600";

  return (
    <span class={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
      {confidence}%
    </span>
  );
});

interface CountryResultProps {
  result: AnalysisResult;
}

const CountryResult = component$<CountryResultProps>(({ result }) => {
  const copied = useSignal(false);

  const copyToClipboard = $(() => {
    navigator.clipboard.writeText(result.countryName);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });

  return (
    <div class="flex items-center justify-between p-4 bg-qwik-dirty-black rounded-lg">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{getFlagEmoji(result.countryCode)}</span>
        <div>
          <div class="font-semibold">{result.countryName}</div>
          <div class="text-sm text-gray-400">
            Matched: {result.matchedCharacters.join(", ")}
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
          {copied.value ? "✓" : "📋"}
        </button>
      </div>
    </div>
  );
});

interface FoundCharactersProps {
  characters: string[];
}

export const FoundCharacters = component$<FoundCharactersProps>(
  ({ characters }) => {
    if (characters.length === 0) return null;

    return (
      <div class="mb-6 p-4 bg-qwik-dirty-black rounded-lg">
        <span class="text-gray-400 mr-2">Found Characters:</span>
        <span class="text-xl font-mono">{characters.join(" ")}</span>
      </div>
    );
  },
);

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults = component$<AnalysisResultsProps>(
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
  },
);
