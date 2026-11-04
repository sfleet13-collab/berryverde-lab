import Link from "next/link";
import { site, type Locale } from "@/config/site";
import { href, type Dictionary } from "@/i18n";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={href(lang)} className={styles.logo} aria-label={`${site.name} – ${t.nav.home}`}>
          <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
            <path d="M12.5 4.5h7M14 4.5v8.2L7.3 24.2A2.2 2.2 0 0 0 9.2 27.5h13.6a2.2 2.2 0 0 0 1.9-3.3L18 12.7V4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.3 20.5h11.4l2.1 3.7a1.2 1.2 0 0 1-1 1.8H9.2a1.2 1.2 0 0 1-1-1.8z" fill="currentColor" opacity="0.28" />
          </svg>
          <span className={styles.logoText}>
            {site.shortName}
            <small>berryverde</small>
          </span>
        </Link>
        <nav aria-label={t.nav.menu} className={styles.nav}>
          <Link href={href(lang, "/kontakt")} className={styles.navLeise}>
            {t.contact.title}
          </Link>
          <Link href={href(lang, "/app")} className={styles.navHaupt}>
            {t.nav.app}
          </Link>
        </nav>
        <div className={styles.tools}>
          <ThemeToggle toLight={t.nav.themeToLight} toDark={t.nav.themeToDark} />
        </div>
      </div>
    </header>
  );
}
