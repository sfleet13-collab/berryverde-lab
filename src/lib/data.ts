import "server-only";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { isAdmin, type SessionUser } from "./auth";

/**
 * ALLE Datenzugriffe laufen über diese Datei.
 * Regel: Nutzer bekommen nur Datensätze mit ihrer eigenen user_id. Admins sehen alles.
 */

const { items, profiles } = schema;

/** Nur eigene Datensätze – ausser für Admins. */
function ownedBy(user: SessionUser, id: number): SQL | undefined {
  return isAdmin(user) ? eq(items.id, id) : and(eq(items.id, id), eq(items.userId, user.id));
}

export async function listItems(user: SessionUser) {
  const db = getDb();
  if (!db) return null;
  const q = db
    .select({
      id: items.id,
      title: items.title,
      note: items.note,
      done: items.done,
      createdAt: items.createdAt,
      userId: items.userId,
      ownerEmail: profiles.email,
    })
    .from(items)
    .leftJoin(profiles, eq(profiles.userId, items.userId))
    .orderBy(items.done, desc(items.createdAt))
    .limit(200);
  return isAdmin(user) ? q : q.where(eq(items.userId, user.id));
}

export async function createItem(user: SessionUser, title: string, note?: string) {
  const db = getDb();
  if (!db) throw new Error("Datenbank nicht verbunden");
  const clean = title.trim().slice(0, 200);
  if (!clean) throw new Error("Titel fehlt");
  const cleanNote = note?.trim().slice(0, 2000) || null;
  await db.insert(items).values({ userId: user.id, title: clean, note: cleanNote });
}

export async function setItemDone(user: SessionUser, id: number, done: boolean) {
  const db = getDb();
  if (!db) return;
  await db.update(items).set({ done }).where(ownedBy(user, id));
}

export async function deleteItem(user: SessionUser, id: number) {
  const db = getDb();
  if (!db) return;
  await db.delete(items).where(ownedBy(user, id));
}
