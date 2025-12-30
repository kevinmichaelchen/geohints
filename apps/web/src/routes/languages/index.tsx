import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "~/components/ui/PageHeader";
import { RegionCard } from "~/components/ui/RegionCard";

const regions = [
  {
    title: "Northern Europe",
    description: "Nordic and Baltic countries with distinctive characters like Å, Ø, Æ, and Þ",
    href: "/languages/europe/northern",
    countries: ["🇮🇸", "🇳🇴", "🇸🇪", "🇩🇰", "🇫🇮", "🇪🇪", "🇱🇻", "🇱🇹"],
  },
  {
    title: "Central & Eastern Europe",
    description: "Slavic, Hungarian, Romanian, and Turkish characters including Cyrillic scripts",
    href: "/languages/europe/central-eastern",
    countries: ["🇵🇱", "🇨🇿", "🇭🇺", "🇷🇴", "🇧🇬", "🇺🇦", "🇷🇺", "🇹🇷"],
  },
];

export default component$(() => {
  return (
    <div class="min-h-screen">
      <PageHeader
        title="Language Characters"
        subtitle="Identify countries by unique alphabet characters and diacritical marks. Each region features distinctive letters that help narrow down your location."
        breadcrumbs={[{ label: "Languages" }]}
      />

      <section class="container mx-auto px-4 pb-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {regions.map((region, index) => (
            <RegionCard key={region.href} {...region} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Language Characters - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Learn to identify countries by unique alphabet characters and diacritical marks in GeoGuessr.",
    },
  ],
};
