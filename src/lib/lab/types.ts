/**
 * Datentypen für Rechner und Prüfregeln.
 * Bewusst ohne Datenbank-Abhängigkeit: läuft im Browser (Rechner live) und auf dem Server (PDF, Prüfung).
 */

export type Stufe = "anfaenger" | "mittel" | "profi";
export type Produkttyp = "emulsion" | "wasserfrei" | "waessrig";
export type Phase = "fett" | "wasser" | "kalt" | "pulver";
export type Form = "fluessig" | "fest" | "pulver";
export type Bereich = "gesicht" | "koerper";

export type Kategorie =
  | "wasser"
  | "emulgator"
  | "konsistenzgeber"
  | "oel"
  | "butter"
  | "konservierer"
  | "antioxidans"
  | "feuchtigkeit"
  | "wirkstoff"
  | "aetherisches_oel"
  | "pulver"
  | "peeling"
  | "ph_regler"
  | "sonstiges";

export type DosierBereich = { produkttyp: Produkttyp | "alle"; min: number; max: number; hinweis?: string | null };

/** Rohstoff, so wie Rechner und Regeln ihn brauchen. */
export type LabRohstoff = {
  id: number;
  slug: string;
  name: string;
  inci: string;
  kategorie: Kategorie;
  phase: Phase;
  form: Form;
  dichte: number | null;
  tropfenfaktor: number | null;
  phMin: number | null;
  phMax: number | null;
  tempMax: number | null;
  stufe: Stufe;
  konsStatus: "konservierungsmittel" | "additiv" | "rohstoff" | null;
  konsRolle: "standard" | "ko" | "kombi" | null;
  kombiPartner: string | null;
  nichtWaessrig: boolean;
  emulgatorTyp: "ow" | "wo" | null;
  fettphaseMin: number | null;
  fettphaseMax: number | null;
  emulgatorBezug: "gesamt" | "fettphase" | null;
  dosierungen: DosierBereich[];
};

export type LabPosition = {
  /** Stabiler Schlüssel der Zeile (Datenbank-ID oder temporär im Editor). */
  key: string;
  rohstoffId: number;
  phase: Phase;
  prozent: number;
  adHundert: boolean;
};

export type LabRezeptur = {
  produkttyp: Produkttyp;
  bereich: Bereich;
  chargeG: number;
  phZiel: number | null;
  frischcreme: boolean;
  positionen: LabPosition[];
};

export const STUFEN_ORDNUNG: Record<Stufe, number> = { anfaenger: 0, mittel: 1, profi: 2 };

/** Einstellungen des Rechners (Platzhalter, bis die Pipette kalibriert ist). */
export const LAB = {
  /** g pro Tropfen an der Laborbox-Pipette (Glas-Shop Art. 1011798) – Platzhalter. */
  tropfenfaktorStandard: 0.045,
  /** Tropfen nur anzeigen bis zu dieser Anzahl, darüber Gramm und ml. */
  tropfenMax: 20,
  dichteOel: 0.92,
  dichteWasser: 1,
  /** Zugabe von Konservierern, ätherischen Ölen und empfindlichen Wirkstoffen erst darunter. */
  kaltGrenze: 40,
  frischcremeTage: 7,
  phZielMin: 5.0,
  phZielMax: 5.5,
  aetherischMaxGesicht: 0.5,
  aetherischMaxKoerper: 1,
  /** Unter diesem Gewicht braucht ein fester Rohstoff die Feinwaage (0,01 g). */
  feinwaageUnterG: 1,
} as const;
