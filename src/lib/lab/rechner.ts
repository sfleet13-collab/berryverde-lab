import { LAB, type LabPosition, type LabRezeptur, type LabRohstoff } from "./types";

/** Auf zwei Nachkommastellen runden, ohne Gleitkomma-Reste (0.1 + 0.2). */
export function runde(wert: number, stellen = 2): number {
  const f = 10 ** stellen;
  return Math.round((wert + Number.EPSILON) * f) / f;
}

export type Mengenangabe =
  | { art: "tropfen"; tropfen: number; gramm: number }
  | { art: "ml"; ml: number; gramm: number }
  | { art: "gramm"; gramm: number; feinwaage: boolean };

export type BerechnetePosition = LabPosition & {
  rohstoff: LabRohstoff;
  /** Tatsächlicher Anteil (bei „ad 100“ der berechnete Rest). */
  prozentEffektiv: number;
  gramm: number;
  menge: Mengenangabe;
};

export type Berechnung = {
  positionen: BerechnetePosition[];
  /** Summe ohne den Ausgleichsposten. */
  summeOhneAusgleich: number;
  /** Summe aller Anteile (mit Ausgleich = 100, sonst die echte Summe). */
  summe: number;
  /** Gesamtgewicht aus Menge und Summe (nicht aus gerundeten Zeilen addiert). */
  gesamtG: number;
  hatAusgleich: boolean;
  fettphase: number;
  wasserphase: number;
  /** Enthält die Rezeptur Wasser (Wasserphase oder wässriger Rohstoff)? */
  hatWasser: boolean;
  emulgator: { gesamt: number; aufFettphase: number } | null;
  konserviererGesamt: number;
  aetherischGesamt: number;
  brauchtFeinwaage: boolean;
};

function dichteVon(r: LabRohstoff): number {
  if (r.dichte && r.dichte > 0) return r.dichte;
  return r.phase === "fett" || r.kategorie === "oel" ? LAB.dichteOel : LAB.dichteWasser;
}

/** Gramm → Anzeige: Tropfen bis 20 Stück, darüber ml; Festes und Pulver immer in Gramm. */
export function mengeFuer(r: LabRohstoff, gramm: number): Mengenangabe {
  if (r.form !== "fluessig") {
    return { art: "gramm", gramm: runde(gramm), feinwaage: gramm > 0 && gramm < LAB.feinwaageUnterG };
  }
  const faktor = r.tropfenfaktor && r.tropfenfaktor > 0 ? r.tropfenfaktor : LAB.tropfenfaktorStandard;
  const tropfen = gramm / faktor;
  if (tropfen <= LAB.tropfenMax + 0.5) {
    return { art: "tropfen", tropfen: Math.max(gramm > 0 ? 1 : 0, Math.round(tropfen)), gramm: runde(gramm) };
  }
  return { art: "ml", ml: runde(gramm / dichteVon(r), 1), gramm: runde(gramm) };
}

/**
 * Rechnet eine Rezeptur durch: Ausgleich „ad 100“, Gramm je Position,
 * Fettphase, Emulgatoranteil (auf Gesamt und auf Fettphase), Konservierer.
 * Positionen mit unbekanntem Rohstoff werden übersprungen.
 */
