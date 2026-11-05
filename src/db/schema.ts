import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * GRUNDREGEL: Jede Tabelle mit Nutzerdaten hat eine Spalte user_id.
 * So sieht jede Person nur ihre eigenen Daten (siehe src/lib/data.ts).
 *
 * Dein Lab: Rohstoffe und Geräte sind Stammdaten (pflegt nur die Admin),
 * Rezepturen gehören immer einer Person (user_id).
 */

export const STUFEN = ["anfaenger", "mittel", "profi"] as const;
export const PRODUKTTYPEN = ["emulsion", "wasserfrei", "waessrig", "tensid"] as const;
export const EMULSIONSTYPEN = ["ow", "wo"] as const;
export const TENSIDKLASSEN = ["anionisch", "amphoter", "nichtionisch"] as const;
export const PHASEN = ["fett", "wasser", "kalt", "pulver"] as const;
export const FORMEN = ["fluessig", "fest", "pulver"] as const;
export const KATEGORIEN = [
  "wasser",
  "emulgator",
  "coemulgator",
  "konsistenzgeber",
  "wachs",
  "tensid",
  "oel",
  "butter",
  "konservierer",
  "antioxidans",
  "feuchtigkeit",
  "wirkstoff",
  "aetherisches_oel",
  "pulver",
  "peeling",
  "ph_regler",
  "sonstiges",
] as const;
export const AUSRUESTUNG = ["start", "pro", "zusatz"] as const;
export const BEREICHE = ["gesicht", "koerper"] as const;

