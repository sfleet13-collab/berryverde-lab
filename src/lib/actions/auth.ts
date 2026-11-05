"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/neon-auth";
import { emailAllowed, isLocale } from "@/config/site";
import { zugangFuer } from "@/lib/auth";

export type SignInState = {
  step: "email" | "code";
  email?: string;
  error?: "email" | "code" | "send" | "config" | "notAllowed";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Schritt 1: Code an die E-Mail-Adresse schicken. Schritt 2: Code prüfen und anmelden. */
export async function signInWithCode(prev: SignInState, form: FormData): Promise<SignInState> {
  const auth = getAuth();
  if (!auth) return { step: "email", error: "config" };

  const lang = String(form.get("lang") ?? "de");
  const email = String(form.get("email") ?? prev.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { step: "email", email, error: "email" };
  if (!emailAllowed(email)) return { step: "email", email, error: "notAllowed" };
  // Dein Lab: nur freigeschaltete Mitglieder (und Admins) bekommen einen Code
  if (!(await zugangFuer(email)).erlaubt) return { step: "email", email, error: "notAllowed" };

  if (prev.step === "email" || form.get("resend")) {
    const { error } = await auth.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    if (error) {
      console.error("[auth] Code senden:", error.message);
      return { step: "email", email, error: "send" };
    }
    return { step: "code", email };
  }

  const otp = String(form.get("otp") ?? "").replace(/\D/g, "");
  if (otp.length < 4) return { step: "code", email, error: "code" };
  const { error } = await auth.signIn.emailOtp({ email, otp });
  if (error) return { step: "code", email, error: "code" };

  redirect(`/${isLocale(lang) ? lang : "de"}/app`);
}

export async function signOut(form: FormData) {
  const lang = String(form.get("lang") ?? "de");
  await getAuth()?.signOut();
  redirect(`/${isLocale(lang) ? lang : "de"}`);
}
