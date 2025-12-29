import { component$ } from "@builder.io/qwik";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";

export const Hero = component$(() => {
  return (
    <section class="container mx-auto px-4 py-20 md:py-28 text-center">
      {/* Logo with subtle glow animation */}
      <div
        class="flex justify-center mb-10 opacity-0"
        style="animation: fade-in-up 0.6s ease-out 0.1s forwards"
      >
        <div class="animate-glow-pulse">
          <GeoHintsLogo height={80} width={320} />
        </div>
      </div>

      {/* Main heading with staggered fade-in */}
      <h1
        class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0"
        style="animation: fade-in-up 0.6s ease-out 0.25s forwards"
      >
        Master{" "}
        <span class="text-qwik-light-blue relative">
          GeoGuessr
          {/* Subtle underline accent */}
          <span
            class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-qwik-light-blue to-qwik-light-purple rounded-full"
            aria-hidden="true"
          />
        </span>{" "}
        with Visual Clues
      </h1>

      {/* Subtitle */}
      <p
        class="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed opacity-0"
        style="animation: fade-in-up 0.6s ease-out 0.4s forwards"
      >
        Learn to identify countries by language characters, follow cars, road
        signs, and more.
      </p>
    </section>
  );
});
