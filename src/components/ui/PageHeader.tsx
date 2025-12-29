import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader = component$<PageHeaderProps>(
  ({ title, subtitle, breadcrumbs }) => {
    return (
      <header class="container mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            class="mb-6 opacity-0"
            style="animation: fade-in-up 0.5s ease-out 0.1s forwards"
            aria-label="Breadcrumb"
          >
            <ol class="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/"
                  class="hover:text-qwik-light-blue transition-colors"
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} class="flex items-center gap-2">
                  <span class="text-gray-600">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      class="hover:text-qwik-light-blue transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span class="text-gray-300">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 opacity-0"
          style="animation: fade-in-up 0.5s ease-out 0.2s forwards"
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            class="text-lg md:text-xl text-gray-300 max-w-2xl opacity-0"
            style="animation: fade-in-up 0.5s ease-out 0.3s forwards"
          >
            {subtitle}
          </p>
        )}

        {/* Optional slot for additional content */}
        <Slot />
      </header>
    );
  },
);
