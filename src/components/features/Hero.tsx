import { component$ } from "@builder.io/qwik";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";

export const Hero = component$(() => {
  return (
    <section class="container mx-auto px-4 py-16 text-center">
      <div class="flex justify-center mb-8">
        <GeoHintsLogo height={80} width={320} />
      </div>
      <h1 class="text-4xl md:text-6xl font-bold mb-4 text-shadow-sm">
        Master <span class="text-qwik-light-blue">GeoGuessr</span> with Visual
        Clues
      </h1>
      <p class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
        Learn to identify countries by language characters, follow cars, road
        signs, and more.
      </p>
    </section>
  );
});
