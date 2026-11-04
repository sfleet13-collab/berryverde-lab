"use client";

import { useActionState, useState } from "react";
import { signInWithCode, type SignInState } from "@/lib/actions/auth";
import { authClient } from "@/lib/auth-client";
import type { Dictionary } from "@/i18n";
import styles from "./SignInForm.module.css";

type Props = { lang: string; t: Dictionary["auth"] };

export default function SignInForm({ lang, t }: Props) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signInWithCode, { step: "email" });
  const [googleError, setGoogleError] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function google() {
    setGoogleError(false);
    setGooglePending(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: `/${lang}/app` });
    if (error) {
      setGoogleError(true);
      setGooglePending(false);
    }
  }

  const error = state.error ? t.errors[state.error] : googleError ? t.errors.google : null;

  return (
    <div className={styles.body}>
      {state.step === "email" && (
        <>
          <button type="button" className={`btn btn-ghost ${styles.google}`} onClick={google} disabled={googlePending}>
            <GoogleMark />
            {t.google}
          </button>
          <p className={styles.or}>
            <span>{t.or}</span>
          </p>
        </>
      )}

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

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
