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

export function getDb() {
  if (!dbConfigured) return null;
  instance ??= drizzle(neon(process.env.DATABASE_URL!), { schema });
  return instance;
}

export { schema };
