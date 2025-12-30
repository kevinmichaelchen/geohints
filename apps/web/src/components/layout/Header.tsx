import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";
import styles from "./Header.module.css";
import { LuCar, LuBook, LuSearch, LuCylinder, LuGlobe, LuMenu, LuX } from "@qwikest/icons/lucide";

const navLinks = [
  {
    label: "Follow Cars",
    href: "/follow",
    icon: <LuCar />,
  },
  {
    label: "Languages",
    href: "/languages",
    icon: <LuBook />,
  },
  {
    label: "Domains",
    href: "/domains",
    icon: <LuGlobe />,
  },
  {
    label: "Bollards",
    href: "/bollards",
    icon: <LuCylinder />,
  },
  {
    label: "Analyze",
    href: "/analyze",
    icon: <LuSearch />,
  },
];

export default component$(() => {
  const isMenuOpen = useSignal(false);

  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  const closeMenu = $(() => {
    isMenuOpen.value = false;
  });

  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <Link href="/" title="GeoHints">
            <GeoHintsLogo height={40} width={160} />
          </Link>
        </div>

        {/* Desktop navigation */}
        <ul class={styles.desktopNav}>
          {navLinks.map((e, i) => (
            <li key={i}>
              <Link href={e.href}>
                {e.label} {e.icon}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          class={styles.menuButton}
          onClick$={toggleMenu}
          aria-label={isMenuOpen.value ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen.value}
        >
          {isMenuOpen.value ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {isMenuOpen.value && (
        <div class={styles.mobileOverlay} onClick$={closeMenu}>
          <nav class={styles.mobileNav} onClick$={(e) => e.stopPropagation()}>
            <ul>
              {navLinks.map((e, i) => (
                <li key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                  <Link href={e.href} onClick$={closeMenu}>
                    {e.icon}
                    <span>{e.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
});
