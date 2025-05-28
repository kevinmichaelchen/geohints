import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="space-y-8">
      <h1 class="text-2xl font-bold">Language Characters</h1>
      <p class="text-gray-700">
        Browse language characters by region to help identify locations in
        GeoGuessr.
      </p>

      <ul class="space-y-4">
        <li class="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded">
          <a href="/languages/europe" class="text-lg font-medium block">
            European Languages
          </a>
          <p class="text-sm text-gray-600 mt-1">
            Characters from Nordic, Baltic, Central, and Eastern European
            languages
          </p>
        </li>
        {/* Additional regions can be added here in the future */}
      </ul>
    </div>
  );
});