/** Rolle und Stufe pro Nutzer. user_id = ID aus Neon Auth. */
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  stufe: text("stufe", { enum: STUFEN }).notNull().default("anfaenger"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Freigegebene Mitglieder: Nur diese E-Mail-Adressen bekommen einen Anmelde-Code. */
export const zugaenge = pgTable(
  "zugaenge",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    stufe: text("stufe", { enum: STUFEN }).notNull().default("anfaenger"),
    aktiv: boolean("aktiv").notNull().default(true),
    notiz: text("notiz"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("zugaenge_email_idx").on(t.email)],
);

/** Rohstoff-Datenbank (Regelwerk Abschnitt 1). */
export const rohstoffe = pgTable(
  "rohstoffe",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    handelsnamen: text("handelsnamen"),
    inci: text("inci").notNull(),
    kategorie: text("kategorie", { enum: KATEGORIEN }).notNull(),
    funktion: text("funktion"),
    phase: text("phase", { enum: PHASEN }).notNull(),
    form: text("form", { enum: FORMEN }).notNull(),
    /** g/ml – für die Umrechnung in ml. Leer = 1,00 (Wasser) bzw. 0,92 (Öle). */
    dichte: numeric("dichte", { precision: 5, scale: 3, mode: "number" }),
    /** g pro Tropfen an der Laborbox-Pipette. Leer = Platzhalter aus den Einstellungen. */
    tropfenfaktor: numeric("tropfenfaktor", { precision: 6, scale: 4, mode: "number" }),
    phMin: numeric("ph_min", { precision: 4, scale: 2, mode: "number" }),
    phMax: numeric("ph_max", { precision: 4, scale: 2, mode: "number" }),
    tempMax: integer("temp_max"),
    loeslichkeit: text("loeslichkeit", { enum: ["wasser", "oel", "beides", "unloeslich"] }),
    stufe: text("stufe", { enum: STUFEN }).notNull().default("anfaenger"),
    lieferant: text("lieferant"),
    /** Nachbestell-Link; affiliate = Provisions-Link, wird gekennzeichnet. */
    kaufLink: text("kauf_link"),
    kaufLinkAffiliate: boolean("kauf_link_affiliate").notNull().default(false),
    steckbriefWas: text("steckbrief_was"),
    steckbriefChemisch: text("steckbrief_chemisch"),
    steckbriefWirkung: text("steckbrief_wirkung"),
    hinweis: text("hinweis"),
    quelle: text("quelle"),

    // Konservierer
    wirkBakterien: text("wirk_bakterien"),
    wirkHefen: text("wirk_hefen"),
    wirkSchimmel: text("wirk_schimmel"),
    breitband: boolean("breitband"),
    /** konservierungsmittel | additiv (multifunktionell) | rohstoff (z. B. Alkohol) */
    konsStatus: text("kons_status", { enum: ["konservierungsmittel", "additiv", "rohstoff"] }),
    /** standard = reicht allein · ko = nur ergänzend · kombi = nur mit Partner */
    konsRolle: text("kons_rolle", { enum: ["standard", "ko", "kombi"] }),
    kombiPartner: text("kombi_partner"),
    /** In rein wässrigen Produkten schlecht löslich (Cosgard, Euxyl K903, Rokonsal). */
    nichtWaessrig: boolean("nicht_waessrig").notNull().default(false),

    // Emulgatoren
    emulgatorTyp: text("emulgator_typ", { enum: ["ow", "wo"] }),
    hlb: numeric("hlb", { precision: 4, scale: 1, mode: "number" }),
    fettphaseMin: numeric("fettphase_min", { precision: 5, scale: 2, mode: "number" }),
    fettphaseMax: numeric("fettphase_max", { precision: 5, scale: 2, mode: "number" }),
    /** Dosierung bezieht sich auf die Gesamtmenge oder auf die Fettphase (Olivem 900). */
    emulgatorBezug: text("emulgator_bezug", { enum: ["gesamt", "fettphase"] }),
    hautgefuehl: text("hautgefuehl"),
    konsistenzgeberNoetig: boolean("konsistenzgeber_noetig"),

    // Öle, Buttern, Wachse
    spreitung: text("spreitung", { enum: ["schnell", "mittel", "langsam"] }),
    oxidation: text("oxidation", { enum: ["stabil", "mittel", "empfindlich"] }),
    haltbarMonate: integer("haltbar_monate"),
    fettsaeuren: text("fettsaeuren"),
    /** mg KOH pro g Öl – Grundlage für den Seifenrechner (V2). */
    verseifungszahlKoh: numeric("verseifungszahl_koh", { precision: 6, scale: 1, mode: "number" }),
    schmelzpunkt: integer("schmelzpunkt"),
    geeignetFuer: text("geeignet_fuer"),

    // Tenside
    tensidKlasse: text("tensid_klasse", { enum: TENSIDKLASSEN }),
    /** Waschaktive Substanz des Handelsprodukts in %. */
    wasProzent: numeric("was_prozent", { precision: 5, scale: 2, mode: "number" }),
    vertraeglichkeit: text("vertraeglichkeit", { enum: ["sehr gut", "gut", "akzeptabel"] }),
    tensidRolle: text("tensid_rolle", { enum: ["basistensid", "kotensid", "mischtensid"] }),

    aktiv: boolean("aktiv").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("rohstoffe_slug_idx").on(t.slug)],
);

/** Dosierung min/max in Prozent je Produkttyp ("alle" = gilt überall, wo nichts Genaueres steht). */
export const rohstoffDosierungen = pgTable(
  "rohstoff_dosierungen",
  {
    id: serial("id").primaryKey(),
    rohstoffId: integer("rohstoff_id")
      .notNull()
      .references(() => rohstoffe.id, { onDelete: "cascade" }),
    produkttyp: text("produkttyp", { enum: [...PRODUKTTYPEN, "alle"] }).notNull(),
    min: numeric("min", { precision: 6, scale: 3, mode: "number" }).notNull(),
    max: numeric("max", { precision: 6, scale: 3, mode: "number" }).notNull(),
    hinweis: text("hinweis"),
  },
  (t) => [uniqueIndex("dosierung_rohstoff_typ_idx").on(t.rohstoffId, t.produkttyp)],
);

