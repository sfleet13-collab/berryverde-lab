/**
 * Startbestand einspielen (Rohstoffe, Geräte, erste Rezepturen).
 * - Legt nur an, was noch FEHLT (Abgleich über slug bzw. Rezeptur-Nummer).
 * - Bei bestehenden Rohstoffen werden nur LEERE Zusatzfelder und fehlende Dosierungen ergänzt.
 *   Was Susan im Admin-Bereich ändert, bleibt.
 * Wird von scripts/seed.mts beim Deployment aufgerufen und in seed.test.ts geprüft.
 */
import { and, eq, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { SEED_QUELLE, seedGeraete, seedRezepturen, seedRohstoffe } from "./seed-data";

/** Besitzer der Bibliotheks-Rezepturen aus dem Startbestand (kein echter Nutzer). */
const SYSTEM_USER = "berryverde";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seed(db: PgDatabase<PgQueryResultHKT, typeof schema, any>) {
  const { rohstoffe, rohstoffDosierungen, geraete, rezepturen, rezepturPositionen } = schema;
  let neu = 0;
  let ergaenzt = 0;
  for (const s of seedRohstoffe) {
    const zusatz = {
      spreitung: s.spreitung ?? null,
      oxidation: s.oxidation ?? null,
      haltbarMonate: s.haltbarMonate ?? null,
      fettsaeuren: s.fettsaeuren ?? null,
      verseifungszahlKoh: s.verseifungszahlKoh ?? null,
      schmelzpunkt: s.schmelzpunkt ?? null,
      geeignetFuer: s.geeignetFuer ?? null,
      tensidKlasse: s.tensidKlasse ?? null,
      wasProzent: s.wasProzent ?? null,
      vertraeglichkeit: s.vertraeglichkeit ?? null,
      tensidRolle: s.tensidRolle ?? null,
    };
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
        quelle: s.quellen?.length ? `${SEED_QUELLE}. Quellen: ${s.quellen.join(" ")}` : SEED_QUELLE,
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
        ...zusatz,
      })
      .onConflictDoNothing({ target: rohstoffe.slug })
      .returning({ id: rohstoffe.id });
    let rohstoffId = row?.id;
    if (row) {
      neu++;
    } else {
      // Gab es schon: nur LEERE Zusatzfelder ergänzen, nichts überschreiben (Susans Änderungen bleiben)
      const set = Object.fromEntries(
        Object.entries(zusatz)
          .filter(([, v]) => v != null)
          .map(([k, v]) => [k, sql`coalesce(${rohstoffe[k as keyof typeof zusatz]}, ${v})`]),
      );
      const [vorhanden] = Object.keys(set).length
        ? await db.update(rohstoffe).set(set).where(eq(rohstoffe.slug, s.slug)).returning({ id: rohstoffe.id })
        : await db.select({ id: rohstoffe.id }).from(rohstoffe).where(eq(rohstoffe.slug, s.slug));
      rohstoffId = vorhanden?.id;
      if (Object.keys(set).length) ergaenzt++;
    }
    if (!rohstoffId) continue;
    // Fehlende Dosierungen ergänzen; vorhandene (je Produkttyp) bleiben unverändert
    for (const [produkttyp, min, max, hinweis] of s.dos ?? []) {
      await db
        .insert(rohstoffDosierungen)
        .values({ rohstoffId, produkttyp, min, max, hinweis: hinweis ?? null })
        .onConflictDoNothing({ target: [rohstoffDosierungen.rohstoffId, rohstoffDosierungen.produkttyp] });
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

  return { neu, ergaenzt, neueRezepturen };
}
