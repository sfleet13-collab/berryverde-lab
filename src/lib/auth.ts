import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { emailAllowed } from "@/config/site";
import { authConfigured, getAuth } from "./neon-auth";

/**
 * LOGIN – die einzige Stelle, an der die App den Login-Anbieter anspricht.
 * Aktuell: Neon Auth. Ein Wechsel (z. B. zu Clerk) passiert nur hier.
 */

export { authConfigured };
export type Role = "user" | "admin";
export type SessionUser = { id: string; email?: string; name?: string; role: Role };

export async function getCurrentUser(): Promise<SessionUser | null> {
  const auth = getAuth();
  if (!auth) return null;
  const { data } = await auth.getSession();
  const u = data?.user;
  if (!u) return null;
  // Privat-Modus: nur freigegebene E-Mail-Adressen (gilt auch für Google-Login)
  if (!emailAllowed(u.email)) return null;
  return { id: u.id, email: u.email ?? undefined, name: u.name ?? undefined, role: await roleFor(u.id, u.email) };
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "admin";
}

/** Rolle aus der Tabelle "profiles"; beim ersten Login wird ein Profil angelegt. */
async function roleFor(userId: string, email?: string | null): Promise<Role> {
  const db = getDb();
  if (!db) return "user";
  const [row] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId)).limit(1);
  if (row) return row.role;
  await db.insert(schema.profiles).values({ userId, email: email ?? null }).onConflictDoNothing();
  return "user";
}
