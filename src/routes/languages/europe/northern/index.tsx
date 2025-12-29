import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CharacterGrid } from "~/components/features/CharacterGrid";
import { PageHeader } from "~/components/ui/PageHeader";
import { europeNorthernChars } from "~/data/languages";

export default component$(() => {
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
        <CharacterGrid characters={europeNorthernChars} />
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
