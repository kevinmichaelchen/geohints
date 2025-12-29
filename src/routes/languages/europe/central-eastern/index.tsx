import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CharacterGrid } from "~/components/features/CharacterGrid";
import { PageHeader } from "~/components/ui/PageHeader";
import { europeCentralEasternChars } from "~/data/languages";

export default component$(() => {
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
        <CharacterGrid characters={europeCentralEasternChars} />
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
