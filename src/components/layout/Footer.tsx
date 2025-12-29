import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="py-8 px-10 text-center text-sm text-gray-400">
      <p>
        GeoHints — A{" "}
        <a
          href="https://geoguessr.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-white transition-colors"
        >
          GeoGuessr
        </a>{" "}
        learning tool
      </p>
    </footer>
  );
});
