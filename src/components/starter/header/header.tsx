import { component$, Slot } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";
import { LuCar, LuBook } from "@qwikest/icons/lucide";

interface HeaderProps {
  children?: any;
}

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
];

export default component$<HeaderProps>(({ children }) => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="geohints">
            <QwikLogo height={50} width={143} />
          </a>
        </div>
        <div class={styles.navContainer}>
          <ul class={styles.navList}>
            {navLinks.map((e, i) => (
              <li key={i}>
                <a href={e.href} class={styles.navLink}>
                  <span class={styles.navIcon}>{e.icon}</span>
                  <span class={styles.navLabel}>{e.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {children && (
            <div class={styles.commandPaletteContainer}>{children}</div>
          )}
        </div>
      </div>
    </header>
  );
});
