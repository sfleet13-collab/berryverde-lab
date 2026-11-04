import Link from "next/link";
import { site, trackingEnabled, type Locale } from "@/config/site";
import { href, type Dictionary } from "@/i18n";
import ConsentSettingsLink from "./ConsentSettingsLink";
import styles from "./Footer.module.css";

/** Jahreszahl wird zwischengespeichert (nötig für statisches Vorrendern). */
async function Year() {
  "use cache";
  return new Date().getFullYear();
}

export default function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <nav aria-label="Rechtliches" className={styles.links}>
          <Link href={href(lang, "/impressum")}>{t.legal.imprint}</Link>
          <Link href={href(lang, "/datenschutz")}>{t.legal.privacy}</Link>
          <Link href={href(lang, "/agb")}>{t.legal.terms}</Link>
          {trackingEnabled && <ConsentSettingsLink label={t.consent.settings} />}
        </nav>
        <p className={styles.copy}>
          © <Year /> {site.owner.name}. {t.footer.rights}
        </p>
        <a className={styles.credit} href={site.credit.url} target="_blank" rel="noopener">
          {site.credit.label}
        </a>
      </div>
    </footer>
  );
}
