import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Verbindung zur Neon-Datenbank.
 * Ohne DATABASE_URL läuft die App trotzdem – Datenbankfunktionen liefern dann nichts.
 */
export const dbConfigured = Boolean(process.env.DATABASE_URL);

let instance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Nur für Tests: eine andere Datenbank einsetzen (z. B. PGlite im Speicher). */
export function setDbForTests(db: unknown) {
  instance = db as typeof instance;
}

export function getDb() {
  if (instance) return instance;
  if (!dbConfigured) return null;
  instance ??= drizzle(neon(process.env.DATABASE_URL!), { schema });
  return instance;
}

export { schema };