/** Geräte mit Empfehlungs-Link (Feinwaage, Aufschäumer, pH-Meter). */
export const geraete = pgTable(
  "geraete",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    beschreibung: text("beschreibung"),
    link: text("link"),
    linkAffiliate: boolean("link_affiliate").notNull().default(true),
  },
  (t) => [uniqueIndex("geraete_slug_idx").on(t.slug)],
);

/** Rezepturen: Susans Bibliothek (bibliothek = true) und eigene der Mitglieder. */
export const rezepturen = pgTable(
  "rezepturen",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    nummer: text("nummer"),
    name: text("name").notNull(),
    untertitel: text("untertitel"),
    produkttyp: text("produkttyp", { enum: PRODUKTTYPEN }).notNull(),
    /** Nur bei Emulsionen: Öl in Wasser (Creme, Lotion) oder Wasser in Öl (Salbe, Schutzcreme). */
    emulsionstyp: text("emulsionstyp", { enum: EMULSIONSTYPEN }),
    produktart: text("produktart"),
    bereich: text("bereich", { enum: BEREICHE }).notNull().default("gesicht"),
    /** Kommagetrennt: alle, trocken, fettig, sensibel, reif, misch */
    hautbeduerfnis: text("hautbeduerfnis").notNull().default("alle"),
    ausruestung: text("ausruestung", { enum: AUSRUESTUNG }).notNull().default("start"),
    stufe: text("stufe", { enum: STUFEN }).notNull().default("anfaenger"),
    zeitMinuten: integer("zeit_minuten"),
    chargeG: numeric("charge_g", { precision: 7, scale: 2, mode: "number" }).notNull().default(30),
    haltbarkeitTage: integer("haltbarkeit_tage"),
    phZiel: numeric("ph_ziel", { precision: 4, scale: 2, mode: "number" }),
    /** Frischcreme: bewusst ohne Konservierer, 7 Tage im Kühlschrank. */
    frischcreme: boolean("frischcreme").notNull().default(false),
    /** Zusatzgeräte (Slugs aus geraete), kommagetrennt. */
    geraete: text("geraete").notNull().default(""),
    herstellung: text("herstellung"),
    anwendung: text("anwendung"),
    /** Kernaussagen für den Blog-Entwurf (ohne Mengen). */
    blogText: text("blog_text"),
    notiz: text("notiz"),
    status: text("status", { enum: ["entwurf", "freigegeben"] }).notNull().default("entwurf"),
    bibliothek: boolean("bibliothek").notNull().default(false),
    varianteVon: integer("variante_von"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rezepturen_user_id_idx").on(t.userId), index("rezepturen_bibliothek_idx").on(t.bibliothek)],
);

export const rezepturPositionen = pgTable(
  "rezeptur_positionen",
  {
    id: serial("id").primaryKey(),
    rezepturId: integer("rezeptur_id")
      .notNull()
      .references(() => rezepturen.id, { onDelete: "cascade" }),
    rohstoffId: integer("rohstoff_id")
      .notNull()
      .references(() => rohstoffe.id),
    phase: text("phase", { enum: PHASEN }).notNull(),
    prozent: numeric("prozent", { precision: 6, scale: 3, mode: "number" }).notNull().default(0),
    /** Ausgleichsposten: füllt auf 100 % auf (meist Wasser). */
    adHundert: boolean("ad_hundert").notNull().default(false),
    reihenfolge: integer("reihenfolge").notNull().default(0),
    hinweis: text("hinweis"),
  },
  (t) => [index("positionen_rezeptur_idx").on(t.rezepturId)],
);

export type Profile = typeof profiles.$inferSelect;
export type Zugang = typeof zugaenge.$inferSelect;
export type Rohstoff = typeof rohstoffe.$inferSelect;
export type Dosierung = typeof rohstoffDosierungen.$inferSelect;
export type Geraet = typeof geraete.$inferSelect;
export type Rezeptur = typeof rezepturen.$inferSelect;
export type Position = typeof rezepturPositionen.$inferSelect;
