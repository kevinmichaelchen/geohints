import {
  $,
  component$,
  useComputed$,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CharacterGrid } from "~/components/features/CharacterGrid";
import { ResultsCount } from "~/components/features/ResultsCount";
import {
  SearchFilter,
  type ScriptFilter,
} from "~/components/features/SearchFilter";
import { PageHeader } from "~/components/ui/PageHeader";
import { europeCentralEasternChars } from "~/data/languages";
import { entriesToArray, filterCharacters } from "~/lib/search";

const allCharacters = entriesToArray(europeCentralEasternChars);

export default component$(() => {
  const searchQuery = useSignal("");
  const scriptFilter = useSignal<ScriptFilter>("all");

  const filteredCharacters = useComputed$(() => {
    return filterCharacters(
      allCharacters,
      searchQuery.value,
      scriptFilter.value,
    );
  });

  useOnDocument(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        document
          .querySelector<HTMLInputElement>("[data-search-input]")
          ?.focus();
      }
    }),
  );

  return (
    <div class="min-h-screen">
      <PageHeader
        title="Central & Eastern Europe"
        subtitle="Slavic, Hungarian, Romanian, and Turkish characters including Latin diacritics and Cyrillic scripts."
        breadcrumbs={[
          { label: "Languages", href: "/languages" },
          { label: "Central & Eastern Europe" },
        ]}
      />

      <section class="container mx-auto px-4 pb-16">
        <SearchFilter
          searchQuery={searchQuery}
          scriptFilter={scriptFilter}
          showScriptFilter={true}
        />
        <ResultsCount
          showing={filteredCharacters.value.length}
          total={allCharacters.length}
        />
        <CharacterGrid
          characters={filteredCharacters.value}
          highlightQuery={searchQuery.value}
        />
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Central & Eastern Europe Characters - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Learn Central and Eastern European alphabet characters including Polish, Czech, Hungarian, Romanian, Bulgarian, Ukrainian, and Russian scripts for GeoGuessr.",
    },
  ],
};
