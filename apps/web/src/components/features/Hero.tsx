import { component$ } from "@builder.io/qwik";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";
import { useIsInitialLoad } from "~/lib/hooks";

export const Hero = component$(() => {
  const isInitialLoad = useIsInitialLoad();

  // Animation styles - only on initial load
  const compassStyle = isInitialLoad
    ? { opacity: 0, animation: "stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }
    : {};
  const logoStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out 0.2s forwards" }
    : {};
  const headingStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out 0.3s forwards" }
    : {};
  const subtitleStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.5s ease-out 0.4s forwards" }
    : {};
  const dividerStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in 0.6s ease-out 0.5s forwards" }
    : {};

  return (
    <section class="container mx-auto px-4 py-12 md:py-20 text-center relative">
      {/* Decorative compass rose - top left */}
      <div
        class="absolute top-4 left-4 md:top-8 md:left-8 opacity-20 pointer-events-none"
        style={compassStyle}
        aria-hidden="true"
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          fill="none"
          class="text-burnt-sienna md:w-20 md:h-20"
        >
          <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="1" fill="none" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="0.5" fill="none" />
          <path
            d="M50 5 L50 20 M50 80 L50 95 M5 50 L20 50 M80 50 L95 50"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path d="M50 25 L55 50 L50 75 L45 50 Z" fill="currentColor" opacity="0.6" />
          <path d="M25 50 L50 45 L75 50 L50 55 Z" fill="currentColor" opacity="0.3" />
          <text
            x="50"
            y="18"
            text-anchor="middle"
            fill="currentColor"
            font-size="8"
            font-family="serif"
          >
            N
          </text>
          <text
            x="50"
            y="92"
            text-anchor="middle"
            fill="currentColor"
            font-size="8"
            font-family="serif"
          >
            S
          </text>
          <text
            x="8"
            y="53"
            text-anchor="middle"
            fill="currentColor"
            font-size="8"
            font-family="serif"
          >
            W
          </text>
          <text
            x="92"
            y="53"
            text-anchor="middle"
            fill="currentColor"
            font-size="8"
            font-family="serif"
          >
            E
          </text>
        </svg>
      </div>

      {/* Logo */}
      <div class="flex justify-center mb-8" style={logoStyle}>
        <GeoHintsLogo height={80} width={320} />
      </div>

      {/* Main heading with vintage underline */}
      <h1
        class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-ink"
        style={headingStyle}
      >
        Master{" "}
        <span class="text-burnt-sienna relative inline-block">
          GeoGuessr
          {/* Hand-drawn style underline */}
          <svg
            class="absolute -bottom-2 left-0 w-full h-3"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,6 Q10,2 20,6 T40,6 T60,6 T80,6 T100,6"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              class="text-antique-gold"
            />
          </svg>
        </span>{" "}
        with Visual Clues
      </h1>

      {/* Subtitle */}
      <p
        class="text-lg md:text-xl lg:text-2xl text-ink-faded max-w-2xl mx-auto leading-relaxed italic"
        style={subtitleStyle}
      >
        An explorer's guide to identifying countries by language characters, follow cars, road
        signs, and more.
      </p>

      {/* Decorative divider */}
      <div class="flex justify-center mt-10" style={dividerStyle}>
        <svg width="200" height="20" viewBox="0 0 200 20" class="text-burnt-sienna opacity-40">
          <path d="M0,10 L70,10 M130,10 L200,10" stroke="currentColor" stroke-width="1" />
          <circle cx="100" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="100" cy="10" r="1.5" fill="currentColor" />
          <path d="M75,10 L85,5 L85,15 Z" fill="currentColor" opacity="0.6" />
          <path d="M125,10 L115,5 L115,15 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </section>
  );
});
