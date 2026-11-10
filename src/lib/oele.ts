/**
 * Öle für die Spreitkaskade – eine Quelle für beide öffentlichen Seiten
 * (/oel-kaskade und /oel-chart-fuer-dich).
 *
 * Einordnung nach dem Spreitmodell (Ansmann), über die Fettsäureketten.
 * `spreitung` ist eine relative Stufe für die Darstellung, kein Messwert.
 */

export type Tempo = "schnell" | "mittel" | "langsam";
export type Hauttyp = "trocken" | "misch" | "oelig";

export type Oel = {
  name: string;
  tempo: Tempo;
  spreitung: number;
  notiz: string;
  haut: Hauttyp[];
};

export const OELE: Oel[] = [
  {
    name: "Squalan",
    tempo: "schnell",
    spreitung: 100,
    notiz: "ultraleicht, geruchlos, zieht sofort ein",
    haut: ["misch", "oelig"],
  },
  {
    name: "Neutralöl (MCT)",
    tempo: "schnell",
    spreitung: 94,
    notiz: "Kokos-Ester, sehr leicht, nicht fettend",
    haut: ["oelig", "misch"],
  },
  {
    name: "Kokosöl",
    tempo: "schnell",
    spreitung: 86,
    notiz: "kurze C12-Kette, schnell, aber komedogen – sparsam",
    haut: ["trocken"],
  },
  {
    name: "Aprikosenkernöl",
    tempo: "mittel",
    spreitung: 64,
    notiz: "zart, weich, gut verträglich",
    haut: ["trocken"],
  },
  {
    name: "Traubenkernöl",
    tempo: "mittel",
    spreitung: 61,
    notiz: "leicht, mattierend, linolsäurereich",
    haut: ["misch"],
  },
  {
    name: "Distelöl",
    tempo: "mittel",
    spreitung: 58,
    notiz: "linolsäurereich, gut bei unreiner Haut",
    haut: ["oelig"],
  },
  {
    name: "Reiskeimöl",
    tempo: "mittel",
    spreitung: 55,
    notiz: "seidig, antioxidantienreich, ausgleichend",
    haut: ["oelig"],
  },
  {
    name: "Mandelöl",
    tempo: "mittel",
    spreitung: 52,
    notiz: "beruhigend, nährend, mild",
    haut: ["trocken"],
  },
  {
    name: "Jojobaöl",
    tempo: "mittel",
    spreitung: 49,
    notiz: "Wachsester, hautähnlich, reguliert",
    haut: ["misch"],
  },
  {
    name: "Avocadoöl",
    tempo: "mittel",
    spreitung: 45,
    notiz: "reichhaltig, aber mittel spreitend",
    haut: ["trocken"],
  },
  {
    name: "Sheabutter",
    tempo: "langsam",
    spreitung: 28,
    notiz: "Butter, langsam, schützender Film",
    haut: ["misch", "trocken"],
  },
  {
    name: "Kakaobutter",
    tempo: "langsam",
    spreitung: 20,
    notiz: "feste Butter, sehr reichhaltig",
    haut: ["trocken"],
  },
];

export const EBENEN: { tempo: Tempo; titel: string; tag: string }[] = [
  { tempo: "schnell", titel: "Schnell", tag: "leicht, zieht sofort ein" },
  { tempo: "mittel", titel: "Mittel", tag: "ausgleichend, seidig" },
  { tempo: "langsam", titel: "Langsam", tag: "reichhaltig, schützend" },
];

export const HAUTTYPEN: { wert: Hauttyp; titel: string }[] = [
  { wert: "trocken", titel: "Trockene Haut" },
  { wert: "misch", titel: "Mischhaut und sensibel" },
  { wert: "oelig", titel: "Ölige Haut" },
];

/** Öle von der schnellsten zur langsamsten Spreitung. */
export const REIHE = [...OELE].sort((a, b) => b.spreitung - a.spreitung);

/** Relative Fleckgrösse in Prozent der Glasschale. */
export function fleckGroesse(spreitung: number) {
  return (0.22 + ((spreitung - 18) / (100 - 18)) * (0.9 - 0.22)) * 100;
}
