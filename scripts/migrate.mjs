/**
 * Datenbank-Migrationen beim Deployment ausführen.
 *
 * - Läuft vor jedem Build auf Vercel (siehe "build" in package.json).
 * - Wendet nur NEUE Dateien aus /drizzle an, bestehende Daten bleiben unangetastet.
 * - Ohne DATABASE_URL (z. B. lokal ohne Datenbank) wird nichts gemacht.
 *
 * Neue Tabelle/Spalte? Erst src/db/schema.ts ändern, dann `npm run db:generate`
 * und die neue Datei in /drizzle mit committen.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] Keine Datenbank verbunden – übersprungen.");
  process.exit(0);
}

try {
  await migrate(drizzle(neon(url)), { migrationsFolder: "./drizzle" });
  console.log("[migrate] Datenbank ist aktuell.");
} catch (err) {
  console.error("[migrate] Fehler – Deployment wird abgebrochen, die Live-Seite bleibt unverändert:", err);
  process.exit(1);
}
