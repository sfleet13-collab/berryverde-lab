import Link from "next/link";
import { Suspense } from "react";
import { site, type Locale } from "@/config/site";
import { href, type Dictionary } from "@/i18n";
import LangToggle from "./LangToggle";
import LangLinks from "./LangLinks";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={href(lang)} className={styles.logo} aria-label={`${site.name} – ${t.nav.home}`}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.logoText}>{site.shortName}</span>
        </Link>
        <nav aria-label={t.nav.menu} className={styles.nav}>
          <Link href={href(lang, "/app")}>{t.nav.app}</Link>
          <Link href={href(lang, "/kontakt")}>{t.nav.contact}</Link>
        </nav>
        <div className={styles.tools}>
          <Suspense fallback={<LangLinks lang={lang} label={t.nav.language} />}>
            <LangToggle lang={lang} label={t.nav.language} />
          </Suspense>
          <ThemeToggle toLight={t.nav.themeToLight} toDark={t.nav.themeToDark} />
        </div>
      </div>
    </header>
  );
}
