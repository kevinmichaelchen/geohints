import { component$ } from "@builder.io/qwik";
import { useCommandPalette } from "~/hooks/useCommandPalette";
import { LuCommand, LuSearch } from "@qwikest/icons/lucide";

export const CommandPaletteButton = component$(() => {
  const { open } = useCommandPalette();

  return (
    <button
      type="button"
      onClick$={open}
      class="group flex h-10 items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Open command palette"
    >
      <div class="flex items-center">
        <LuSearch class="mr-2 h-4 w-4 text-gray-400" />
        <span class="hidden sm:inline">Search...</span>
      </div>
      <div class="hidden items-center sm:flex">
        <kbd class="ml-2 flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
          <LuCommand class="mr-1 h-3 w-3" />K
        </kbd>
      </div>
    </button>
  );
});
