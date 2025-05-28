import {
  component$,
  useSignal,
  useVisibleTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import {
  LuSearch,
  LuX,
  LuCommand,
  LuArrowRight,
  LuGlobe,
  LuType,
  LuAlertCircle,
  LuFlag,
  LuMapPin,
} from "@qwikest/icons/lucide";

// Import language character data
import {
  europeanCharGroups,
  LanguageCharacter,
  CharacterGroup,
  searchCharacters,
  getCountryName,
} from "../../data/languageCharacters";

// Import country data
import {
  countries,
  Country,
  getFlagEmoji,
  searchCountries,
} from "../../data/countries";

// Define the available icon names as a type
type IconName = "car" | "globe" | "type" | "alert" | "flag" | "pin";

// Map icon names to their corresponding components
const iconComponents = {
  car: LuCommand,
  globe: LuGlobe,
  type: LuType,
  alert: LuAlertCircle,
  flag: LuFlag,
  pin: LuMapPin,
} as const;

type CommandType = "navigation" | "character" | "group" | "country";

interface CommandItem {
  id: string;
  title: string;
  href: string;
  type: CommandType;
  icon?: IconName;
  description?: string;
  char?: string; // For character commands
  countries?: string[]; // For character commands
  parent?: string; // For nested commands
  children?: string[]; // For parent commands
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose$: () => void;
}

export const CommandPalette = component$<CommandPaletteProps>(
  ({ isOpen, onClose$ }) => {
    const searchInput = useSignal<HTMLInputElement>();
    const searchQuery = useSignal("");
    const selectedIndex = useSignal(0);

    // Base commands - main navigation items
    const baseCommands = useSignal<CommandItem[]>([
      {
        id: "follow",
        title: "Follow Cars",
        href: "/follow",
        icon: "car",
        type: "navigation",
      },
      {
        id: "countries",
        title: "Country Codes",
        href: "/countries",
        icon: "flag",
        type: "navigation",
        description: "Search countries by ISO 3166-1 alpha-2 codes",
      },
      {
        id: "languages",
        title: "Languages",
        href: "/languages",
        icon: "globe",
        type: "navigation",
        description: "Browse language characters by region",
        children: ["languages-europe"],
      },
      {
        id: "languages-europe",
        title: "European Languages",
        href: "/languages/europe",
        icon: "globe",
        type: "group",
        parent: "languages",
        description: "Browse European language characters",
        children: europeanCharGroups.map(
          (group) => `languages-europe-${group.id}`,
        ),
      },
    ]);

    // Add character group commands
    europeanCharGroups.forEach((group) => {
      baseCommands.value.push({
        id: `languages-europe-${group.id}`,
        title: group.name,
        href: `/languages/europe#section-${group.id.split("-").pop()?.charAt(0).toUpperCase()}`,
        icon: "type",
        type: "group",
        parent: "languages-europe",
        description: `${group.characters.length} special characters`,
        children: group.characters.map((char) => `char-${char.id}`),
      });
    });

    // Add individual character commands
    europeanCharGroups.forEach((group) => {
      group.characters.forEach((char) => {
        baseCommands.value.push({
          id: `char-${char.id}`,
          title: char.char,
          href: `/languages/europe#section-${group.id.split("-").pop()?.charAt(0).toUpperCase()}`,
          icon: "alert",
          type: "character",
          parent: `languages-europe-${group.id}`,
          description: char.description,
          char: char.char,
          countries: char.countries,
        });
      });
    });

    // All commands
    const commands = useSignal<CommandItem[]>(baseCommands.value);

    const filteredCommands = useComputed$(() => {
      if (!searchQuery.value) {
        // When there's no search, only show top-level navigation items
        return commands.value.filter((cmd) => cmd.type === "navigation");
      }

      const query = searchQuery.value.toLowerCase();
      const results: CommandItem[] = [];

      // Add direct matches from commands
      commands.value.forEach((cmd) => {
        let shouldAdd = false;

        // Check title and description
        if (
          cmd.title.toLowerCase().includes(query) ||
          (cmd.description && cmd.description.toLowerCase().includes(query))
        ) {
          shouldAdd = true;
        }

        // For character commands, check additional properties
        if (cmd.type === "character") {
          // Check character itself
          if (cmd.char && cmd.char.toLowerCase().includes(query)) {
            shouldAdd = true;
          }

          // Check country names and codes
          if (cmd.countries) {
            for (const code of cmd.countries) {
              const countryName = getCountryName(code).toLowerCase();
              if (
                countryName.includes(query) ||
                code.toLowerCase().includes(query)
              ) {
                shouldAdd = true;
                break;
              }
            }
          }
        }

        if (shouldAdd) {
          results.push(cmd);
        }
      });

      // Add country search results if query is at least 2 characters
      if (query.length >= 2) {
        // Search for countries matching the query
        const matchingCountries = searchCountries(query);

        // Only add up to 5 country results to avoid overwhelming the results
        matchingCountries.slice(0, 5).forEach((country) => {
          // Create a command item for each matching country
          results.push({
            id: `country-${country.code}`,
            title: country.name,
            href: `/countries?search=${encodeURIComponent(country.code)}`,
            type: "country",
            icon: "flag",
            description: `${country.code.toUpperCase()} - ${country.region}${country.subregion ? `, ${country.subregion}` : ""}`,
            char: getFlagEmoji(country.code),
          });
        });
      }

      return results;
    });

    // Focus search input when modal opens
    useVisibleTask$(({ track }) => {
      track(() => isOpen);
      if (isOpen && searchInput.value) {
        searchInput.value.focus();
      }
    });

    // Handle keyboard navigation
    const navigate = useNavigate();

    const handleKeyDown = $((e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          selectedIndex.value = Math.min(
            selectedIndex.value + 1,
            filteredCommands.value.length - 1,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands.value[selectedIndex.value]) {
            const command = filteredCommands.value[selectedIndex.value];
            navigate(command.href);
            onClose$();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose$();
          break;
      }
    });

    const handleCommandClick = $((href: string) => {
      navigate(href);
      onClose$();
    });

    // Close when clicking outside
    const overlayRef = useSignal<HTMLDivElement>();
    useVisibleTask$(({ track }) => {
      track(() => isOpen);

      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (overlayRef.value && !overlayRef.value.contains(e.target as Node)) {
          onClose$();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    });

    if (!isOpen) return null;

    return (
      <div
        class="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20"
        onKeyDown$={handleKeyDown}
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />

        <div
          ref={overlayRef}
          class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
        >
          <div class="relative">
            <LuSearch class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              ref={searchInput}
              type="text"
              class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              value={searchQuery.value}
              onInput$={(e) =>
                (searchQuery.value = (e.target as HTMLInputElement).value)
              }
            />
            <div class="absolute right-3 top-3.5 flex">
              <kbd class="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                Esc
              </kbd>
            </div>
          </div>

          {filteredCommands.value.length > 0 ? (
            <ul class="max-h-96 scroll-py-3 overflow-y-auto p-3">
              {filteredCommands.value.map((command, index) => (
                <li key={command.id}>
                  <button
                    type="button"
                    class={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                      index === selectedIndex.value ? "bg-gray-100" : ""
                    }`}
                    onClick$={() => handleCommandClick(command.href)}
                  >
                    <div class="flex items-center">
                      {command.icon && iconComponents[command.icon] && (
                        <span class="mr-3 flex h-6 w-6 items-center justify-center">
                          {(() => {
                            const IconComponent = iconComponents[command.icon!];
                            return <IconComponent class="h-4 w-4" />;
                          })()}
                        </span>
                      )}
                      <div>
                        <p class="font-medium text-gray-900">
                          {command.type === "character" ? (
                            <span class="text-xl mr-2">{command.title}</span>
                          ) : command.type === "country" ? (
                            <span class="flex items-center">
                              <span class="text-xl mr-2">{command.char}</span>
                              <span>{command.title}</span>
                            </span>
                          ) : (
                            command.title
                          )}
                        </p>
                        {command.description && (
                          <p class="text-xs text-gray-500">
                            {command.description}
                          </p>
                        )}
                        {command.type === "character" && command.countries && (
                          <div class="flex flex-wrap mt-1 gap-1">
                            {command.countries.slice(0, 3).map((code) => (
                              <span
                                key={code}
                                class="inline-flex items-center text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                                title={getCountryName(code)}
                              >
                                <span class="mr-1">{getFlagEmoji(code)}</span>
                                <span>{code.toUpperCase()}</span>
                              </span>
                            ))}
                            {command.countries.length > 3 && (
                              <span class="inline-flex items-center text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                +{command.countries.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <LuArrowRight class="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div class="px-6 py-14 text-center text-sm sm:px-14">
              <svg
                class="mx-auto h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              <p class="mt-4 font-semibold text-gray-900">No results found</p>
              <p class="mt-2 text-gray-500">No commands match your search.</p>
            </div>
          )}
        </div>
      </div>
    );
  },
);
