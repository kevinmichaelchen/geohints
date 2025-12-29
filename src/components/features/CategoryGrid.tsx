import { component$ } from "@builder.io/qwik";
import { CategoryCard } from "~/components/ui/CategoryCard";

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
  return (
    <section class="@container container mx-auto px-4 py-12">
      <h2 class="text-2xl font-semibold mb-8 text-center">Explore Hints</h2>
      <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.href} {...cat} />
        ))}
      </div>
    </section>
  );
});
