import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <main class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4">GeoHints</h1>
      <p class="text-xl text-gray-300">
        Learn to identify countries in GeoGuessr with visual clues.
      </p>
    </main>
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
  ],
};
