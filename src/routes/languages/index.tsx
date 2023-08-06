import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <ul class="space-y-10">
      <li>
        <a href="/languages/europe/northern">Northern (Nordic / Baltic)</a>
      </li>
      <li>
        <a href="/languages/europe/central-eastern">Central/Eastern</a>
      </li>
    </ul>
  );
});
