import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { GeoHintsLogo } from "~/components/ui/GeoHintsLogo";
import styles from "./Header.module.css";
import { LuCar, LuBook, LuSearch } from "@qwikest/icons/lucide";

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
    label: "Analyze",
    href: "/analyze",
    icon: <LuSearch />,
  },
];

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <Link href="/" title="GeoHints">
            <GeoHintsLogo height={40} width={160} />
          </Link>
        </div>
        <ul>
          {navLinks.map((e, i) => (
            <li key={i}>
              <Link href={e.href}>
                {e.label} {e.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
});
