import { component$ } from "@builder.io/qwik";
import { CharacterGrid } from "~/components/features/CharacterGrid";
import { europeNorthernChars } from "~/data/languages";

export default component$(() => {
  return <CharacterGrid characters={europeNorthernChars} />;
});
