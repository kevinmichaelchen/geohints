import { component$ } from "@builder.io/qwik";
import { CategoryCard } from "~/components/ui/CategoryCard";
import { useIsInitialLoad } from "~/lib/hooks";

const categories = [
  {
    title: "Languages",
    description: "Identify countries by unique alphabet characters",
    href: "/languages",
    imageSrc: "/images/follow/kenya1.webp",
  },
  {
    title: "Follow Cars",
    description: "Recognize Google coverage vehicles by country",
    href: "/follow",
    imageSrc: "/images/follow/nigeria1.webp",
  },
  {
    title: "Text Analyzer",
    description: "Paste text to identify possible countries",
    href: "/analyze",
    imageSrc: "/images/follow/kenya2.webp",
    comingSoon: true,
  },
];

export const CategoryGrid = component$(() => {
  const isInitialLoad = useIsInitialLoad();

  const headingStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out forwards" }
    : {};

  return (
    <section class="@container container mx-auto px-4 py-12 md:py-16">
      {/* Section heading with fade-in */}
      <h2
        class="text-2xl md:text-3xl font-semibold mb-10 text-center tracking-tight"
        style={headingStyle}
      >
        Explore Hints
      </h2>

      {/* Cards grid */}
      <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((cat, index) => (
          <CategoryCard key={cat.href} {...cat} index={index} />
        ))}
      </div>
    </section>
  );
});
