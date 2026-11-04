"use client";

import { useRef } from "react";
import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";
import { Steckbrief, type RohstoffInfo } from "./Steckbrief";
import styles from "./lab.module.css";

/** Info-Knopf mit Steckbrief als Dialog (Popover). Beim Öffnen wandert der Fokus in den Dialog. */
export default function InfoKnopf({ id, name, inci, info }: { id: string; name: string; inci: string; info: RohstoffInfo }) {
  const schliessen = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" className={styles.infoBtn} popoverTarget={id} aria-label={`${L.rezeptur.steckbrief}: ${name}`}>
        <Icon name="info" size={16} />
      </button>
      <div
        id={id}
        popover="auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        className={styles.steckbrief}
        onToggle={(e) => {
          if ((e as unknown as ToggleEvent).newState === "open") schliessen.current?.focus();
        }}
      >
        <button ref={schliessen} type="button" className={styles.schliessen} popoverTarget={id} popoverTargetAction="hide" aria-label={L.rezeptur.schliessen}>
          <Icon name="x" size={18} />
        </button>
        <Steckbrief name={name} inci={inci} info={info} titelId={`${id}-t`} />
      </div>
    </>
  );
}
