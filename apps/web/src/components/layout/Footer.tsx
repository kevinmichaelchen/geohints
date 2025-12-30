import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="py-10 px-10 text-center border-t border-burnt-sienna/15">
      {/* Decorative separator */}
      <svg
        width="80"
        height="16"
        viewBox="0 0 80 16"
        class="mx-auto mb-4 text-burnt-sienna opacity-30"
      >
        <path d="M0,8 L30,8" stroke="currentColor" stroke-width="1" />
        <path d="M50,8 L80,8" stroke="currentColor" stroke-width="1" />
        <circle cx="40" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1" />
      </svg>

      <p
        class="text-ink-faded text-sm italic"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        GeoHints — A companion for{" "}
        <a
          href="https://geoguessr.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-teal hover:text-burnt-sienna transition-colors underline decoration-dotted underline-offset-2"
        >
          GeoGuessr
        </a>{" "}
        explorers
      </p>

      <p
        class="text-ink-faded/50 text-xs mt-2"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        Est. MMXXIV
      </p>
    </footer>
  );
});
