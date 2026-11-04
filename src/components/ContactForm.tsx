"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import type { Dictionary } from "@/i18n";
import styles from "./ContactForm.module.css";

export default function ContactForm({ t, privacyHref }: { t: Dictionary["contact"]; privacyHref: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { ok: false });
  // Startzeit erst im Browser setzen (Spam-Schutz); beim Vorab-Rendern gibt es keine Uhrzeit
  const startedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);
  const e = state.errors ?? {};
  const v = state.values;

  if (state.ok) {
    return (
      <p className={styles.success} role="status">
        {t.success}
      </p>
    );
  }

  return (
    <form action={action} className={styles.form} noValidate>
      {e.form && (
        <p className={styles.formError} role="alert">
          {t.errors.generic}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="name">{t.name}</label>
        <input id="name" name="name" autoComplete="name" defaultValue={v?.name} required aria-invalid={e.name || undefined} aria-describedby={e.name ? "name-err" : undefined} />
        {e.name && <span id="name-err" className={styles.err}>{t.errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">{t.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={v?.email} required aria-invalid={e.email || undefined} aria-describedby={e.email ? "email-err" : undefined} />
        {e.email && <span id="email-err" className={styles.err}>{t.errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">{t.message}</label>
        <textarea id="message" name="message" rows={6} defaultValue={v?.message} required aria-invalid={e.message || undefined} aria-describedby={e.message ? "message-err" : undefined} />
        {e.message && <span id="message-err" className={styles.err}>{t.errors.message}</span>}
      </div>

      <label className={styles.check}>
        <input type="checkbox" name="consent" required aria-invalid={e.consent || undefined} />
        <span>
          {t.consent} <a href={privacyHref}>{t.privacyLink}</a>
        </span>
      </label>
      {e.consent && <span className={styles.err}>{t.errors.consent}</span>}

      {/* Spam-Schutz: unsichtbar für Menschen */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedRef} type="hidden" name="started" defaultValue="" />

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}
