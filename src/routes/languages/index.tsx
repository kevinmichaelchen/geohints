import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <ul class="space-y-10">
      <li>
        <Link href="/languages/europe/northern">
          Northern (Nordic / Baltic)
        </Link>
      </li>
      <li>
        <Link href="/languages/europe/central-eastern">Central/Eastern</Link>
      </li>
    </ul>
  );
});
