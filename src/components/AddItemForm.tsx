"use client";

import { useActionState, useEffect, useRef } from "react";
import { addItem, type AddItemState } from "@/lib/actions/items";
import type { Dictionary } from "@/i18n";
import styles from "@/app/[lang]/app/app.module.css";

/** Eingabe + sichtbare Bestätigung „Gespeichert ✓“. */
export default function AddItemForm({ t }: { t: Dictionary["app"] }) {
  const [state, action, pending] = useActionState<AddItemState, FormData>(addItem, { ok: false });
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) input.current?.focus();
  }, [state.savedAt, state.ok]);

  return (
    <form action={action} className={styles.add}>
      <label htmlFor="title" className="sr-only">
        {t.addLabel}
      </label>
      <input ref={input} id="title" name="title" required maxLength={200} placeholder={t.addPlaceholder} autoComplete="off" />
      <label htmlFor="note" className="sr-only">
        {t.noteLabel}
      </label>
      <textarea id="note" name="note" rows={2} maxLength={2000} placeholder={t.notePlaceholder} className={styles.note} />
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? t.saving : t.add}
      </button>
      <p className={styles.feedback} role="status" aria-live="polite">
        {state.ok && !pending && (
          <span key={state.savedAt} className={styles.saved}>
            {t.saved}
          </span>
        )}
        {state.error && <span className={styles.error}>{t.errors[state.error]}</span>}
      </p>
    </form>
  );
}
