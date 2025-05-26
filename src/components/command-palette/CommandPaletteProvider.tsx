import { component$ } from "@builder.io/qwik";
import { CommandPalette } from "./CommandPalette";
import { useCommandPalette } from "~/hooks/useCommandPalette";

export const CommandPaletteProvider = component$(() => {
  const { isOpen, close } = useCommandPalette();

  return <CommandPalette isOpen={isOpen.value} onClose$={close} />;
});
