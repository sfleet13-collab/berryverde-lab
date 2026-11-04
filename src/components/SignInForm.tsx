"use client";

import { useActionState } from "react";
import { signInWithCode, type SignInState } from "@/lib/actions/auth";
import type { Dictionary } from "@/i18n";
import styles from "./SignInForm.module.css";

type Props = { lang: string; t: Dictionary["auth"] };

export default function SignInForm({ lang, t }: Props) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signInWithCode, { step: "email" });
  const error = state.error ? t.errors[state.error] : null;

  return (
    <div className={styles.body}>
      <form action={action} className={styles.form} noValidate>
        <input type="hidden" name="lang" value={lang} />

        {state.step === "email" ? (
          <div className={styles.field}>
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              defaultValue={state.email}
              aria-invalid={state.error === "email" || undefined}
              aria-describedby={error ? "auth-error" : undefined}
            />
          </div>
        ) : (
          <>
            <input type="hidden" name="email" value={state.email} />
            <p className={styles.sent} role="status">
              {t.codeSent.replace("{email}", state.email ?? "")}
            </p>
            <div className={styles.field}>
              <label htmlFor="otp">{t.code}</label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                required
                autoFocus
                className={styles.code}
                aria-invalid={state.error === "code" || undefined}
                aria-describedby={error ? "auth-error" : undefined}
              />
            </div>
          </>
        )}

        {error && (
          <p id="auth-error" className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {state.step === "email" ? t.sendCode : t.verify}
        </button>

        {state.step === "code" && (
          <div className={styles.links}>
            <button type="submit" name="resend" value="1" className={styles.link} disabled={pending}>
              {t.resend}
            </button>
            <a href={`/${lang}/anmelden`} className={styles.link}>
              {t.otherEmail}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
