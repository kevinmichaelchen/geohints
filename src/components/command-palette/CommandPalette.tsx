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
} from "@qwikest/icons/lucide";

// Define the available icon names as a type
type IconName = "car" | "globe";

// Map icon names to their corresponding components
const iconComponents = {
  car: LuCommand,
  globe: LuGlobe,
} as const;

interface CommandItem {
  id: string;
  title: string;
  href: string;
  icon?: IconName;
  description?: string;
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

    // Sample commands - using string-based icon names
    const commands = useSignal<CommandItem[]>([
      { id: "follow", title: "Follow Cars", href: "/follow", icon: "car" },
      {
        id: "languages",
        title: "Languages",
        href: "/languages",
        icon: "globe",
      },
    ]);

    const filteredCommands = useComputed$(() => {
      if (!searchQuery.value) return commands.value;
      return commands.value.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (cmd.description &&
            cmd.description
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())),
      );
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
                        <p class="font-medium text-gray-900">{command.title}</p>
                        {command.description && (
                          <p class="text-xs text-gray-500">
                            {command.description}
                          </p>
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
