import { LAB } from "./types";
import { chargenNummer, haltbarBis } from "./rechner";

export const DATUM = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Berlin",
});

/** Heutiges Datum in Deutschland als JJJJ-MM-TT (Vercel rechnet in UTC). */
export function heuteIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Herstelldatum aus der Adresse (?d=JJJJ-MM-TT), sonst heute. Mittags, damit die Zeitzone den Tag nicht verschiebt. */
export function herstelldatum(d?: string): { iso: string; datum: Date } {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(d ?? "") ? d! : heuteIso();
  return { iso, datum: new Date(`${iso}T12:00:00Z`) };
}

/** Menge aus der Adresse (?g=…), sonst die Charge der Rezeptur. */
export function mengeAus(g: string | undefined, standard: number): number {
  const n = Number(String(g ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 && n <= 5000 ? n : standard;
}

export type EtikettDaten = {
  name: string;
  frischcreme: boolean;
  hergestellt: string;
  haltbarBis: string;
  charge: string;
  inci: string;
};

export function etikettDaten(opt: {
  name: string;
  nummer: string | null;
  id: number;
  frischcreme: boolean;
  haltbarkeitTage: number | null;
  haltbarkeitMaxTage: number | null;
  hergestellt: Date;
  inci: string;
}): EtikettDaten {
  const tage = opt.frischcreme
    ? LAB.frischcremeTage
    : Math.min(
        opt.haltbarkeitTage ?? opt.haltbarkeitMaxTage ?? 90,
        opt.haltbarkeitMaxTage ?? 10000,
      );
  return {
    name: opt.name,
    frischcreme: opt.frischcreme,
    hergestellt: DATUM.format(opt.hergestellt),
    haltbarBis: DATUM.format(haltbarBis(opt.hergestellt, tage)),
    charge: chargenNummer(opt.hergestellt, opt.nummer ?? `E${opt.id}`),
    inci: opt.inci,
  };
}

/** Raster der A4-Bögen in mm. Rechteck = gängiger Bogen mit 21 Etiketten (63,5 × 38,1 mm). */
export const BOEGEN = {
  rechteck: {
    breite: 63.5,
    hoehe: 38.1,
    spalten: 3,
    zeilen: 7,
    links: 7.21,
    oben: 15.15,
    abstandX: 66.04,
    abstandY: 38.1,
  },
  rund: {
    breite: 40,
    hoehe: 40,
    spalten: 4,
    zeilen: 6,
    links: 15,
    oben: 13.5,
    abstandX: 47,
    abstandY: 46,
  },
} as const;
export type Format = keyof typeof BOEGEN;
