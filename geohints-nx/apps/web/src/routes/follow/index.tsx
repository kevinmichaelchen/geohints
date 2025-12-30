import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "~/components/ui/PageHeader";
import { useIsInitialLoad } from "~/lib/hooks";

// R2 bucket base URL (same as bollards)
const R2_BASE_URL = 'https://pub-3d7bacd76def438caae68643612e60f9.r2.dev';

interface Country {
  name: string;
  code: string;
  numImages: number;
  description: string;
  /** Set to true if images are available in R2 */
  imagesAvailable: boolean;
}

const countries: Country[] = [
  {
    name: "Kenya",
    code: "KE",
    numImages: 5,
    description: "White Toyota Land Cruisers with roof racks and snorkels",
    imagesAvailable: false, // TODO: Upload to R2
  },
  {
    name: "Nigeria",
    code: "NG",
    numImages: 16,
    description: "Various vehicles including white SUVs and sedans",
    imagesAvailable: false, // TODO: Upload to R2
  },
];

/**
 * Get R2 URL for a follow car image
 */
function getFollowCarImageUrl(
  countryCode: string,
  sequence: number,
  size: 400 | 800 | 1200 = 800
): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, '0');
  return `${R2_BASE_URL}/follow-cars/${cc}/${cc}-${seq}-${size}w.webp`;
}

/**
 * Get srcset for a follow car image
 */
function getFollowCarSrcset(countryCode: string, sequence: number): string {
  const cc = countryCode.toLowerCase();
  const seq = String(sequence).padStart(3, '0');
  const base = `${R2_BASE_URL}/follow-cars/${cc}/${cc}-${seq}`;
  return `${base}-400w.webp 400w, ${base}-800w.webp 800w, ${base}-1200w.webp 1200w`;
}

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

  return (
    <div class="min-h-screen">
      <PageHeader
        title="Follow Cars"
        subtitle="Recognize Google Street View coverage vehicles by country. Each region uses distinctive vehicles that help identify your location."
        breadcrumbs={[{ label: "Follow Cars" }]}
      />

      <div class="container mx-auto px-4 pb-16 space-y-16">
        {countries.map((country, countryIndex) => {
          const sectionStyle = isInitialLoad
            ? {
                opacity: 0,
                animation: `fade-in-up 0.4s ease-out ${countryIndex * 0.1}s forwards`,
              }
            : {};

          return (
            <section key={country.code} style={sectionStyle}>
              {/* Country header */}
              <div class="flex items-center gap-4 mb-6">
                <span class="text-4xl">{getFlagEmoji(country.code)}</span>
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold">{country.name}</h2>
                  <p class="text-gray-400 text-sm mt-1">{country.description}</p>
                </div>
              </div>

              {/* Image grid or placeholder */}
              {country.imagesAvailable ? (
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {new Array(country.numImages).fill(0).map((_, i) => {
                    const imageStyle = isInitialLoad
                      ? {
                          opacity: 0,
                          animation: `fade-in-up 0.3s ease-out ${countryIndex * 0.1 + (i % 10) * 0.02}s forwards`,
                        }
                      : {};

                    return (
                      <div
                        key={i}
                        class="group relative rounded-lg overflow-hidden bg-qwik-dirty-black/60"
                        style={imageStyle}
                      >
                        {/* Gradient border on hover */}
                        <div
                          class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                          style="background: linear-gradient(135deg, rgba(24,182,246,0.4), rgba(172,127,244,0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                          aria-hidden="true"
                        />

                        <div class="aspect-video relative overflow-hidden">
                          <img
                            src={getFollowCarImageUrl(country.code, i + 1)}
                            srcset={getFollowCarSrcset(country.code, i + 1)}
                            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                            width={400}
                            height={250}
                            alt={`Follow car for ${country.name} - Example ${i + 1}`}
                            class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
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
              ) : (
                <div class="bg-qwik-dirty-black/40 rounded-lg p-8 text-center">
                  <p class="text-gray-400">
                    Images coming soon. We're working on uploading {country.numImages} images for {country.name}.
                  </p>
                </div>
              )}
          </section>
          );
        })}
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
