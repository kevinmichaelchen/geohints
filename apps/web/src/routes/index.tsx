import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Hero } from "~/components/features/Hero";
import { CategoryGrid } from "~/components/features/CategoryGrid";

export default component$(() => {
  return (
    <>
      <Hero />
      <CategoryGrid />
    </>
  );
});

export const head: DocumentHead = {
  title: "GeoHints - GeoGuessr Learning Tool",
  meta: [
    {
      name: "description",
      content:
        "Learn to identify countries in GeoGuessr with language characters, follow cars, and visual clues.",
    },
    {
      property: "og:title",
      content: "GeoHints - Master GeoGuessr with Visual Clues",
    },
    {
      property: "og:description",
      content:
        "Learn to identify countries by language characters, follow cars, road signs, and more.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
};
