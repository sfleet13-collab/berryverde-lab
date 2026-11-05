"use client";

import { useRef } from "react";
import Icon from "@/components/Icon";
import { L, fuelle, nbsp } from "@/i18n/lab";
import type { Korrektur, Meldung } from "@/lib/lab/regeln";
import styles from "./lab.module.css";

const ORDNUNG = { fehler: 0, warnung: 1, hinweis: 2 } as const;

/** Ergebnis der Prüfung: Fehler zuerst, jeder mit Erklärung und (im Editor) Korrektur per Klick. */
export default function Meldungen({ meldungen, onKorrektur }: { meldungen: Meldung[]; onKorrektur?: (k: Korrektur) => void }) {
  const liste = [...meldungen].sort((a, b) => ORDNUNG[a.art] - ORDNUNG[b.art]);
  const fehler = liste.filter((m) => m.art === "fehler").length;
  const warnungen = liste.filter((m) => m.art === "warnung").length;
  const status = useRef<HTMLParagraphElement>(null);
  // Nach einer Korrektur verschwindet der Knopf: Fokus auf den Prüfstatus setzen, damit er nicht verloren geht
  const korrigiere = (k: Korrektur) => {
    onKorrektur?.(k);
    requestAnimationFrame(() => status.current?.focus());
  };

  return (
    <div className={styles.pruefung}>
      <p ref={status} tabIndex={-1} className={styles.pruefStatus} data-ok={fehler === 0 || undefined} data-warnung={(fehler === 0 && warnungen > 0) || undefined} role="status">
        <Icon name={fehler === 0 ? "check" : "alert"} size={18} />
        {fehler === 0
          ? warnungen === 0
            ? L.rezeptur.pruefungOk
            : warnungen === 1
              ? L.rezeptur.pruefungOkWarnung
              : fuelle(L.rezeptur.pruefungOkWarnungen, { n: warnungen })
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
                <p className={styles.meldungTitel}>{nbsp(m.titel)}</p>
                <p className={styles.meldungText}>{nbsp(m.text)}</p>
                {m.korrektur && onKorrektur && (
                  <button type="button" className={styles.korrektur} onClick={() => korrigiere(m.korrektur!)}>
                    <Icon name="check" size={16} />
                    {nbsp(m.korrektur.label)}
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
