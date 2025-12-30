import { component$ } from "@builder.io/qwik";

interface GeoHintsLogoProps {
  height?: number;
  width?: number;
}

export const GeoHintsLogo = component$<GeoHintsLogoProps>(({ height = 40, width = 160 }) => {
  return (
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height={height} width={height}>
        <defs>
          <linearGradient id="globe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18B6F6" />
            <stop offset="100%" stop-color="#006ce9" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#globe)" />
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="20"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          opacity="0.6"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="20"
          ry="45"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          opacity="0.6"
        />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#fff" stroke-width="2" opacity="0.6" />
        <circle cx="65" cy="30" r="8" fill="#AC7EF4" />
        <circle cx="65" cy="30" r="4" fill="#fff" />
      </svg>
      <span class="font-bold text-xl" style={{ color: "#006ce9", width: width - height - 8 }}>
        GeoHints
      </span>
    </div>
  );
});
