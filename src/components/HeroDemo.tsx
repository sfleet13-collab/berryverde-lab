import type { Dictionary } from "@/i18n";
import Icon from "./Icon";
import styles from "./HeroDemo.module.css";

/**
 * Die eine "Bühne" der Startseite: zeigt in 3 Sekunden, was die Vorlage kann –
 * Anmeldung per Code, dann der persönliche Bereich. Reines CSS, kein JavaScript.
 * Bei "Bewegung reduzieren" erscheint direkt der Endzustand.
 */
export default function HeroDemo({ d }: { d: Dictionary["home"]["demo"] }) {
  const code = ["4", "8", "2", "9", "1", "5"];
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.grid} />

      {/* Schritt 1: Anmelden */}
      <div className={`${styles.card} ${styles.login}`}>
        <div className={styles.cardHead}>
          <Icon name="lock" size={16} />
          <span>{d.signIn}</span>
        </div>
        <div className={styles.field}>{d.email}</div>
        <div className={styles.codeLabel}>{d.codeLabel}</div>
        <div className={styles.code}>
          {code.map((c, i) => (
            <span key={i} style={{ animationDelay: `${500 + i * 140}ms` }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Schritt 2: Persönlicher Bereich */}
      <div className={`${styles.card} ${styles.dash}`}>
        <div className={styles.dashHead}>
          <span className={styles.avatar}>L</span>
          <div>
            <strong>{d.hello}</strong>
            <span className={styles.role}>{d.role}</span>
          </div>
          <span className={styles.ok}>
            <Icon name="check" size={14} />
            {d.signedIn}
          </span>
        </div>
        <div className={styles.listTitle}>{d.entriesTitle}</div>
        <ul className={styles.list}>
          {d.entries.map((e, i) => (
            <li key={e} style={{ animationDelay: `${2350 + i * 130}ms` }}>
              <span className={styles.dot} />
              {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
