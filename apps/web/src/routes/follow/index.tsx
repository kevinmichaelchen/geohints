import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "~/components/ui/PageHeader";
import { TableOfContents, type TOCItem } from "~/components/ui/TableOfContents";
import { useIsInitialLoad } from "~/lib/hooks";
import {
  followCarCountries,
  continents,
  getFollowCarImageUrl,
  getFollowCarSrcset,
} from "~/data/follow-cars";

// Flag emoji helper
const getFlagEmoji = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default component$(() => {
  const isInitialLoad = useIsInitialLoad();
  const selectedContinent = useSignal<string | null>(null);

  const filteredCountries = useComputed$(() => {
    if (!selectedContinent.value) return followCarCountries;
    return followCarCountries.filter((c) => c.continent === selectedContinent.value);
  });

  // Group by continent for display
  const countriesByContinent = useComputed$(() => {
    const groups: Record<string, typeof followCarCountries> = {};
    for (const country of filteredCountries.value) {
      const continent = country.continent;
      if (!groups[continent]) {
        groups[continent] = [];
      }
      groups[continent]!.push(country);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  });

  // Generate TOC items from visible continents
  const tocItems: TOCItem[] = countriesByContinent.value.map(([continent]) => ({
    id: continent.toLowerCase().replace(/\s+/g, "-"),
    label: continent,
  }));

  return (
    <div class="min-h-screen">
      <PageHeader
        title="Follow Cars"
        subtitle="Recognize Google Street View coverage vehicles by country. Each region uses distinctive vehicles that help identify your location."
        breadcrumbs={[{ label: "Follow Cars" }]}
      />

      <div class="container mx-auto px-4 pb-16">
        <div class="flex gap-8">
          {/* Main content */}
          <div class="flex-1 min-w-0">
            {/* Continent filter */}
            <div class="flex flex-wrap gap-2 mb-8">
              <button
                type="button"
                class={[
                  "px-4 py-2 rounded-sm text-sm transition-colors border",
                  selectedContinent.value === null
                    ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                    : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
                ]}
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                onClick$={() => (selectedContinent.value = null)}
              >
                All ({followCarCountries.length})
              </button>
              {continents.map((continent) => {
                const count = followCarCountries.filter((c) => c.continent === continent).length;
                return (
                  <button
                    key={continent}
                    type="button"
                    class={[
                      "px-4 py-2 rounded-sm text-sm transition-colors border",
                      selectedContinent.value === continent
                        ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                        : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
                    ]}
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                    onClick$={() => (selectedContinent.value = continent)}
                  >
                    {continent} ({count})
                  </button>
                );
              })}
            </div>

            {/* Countries grouped by continent */}
            <div class="space-y-16">
              {countriesByContinent.value.map(([continent, countries], continentIndex) => {
                const sectionStyle = isInitialLoad
                  ? {
                      opacity: 0,
                      animation: `fade-in-up 0.4s ease-out ${continentIndex * 0.1}s forwards`,
                    }
                  : {};
                const sectionId = continent.toLowerCase().replace(/\s+/g, "-");

                return (
                  <section key={continent} id={sectionId} class="scroll-mt-24" style={sectionStyle}>
                    {/* Continent header */}
                    <h2
                      class="text-xl md:text-2xl font-bold text-burnt-sienna mb-6 border-b border-burnt-sienna/20 pb-2"
                      style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                    >
                      {continent}
                    </h2>

                    {/* Countries in this continent */}
                    <div class="space-y-10">
                      {countries.map((country, countryIndex) => (
                        <div key={country.code}>
                          {/* Country header */}
                          <a
                            href={`/${country.code.toLowerCase()}`}
                            class="flex items-center gap-3 mb-4 group hover:opacity-90 transition-opacity"
                          >
                            <span class="text-3xl">{getFlagEmoji(country.code)}</span>
                            <div>
                              <h3
                                class="text-lg md:text-xl font-semibold text-ink group-hover:text-burnt-sienna transition-colors"
                                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                              >
                                {country.name}
                              </h3>
                              <p
                                class="text-ink-faded text-sm italic"
                                style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
                              >
                                {country.images.length} image
                                {country.images.length !== 1 ? "s" : ""} →
                              </p>
                            </div>
                          </a>

                          {/* Image grid */}
                          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {country.images.map((hash, i) => {
                              const imageStyle = isInitialLoad
                                ? {
                                    opacity: 0,
                                    animation: `fade-in-up 0.3s ease-out ${continentIndex * 0.1 + countryIndex * 0.05 + (i % 10) * 0.02}s forwards`,
                                  }
                                : {};

                              return (
                                <div
                                  key={hash}
                                  class="group relative rounded-sm overflow-hidden bg-parchment-light border border-burnt-sienna/15 shadow-sm hover:shadow-md transition-shadow"
                                  style={imageStyle}
                                >
                                  {/* Vintage border on hover */}
                                  <div
                                    class="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                                    style="background: linear-gradient(135deg, rgba(184,134,11,0.4), rgba(139,69,19,0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                                    aria-hidden="true"
                                  />

                                  <div class="aspect-video relative overflow-hidden">
                                    <img
                                      src={getFollowCarImageUrl(country.code, hash)}
                                      srcset={getFollowCarSrcset(country.code, hash)}
                                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                                      width={400}
                                      height={250}
                                      alt={`Follow car from ${country.name} - Example ${i + 1}`}
                                      class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                      style={{ filter: "sepia(0.1)" }}
                                      loading="lazy"
                                      decoding="async"
                                    />

                                    {/* Image number badge */}
                                    <div class="absolute bottom-2 right-2 bg-parchment/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-xs text-ink-faded font-medium border border-burnt-sienna/20">
                                      {i + 1}/{country.images.length}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Table of Contents - right sidebar */}
          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Follow Cars - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Learn to recognize Google Street View coverage vehicles by country to improve your GeoGuessr skills.",
    },
  ],
};
