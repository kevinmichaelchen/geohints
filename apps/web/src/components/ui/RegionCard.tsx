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
    const entranceStyle = useEntranceAnimation(index, {
      baseDelay: 0.1,
      stagger: 0.05,
      duration: 0.4,
    });

    return (
      <Link
        href={href}
        class="group relative block rounded-xl overflow-hidden bg-qwik-dirty-black transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-qwik-dark-blue/20"
        style={entranceStyle}
      >
        {/* Gradient border on hover */}
        <div
          class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style="background: linear-gradient(135deg, rgba(24,182,246,0.5), rgba(172,127,244,0.5)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 1px;"
          aria-hidden="true"
        />

        {/* Card content */}
        <div class="p-6 md:p-8">
          {/* Icon/visual element */}
          <div class="mb-4 text-4xl opacity-80 group-hover:opacity-100 transition-opacity">🌍</div>

          {/* Title */}
          <h3 class="text-xl md:text-2xl font-semibold mb-2 group-hover:text-qwik-light-blue transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          <p class="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>

          {/* Country flags */}
          <div class="flex flex-wrap gap-2">
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

        {/* Bottom accent line */}
        <div
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-qwik-light-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </Link>
    );
  },
);
