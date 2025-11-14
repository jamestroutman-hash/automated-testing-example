"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DocsNav.module.css";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Getting Started", href: "/getting-started" },
  { label: "Features", href: "/features" },
  { label: "Architecture", href: "/architecture" },
  { label: "API Reference", href: "/api-reference" },
  { label: "Testing Guide", href: "/testing-guide" },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navHeader}>
        <h2 className={styles.navTitle}>Veritas Weather</h2>
        <p className={styles.navSubtitle}>Documentation</p>
      </div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
