import { $, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface UseCommandPaletteReturn {
  isOpen: { value: boolean };
  open: () => void;
  close: () => void;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const isOpen = useSignal(false);

  // Toggle command palette with Cmd+K or Ctrl+K
  useVisibleTask$(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        isOpen.value = !isOpen.value;
      }
      // Close with Escape
      if (e.key === "Escape" && isOpen.value) {
        isOpen.value = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const open = $(() => {
    isOpen.value = true;
  });

  const close = $(() => {
    isOpen.value = false;
  });

  return {
    isOpen,
    open,
    close,
  };
}
