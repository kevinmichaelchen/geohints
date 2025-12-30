import { component$, type Signal } from "@builder.io/qwik";

export type AnalysisMode = "simple" | "advanced";

interface ModeToggleProps {
  mode: Signal<AnalysisMode>;
}

export const ModeToggle = component$<ModeToggleProps>(({ mode }) => {
  return (
    <div class="flex gap-2 mb-6">
      <button
        onClick$={() => {
          mode.value = "simple";
        }}
        class={[
          "px-4 py-2 rounded-lg transition-colors",
          mode.value === "simple"
            ? "bg-qwik-light-blue text-white"
            : "bg-qwik-dirty-black text-gray-400 hover:text-white",
        ]}
      >
        Simple
      </button>
      <div class="relative group">
        <button
          disabled
          class="px-4 py-2 rounded-lg bg-qwik-dirty-black text-gray-600 cursor-not-allowed"
        >
          Advanced
        </button>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Coming Soon
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      </div>
    </div>
  );
});
