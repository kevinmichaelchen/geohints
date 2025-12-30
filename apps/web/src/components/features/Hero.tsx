import { component$ } from "@builder.io/qwik";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";
import { useIsInitialLoad } from "~/lib/hooks";

export const Hero = component$(() => {
  const isInitialLoad = useIsInitialLoad();

  // Animation styles - only on initial load
  const logoStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out forwards" }
    : {};
  const headingStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out 0.1s forwards" }
    : {};
  const subtitleStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out 0.2s forwards" }
    : {};

  return (
    <section class="container mx-auto px-4 py-12 md:py-16 text-center">
      {/* Logo with subtle glow animation */}
      <div class="flex justify-center mb-6" style={logoStyle}>
        <div class="animate-glow-pulse">
          <GeoHintsLogo height={80} width={320} />
        </div>
      </div>

      {/* Main heading with staggered fade-in */}
      <h1
        class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
        style={headingStyle}
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
        class="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
        style={subtitleStyle}
      >
        Learn to identify countries by language characters, follow cars, road signs, and more.
      </p>
    </section>
  );
});
