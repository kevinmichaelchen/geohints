import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useIsInitialLoad } from "~/lib/hooks";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader = component$<PageHeaderProps>(({ title, subtitle, breadcrumbs }) => {
  const isInitialLoad = useIsInitialLoad();

  // Animation styles - only on initial load
  const breadcrumbStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out forwards" }
    : {};
  const titleStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out 0.05s forwards" }
    : {};
  const subtitleStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in-up 0.4s ease-out 0.1s forwards" }
    : {};
  const dividerStyle = isInitialLoad
    ? { opacity: 0, animation: "fade-in 0.5s ease-out 0.15s forwards" }
    : {};

  return (
    <header class="container mx-auto px-4 py-12 md:py-16">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav class="mb-6" style={breadcrumbStyle} aria-label="Breadcrumb">
          <ol
            class="flex items-center gap-2 text-sm text-ink-faded"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
          >
            <li>
              <Link href="/" class="hover:text-burnt-sienna transition-colors">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} class="flex items-center gap-2">
                <span class="text-burnt-sienna/40">›</span>
                {crumb.href ? (
                  <Link href={crumb.href} class="hover:text-burnt-sienna transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span class="text-ink">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title */}
      <h1
        class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-ink"
        style={{ ...titleStyle, fontFamily: "'Libre Baskerville', Georgia, serif" }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          class="text-lg md:text-xl text-ink-faded max-w-2xl italic"
          style={{ ...subtitleStyle, fontFamily: "'Crimson Text', Georgia, serif" }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative divider */}
      <div class="mt-8" style={dividerStyle}>
        <svg width="100" height="12" viewBox="0 0 100 12" class="text-burnt-sienna opacity-30">
          <path d="M0,6 L35,6" stroke="currentColor" stroke-width="1" />
          <path d="M65,6 L100,6" stroke="currentColor" stroke-width="1" />
          <circle cx="50" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="50" cy="6" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Optional slot for additional content */}
      <Slot />
    </header>
  );
});
