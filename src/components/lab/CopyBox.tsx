"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";
import styles from "./lab.module.css";

/** Kästchen mit Kopieren-Knopf (Blog-Entwurf, Willkommens-Mail, INCI). */
export default function CopyBox({ text, label, kompakt = false }: { text: string; label: string; kompakt?: boolean }) {
  const [kopiert, setKopiert] = useState(false);

  async function kopiere() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback für Browser ohne Zwischenablage-Zugriff
      const feld = document.createElement("textarea");
      feld.value = text;
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      document.body.appendChild(feld);
      feld.select();
      document.execCommand("copy");
      feld.remove();
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 1800);
  }

  return (
    <div className={styles.copyBox} data-kompakt={kompakt || undefined}>
      <div className={styles.copyKopf}>
        <span>{label}</span>
        <button type="button" className={styles.copyBtn} onClick={kopiere} data-kopiert={kopiert || undefined}>
          <Icon name={kopiert ? "check" : "copy"} size={16} />
          <span aria-live="polite">{kopiert ? L.kopiert : L.kopieren}</span>
        </button>
      </div>
      <pre className={styles.copyText}>{text}</pre>
    </div>
  );
}
