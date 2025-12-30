import { component$, type Signal } from "@builder.io/qwik";

interface TextInputProps {
  value: Signal<string>;
}

export const TextInput = component$<TextInputProps>(({ value }) => {
  return (
    <textarea
      value={value.value}
      onInput$={(e) => {
        value.value = (e.target as HTMLTextAreaElement).value;
      }}
      placeholder="Paste or type text here..."
      class="w-full h-40 p-4 bg-qwik-dirty-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-qwik-light-blue resize-y"
      aria-label="Text to analyze"
    />
  );
});
