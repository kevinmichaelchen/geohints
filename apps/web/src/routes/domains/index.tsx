import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { type DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { PageHeader } from "~/components/ui/PageHeader";
import { useIsInitialLoad } from "~/lib/hooks";
import {
  domainEntries,
  getDomainContinents,
  type DomainEntry,
  type DomainFrequency,
  domainStats,
} from "~/data/domains";
import { LuSearch, LuX, LuStar, LuInfo } from "@qwikest/icons/lucide";

// Flag emoji helper
const getFlagEmoji = (code: string) => {
  // Handle special cases
  if (code === "UK") code = "GB";
  if (code === "EU" || code === "SU" || code === "XK") return "";

  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Frequency badge colors
const frequencyStyles: Record<DomainFrequency, string> = {
  common: "bg-teal/20 text-teal-dark border-teal/30 after:content-['Common'] after:sr-only",
  uncommon:
    "bg-antique-gold/20 text-sepia border-antique-gold/30 after:content-['Uncommon'] after:sr-only",
  rare: "bg-ink/10 text-ink-faded border-ink/20 after:content-['Rare'] after:sr-only",
};

const frequencyLabels: Record<DomainFrequency, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
};

export default component$(() => {
  const isInitialLoad = useIsInitialLoad();
  const loc = useLocation();
  const nav = useNavigate();

  // Search query state
  const searchQuery = useSignal("");

  // Read continent filter from URL params
  const selectedContinent = useComputed$(() => {
    const param = loc.url.searchParams.get("continent");
    const continents = getDomainContinents();
    if (param && continents.includes(param)) {
      return param;
    }
    return null;
  });

  // Read frequency filter from URL params
  const selectedFrequency = useComputed$(() => {
    const param = loc.url.searchParams.get("frequency");
    if (param && ["common", "uncommon", "rare"].includes(param)) {
      return param as DomainFrequency;
    }
    return null;
  });

  // Filter and search domains
  const filteredDomains = useComputed$(() => {
    let results = domainEntries;

    // Apply continent filter
    if (selectedContinent.value) {
      results = results.filter((d) => d.continent === selectedContinent.value);
    }

    // Apply frequency filter
    if (selectedFrequency.value) {
      results = results.filter((d) => d.frequency === selectedFrequency.value);
    }

    // Apply search
    const query = searchQuery.value.toLowerCase().replace(/^\./, "");
    if (query) {
      results = results.filter(
        (d) =>
          d.tld.includes(query) ||
          d.name.toLowerCase().includes(query) ||
          d.code.toLowerCase().includes(query),
      );

      // Sort results: exact TLD matches first, then by relevance
      results = results.sort((a, b) => {
        const aExactTld = a.tld === query;
        const bExactTld = b.tld === query;
        const aTldStarts = a.tld.startsWith(query);
        const bTldStarts = b.tld.startsWith(query);
        const aNameStarts = a.name.toLowerCase().startsWith(query);
        const bNameStarts = b.name.toLowerCase().startsWith(query);

        // Exact TLD match first
        if (aExactTld && !bExactTld) return -1;
        if (!aExactTld && bExactTld) return 1;

        // TLD starts with query
        if (aTldStarts && !bTldStarts) return -1;
        if (!aTldStarts && bTldStarts) return 1;

        // Country name starts with query
        if (aNameStarts && !bNameStarts) return -1;
        if (!aNameStarts && bNameStarts) return 1;

        // Alphabetical by name
        return a.name.localeCompare(b.name);
      });
    }

    return results;
  });

  // Clear search handler
  const clearSearch = $(() => {
    searchQuery.value = "";
  });

  // Navigation handlers
  const navigateToContinent = $((continent: string | null) => {
    const params = new URLSearchParams(loc.url.searchParams);
    if (continent) {
      params.set("continent", continent);
    } else {
      params.delete("continent");
    }
    const queryString = params.toString();
    nav(`/domains${queryString ? `?${queryString}` : ""}`);
  });

  const navigateToFrequency = $((frequency: DomainFrequency | null) => {
    const params = new URLSearchParams(loc.url.searchParams);
    if (frequency) {
      params.set("frequency", frequency);
    } else {
      params.delete("frequency");
    }
    const queryString = params.toString();
    nav(`/domains${queryString ? `?${queryString}` : ""}`);
  });

  const continents = getDomainContinents();

  // Animation styles
  const searchStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out forwards" }
    : {};
  const filtersStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out 0.05s forwards" }
    : {};
  const statsStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out 0.1s forwards" }
    : {};
  const tableStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out 0.15s forwards" }
    : {};

  return (
    <div class="min-h-screen">
      <PageHeader
        title="Domain Extensions"
        subtitle="Identify countries from website URLs visible in GeoGuessr street view. Each country has a unique domain extension that reveals its location."
        breadcrumbs={[{ label: "Domains" }]}
      />

      <div class="container mx-auto px-4 pb-16">
        {/* Search input */}
        <div class="mb-6" style={searchStyle}>
          <div class="relative max-w-md">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-burnt-sienna/60">
              <LuSearch class="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by domain (.de) or country (Germany)..."
              value={searchQuery.value}
              onInput$={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
              }}
              class="w-full pl-12 pr-10 py-3 bg-parchment-light border border-burnt-sienna/30 rounded-sm text-ink placeholder:text-ink-faded/60 focus:outline-none focus:border-burnt-sienna focus:ring-1 focus:ring-burnt-sienna/30 transition-colors"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            />
            {searchQuery.value && (
              <button
                type="button"
                onClick$={clearSearch}
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-faded hover:text-burnt-sienna transition-colors"
                aria-label="Clear search"
              >
                <LuX class="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters row */}
        <div class="space-y-4 mb-8" style={filtersStyle}>
          {/* Continent filters */}
          <div class="flex flex-wrap gap-2">
            <span
              class="text-sm text-ink-faded py-2 pr-2"
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
            >
              Region:
            </span>
            <button
              type="button"
              class={[
                "px-4 py-2 rounded-sm text-sm transition-colors border",
                selectedContinent.value === null
                  ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                  : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
              ]}
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              onClick$={() => navigateToContinent(null)}
            >
              All
            </button>
            {continents.map((continent) => (
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
                onClick$={() => navigateToContinent(continent)}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Frequency filters */}
          <div class="flex flex-wrap gap-2">
            <span
              class="text-sm text-ink-faded py-2 pr-2"
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
            >
              Frequency:
            </span>
            <button
              type="button"
              class={[
                "px-4 py-2 rounded-sm text-sm transition-colors border",
                selectedFrequency.value === null
                  ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                  : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
              ]}
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              onClick$={() => navigateToFrequency(null)}
            >
              All
            </button>
            {(["common", "uncommon", "rare"] as DomainFrequency[]).map((freq) => (
              <button
                key={freq}
                type="button"
                class={[
                  "px-4 py-2 rounded-sm text-sm transition-colors border capitalize",
                  selectedFrequency.value === freq
                    ? "bg-burnt-sienna text-parchment-light border-burnt-sienna font-semibold"
                    : "bg-parchment-light text-ink border-burnt-sienna/30 hover:border-burnt-sienna/60 hover:bg-parchment",
                ]}
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                onClick$={() => navigateToFrequency(freq)}
              >
                {frequencyLabels[freq]} ({domainStats[freq]})
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div
          class="flex items-center gap-4 mb-6 text-sm text-ink-faded"
          style={{ ...statsStyle, fontFamily: "'Crimson Text', Georgia, serif" }}
        >
          <span>
            Showing <strong class="text-ink">{filteredDomains.value.length}</strong> of{" "}
            {domainStats.total} domains
          </span>
          {searchQuery.value && (
            <span class="italic">
              matching "<span class="text-burnt-sienna">{searchQuery.value}</span>"
            </span>
          )}
        </div>

        {/* Domains table */}
        <div
          class="bg-parchment-light border border-burnt-sienna/20 rounded-sm overflow-hidden shadow-sm"
          style={tableStyle}
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-burnt-sienna/10 border-b border-burnt-sienna/20">
                  <th
                    class="px-4 py-3 text-left text-sm font-semibold text-ink"
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                  >
                    Domain
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-semibold text-ink"
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                  >
                    Country
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-semibold text-ink hidden sm:table-cell"
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                  >
                    Region
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-semibold text-ink hidden md:table-cell"
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                  >
                    Frequency
                  </th>
                  <th
                    class="px-4 py-3 text-left text-sm font-semibold text-ink hidden lg:table-cell"
                    style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDomains.value.map((domain, index) => (
                  <DomainRow key={domain.code} domain={domain} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredDomains.value.length === 0 && (
            <div class="px-4 py-12 text-center">
              <p
                class="text-ink-faded italic"
                style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
              >
                No domains found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Legend / Help section */}
        <div
          class="mt-8 p-6 bg-parchment-light/50 border border-burnt-sienna/15 rounded-sm"
          style={tableStyle}
        >
          <h3
            class="text-lg font-semibold text-ink mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            <LuInfo class="w-5 h-5 text-burnt-sienna" />
            Understanding Domain Frequency
          </h3>
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
          >
            <div class="flex items-start gap-3">
              <span class={`px-2 py-0.5 rounded-sm text-xs border ${frequencyStyles.common}`}>
                Common
              </span>
              <p class="text-ink-faded">
                Frequently seen in GeoGuessr. Countries with extensive Street View coverage.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class={`px-2 py-0.5 rounded-sm text-xs border ${frequencyStyles.uncommon}`}>
                Uncommon
              </span>
              <p class="text-ink-faded">
                Occasionally visible. Limited coverage or less prominent web presence.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class={`px-2 py-0.5 rounded-sm text-xs border ${frequencyStyles.rare}`}>
                Rare
              </span>
              <p class="text-ink-faded">
                Rarely encountered. Minimal or no Street View coverage in that country.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Individual domain row component
const DomainRow = component$<{ domain: DomainEntry; index: number }>(({ domain, index }) => {
  const flag = getFlagEmoji(domain.code);

  return (
    <tr
      class={[
        "border-b border-burnt-sienna/10 hover:bg-burnt-sienna/5 transition-colors",
        domain.frequency === "common" && "bg-teal/[0.03]",
      ]}
    >
      {/* Domain */}
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          <code
            class={[
              "px-2 py-1 rounded-sm text-base font-mono font-semibold",
              domain.frequency === "common"
                ? "bg-teal/15 text-teal-dark border border-teal/20"
                : "bg-burnt-sienna/10 text-sepia border border-burnt-sienna/15",
            ]}
          >
            .{domain.tld}
          </code>
          {domain.frequency === "common" && (
            <LuStar
              class="w-4 h-4 text-antique-gold fill-antique-gold/30"
              aria-label="Common in GeoGuessr"
            />
          )}
        </div>
      </td>

      {/* Country */}
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          {flag && <span class="text-xl">{flag}</span>}
          <span class="text-ink" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            {domain.name}
          </span>
        </div>
      </td>

      {/* Region */}
      <td
        class="px-4 py-3 text-ink-faded hidden sm:table-cell"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        {domain.continent}
      </td>

      {/* Frequency */}
      <td class="px-4 py-3 hidden md:table-cell">
        <span class={`px-2 py-0.5 rounded-sm text-xs border ${frequencyStyles[domain.frequency]}`}>
          {frequencyLabels[domain.frequency]}
        </span>
      </td>

      {/* Notes */}
      <td
        class="px-4 py-3 text-ink-faded text-sm hidden lg:table-cell max-w-xs"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        {domain.mnemonic && <span class="text-burnt-sienna italic">"{domain.mnemonic}"</span>}
        {domain.mnemonic && domain.note && " — "}
        {domain.note && <span>{domain.note}</span>}
      </td>
    </tr>
  );
});

export const head: DocumentHead = {
  title: "Domain Extensions - GeoHints",
  meta: [
    {
      name: "description",
      content:
        "Identify countries by their domain extensions (.de, .jp, .br) to improve your GeoGuessr skills. Quick reference for ccTLDs visible in street view.",
    },
  ],
};
