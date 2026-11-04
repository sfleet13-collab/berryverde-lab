"use client";

import { useActionState, useEffect, useRef } from "react";
import { L } from "@/i18n/lab";
import { zugangHinzufuegen, type ZugangState } from "@/lib/actions/lab";
import styles from "./lab.module.css";

/** Mitglied freischalten: E-Mail eintragen, Stufe wählen. */
export default function ZugangForm() {
  const [state, action, pending] = useActionState<ZugangState, FormData>(zugangHinzufuegen, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className={styles.zugangForm} noValidate>
      <div className={styles.feld}>
        <label htmlFor="z-email">{L.admin.email}</label>
        <input id="z-email" name="email" type="email" autoComplete="off" required aria-invalid={state.fehler ? true : undefined} aria-describedby="z-status" />
      </div>
      <div className={styles.feld}>
        <label htmlFor="z-name">{L.admin.name}</label>
        <input id="z-name" name="name" type="text" autoComplete="off" />
      </div>
      <div className={styles.feld}>
        <label htmlFor="z-stufe">{L.admin.stufe}</label>
        <select id="z-stufe" name="stufe" defaultValue="anfaenger">
          {Object.entries(L.stufe).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.feld}>
        <label htmlFor="z-notiz">{L.admin.notiz}</label>
        <input id="z-notiz" name="notiz" type="text" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {L.admin.freischalten}
      </button>
      <p id="z-status" className={state.fehler ? styles.formFehler : styles.formOk} role="status">
        {state.fehler ?? state.ok ?? ""}
      </p>
    </form>
  );
}
