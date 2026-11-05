/** Startbestand gegen eine echte Postgres-Datenbank im Speicher (PGlite) mit den echten Migrationen. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";
import { seed } from "./seed";
import { seedRohstoffe } from "./seed-data";

test("Startbestand: legt alles an, zweiter Lauf ändert nichts, Änderungen bleiben erhalten", async () => {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });

  const erst = await seed(db);
  assert.equal(erst.neu, seedRohstoffe.length);
  assert.equal(erst.neueRezepturen, 2);

  // Susan ändert einen Wert und leert ein Zusatzfeld
  const slug = seedRohstoffe.find((r) => r.spreitung)?.slug ?? "jojobaoel";
  await db.update(schema.rohstoffe).set({ name: "Geändert", spreitung: null }).where(eq(schema.rohstoffe.slug, slug));

  const zweit = await seed(db);
  assert.equal(zweit.neu, 0);
  assert.equal(zweit.neueRezepturen, 0);
  const [r] = await db.select().from(schema.rohstoffe).where(eq(schema.rohstoffe.slug, slug));
  assert.equal(r.name, "Geändert", "geänderter Wert bleibt");
  const soll = seedRohstoffe.find((x) => x.slug === slug)?.spreitung ?? null;
  assert.equal(r.spreitung, soll, "leeres Feld wird ergänzt");

  const anzahl = await db.select().from(schema.rohstoffe);
  assert.equal(anzahl.length, seedRohstoffe.length);
});
