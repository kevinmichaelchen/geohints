import { component$ } from "@builder.io/qwik";
import { CategoryCard } from "~/components/ui/CategoryCard";
import { useIsInitialLoad } from "~/lib/hooks";
import { R2_BASE_URL } from "~/data/bollards";

// Helper to build R2 image URLs
const bollardImg = (country: string, seq: number) =>
  `${R2_BASE_URL}/bollards/${country}/${country}-${String(seq).padStart(3, "0")}-800w.webp`;
const followCarImg = (country: string, hash: string) =>
  `${R2_BASE_URL}/follow-cars/${country}/${hash}-800w.webp`;

const categories = [
  // Categories with content
  {
    title: "Languages",
    description: "Identify countries by unique alphabet characters",
    href: "/languages",
    imageSrc: followCarImg("ke", "243bed95"),
  },
  {
    title: "Follow Cars",
    description: "Recognize Google coverage vehicles by country",
    href: "/follow",
    imageSrc: followCarImg("ng", "aef63ea7"),
  },
  {
    title: "Bollards",
    description: "Learn bollard styles unique to each country",
    href: "/bollards",
    imageSrc: bollardImg("au", 1),
  },
  {
    title: "Domains",
    description: "Identify countries by website URL extensions",
    href: "/domains",
    imageSrc: bollardImg("ch", 1),
  },
  // Coming soon categories
  {
    title: "License Plates",
    description: "Identify countries by license plate designs",
    href: "/license-plates",
    imageSrc: bollardImg("de", 1),
    comingSoon: true,
  },
  {
    title: "Road Lines",
    description: "Road line colors and patterns by region",
    href: "/road-lines",
    imageSrc: bollardImg("fr", 1),
    comingSoon: true,
  },
  {
    title: "Street Signs",
    description: "Street sign styles across different countries",
    href: "/street-signs",
    imageSrc: bollardImg("jp", 1),
    comingSoon: true,
  },
  {
    title: "Utility Poles",
    description: "Utility pole designs and patterns",
    href: "/utility-poles",
    imageSrc: bollardImg("us", 1),
    comingSoon: true,
  },
  {
    title: "Phone Booths",
    description: "Classic phone booth styles by country",
    href: "/phone-booths",
    imageSrc: bollardImg("gb", 1),
    comingSoon: true,
  },
  {
    title: "Post Boxes",
    description: "Post box colors and designs",
    href: "/post-boxes",
    imageSrc: bollardImg("it", 1),
    comingSoon: true,
  },
  {
    title: "Crosswalks",
    description: "Crosswalk patterns and markings",
    href: "/crosswalks",
    imageSrc: bollardImg("nl", 1),
    comingSoon: true,
  },
  {
    title: "Guardrails",
    description: "Highway guardrail styles",
    href: "/guardrails",
    imageSrc: bollardImg("es", 1),
    comingSoon: true,
  },
  {
    title: "Road Markings",
    description: "Distinctive road marking patterns",
    href: "/road-markings",
    imageSrc: bollardImg("se", 1),
    comingSoon: true,
  },
  {
    title: "Traffic Lights",
    description: "Traffic light designs and mounting styles",
    href: "/traffic-lights",
    imageSrc: bollardImg("ca", 1),
    comingSoon: true,
  },
  {
    title: "House Numbers",
    description: "House numbering systems and styles",
    href: "/house-numbers",
    imageSrc: bollardImg("be", 1),
    comingSoon: true,
  },
  {
    title: "Google Cars",
    description: "Identify official Google Street View cars",
    href: "/google-cars",
    imageSrc: followCarImg("us", "66e09dbb"),
    comingSoon: true,
  },
  {
    title: "Vegetation",
    description: "Flora and vegetation patterns by region",
    href: "/vegetation",
    imageSrc: bollardImg("br", 1),
    comingSoon: true,
  },
  {
    title: "Architecture",
    description: "Building styles and architectural patterns",
    href: "/architecture",
    imageSrc: bollardImg("gr", 1),
    comingSoon: true,
  },
  {
    title: "Road Surfaces",
    description: "Road surface types and conditions",
    href: "/road-surfaces",
    imageSrc: bollardImg("ru", 1),
    comingSoon: true,
  },
  {
    title: "Road Signs",
    description: "Traffic and road sign designs",
    href: "/road-signs",
    imageSrc: bollardImg("pl", 1),
    comingSoon: true,
  },
  {
    title: "Speed Limits",
    description: "Speed limit sign styles and units",
    href: "/speed-limits",
    imageSrc: bollardImg("at", 1),
    comingSoon: true,
  },
  {
    title: "Scripts",
    description: "Writing systems and character sets",
    href: "/scripts",
    imageSrc: bollardImg("kr", 1),
    comingSoon: true,
  },
  {
    title: "Text Analyzer",
    description: "Paste text to identify possible countries",
    href: "/analyze",
    imageSrc: followCarImg("ke", "3fa4424f"),
    comingSoon: true,
  },
];

export const CategoryGrid = component$(() => {
  const isInitialLoad = useIsInitialLoad();

  const headingStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out forwards" }
    : {};

  return (
    <section class="@container container mx-auto px-4 py-12 md:py-20">
      {/* Section heading with vintage ornament */}
      <div class="text-center mb-12" style={headingStyle}>
        {/* Decorative top ornament */}
        <svg
          width="120"
          height="20"
          viewBox="0 0 120 20"
          class="mx-auto mb-4 text-burnt-sienna opacity-40"
        >
          <path d="M0,10 L40,10" stroke="currentColor" stroke-width="1" />
          <path d="M80,10 L120,10" stroke="currentColor" stroke-width="1" />
          <circle cx="60" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="60" cy="10" r="2" fill="currentColor" />
          <path d="M45,10 L52,6 L52,14 Z" fill="currentColor" opacity="0.5" />
          <path d="M75,10 L68,6 L68,14 Z" fill="currentColor" opacity="0.5" />
        </svg>

        <h2
          class="text-2xl md:text-3xl font-bold text-ink tracking-tight"
          style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
        >
          Explorer's Compendium
        </h2>

        <p
          class="text-ink-faded mt-2 italic"
          style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
        >
          A collection of visual guides for the discerning traveler
        </p>
      </div>

      {/* Cards grid - slightly looser for "scattered papers" feel */}
      <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-8 md:gap-10">
        {categories.map((cat, index) => (
          <CategoryCard key={cat.href} {...cat} index={index} />
        ))}
      </div>
    </section>
  );
});
