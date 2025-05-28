import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import {
  countries,
  getFlagEmoji,
  searchCountries,
  getCountriesByRegion,
} from "../../data/countries";

export default component$(() => {
  // Signal for the search input
  const searchQuery = useSignal("");
  // Signal for selected region filter
  const selectedRegion = useSignal<string>("");

  // Compute filtered countries based on search and region filter
  const filteredCountries = useComputed$(() => {
    let results = searchQuery.value
      ? searchCountries(searchQuery.value)
      : [...countries];

    // Apply region filter if selected
    if (selectedRegion.value) {
      results = results.filter(
        (country) => country.region === selectedRegion.value,
      );
    }

    return results;
  });

  // Get all countries grouped by region
  const countriesByRegion = getCountriesByRegion();
  const regions = Object.keys(countriesByRegion).sort();

  return (
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold mb-4">Country Codes</h1>
        <p class="mb-3">
          Search for countries by their ISO 3166-1 alpha-2 codes or names to
          help identify locations in GeoGuessr.
        </p>

        {/* How to use section */}
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 class="font-bold text-blue-800 mb-2">How to use this page</h2>
          <ul class="space-y-2 text-sm text-blue-700">
            <li>• Use the search box to find countries by name or code</li>
            <li>• Filter by region to narrow down your search</li>
            <li>• Each card shows a country's name, code, and flag</li>
          </ul>
        </div>
      </div>

      {/* Search and filter controls */}
      <div class="flex flex-col md:flex-row gap-4">
        {/* Search box */}
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              bind:value={searchQuery}
              class="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by country name or code..."
            />
            {searchQuery.value && (
              <button
                onClick$={() => (searchQuery.value = "")}
                class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <svg
                  class="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Region filter */}
        <div class="md:w-64">
          <select
            bind:value={selectedRegion}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results stats */}
      {searchQuery.value || selectedRegion.value ? (
        <div class="text-sm text-gray-600">
          Found {filteredCountries.value.length} countries
          {searchQuery.value && <span> matching "{searchQuery.value}"</span>}
          {selectedRegion.value && <span> in {selectedRegion.value}</span>}
        </div>
      ) : null}

      {/* Display results */}
      {filteredCountries.value.length > 0 ? (
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredCountries.value.map((country) => (
            <div
              key={country.code}
              class="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl" title={country.name}>
                  {getFlagEmoji(country.code)}
                </span>
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-yellow-800">
                  {country.code.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 class="font-semibold text-yellow-800">{country.name}</h3>
                <p class="text-sm text-yellow-600 mt-1">
                  {country.subregion ? `${country.subregion}, ` : ""}
                  {country.region}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No countries found
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
});
