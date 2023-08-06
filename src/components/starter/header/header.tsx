import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";
import { LuCar, LuBook } from "@qwikest/icons/lucide";

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

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="geohints">
            <QwikLogo height={50} width={143} />
          </a>
        </div>
        <ul>
          {navLinks.map((e, i) => (
            <li key={i}>
              <a href={e.href}>
                {e.label} {e.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
});
