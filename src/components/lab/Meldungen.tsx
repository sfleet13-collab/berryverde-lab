import Icon from "@/components/Icon";
import { L, fuelle } from "@/i18n/lab";
import type { Korrektur, Meldung } from "@/lib/lab/regeln";
import styles from "./lab.module.css";

const ORDNUNG = { fehler: 0, warnung: 1, hinweis: 2 } as const;

/** Ergebnis der Prüfung: Fehler zuerst, jeder mit Erklärung und (im Editor) Korrektur per Klick. */
export default function Meldungen({ meldungen, onKorrektur }: { meldungen: Meldung[]; onKorrektur?: (k: Korrektur) => void }) {
  const liste = [...meldungen].sort((a, b) => ORDNUNG[a.art] - ORDNUNG[b.art]);
  const fehler = liste.filter((m) => m.art === "fehler").length;

  return (
    <div className={styles.pruefung}>
      <p className={styles.pruefStatus} data-ok={fehler === 0 || undefined} role="status">
        <Icon name={fehler === 0 ? "check" : "alert"} size={18} />
        {fehler === 0
          ? L.rezeptur.pruefungOk
          : fehler === 1
            ? L.rezeptur.pruefungFehlerEins
            : fuelle(L.rezeptur.pruefungFehler, { n: fehler })}
      </p>
      {liste.length > 0 && (
        <ul className={styles.meldungen}>
          {liste.map((m, i) => (
            <li key={`${m.code}-${i}`} data-art={m.art}>
              <span className={styles.meldungArt}>{L.meldung[m.art]}</span>
              <div>
                <p className={styles.meldungTitel}>{m.titel}</p>
                <p className={styles.meldungText}>{m.text}</p>
                {m.korrektur && onKorrektur && (
                  <button type="button" className={styles.korrektur} onClick={() => onKorrektur(m.korrektur!)}>
                    <Icon name="check" size={16} />
                    {m.korrektur.label}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
