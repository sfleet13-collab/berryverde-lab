import { L } from "@/i18n/lab";
import type { Berechnung } from "./rechner";

/**
 * Blog-Entwurf OHNE Mengen: Die genaue Rezeptur bleibt in Dein Lab.
 * Zeilen der Herstellung, die Zahlen mit Einheit enthalten (g, %, ml, Tropfen), werden entschärft.
 */
export function blogEntwurf(opt: {
  name: string;
  untertitel: string | null;
  kernaussagen: string | null;
  herstellung: string | null;
  anwendung: string | null;
  b: Berechnung;
  funktionen: Record<number, string | null>;
}): string {
  const ohneMengen = (s: string) =>
    s
      .replace(/\(?\s*[≈~]?\s*\d+(?:[.,]\d+)?\s*(?:g|mg|kg|%|Prozent|Gramm)\b\s*\)?/gi, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([.,;:])/g, "$1")
      .trim();
  const schritte = (opt.herstellung ?? "")
    .split("\n")
    .map((s) => ohneMengen(s.trim()))
    .filter(Boolean);
  const zutaten = [...opt.b.positionen]
    .filter((p) => p.prozentEffektiv > 0)
    .sort((a, c) => c.prozentEffektiv - a.prozentEffektiv)
    .map((p) => `- ${p.rohstoff.name}${opt.funktionen[p.rohstoffId] ? `: ${opt.funktionen[p.rohstoffId]}` : ""}`);

  return [
    `${opt.name}${opt.untertitel ? `: ${opt.untertitel}` : ""}`,
    opt.kernaussagen?.trim() ?? "",
    `${L.rezeptur.blogBrauchst}\n${zutaten.join("\n")}`,
    schritte.length ? `${L.rezeptur.blogSo}\n${schritte.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : "",
    opt.anwendung ? `${L.rezeptur.blogAnwendung}\n${opt.anwendung.trim()}` : "",
    L.rezeptur.blogSchluss,
  ]
    .filter(Boolean)
    .join("\n\n");
}
