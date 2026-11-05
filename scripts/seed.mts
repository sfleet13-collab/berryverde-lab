/**
 * Startbestand beim Deployment einspielen (läuft nach den Migrationen, siehe "build" in package.json).
 * Die Logik steht in src/db/seed.ts. Ohne DATABASE_URL wird nichts gemacht.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.log("[seed] Keine Datenbank verbunden – übersprungen.");
  process.exit(0);
}

try {
  const r = await seed(drizzle(neon(url), { schema }));
  console.log(`[seed] Startbestand aktuell (${r.neu} neue Rohstoffe, ${r.ergaenzt} ergänzt, ${r.neueRezepturen} neue Rezepturen).`);
} catch (err) {
  console.error("[seed] Fehler – Deployment wird abgebrochen, die Live-Seite bleibt unverändert:", err);
  process.exit(1);
}
