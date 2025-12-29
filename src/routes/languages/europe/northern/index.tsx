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
import { europeNorthernChars } from "~/data/languages";
import { entriesToArray, filterCharacters } from "~/lib/search";

const allCharacters = entriesToArray(europeNorthernChars);

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
        title="Northern Europe"
        subtitle="Nordic and Baltic characters including Icelandic Þ, Norwegian Ø, Swedish Å, and Finnish double vowels."
        breadcrumbs={[
          { label: "Languages", href: "/languages" },
          { label: "Northern Europe" },
        ]}
      />

      <section class="container mx-auto px-4 pb-16">
        <SearchFilter
          searchQuery={searchQuery}
          scriptFilter={scriptFilter}
          showScriptFilter={false}
        />
        <ResultsCount
          showing={filteredCharacters.value.length}
          total={allCharacters.length}
        />
        <CharacterGrid characters={filteredCharacters.value} />
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Northern Europe Characters - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Learn Nordic and Baltic alphabet characters to identify Iceland, Norway, Sweden, Denmark, Finland, and Baltic countries in GeoGuessr.",
    },
  ],
};
