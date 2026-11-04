"use client";

import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";
import styles from "./lab.module.css";

/** Drucken oder als PDF speichern; wahlweise nur das Etikett. */
export default function PrintButtons() {
  function drucke(nurEtikett: boolean) {
    const root = document.documentElement;
    if (nurEtikett) root.dataset.druck = "etikett";
    else delete root.dataset.druck;
    const fertig = () => {
      delete root.dataset.druck;
      window.removeEventListener("afterprint", fertig);
    };
    window.addEventListener("afterprint", fertig);
    window.print();
  }
  return (
    <div className={styles.aktionen}>
      <button type="button" className="btn btn-primary" onClick={() => drucke(false)}>
        <Icon name="print" />
        {L.karte.drucken}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => drucke(true)}>
        {L.karte.nurEtikett}
      </button>
    </div>
  );
}
