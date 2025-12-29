import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { PageHeader } from "~/components/ui/PageHeader";

interface Country {
  name: string;
  code: string;
  numImages: number;
  description: string;
}

const countries: Country[] = [
  {
    name: "Kenya",
    code: "KE",
    numImages: 5,
    description: "White Toyota Land Cruisers with roof racks and snorkels",
  },
  {
    name: "Nigeria",
    code: "NG",
    numImages: 16,
    description: "Various vehicles including white SUVs and sedans",
  },
];

// Flag emoji helper
const getFlagEmoji = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default component$(() => {
  return (
    <div class="min-h-screen">
      <PageHeader
        title="Follow Cars"
        subtitle="Recognize Google Street View coverage vehicles by country. Each region uses distinctive vehicles that help identify your location."
        breadcrumbs={[{ label: "Follow Cars" }]}
      />

      <div class="container mx-auto px-4 pb-16 space-y-16">
        {countries.map((country, countryIndex) => (
          <section
            key={country.code}
            class="opacity-0"
            style={{
              animation: `fade-in-up 0.5s ease-out ${0.4 + countryIndex * 0.15}s forwards`,
            }}
          >
            {/* Country header */}
            <div class="flex items-center gap-4 mb-6">
              <span class="text-4xl">{getFlagEmoji(country.code)}</span>
              <div>
                <h2 class="text-2xl md:text-3xl font-bold">{country.name}</h2>
                <p class="text-gray-400 text-sm mt-1">{country.description}</p>
              </div>
            </div>

            {/* Image grid */}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {new Array(country.numImages).fill(0).map((_, i) => {
                const imageDelay = `${0.5 + countryIndex * 0.15 + i * 0.03}s`;
                return (
                  <div
                    key={i}
                    class="group relative rounded-lg overflow-hidden bg-qwik-dirty-black/60 opacity-0"
                    style={{ animation: `fade-in-up 0.4s ease-out ${imageDelay} forwards` }}
                  >
                    {/* Gradient border on hover */}
                    <div
                      class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                      style="background: linear-gradient(135deg, rgba(24,182,246,0.4), rgba(172,127,244,0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                      aria-hidden="true"
                    />

                    <div class="aspect-video relative overflow-hidden">
                      <Image
                        src={`/images/follow/${country.name.toLowerCase()}${i + 1}.webp`}
                        layout="constrained"
                        width={400}
                        height={250}
                        alt={`Follow car for ${country.name} - Example ${i + 1}`}
                        class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Image number badge */}
                      <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-gray-300 font-medium">
                        {i + 1}/{country.numImages}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
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
