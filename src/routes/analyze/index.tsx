import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  AnalysisResults,
  FoundCharacters,
} from "~/components/features/AnalysisResults";
import { TextInput } from "~/components/features/TextInput";
import { PageHeader } from "~/components/ui/PageHeader";
import { analyzeText } from "~/lib/analyzer";

export default component$(() => {
  const inputText = useSignal("");

  const analysis = useComputed$(() => {
    return analyzeText(inputText.value, "simple");
  });

  return (
    <div class="min-h-screen">
      <PageHeader
        title="Text Analyzer"
        subtitle="Paste text to identify possible countries based on unique characters."
        breadcrumbs={[{ label: "Analyze" }]}
      />

      <section class="container mx-auto px-4 pb-16 max-w-3xl">
        <TextInput value={inputText} />

        <div class="mt-6">
          <FoundCharacters characters={analysis.value.characters} />
          <AnalysisResults results={analysis.value.results} />
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Text Analyzer - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Analyze text to identify possible countries based on unique alphabet characters for GeoGuessr.",
    },
  ],
};
