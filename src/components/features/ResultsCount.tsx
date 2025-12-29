import { component$ } from "@builder.io/qwik";

interface ResultsCountProps {
  showing: number;
  total: number;
}

export const ResultsCount = component$<ResultsCountProps>(
  ({ showing, total }) => {
    const isFiltered = showing !== total;

    return (
      <p
        class="text-sm text-gray-400 mb-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {isFiltered
          ? `Showing ${showing} of ${total} characters`
          : `${total} characters`}
      </p>
    );
  },
);
