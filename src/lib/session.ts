import "server-only";
import { redirect } from "next/navigation";
import {
  authConfigured,
  getCurrentUser,
  isAdmin,
  type SessionUser,
} from "./auth";

/**
 * Zugangsprüfung für Seiten im App-Bereich.
 * - nicht angemeldet → Anmeldeseite
 * - angemeldet, aber nicht (mehr) freigeschaltet → Hinweisseite
 */
export async function requireMitglied(lang = "de"): Promise<SessionUser> {
  if (!authConfigured) redirect(`/${lang}/anmelden`);
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/anmelden`);
  if (!user.mitglied) redirect(`/${lang}/kein-zugang`);
  return user;
}

export async function requireAdmin(lang = "de"): Promise<SessionUser> {
  const user = await requireMitglied(lang);
  if (!isAdmin(user)) redirect(`/${lang}/app`);
  return user;
}