export function berechne(rezeptur: LabRezeptur, rohstoffe: Map<number, LabRohstoff>): Berechnung {
  const zeilen = rezeptur.positionen.filter((p) => rohstoffe.has(p.rohstoffId));
  const ausgleich = zeilen.find((p) => p.adHundert);
  const summeOhneAusgleich = runde(
    zeilen.filter((p) => p !== ausgleich).reduce((s, p) => s + (Number.isFinite(p.prozent) ? p.prozent : 0), 0),
    3,
  );
  const rest = runde(100 - summeOhneAusgleich, 3);
  const charge = rezeptur.chargeG > 0 ? rezeptur.chargeG : 0;

  const positionen: BerechnetePosition[] = zeilen.map((p) => {
    const rohstoff = rohstoffe.get(p.rohstoffId)!;
    const prozentEffektiv = p === ausgleich ? Math.max(0, rest) : Number.isFinite(p.prozent) ? p.prozent : 0;
    const gramm = (charge * prozentEffektiv) / 100;
    return { ...p, rohstoff, prozentEffektiv, gramm: runde(gramm), menge: mengeFuer(rohstoff, gramm) };
  });

  const sum = (f: (p: BerechnetePosition) => boolean) =>
    runde(positionen.filter(f).reduce((s, p) => s + p.prozentEffektiv, 0), 3);

  const fettphase = sum((p) => p.phase === "fett");
  const wasserphase = sum((p) => p.phase === "wasser");
  const emulgatorGesamt = sum((p) => p.rohstoff.kategorie === "emulgator");
  const hatWasser =
    wasserphase > 0 ||
    positionen.some((p) => p.prozentEffektiv > 0 && (p.rohstoff.kategorie === "wasser" || p.rohstoff.slug === "wasser"));

  return {
    positionen,
    summeOhneAusgleich,
    summe: ausgleich ? runde(summeOhneAusgleich + Math.max(0, rest), 3) : summeOhneAusgleich,
    gesamtG: runde((charge * (ausgleich ? runde(summeOhneAusgleich + Math.max(0, rest), 3) : summeOhneAusgleich)) / 100),
    hatAusgleich: Boolean(ausgleich),
    fettphase,
    wasserphase,
    hatWasser,
    emulgator:
      emulgatorGesamt > 0
        ? { gesamt: emulgatorGesamt, aufFettphase: fettphase > 0 ? runde((emulgatorGesamt / fettphase) * 100, 1) : 0 }
        : null,
    konserviererGesamt: sum((p) => p.rohstoff.kategorie === "konservierer"),
    aetherischGesamt: sum((p) => p.rohstoff.kategorie === "aetherisches_oel"),
    brauchtFeinwaage: positionen.some((p) => p.menge.art === "gramm" && p.menge.feinwaage),
  };
}

/**
 * INCI-Liste absteigend nach Menge. Mischungen (mehrere INCI in einem Rohstoff)
 * werden an der Stelle des Rohstoffs eingereiht; doppelte Namen erscheinen nur einmal.
 */
export function inciListe(b: Berechnung): string[] {
  const gesehen = new Set<string>();
  const out: string[] = [];
  for (const p of [...b.positionen].sort((a, c) => c.prozentEffektiv - a.prozentEffektiv)) {
    if (p.prozentEffektiv <= 0) continue;
    for (const teil of p.rohstoff.inci.split(",")) {
      const name = teil.trim();
      const key = name.toLowerCase();
      if (name && !gesehen.has(key)) {
        gesehen.add(key);
        out.push(name);
      }
    }
  }
  return out;
}

/** Zahl in deutscher Schreibweise (Komma). */
export function zahl(wert: number, stellen = 2, fest = false): string {
  return wert.toLocaleString("de-DE", {
    minimumFractionDigits: fest ? stellen : 0,
    maximumFractionDigits: stellen,
  });
}

/** „12 Tropfen“, „3,2 ml“ oder „4,50 g“. */
export function mengeText(m: Mengenangabe): string {
  if (m.art === "tropfen") return `${m.tropfen} Tropfen`;
  if (m.art === "ml") return `${zahl(m.ml, 1, true)} ml`;
  return `${zahl(m.gramm, 2, true)} g`;
}

/** Haltbar bis: Herstelldatum + Tage (Frischcreme: 7 Tage). */
export function haltbarBis(herstellung: Date, tage: number): Date {
  const d = new Date(herstellung);
  d.setDate(d.getDate() + tage);
  return d;
}

/** Chargennummer aus Datum und Rezeptur, z. B. 261115-R001. */
export function chargenNummer(herstellung: Date, kennung: string): string {
  const j = String(herstellung.getFullYear()).slice(2);
  const m = String(herstellung.getMonth() + 1).padStart(2, "0");
  const t = String(herstellung.getDate()).padStart(2, "0");
  return `${j}${m}${t}-${kennung.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || "LAB"}`;
}
