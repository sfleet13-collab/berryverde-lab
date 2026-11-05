import "server-only";
import { and, asc, desc, eq, inArray, or, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { Dosierung, Geraet, Position, Rezeptur, Rohstoff, Zugang } from "@/db/schema";
import { isAdmin, type SessionUser } from "./auth";
import { labRohstoff } from "./lab/map";
import type { LabRohstoff, Phase, Produkttyp, Stufe } from "./lab/types";

/**
 * ALLE Datenzugriffe laufen über diese Datei.
 *
 * Regeln für Dein Lab:
 * - Rohstoffe und Geräte sind Stammdaten: alle Mitglieder lesen, nur Admins ändern.
 * - Rezepturen: Mitglieder sehen die freigegebene Bibliothek und ihre eigenen. Ändern nur eigene.
 *   Admins sehen und ändern alles.
 * - Zugänge: nur Admins.
 */

const { rohstoffe, rohstoffDosierungen, geraete, rezepturen, rezepturPositionen, zugaenge } = schema;

function db() {
  const d = getDb();
  if (!d) throw new Error("Datenbank nicht verbunden");
  return d;
}

function nurMitglied(user: SessionUser) {
  if (!user.mitglied) throw new Error("Kein Zugang");
}
function nurAdmin(user: SessionUser) {
  if (!isAdmin(user)) throw new Error("Nur für Admins");
}

// ---------------------------------------------------------------- Rohstoffe

export type RohstoffMitDosierung = Rohstoff & { dosierungen: Dosierung[] };

export async function listRohstoffe(user: SessionUser, opt: { auchInaktive?: boolean } = {}): Promise<RohstoffMitDosierung[]> {
  nurMitglied(user);
  const zeigeInaktive = opt.auchInaktive && isAdmin(user);
  const rows = await db()
    .select()
    .from(rohstoffe)
    .where(zeigeInaktive ? undefined : eq(rohstoffe.aktiv, true))
    .orderBy(asc(rohstoffe.name));
  const dos = await db().select().from(rohstoffDosierungen);
  return rows.map((r) => ({ ...r, dosierungen: dos.filter((d) => d.rohstoffId === r.id) }));
}

export function alsLab(rows: RohstoffMitDosierung[]): LabRohstoff[] {
  return rows.map((r) => labRohstoff(r, r.dosierungen));
}

export async function getRohstoff(user: SessionUser, id: number): Promise<RohstoffMitDosierung | null> {
  nurMitglied(user);
  const [r] = await db().select().from(rohstoffe).where(eq(rohstoffe.id, id)).limit(1);
  if (!r || (!r.aktiv && !isAdmin(user))) return null;
  const dos = await db().select().from(rohstoffDosierungen).where(eq(rohstoffDosierungen.rohstoffId, id));
  return { ...r, dosierungen: dos };
}

export type RohstoffEingabe = Omit<typeof rohstoffe.$inferInsert, "id" | "createdAt">;
export type DosierungEingabe = { produkttyp: Produkttyp | "alle"; min: number; max: number; hinweis: string | null };

export async function saveRohstoff(user: SessionUser, id: number | null, werte: RohstoffEingabe, dosierungen: DosierungEingabe[]) {
  nurAdmin(user);
  let rohstoffId = id;
  if (rohstoffId) {
    await db().update(rohstoffe).set(werte).where(eq(rohstoffe.id, rohstoffId));
    await db().delete(rohstoffDosierungen).where(eq(rohstoffDosierungen.rohstoffId, rohstoffId));
  } else {
    const [row] = await db().insert(rohstoffe).values(werte).returning({ id: rohstoffe.id });
    rohstoffId = row.id;
  }
  if (dosierungen.length > 0) {
    await db().insert(rohstoffDosierungen).values(dosierungen.map((d) => ({ ...d, rohstoffId: rohstoffId! })));
  }
  return rohstoffId;
}

// ---------------------------------------------------------------- Geräte

export async function listGeraete(user: SessionUser): Promise<Geraet[]> {
  nurMitglied(user);
  return db().select().from(geraete).orderBy(asc(geraete.id));
}

export async function saveGeraetLink(user: SessionUser, id: number, link: string | null, linkAffiliate: boolean) {
  nurAdmin(user);
  await db().update(geraete).set({ link, linkAffiliate }).where(eq(geraete.id, id));
}

// ---------------------------------------------------------------- Rezepturen

export type RezepturMitPositionen = Rezeptur & { positionen: Position[] };

/** Sichtbar: freigegebene Bibliothek + eigene. Admins: alles. */
function sichtbar(user: SessionUser): SQL | undefined {
  if (isAdmin(user)) return undefined;
  return or(and(eq(rezepturen.bibliothek, true), eq(rezepturen.status, "freigegeben")), eq(rezepturen.userId, user.id));
}

/** Änderbar: eigene. Admins: alles. */
function aenderbar(user: SessionUser, id: number): SQL | undefined {
  return isAdmin(user) ? eq(rezepturen.id, id) : and(eq(rezepturen.id, id), eq(rezepturen.userId, user.id));
}

export function darfAendern(user: SessionUser, r: Rezeptur): boolean {
  return isAdmin(user) || r.userId === user.id;
}

export async function listRezepturen(user: SessionUser): Promise<RezepturMitPositionen[]> {
  nurMitglied(user);
  const rows = await db()
    .select()
    .from(rezepturen)
    .where(sichtbar(user))
    .orderBy(desc(rezepturen.bibliothek), asc(rezepturen.nummer), desc(rezepturen.updatedAt))
    .limit(500);
  if (rows.length === 0) return [];
  const pos = await db()
    .select()
    .from(rezepturPositionen)
    .where(inArray(rezepturPositionen.rezepturId, rows.map((r) => r.id)));
  return rows.map((r) => ({ ...r, positionen: pos.filter((p) => p.rezepturId === r.id) }));
}

export async function getRezeptur(user: SessionUser, id: number): Promise<RezepturMitPositionen | null> {
  nurMitglied(user);
  const [r] = await db()
    .select()
    .from(rezepturen)
    .where(and(eq(rezepturen.id, id), sichtbar(user)))
    .limit(1);
  if (!r) return null;
  const positionen = await db()
    .select()
    .from(rezepturPositionen)
    .where(eq(rezepturPositionen.rezepturId, id))
    .orderBy(asc(rezepturPositionen.reihenfolge), asc(rezepturPositionen.id));
  return { ...r, positionen };
}

export type RezepturEingabe = {
  name: string;
  untertitel: string | null;
  produkttyp: Produkttyp;
  emulsionstyp: "ow" | "wo" | null;
  produktart: string | null;
  bereich: "gesicht" | "koerper";
  hautbeduerfnis: string;
  ausruestung: "start" | "pro" | "zusatz";
  stufe: Stufe;
  zeitMinuten: number | null;
  chargeG: number;
  haltbarkeitTage: number | null;
  phZiel: number | null;
  frischcreme: boolean;
  geraete: string;
  herstellung: string | null;
  anwendung: string | null;
  notiz: string | null;
  // nur Admin
  nummer?: string | null;
  blogText?: string | null;
  status?: "entwurf" | "freigegeben";
  bibliothek?: boolean;
  positionen: { rohstoffId: number; phase: Phase; prozent: number; adHundert: boolean }[];
};

/** Legt eine Rezeptur an (id = null) oder speichert eine bestehende. Gibt die ID zurück. */
export async function saveRezeptur(user: SessionUser, id: number | null, e: RezepturEingabe): Promise<number> {
  nurMitglied(user);
  const admin = isAdmin(user);
  const kopf = {
    name: e.name,
    untertitel: e.untertitel,
    produkttyp: e.produkttyp,
    emulsionstyp: e.produkttyp === "emulsion" ? (e.emulsionstyp ?? "ow") : null,
    produktart: e.produktart,
    bereich: e.bereich,
    hautbeduerfnis: e.hautbeduerfnis,
    ausruestung: e.ausruestung,
    stufe: e.stufe,
    zeitMinuten: e.zeitMinuten,
    chargeG: e.chargeG,
    haltbarkeitTage: e.haltbarkeitTage,
    phZiel: e.phZiel,
    frischcreme: e.frischcreme,
    geraete: e.geraete,
    herstellung: e.herstellung,
    anwendung: e.anwendung,
    notiz: e.notiz,
    // Bibliothek, Nummer, Blog-Text und Freigabe bestimmt nur die Admin
    ...(admin
      ? { nummer: e.nummer ?? null, blogText: e.blogText ?? null, status: e.status ?? "entwurf", bibliothek: e.bibliothek ?? false }
      : {}),
    updatedAt: new Date(),
  };

  let rezepturId = id;
  if (rezepturId) {
    const [row] = await db().update(rezepturen).set(kopf).where(aenderbar(user, rezepturId)).returning({ id: rezepturen.id });
    if (!row) throw new Error("Rezeptur nicht gefunden");
    await db().delete(rezepturPositionen).where(eq(rezepturPositionen.rezepturId, rezepturId));
  } else {
    const [row] = await db()
      .insert(rezepturen)
      .values({ ...kopf, userId: user.id })
      .returning({ id: rezepturen.id });
    rezepturId = row.id;
  }
  if (e.positionen.length > 0) {
    await db()
      .insert(rezepturPositionen)
      .values(e.positionen.map((p, i) => ({ ...p, rezepturId: rezepturId!, reihenfolge: i })));
  }
  return rezepturId;
}

/** Kopiert eine sichtbare Rezeptur als eigene (privat, Entwurf). */
export async function copyRezeptur(user: SessionUser, id: number): Promise<number> {
  const quelle = await getRezeptur(user, id);
  if (!quelle) throw new Error("Rezeptur nicht gefunden");
  const { id: _id, createdAt: _c, updatedAt: _u, positionen, ...kopf } = quelle;
  void _id;
  void _c;
  void _u;
  const [row] = await db()
    .insert(rezepturen)
    .values({
      ...kopf,
      userId: user.id,
      name: `${quelle.name} (meine Variante)`,
      nummer: null,
      blogText: null,
      status: "entwurf",
      bibliothek: false,
      varianteVon: quelle.id,
    })
    .returning({ id: rezepturen.id });
  if (positionen.length > 0) {
    await db()
      .insert(rezepturPositionen)
      .values(
        positionen.map((p) => ({
          rezepturId: row.id,
          rohstoffId: p.rohstoffId,
          phase: p.phase,
          prozent: p.prozent,
          adHundert: p.adHundert,
          reihenfolge: p.reihenfolge,
          hinweis: p.hinweis,
        })),
      );
  }
  return row.id;
}

export async function deleteRezeptur(user: SessionUser, id: number) {
  nurMitglied(user);
  await db().delete(rezepturen).where(aenderbar(user, id));
}

// ---------------------------------------------------------------- Zugänge (nur Admin)

export async function listZugaenge(user: SessionUser): Promise<Zugang[]> {
  nurAdmin(user);
  return db().select().from(zugaenge).orderBy(desc(zugaenge.aktiv), desc(zugaenge.createdAt));
}

export async function addZugang(user: SessionUser, email: string, name: string | null, stufe: Stufe, notiz: string | null) {
  nurAdmin(user);
  await db()
    .insert(zugaenge)
    .values({ email: email.trim().toLowerCase(), name, stufe, notiz })
    .onConflictDoUpdate({ target: zugaenge.email, set: { aktiv: true, stufe, ...(name ? { name } : {}), ...(notiz ? { notiz } : {}) } });
}

export async function updateZugang(user: SessionUser, id: number, werte: { aktiv?: boolean; stufe?: Stufe }) {
  nurAdmin(user);
  await db().update(zugaenge).set(werte).where(eq(zugaenge.id, id));
}

export async function deleteZugang(user: SessionUser, id: number) {
  nurAdmin(user);
  await db().delete(zugaenge).where(eq(zugaenge.id, id));
}
