import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  comingSoon?: boolean;
}

export const CategoryCard = component$<CategoryCardProps>(
  ({ title, description, href, imageSrc, comingSoon = false }) => {
    const baseClasses =
      "block rounded-xl overflow-hidden bg-qwik-dirty-black transition-transform duration-200";
    const interactiveClasses = comingSoon
      ? "opacity-60 cursor-not-allowed"
      : "hover:scale-105 hover:shadow-xl";

    const content = (
      <>
        <div class="aspect-video relative">
          <img
            src={imageSrc}
            alt={title}
            class="object-cover w-full h-full"
            loading="lazy"
            width={400}
            height={225}
          />
          {comingSoon && (
            <div class="absolute inset-0 flex items-center justify-center bg-black/50">
              <span class="bg-qwik-light-purple px-3 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{title}</h3>
          <p class="text-gray-400 text-sm">{description}</p>
        </div>
      </>
    );

    if (comingSoon) {
      return (
        <div class={`${baseClasses} ${interactiveClasses}`}>{content}</div>
      );
    }

    return (
      <Link href={href} class={`${baseClasses} ${interactiveClasses}`}>
        {content}
      </Link>
    );
  },
);
