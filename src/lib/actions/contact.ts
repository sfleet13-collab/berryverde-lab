"use server";

import { headers } from "next/headers";
import { sendMail } from "@/lib/mail";

export type ContactState = {
  ok: boolean;
  errors?: Partial<
    Record<"name" | "email" | "message" | "consent" | "form", true>
  >;
  /** Eingaben zurückgeben, damit bei Fehlern nichts verloren geht */
  values?: { name: string; email: string; message: string };
};

/** Einfacher Schutz gegen Massen-Anfragen (pro Server-Instanz). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
}

export async function submitContact(
  _prev: ContactState,
  form: FormData,
): Promise<ContactState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const consent = form.get("consent") === "on";

  const errors: ContactState["errors"] = {};
  if (name.length < 2 || name.length > 120) errors.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200)
    errors.email = true;
  if (message.length < 10 || message.length > 5000) errors.message = true;
  if (!consent) errors.consent = true;
  if (Object.keys(errors).length)
    return { ok: false, errors, values: { name, email, message } };

  // Spam-Schutz 1: verstecktes Feld muss leer bleiben
  if (String(form.get("website") ?? "")) return { ok: true };
  // Spam-Schutz 2: Bots senden in unter 2 Sekunden
  const started = Number(form.get("started") ?? 0);
  if (!started || Date.now() - started < 2000) return { ok: true };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip))
    return {
      ok: false,
      errors: { form: true },
      values: { name, email, message },
    };

  try {
    await sendMail({
      subject: `Neue Kontaktanfrage von ${name}`,
      replyTo: email,
      text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
    });
    return { ok: true };
  } catch (err) {
    console.error("Kontaktformular:", err);
    return {
      ok: false,
      errors: { form: true },
      values: { name, email, message },
    };
  }
}
