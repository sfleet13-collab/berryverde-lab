import type { Dictionary } from "@/i18n";
import { site } from "@/config/site";
import styles from "./LegalPage.module.css";

/**
 * Rahmen für Impressum, Datenschutz und AGB.
 * Den Platzhalter vor dem Go-live durch den echten Text ersetzen.
 */
export default function LegalPage({ title, t, children }: { title: string; t: Dictionary; children?: React.ReactNode }) {
  return (
    <article className={`container ${styles.legal}`}>
      <h1>{title}</h1>
      {children ?? (
        <div className={styles.placeholder} role="note">
          <h2 className={styles.placeholderTitle}>{t.legal.placeholderTitle}</h2>
          <p>{t.legal.placeholderText}</p>
          <p className="muted">
            {site.owner.name} · {site.owner.email}
          </p>
        </div>
      )}
    </article>
  );
}
