import { component$ } from "@builder.io/qwik";
import { CharacterGrid } from "~/components/features/CharacterGrid";
import { europeCentralEasternChars } from "~/data/languages";

export default component$(() => {
  return <CharacterGrid characters={europeCentralEasternChars} />;
});
