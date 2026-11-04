/**
 * Startbestand einspielen (Rohstoffe, Geräte, erste Rezepturen).
 *
 * - Läuft nach den Migrationen bei jedem Deployment (siehe "build" in package.json).
 * - Legt nur an, was noch FEHLT (Abgleich über slug bzw. Rezeptur-Nummer).
 *   Bestehende Einträge werden nie überschrieben: Was Susan im Admin-Bereich ändert, bleibt.
 * - Ohne DATABASE_URL wird nichts gemacht.
 */
import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { SEED_QUELLE, seedGeraete, seedRezepturen, seedRohstoffe } from "../src/db/seed-data";

/** Besitzer der Bibliotheks-Rezepturen aus dem Startbestand (kein echter Nutzer). */
const SYSTEM_USER = "berryverde";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.log("[seed] Keine Datenbank verbunden – übersprungen.");
  process.exit(0);
}

const db = drizzle(neon(url), { schema });
const { rohstoffe, rohstoffDosierungen, geraete, rezepturen, rezepturPositionen } = schema;

try {
  let neu = 0;
  for (const s of seedRohstoffe) {
    const [row] = await db
      .insert(rohstoffe)
      .values({
        slug: s.slug,
        name: s.name,
        handelsnamen: s.handelsnamen ?? null,
        inci: s.inci,
        kategorie: s.kategorie,
        funktion: s.funktion,
        phase: s.phase,
        form: s.form,
        dichte: s.dichte ?? null,
        phMin: s.phMin ?? null,
        phMax: s.phMax ?? null,
        tempMax: s.tempMax ?? null,
        loeslichkeit: s.loeslichkeit ?? null,
        stufe: s.stufe,
        hinweis: s.hinweis ?? null,
        steckbriefWas: s.was,
        steckbriefChemisch: s.chemisch,
        steckbriefWirkung: s.wirkung,
        quelle: SEED_QUELLE,
        wirkBakterien: s.wirk?.[0] ?? null,
        wirkHefen: s.wirk?.[1] ?? null,
        wirkSchimmel: s.wirk?.[2] ?? null,
        breitband: s.breitband ?? null,
        konsStatus: s.konsStatus ?? null,
        konsRolle: s.konsRolle ?? null,
        kombiPartner: s.kombiPartner ?? null,
        nichtWaessrig: s.nichtWaessrig ?? false,
        emulgatorTyp: s.emulgatorTyp ?? null,
        hlb: s.hlb ?? null,
        fettphaseMin: s.fettphase?.[0] ?? null,
        fettphaseMax: s.fettphase?.[1] ?? null,
        emulgatorBezug: s.emulgatorBezug ?? null,
        hautgefuehl: s.hautgefuehl ?? null,
        konsistenzgeberNoetig: s.konsistenzgeberNoetig ?? null,
      })
      .onConflictDoNothing({ target: rohstoffe.slug })
      .returning({ id: rohstoffe.id });
    if (!row) continue; // gab es schon
    neu++;
    for (const [produkttyp, min, max, hinweis] of s.dos ?? []) {
      await db.insert(rohstoffDosierungen).values({ rohstoffId: row.id, produkttyp, min, max, hinweis: hinweis ?? null });
    }
  }

  for (const g of seedGeraete) {
    await db.insert(geraete).values(g).onConflictDoNothing({ target: geraete.slug });
  }

  const alle = await db.select({ id: rohstoffe.id, slug: rohstoffe.slug, phase: rohstoffe.phase }).from(rohstoffe);
  const nachSlug = new Map(alle.map((r) => [r.slug, r]));
  let neueRezepturen = 0;
  for (const r of seedRezepturen) {
    const [vorhanden] = await db
      .select({ id: rezepturen.id })
      .from(rezepturen)
      .where(and(eq(rezepturen.nummer, r.nummer), eq(rezepturen.bibliothek, true)))
      .limit(1);
    if (vorhanden) continue;
    let varianteVon: number | null = null;
    if (r.variante) {
      const [basis] = await db
        .select({ id: rezepturen.id })
        .from(rezepturen)
        .where(and(eq(rezepturen.nummer, r.variante), eq(rezepturen.bibliothek, true)))
        .limit(1);
      varianteVon = basis?.id ?? null;
    }
    const { positionen, variante: _variante, ...kopf } = r;
    void _variante;
    const [row] = await db
      .insert(rezepturen)
      .values({ ...kopf, userId: SYSTEM_USER, stufe: "anfaenger", status: "freigegeben", bibliothek: true, varianteVon })
      .returning({ id: rezepturen.id });
    let i = 0;
    for (const [slug, prozent] of positionen) {
      const roh = nachSlug.get(slug);
      if (!roh) throw new Error(`Rohstoff fehlt: ${slug}`);
      await db.insert(rezepturPositionen).values({ rezepturId: row.id, rohstoffId: roh.id, phase: roh.phase, prozent, reihenfolge: i++ });
    }
    neueRezepturen++;
  }

  console.log(`[seed] Startbestand aktuell (${neu} neue Rohstoffe, ${neueRezepturen} neue Rezepturen).`);
} catch (err) {
  console.error("[seed] Fehler – Deployment wird abgebrochen, die Live-Seite bleibt unverändert:", err);
  process.exit(1);
}
