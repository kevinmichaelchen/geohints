import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { useEntranceAnimation } from "~/lib/hooks";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  comingSoon?: boolean;
  index?: number;
}

export const CategoryCard = component$<CategoryCardProps>(
  ({ title, description, href, imageSrc, comingSoon = false, index = 0 }) => {
    const baseClasses =
      "group relative block rounded-xl overflow-hidden bg-qwik-dirty-black transition-all duration-300 ease-out";
    const interactiveClasses = comingSoon
      ? "opacity-60 cursor-not-allowed"
      : "hover:scale-[1.02] hover:-translate-y-1";

    // Entrance animation (only on initial load, instant on SPA nav)
    const entranceStyle = useEntranceAnimation(index, {
      baseDelay: 0.1,
      stagger: 0.05,
      duration: 0.4,
    });

    const content = (
      <>
        {/* Gradient border - using pseudo-element style via outline */}
        {!comingSoon && (
          <div
            class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
            style="background: linear-gradient(135deg, rgba(24,182,246,0.5), rgba(172,127,244,0.5)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
            aria-hidden="true"
          />
        )}

        {/* Image container */}
        <div class="aspect-video relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            layout="constrained"
            width={400}
            height={225}
            class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {/* Image overlay gradient */}
          <div
            class="absolute inset-0 bg-gradient-to-t from-qwik-dirty-black/60 via-transparent to-transparent"
            aria-hidden="true"
          />
          {comingSoon && (
            <div class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <span class="bg-qwik-light-purple/90 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg animate-glow-pulse">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div class="p-5">
          <h3 class="text-xl font-semibold mb-2 group-hover:text-qwik-light-blue transition-colors duration-200">
            {title}
          </h3>
          <p class="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Bottom glow effect on hover */}
        {!comingSoon && (
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-qwik-light-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />
        )}
      </>
    );

    const wrapperStyle = entranceStyle;

    // Shadow classes for hover
    const shadowClasses = comingSoon
      ? ""
      : "shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-qwik-dark-blue/20";

    if (comingSoon) {
      return (
        <div
          class={`${baseClasses} ${interactiveClasses} ${shadowClasses}`}
          style={wrapperStyle}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        href={href}
        class={`${baseClasses} ${interactiveClasses} ${shadowClasses}`}
        style={wrapperStyle}
      >
        {content}
      </Link>
    );
  },
);
