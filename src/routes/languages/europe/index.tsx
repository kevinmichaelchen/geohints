import {
  component$,
  useSignal,
  $,
  useVisibleTask$,
  useComputed$,
} from "@builder.io/qwik";

// Function to group characters by their first letter
function groupCharsByFirstLetter(chars: Record<string, string[]>) {
  const groups: Record<string, Record<string, string[]>> = {};

  Object.entries(chars).forEach(([char, countries]) => {
    // Get the first letter and use it as a group key
    let firstLetter = char[0].toUpperCase();

    // Special handling for Cyrillic characters - group them together
    if (/[\u0400-\u04FF]/.test(firstLetter)) {
      firstLetter = "Cyrillic";
    }

    if (!groups[firstLetter]) {
      groups[firstLetter] = {};
    }

    groups[firstLetter][char] = countries;
  });

  return groups;
}

// Combined characters from both Northern and Central/Eastern Europe
const chars = {
  // Northern Europe characters
  Áá: ["is"],
  Åå: ["dk", "fi", "no", "se"],
  Ää: ["ee", "fi", "se", "sk"],
  Āā: ["lv"],
  Ąą: ["lt", "pl"],
  Čč: ["lv", "lt", "cz", "hr", "sk", "si"],
  Ðð: ["is"],
  Ėė: ["lt"],
  Éé: ["is", "no", "cz", "hu", "sk"],
  Ēē: ["lv"],
  Ęę: ["lt", "pl"],
  Ģģ: ["lv"],
  Íí: ["is", "cz", "hu", "sk"],
  Īī: ["lv"],
  Įį: ["lt"],
  Ķķ: ["lv"],
  Ļļ: ["lv"],
  Ņņ: ["lv"],
  Øø: ["dk", "no"],
  Óó: ["is", "cz", "hu", "pl", "sk"],
  Öö: ["ee", "fi", "is", "se", "hu", "tr"],
  Õõ: ["ee"],
  Ůů: ["cz"],
  Ūū: ["lv", "lt"],
  Ųų: ["lt"],
  Šš: ["ee", "lv", "lt", "cz", "hr", "me", "rs", "sk", "si"],
  Úú: ["is", "cz", "hu", "sk"],
  Üü: ["ee", "hu", "tr"],
  Ww: ["dk", "ee", "fi", "no", "se", "pl", "ro", "sk"],
  Xx: ["dk", "ee", "fi", "is", "no", "se"],
  Yy: [
    "dk",
    "ee",
    "fi",
    "is",
    "lt",
    "no",
    "se",
    "al",
    "bg",
    "cz",
    "hu",
    "me",
    "mk",
    "pl",
    "ro",
    "ru",
    "sk",
    "tr",
    "ua",
  ],
  Ýý: ["is", "cz", "sk"],
  Žž: ["ee", "lv", "lt", "cz", "hr", "me", "rs", "sk", "si"],
  Ææ: ["dk", "is", "no"],
  Þþ: ["is"],

  // Additional Central/Eastern Europe characters
  Ăă: ["ro"],
  Ââ: ["ro"],
  Ćć: ["hr", "me", "pl", "rs"],
  Çç: ["al", "mk", "tr"],
  Ďď: ["cz", "sk"],
  Đđ: ["hr", "me"],
  Ёё: ["al", "mk", "ru"],
  Ěě: ["cz"],
  Ğğ: ["tr"],
  Ii: [
    "al",
    "cz",
    "hr",
    "hu",
    "me",
    "mk",
    "pl",
    "ro",
    "rs",
    "sk",
    "si",
    "tr",
    "ua",
  ],
  Її: ["ua"],
  Îî: ["ro"],
  Jj: ["al", "cz", "hr", "hu", "me", "mk", "pl", "ro", "rs", "sk", "si"],
  Ќќ: ["mk"],
  Ĺĺ: ["sk"],
  Ľľ: ["sk"],
  Łł: ["pl"],
  Ňň: ["cz", "sk"],
  Őő: ["hu"],
  Ôô: ["sk"],
  Qq: ["dk", "ee", "fi", "no", "se", "al", "cz", "hu", "mk", "ro"],
  Ŕŕ: ["sk"],
  Řř: ["cz"],
  Ѕѕ: ["al", "cz", "hr", "hu", "me", "mk", "pl", "ro", "rs", "sk", "si", "tr"],
  Śś: ["me", "pl"],
  Șș: ["ro", "tr"],
  Ťť: ["cz", "sk"],
  Țț: ["ro"],
  Űű: ["hu"],
  Żż: ["pl"],
  Źź: ["me", "pl"],

  // Cyrillic characters
  Хх: ["al", "bg", "cz", "hu", "me", "mk", "ro", "ru", "rs", "sk", "ua"],
  Бб: ["bg", "me", "mk", "ru", "rs", "ua"],
  Цц: ["bg", "me", "mk", "ru", "rs", "ua"],
  Џџ: ["me", "mk", "rs"],
  Чч: ["bg", "me", "mk", "ru", "rs", "ua"],
  Дд: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ћћ: ["me", "rs"],
  Ђђ: ["me", "rs"],
  Єє: ["ua"],
  Ээ: ["ru"],
  Ии: ["bg", "me", "mk", "ru", "rs", "ua"],
  Йй: ["bg", "ru", "ua"],
  Фф: ["bg", "me", "mk", "ru", "rs", "ua"],
  Гг: ["bg", "me", "mk", "ru", "rs", "ua"],
  Ѓѓ: ["mk"],
  Ґґ: ["ua"],
  Зз: ["bg", "me", "mk", "ru", "rs", "ua"],
  З́з́: ["me", "mk"],
  Шш: ["bg", "me", "mk", "ru", "rs", "ua"],
  Щщ: ["bg", "ru", "ua"],
  Юю: ["bg", "ru", "ua"],
  Яя: ["bg", "ru", "ua"],
  Ьь: ["bg", "ru", "ua"],
  Ъъ: ["bg", "ru"],
  Ыы: ["ru"],
  Љљ: ["me", "mk", "rs"],
  Њњ: ["me", "mk", "rs"],
};

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default component$(() => {
  // Signal to track which section is currently active in the TOC
  const activeSection = useSignal<string>("");

  // Signal for the search input
  const searchQuery = useSignal("");

  // Group characters by their first letter
  const charGroups = groupCharsByFirstLetter(chars);

  // Filter characters based on search query
  const filteredCharGroups = useComputed$(() => {
    if (!searchQuery.value.trim()) return charGroups;

    const result: Record<string, Record<string, string[]>> = {};
    const query = searchQuery.value.toLowerCase();

    Object.entries(charGroups).forEach(([groupKey, groupChars]) => {
      const filteredGroup: Record<string, string[]> = {};

      Object.entries(groupChars).forEach(([char, countries]) => {
        // Check if the character contains the search query
        if (char.toLowerCase().includes(query)) {
          filteredGroup[char] = countries;
        } else {
          // Check if any country names contain the search query
          const matchingCountries = countries.filter((code) => {
            const countryName = new Intl.DisplayNames(["en"], {
              type: "region",
            })
              .of(code.toUpperCase())
              ?.toLowerCase();
            return (
              countryName?.includes(query) || code.toLowerCase().includes(query)
            );
          });

          if (matchingCountries.length > 0) {
            filteredGroup[char] = matchingCountries;
          }
        }
      });

      if (Object.keys(filteredGroup).length > 0) {
        result[groupKey] = filteredGroup;
      }
    });

    return result;
  });

  // Get sorted group keys for the TOC
  const groupKeys = useComputed$(() => {
    return Object.keys(filteredCharGroups.value).sort((a, b) => {
      // Sort Cyrillic to the end
      if (a === "Cyrillic") return 1;
      if (b === "Cyrillic") return -1;
      return a.localeCompare(b);
    });
  });

  // Handle TOC link click
  const scrollToSection = $((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      activeSection.value = sectionId;
    }
  });

  // Setup a manual scroll tracker to highlight current section in TOC
  useVisibleTask$(({ cleanup }) => {
    // Simplest approach - just update active section on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const middlePosition = scrollPosition + windowHeight / 3; // Focus on upper third of screen

      // Find which section we're currently viewing
      let closestSection = null;
      let closestDistance = Infinity;

      // Check each section
      groupKeys.value.forEach((key) => {
        const sectionId = `section-${key}`;
        const element = document.getElementById(sectionId);

        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;

          // Check if section is visible
          if (sectionTop <= middlePosition && sectionBottom >= scrollPosition) {
            // Calculate how close the section is to the middle of our view
            const distance = Math.abs(sectionTop - middlePosition);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = sectionId;
            }
          }
        }
      });

      // Update active section if we found one
      if (closestSection && closestSection !== activeSection.value) {
        activeSection.value = closestSection;

        // Only auto-scroll the sidebar on desktop layouts (md and up)
        // This prevents the annoying snap-back on mobile
        const isMobile = window.innerWidth < 768; // md breakpoint in Tailwind

        if (!isMobile) {
          // Only auto-scroll on desktop to avoid interfering with mobile scrolling
          const activeButton = document.querySelector(
            `button[class*="bg-blue-100"]`,
          );
          if (activeButton && activeButton.parentElement) {
            activeButton.scrollIntoView({
              block: "nearest",
              inline: "nearest",
              behavior: "smooth",
            });
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial call
    setTimeout(handleScroll, 100); // Small delay to ensure DOM is ready

    // Clean up event listeners
    cleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    });
  });

  // This section previously contained legend generation code that has been removed

  return (
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold mb-4">European Languages</h1>
        <p class="mb-3">
          This page helps identify locations in GeoGuessr by showing special
          characters used in different European languages. Look for these
          distinctive characters on signs, advertisements, and other text in the
          game to narrow down your location.
        </p>

        {/* How to use section */}
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 class="font-bold text-blue-800 mb-2">How to use this page</h2>
          <ul class="space-y-2 text-sm text-blue-700">
            <li>
              • Use the sidebar on the left to quickly navigate to different
              character groups
            </li>
            <li>
              • Each card shows a special character and the countries where it
              appears
            </li>
            <li>
              • When you see a special character in GeoGuessr, find it on this
              page to identify possible countries
            </li>
            <li>
              • The more unusual characters you identify, the more you can
              narrow down your location
            </li>
          </ul>
        </div>

        {/* The Country Codes Legend has been removed */}
      </div>

      {/* Main content container with sidebar */}
      {/* Mobile jump menu - only visible on mobile */}
      <div class="md:hidden mb-4">
        <div class="p-3 bg-gray-100 rounded-lg">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
              <h2 class="font-bold text-gray-800">Jump to</h2>
              <span class="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  shape-rendering="geometricPrecision"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <div class="grid grid-cols-4 gap-1 mt-3">
              {groupKeys.value.map((key) => (
                <button
                  key={key}
                  onClick$={() => scrollToSection(`section-${key}`)}
                  class={`text-center px-2 py-1.5 rounded text-sm ${activeSection.value === `section-${key}` ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  {key}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        {/* Table of Contents - Sticky Sidebar (desktop only) */}
        <div class="hidden md:block md:w-64 flex-shrink-0">
          <div class="sticky top-4 p-4 bg-gray-100 rounded-lg max-h-[calc(100vh-32px)] overflow-y-auto">
            <h2 class="font-bold mb-3 text-gray-800">Jump to</h2>
            <div class="grid grid-cols-3 gap-1">
              {groupKeys.value.map((key) => (
                <button
                  key={key}
                  onClick$={() => scrollToSection(`section-${key}`)}
                  class={`text-center px-2 py-1.5 rounded text-sm ${activeSection.value === `section-${key}` ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div class="flex-1">
          {/* Search bar */}
          <div class="mb-6 sticky top-4 z-10 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
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
                placeholder="Search for characters, countries..."
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
            {searchQuery.value &&
              Object.keys(filteredCharGroups.value).length === 0 && (
                <p class="mt-3 text-sm text-gray-600">
                  No characters found matching "{searchQuery.value}"
                </p>
              )}
          </div>

          {searchQuery.value && (
            <div class="mb-4 pb-2 border-b border-gray-200">
              <p class="text-sm text-gray-600">
                {Object.keys(filteredCharGroups.value).length} character groups
                found for "{searchQuery.value}"
              </p>
            </div>
          )}

          {Object.keys(filteredCharGroups.value).length > 0
            ? groupKeys.value.map((key) => (
                <section
                  key={key}
                  id={`section-${key}`}
                  class="mb-10 scroll-mt-4"
                >
                  <h2 class="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
                    {key}
                  </h2>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Object.entries(filteredCharGroups.value[key]).map(
                      ([char, countries], i) => (
                        <div
                          key={i}
                          class="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div class="text-3xl lg:text-4xl mb-3 text-center">
                            {char}
                          </div>
                          <ul class="space-y-1">
                            {countries.map((code: string, i) => (
                              <li key={i}>
                                <div class="flex flex-row justify-between items-center">
                                  <span class="text-sm">
                                    {new Intl.DisplayNames(["en"], {
                                      type: "region",
                                    }).of(code.toUpperCase())}
                                  </span>
                                  <span
                                    class="text-2xl"
                                    title={new Intl.DisplayNames(["en"], {
                                      type: "region",
                                    }).of(code.toUpperCase())}
                                  >
                                    {getFlagEmoji(code)}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              ))
            : searchQuery.value && (
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
                    No results found
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No characters match your search criteria.
                  </p>
                  <div class="mt-6">
                    <button
                      onClick$={() => (searchQuery.value = "")}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
});
