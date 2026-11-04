import { notFound } from "next/navigation";
import { isLocale, site, type Locale } from "@/config/site";
import de, { type Dictionary } from "./de";

export type { Dictionary };

/** Wandelt alle Texte rekursiv um (ß -> ss für Schweizer Schreibweise). */
function swissify<T>(value: T): T {
  if (typeof value === "string") return value.replace(/ß/g, "ss") as T;
  if (Array.isArray(value)) return value.map(swissify) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, swissify(v)]),
    ) as T;
  }
  return value;
}

const deFinal = site.spelling === "de-CH" ? swissify(de) : de;
const dictionaries: Record<Locale, Dictionary> = { de: deFinal };

export function getDictionary(lang: string): Dictionary {
  if (!isLocale(lang)) notFound();
  return dictionaries[lang];
}

/** Pfad mit Sprachpräfix, z. B. href("de", "/kontakt") -> "/de/kontakt" */
export function href(lang: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}
