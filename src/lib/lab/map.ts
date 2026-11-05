import type { Dosierung, Position, Rezeptur, Rohstoff } from "@/db/schema";
import type { LabPosition, LabRezeptur, LabRohstoff } from "./types";

/** Datenbank-Zeile → Rohstoff für Rechner und Regeln. */
export function labRohstoff(r: Rohstoff, dosierungen: Dosierung[]): LabRohstoff {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    inci: r.inci,
    kategorie: r.kategorie,
    phase: r.phase,
    form: r.form,
    dichte: r.dichte,
    tropfenfaktor: r.tropfenfaktor,
    phMin: r.phMin,
    phMax: r.phMax,
    tempMax: r.tempMax,
    stufe: r.stufe,
    konsStatus: r.konsStatus,
    konsRolle: r.konsRolle,
    kombiPartner: r.kombiPartner,
    nichtWaessrig: r.nichtWaessrig,
    emulgatorTyp: r.emulgatorTyp,
    fettphaseMin: r.fettphaseMin,
    fettphaseMax: r.fettphaseMax,
    emulgatorBezug: r.emulgatorBezug,
    tensidKlasse: r.tensidKlasse,
    wasProzent: r.wasProzent,
    dosierungen: dosierungen
      .filter((d) => d.rohstoffId === r.id)
      .map((d) => ({ produkttyp: d.produkttyp, min: d.min, max: d.max, hinweis: d.hinweis })),
  };
}

export function labPosition(p: Position): LabPosition {
  return { key: `p${p.id}`, rohstoffId: p.rohstoffId, phase: p.phase, prozent: p.prozent, adHundert: p.adHundert };
}

export function labRezeptur(r: Rezeptur, positionen: Position[], chargeG?: number): LabRezeptur {
  return {
    produkttyp: r.produkttyp,
    emulsionstyp: r.emulsionstyp,
    bereich: r.bereich,
    chargeG: chargeG && chargeG > 0 ? chargeG : r.chargeG,
    phZiel: r.phZiel,
    frischcreme: r.frischcreme,
    positionen: [...positionen].sort((a, b) => a.reihenfolge - b.reihenfolge || a.id - b.id).map(labPosition),
  };
}
