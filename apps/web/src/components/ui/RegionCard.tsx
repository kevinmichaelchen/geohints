import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useEntranceAnimation } from "~/lib/hooks";

interface RegionCardProps {
  title: string;
  description: string;
  href: string;
  countries: string[];
  index?: number;
}

export const RegionCard = component$<RegionCardProps>(
  ({ title, description, href, countries, index = 0 }) => {
    // Slight rotation for organic feel
    const rotations = [-0.8, 0.5, -0.3, 0.7, -0.5, 0.3];
    const rotation = rotations[index % rotations.length];

    const entranceStyle = useEntranceAnimation(index, {
      baseDelay: 0.1,
      stagger: 0.05,
      duration: 0.4,
    });

    return (
      <Link
        href={href}
        class="group relative block overflow-hidden transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-1"
        style={entranceStyle}
      >
        {/* Vintage card styling */}
        <div
          class="bg-parchment-light rounded-sm p-1 transition-shadow duration-300"
          style={{
            transform: `rotate(${rotation}deg)`,
            boxShadow: "0 4px 16px rgba(139, 69, 19, 0.12), 0 2px 6px rgba(0,0,0,0.08)",
            border: "1px solid rgba(139, 69, 19, 0.15)",
          }}
        >
          {/* Inner content area */}
          <div
            class="p-5 md:p-6"
            style={{
              background:
                "linear-gradient(135deg, var(--color-parchment-light) 0%, var(--color-parchment) 100%)",
              borderRadius: "2px",
            }}
          >
            {/* Globe icon */}
            <div class="mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <svg width="36" height="36" viewBox="0 0 100 100" class="text-teal">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="40"
                  ry="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  opacity="0.6"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="18"
                  ry="40"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  opacity="0.6"
                />
                <line
                  x1="10"
                  y1="50"
                  x2="90"
                  y2="50"
                  stroke="currentColor"
                  stroke-width="1"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Title */}
            <h3
              class="text-xl md:text-2xl font-bold mb-2 text-ink group-hover:text-burnt-sienna transition-colors duration-200"
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              class="text-ink-faded text-sm mb-4 leading-relaxed italic"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            >
              {description}
            </p>

            {/* Country flags */}
            <div class="flex flex-wrap gap-2 pt-2 border-t border-burnt-sienna/10">
              {countries.map((flag, i) => (
                <span
                  key={i}
                  class="text-2xl opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>

          {/* Corner accents */}
          <div
            class="absolute top-0 left-0 w-5 h-5 opacity-20 group-hover:opacity-40 transition-opacity"
            style={{
              background: "linear-gradient(135deg, var(--color-antique-gold) 50%, transparent 50%)",
            }}
            aria-hidden="true"
          />
          <div
            class="absolute bottom-0 right-0 w-5 h-5 opacity-20 group-hover:opacity-40 transition-opacity"
            style={{
              background: "linear-gradient(-45deg, var(--color-antique-gold) 50%, transparent 50%)",
            }}
            aria-hidden="true"
          />
        </div>
      </Link>
    );
  },
);
