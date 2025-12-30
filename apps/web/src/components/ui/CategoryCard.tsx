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
    // Slight rotation for organic "scattered on desk" feel
    const rotations = [-1.5, 0.8, -0.5, 1.2, -1, 0.5, -0.8, 1.5, -1.2, 0.3];
    const rotation = rotations[index % rotations.length];

    const baseClasses = "group relative block overflow-hidden transition-all duration-300 ease-out";
    const interactiveClasses = comingSoon
      ? "opacity-70 cursor-not-allowed"
      : "hover:scale-[1.02] hover:-translate-y-2";

    // Entrance animation (only on initial load, instant on SPA nav)
    const entranceStyle = useEntranceAnimation(index, {
      baseDelay: 0.15,
      stagger: 0.06,
      duration: 0.5,
    });

    const content = (
      <>
        {/* Vintage photo frame / postcard styling */}
        <div
          class="bg-parchment-light rounded-sm shadow-lg transition-shadow duration-300"
          style={{
            transform: `rotate(${rotation}deg)`,
            boxShadow: "0 4px 20px rgba(139, 69, 19, 0.15), 0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Inner border like old photo mount */}
          <div class="p-2 md:p-3">
            {/* Image container with vintage photo border */}
            <div
              class="relative overflow-hidden"
              style={{
                border: "1px solid rgba(139, 69, 19, 0.2)",
                boxShadow: "inset 0 2px 8px rgba(139, 69, 19, 0.1)",
              }}
            >
              <Image
                src={imageSrc}
                alt={title}
                layout="constrained"
                width={400}
                height={225}
                class="object-cover w-full aspect-video transition-all duration-500 group-hover:scale-105"
                style={{
                  filter: comingSoon ? "sepia(0.3) brightness(0.9)" : "sepia(0.1)",
                }}
              />
              {/* Vintage photo overlay - subtle aging effect */}
              <div
                class="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%, rgba(139, 69, 19, 0.15) 100%)",
                }}
                aria-hidden="true"
              />
              {comingSoon && (
                <div class="absolute inset-0 flex items-center justify-center bg-parchment/70">
                  <span
                    class="px-4 py-1.5 text-sm font-medium text-burnt-sienna border-2 border-burnt-sienna rounded-sm uppercase tracking-wider"
                    style={{
                      transform: "rotate(-5deg)",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                    }}
                  >
                    Coming Soon
                  </span>
                </div>
              )}
            </div>

            {/* Content - styled like journal entry */}
            <div class="pt-3 pb-1">
              <h3
                class="text-lg font-bold mb-1 text-ink group-hover:text-burnt-sienna transition-colors duration-200"
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              >
                {title}
              </h3>
              <p
                class="text-ink-faded text-sm leading-relaxed italic"
                style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Corner accent - like vintage photo corner */}
          {!comingSoon && (
            <>
              <div
                class="absolute top-0 left-0 w-6 h-6 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-antique-gold) 50%, transparent 50%)",
                }}
                aria-hidden="true"
              />
              <div
                class="absolute bottom-0 right-0 w-6 h-6 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(-45deg, var(--color-antique-gold) 50%, transparent 50%)",
                }}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </>
    );

    const wrapperStyle = {
      ...entranceStyle,
    };

    if (comingSoon) {
      return (
        <div class={`${baseClasses} ${interactiveClasses}`} style={wrapperStyle}>
          {content}
        </div>
      );
    }

    return (
      <Link href={href} class={`${baseClasses} ${interactiveClasses}`} style={wrapperStyle}>
        {content}
      </Link>
    );
  },
);
