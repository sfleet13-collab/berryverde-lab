import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { adminEmails, emailAllowed } from "@/config/site";
import { authConfigured, getAuth } from "./neon-auth";
import type { Stufe } from "./lab/types";

/**
 * LOGIN – die einzige Stelle, an der die App den Login-Anbieter anspricht.
 * Aktuell: Neon Auth. Ein Wechsel (z. B. zu Clerk) passiert nur hier.
 *
 * Dein Lab: Zugang haben Admins (ADMIN_EMAILS) und freigeschaltete Mitglieder (Tabelle "zugaenge").
 */

export { authConfigured };
export type Role = "user" | "admin";
export type SessionUser = {
  id: string;
  email?: string;
  name?: string;
  role: Role;
  /** Freigeschaltetes Mitglied (oder Admin)? */
  mitglied: boolean;
  stufe: Stufe;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const auth = getAuth();
  if (!auth) return null;
  const { data } = await auth.getSession();
  const u = data?.user;
  if (!u) return null;
  // Privat-Modus: nur freigegebene E-Mail-Adressen
  if (!emailAllowed(u.email)) return null;
  const rechte = await rechteFuer(u.id, u.email);
  return { id: u.id, email: u.email ?? undefined, name: u.name ?? undefined, ...rechte };
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "admin";
}

export function istAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails.includes(email.trim().toLowerCase());
}

/** Darf diese Adresse einen Anmelde-Code bekommen? (Admin oder aktiver Zugang) */
export async function zugangFuer(email: string): Promise<{ erlaubt: boolean; stufe: Stufe }> {
  const clean = email.trim().toLowerCase();
  if (istAdminEmail(clean)) return { erlaubt: true, stufe: "profi" };
  const db = getDb();
  if (!db) return { erlaubt: false, stufe: "anfaenger" };
  const [row] = await db.select().from(schema.zugaenge).where(eq(schema.zugaenge.email, clean)).limit(1);
  return { erlaubt: Boolean(row?.aktiv), stufe: row?.stufe ?? "anfaenger" };
}

/** Rolle aus "profiles" (beim ersten Login angelegt), Mitgliedschaft aus "zugaenge". */
async function rechteFuer(userId: string, email?: string | null): Promise<Pick<SessionUser, "role" | "mitglied" | "stufe">> {
  const db = getDb();
  const adminPerMail = istAdminEmail(email);
  if (!db) return { role: adminPerMail ? "admin" : "user", mitglied: adminPerMail, stufe: "anfaenger" };

  const [row] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId)).limit(1);
  let role: Role = row?.role ?? "user";
  if (!row) {
    await db
      .insert(schema.profiles)
      .values({ userId, email: email ?? null, role: adminPerMail ? "admin" : "user" })
      .onConflictDoNothing();
    role = adminPerMail ? "admin" : "user";
  } else if (adminPerMail && row.role !== "admin") {
    await db.update(schema.profiles).set({ role: "admin" }).where(eq(schema.profiles.userId, userId));
    role = "admin";
  }
  if (role === "admin") return { role, mitglied: true, stufe: "profi" };
  const z = email ? await zugangFuer(email) : { erlaubt: false, stufe: "anfaenger" as Stufe };
  return { role, mitglied: z.erlaubt, stufe: z.stufe };
}
