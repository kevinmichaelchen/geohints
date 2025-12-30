import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export interface TOCItem {
  /** Section ID for anchor */
  id: string;
  /** Display text */
  label: string;
}

interface TableOfContentsProps {
  /** List of sections to display in the TOC */
  items: TOCItem[];
}

/**
 * Floating Table of Contents component
 * - Fixed position on right side (desktop only)
 * - Hidden on mobile
 * - Highlights current section on scroll
 * - Smooth scroll on click
 */
export const TableOfContents = component$<TableOfContentsProps>(({ items }) => {
  const activeId = useSignal<string>(items[0]?.id ?? "");

  // Track which section is currently in view
  useVisibleTask$(({ cleanup }) => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in upper portion of viewport
        threshold: 0,
      }
    );

    // Observe all sections
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    }

    cleanup(() => observer.disconnect());
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      class="hidden lg:block sticky top-24 w-56 shrink-0 self-start"
      aria-label="Table of contents"
    >
      <div class="border-l-2 border-qwik-dirty-black/40 pl-4">
        <h4 class="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          On this page
        </h4>
        <ul class="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                class={[
                  "block text-sm transition-colors duration-200",
                  activeId.value === item.id
                    ? "text-qwik-blue-400 font-medium"
                    : "text-gray-400 hover:text-white",
                ]}
                onClick$={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    // Update URL hash without scrolling
                    history.pushState(null, "", `#${item.id}`);
                  }
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
});
