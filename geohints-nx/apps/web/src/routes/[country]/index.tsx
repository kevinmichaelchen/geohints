import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "~/components/ui/PageHeader";
import { TableOfContents, type TOCItem } from "~/components/ui/TableOfContents";
import { findCountryByCode } from "~/data/countries";
import { getBollardImageUrl, getBollardSrcset } from "~/data/bollards";

// Flag emoji helper
const getFlagEmoji = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Server-side country lookup
export const useCountryData = routeLoader$(({ params, status }) => {
  const country = findCountryByCode(params.country);

  if (!country) {
    status(404);
    return null;
  }

  return country;
});

export default component$(() => {
  const countryData = useCountryData();
  const country = countryData.value;

  if (!country) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Country Not Found</h1>
          <p class="text-gray-400 mb-8">
            The country you're looking for doesn't exist in our database.
          </p>
          <a
            href="/bollards"
            class="text-qwik-blue-400 hover:underline"
          >
            Browse all countries
          </a>
        </div>
      </div>
    );
  }

  const tocItems: TOCItem[] = [
    { id: "bollards", label: "Bollards" },
    // Future sections can be added here
    // { id: "languages", label: "Languages" },
    // { id: "infrastructure", label: "Infrastructure" },
  ];

  return (
    <div class="min-h-screen">
      <PageHeader
        title={`${getFlagEmoji(country.code)} ${country.name}`}
        subtitle={`Geolocation guide for ${country.name} - ${country.continent}`}
        breadcrumbs={[
          { label: "Bollards", href: "/bollards" },
          { label: country.name },
        ]}
      />

      <div class="container mx-auto px-4 pb-16">
        <div class="flex gap-8">
          {/* Main content */}
          <div class="flex-1 min-w-0">
            {/* Bollards Section */}
            <section id="bollards" class="scroll-mt-24">
              <h2 class="text-2xl font-bold text-qwik-blue-400 mb-6 border-b border-qwik-dirty-black/40 pb-2">
                Bollards
              </h2>

              <p class="text-gray-400 mb-6">
                {country.images.length} bollard image
                {country.images.length !== 1 ? "s" : ""} from {country.name}.
              </p>

              {/* Image grid */}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {country.images.map((seq, i) => (
                  <div
                    key={seq}
                    class="group relative rounded-lg overflow-hidden bg-qwik-dirty-black/60"
                  >
                    {/* Gradient border on hover */}
                    <div
                      class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                      style="background: linear-gradient(135deg, rgba(24,182,246,0.4), rgba(172,127,244,0.4)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
                      aria-hidden="true"
                    />

                    <div class="aspect-video relative overflow-hidden">
                      <img
                        src={getBollardImageUrl(country.code, seq)}
                        srcset={getBollardSrcset(country.code, seq)}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        width={400}
                        height={250}
                        alt={`Bollard from ${country.name} - Example ${i + 1}`}
                        class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        loading={i < 6 ? "eager" : "lazy"}
                        decoding="async"
                      />

                      {/* Image number badge */}
                      <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-gray-300 font-medium">
                        {i + 1}/{country.images.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Future sections placeholder */}
            {/*
            <section id="languages" class="mt-16 scroll-mt-24">
              <h2 class="text-2xl font-bold text-qwik-blue-400 mb-6">Languages</h2>
              <p class="text-gray-400">Coming soon...</p>
            </section>
            */}
          </div>

          {/* Table of Contents - right sidebar */}
          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const country = resolveValue(useCountryData);

  if (!country) {
    return {
      title: "Country Not Found - GeoHints",
    };
  }

  return {
    title: `${country.name} - GeoHints`,
    meta: [
      {
        name: "description",
        content: `Geolocation guide for ${country.name}. Learn to identify ${country.name} by bollards, infrastructure, and more.`,
      },
    ],
  };
};
