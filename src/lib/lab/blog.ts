import { L } from "@/i18n/lab";
import type { Berechnung, BerechnetePosition } from "./rechner";
import type { Kategorie, Phase } from "./types";

/**
 * Blog-Entwurf und Pin-Texte aus einer Rezeptur – OHNE Mengen. Die genaue Rezeptur bleibt in Dein Lab.
 * Eine Quelle, mehrere Ausgaben: H1 mit Suchbegriff, H2/H3 (Idee, Zutaten, warum sie zusammenpassen,
 * Herstellung, Anwendung), Schlusssatz mit Verweis auf Dein Lab; dazu Pin-Titel, Beschreibung, Alt-Text, Ziel-Link.
 */

export type BlogEingabe = {
  name: string;
  untertitel: string | null;
  suchbegriff: string | null;
  /** Die Idee / Kernaussagen (Feld „blogText“). */
  idee: string | null;
  /** Eigener Text „Warum sie zusammenpassen“; leer = Vorschlag aus den Rohstoffen. */
  warum: string | null;
  herstellung: string | null;
  anwendung: string | null;
  zielLink: string | null;
  fotoUrl: string | null;
  /** Hautbedürfnisse als Text, z. B. „trockene, sensible Haut“. */
  haut: string | null;
  labUrl: string;
  b: Berechnung;
  funktionen: Record<number, string | null>;
};

export type Veroeffentlichung = {
  titel: string;
  markdown: string;
  html: string;
  pin: { titel: string; beschreibung: string; alt: string; link: string };
};

const BLOG_BASIS = "https://berryverde.com";
const PIN_TITEL_MAX = 100;
const PIN_TEXT_MAX = 500;

/** Mengen (Zahl mit Einheit) aus einem Text entfernen. */
export function ohneMengen(s: string): string {
  return s
    .replace(
      /\s*\([^()]*\d[^()]*?(?:g|mg|kg|ml|%|Prozent|Gramm|Tropfen)(?![\p{L}])[^()]*\)/giu,
      "",
    )
    .replace(
      /\(?\s*[≈~]?\s*\d+(?:[.,]\d+)?\s*(?:–\s*\d+(?:[.,]\d+)?\s*)?(?:g|mg|kg|ml|%|Prozent|Gramm|Tropfen)(?![\p{L}])\s*\)?/giu,
      " ",
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

/** URL-Teil aus einem Text: „Gesichtsmaske selber machen“ → „gesichtsmaske-selber-machen“. */
export function slugAus(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function kuerze(s: string, max: number): string {
  if (s.length <= max) return s;
  const schnitt = s.slice(0, max - 1);
  const leer = schnitt.lastIndexOf(" ");
  return `${(leer > max * 0.6 ? schnitt.slice(0, leer) : schnitt).replace(/[,;:–\s]+$/, "")}…`;
}

function aufzaehlung(namen: string[]): string {
  if (namen.length <= 1) return namen.join("");
  return `${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}`;
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Sätze für „Warum sie zusammenpassen“, nach Aufgabe der Rohstoffe. [Einzahl, Mehrzahl] */
const ROLLEN: { kategorien: Kategorie[]; satz: [string, string] }[] = [
  {
    kategorien: ["oel", "butter"],
    satz: [
      "{n} bildet die pflegende Basis.",
      "{n} bilden die pflegende Basis und ergänzen sich in ihren Fettsäuren.",
    ],
  },
  {
    kategorien: ["emulgator"],
    satz: [
      "{n} verbindet Öl und Wasser zu einer stabilen Emulsion.",
      "{n} verbinden Öl und Wasser zu einer stabilen Emulsion.",
    ],
  },
  {
    kategorien: ["coemulgator", "konsistenzgeber", "wachs"],
    satz: [
      "{n} gibt Halt und die richtige Konsistenz.",
      "{n} geben Halt und die richtige Konsistenz.",
    ],
  },
  {
    kategorien: ["tensid"],
    satz: [
      "{n} reinigt mild und schäumt.",
      "{n} reinigen gemeinsam mild und schäumen angenehm.",
    ],
  },
  {
    kategorien: ["wasser", "feuchtigkeit"],
    satz: ["{n} bringt Feuchtigkeit.", "{n} bringen Feuchtigkeit."],
  },
  {
    kategorien: ["pulver"],
    satz: [
      "{n} gibt die Textur und nimmt überschüssiges Fett auf.",
      "{n} geben die Textur und nehmen überschüssiges Fett auf.",
    ],
  },
  {
    kategorien: ["peeling"],
    satz: [
      "{n} sorgt für den sanften Peeling-Effekt.",
      "{n} sorgen für den sanften Peeling-Effekt.",
    ],
  },
  {
    kategorien: ["wirkstoff"],
    satz: [
      "{n} setzt den pflegenden Akzent.",
      "{n} setzen die pflegenden Akzente.",
    ],
  },
  {
    kategorien: ["antioxidans"],
    satz: [
      "{n} schützt die Öle vor dem Ranzigwerden.",
      "{n} schützen die Öle vor dem Ranzigwerden.",
    ],
  },
  {
    kategorien: ["aetherisches_oel"],
    satz: ["{n} gibt den Duft.", "{n} geben den Duft."],
  },
  {
    kategorien: ["konservierer"],
    satz: [
      "{n} hält das Produkt frisch und schützt vor Keimen.",
      "{n} halten das Produkt frisch und schützen vor Keimen.",
    ],
  },
  {
    kategorien: ["ph_regler"],
    satz: [
      "{n} stellt den hautfreundlichen pH-Wert ein.",
      "{n} stellen den hautfreundlichen pH-Wert ein.",
    ],
  },
];

/** Vorschlag „Warum sie zusammenpassen“ aus den Aufgaben der Rohstoffe (ohne Wasser, das ist selbstverständlich). */
export function warumVorschlag(pos: BerechnetePosition[]): string {
  const saetze: string[] = [];
  for (const rolle of ROLLEN) {
    const namen = [
      ...new Set(
        pos
          .filter(
            (p) =>
              rolle.kategorien.includes(p.rohstoff.kategorie) &&
              p.rohstoff.slug !== "wasser",
          )
          .map((p) => p.rohstoff.name),
      ),
    ];
    if (namen.length === 0) continue;
    saetze.push(
      rolle.satz[namen.length === 1 ? 0 : 1].replace("{n}", aufzaehlung(namen)),
    );
  }
  return saetze.join(" ");
}

const PHASEN_REIHE: Phase[] = ["fett", "wasser", "kalt", "pulver"];

export function veroeffentlichung(e: BlogEingabe): Veroeffentlichung {
  const pos = [...e.b.positionen]
    .filter((p) => p.prozentEffektiv > 0)
    .sort((a, c) => c.prozentEffektiv - a.prozentEffektiv);
  const such = e.suchbegriff?.trim() || null;
  const titel =
    such && !e.name.toLowerCase().includes(such.toLowerCase())
      ? `${such}: ${e.name}`
      : e.name;
  const idee = ohneMengen(e.idee?.trim() || e.untertitel?.trim() || "");
  const warum = ohneMengen(e.warum?.trim() || warumVorschlag(pos));
  const schritte = (e.herstellung ?? "")
    .split("\n")
    .map((s) => ohneMengen(s.trim()))
    .filter(Boolean);
  const anwendung = ohneMengen(e.anwendung?.trim() ?? "");
  const zeile = (p: BerechnetePosition) => ({
    name: p.rohstoff.name,
    funktion: e.funktionen[p.rohstoffId] ?? null,
  });

  // Zutaten nach Phase (H3), nur wenn es mehr als eine Phase gibt
  const gruppen = PHASEN_REIHE.map((ph) => ({
    phase: ph,
    zeilen: pos.filter((p) => p.phase === ph).map(zeile),
  })).filter((g) => g.zeilen.length > 0);
  const mitPhasen = gruppen.length > 1;
  const link =
    e.zielLink?.trim() || `${BLOG_BASIS}/${slugAus(such ?? e.name)}/`;
  const T = L.blog;

  // ---------- Markdown ----------
  const md: string[] = [`# ${titel}`];
  if (e.fotoUrl) md.push(`![${e.name}](${e.fotoUrl})`);
  if (idee) md.push(`## ${T.idee}`, idee);
  md.push(`## ${T.zutaten}`);
  for (const g of gruppen) {
    if (mitPhasen) md.push(`### ${L.phase[g.phase]}`);
    md.push(
      g.zeilen
        .map((z) => `- **${z.name}**${z.funktion ? `: ${z.funktion}` : ""}`)
        .join("\n"),
    );
  }
  if (warum) md.push(`## ${T.warum}`, warum);
  if (schritte.length)
    md.push(
      `## ${T.herstellung}`,
      schritte.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    );
  if (anwendung) md.push(`## ${T.anwendung}`, anwendung);
  md.push(`${T.schluss} [${T.labLink}](${e.labUrl})`);

  // ---------- HTML (für WordPress, Code-Editor) ----------
  const h: string[] = [`<h1>${esc(titel)}</h1>`];
  if (e.fotoUrl) h.push(`<img src="${esc(e.fotoUrl)}" alt="${esc(e.name)}" />`);
  if (idee) h.push(`<h2>${esc(T.idee)}</h2>`, `<p>${esc(idee)}</p>`);
  h.push(`<h2>${esc(T.zutaten)}</h2>`);
  for (const g of gruppen) {
    if (mitPhasen) h.push(`<h3>${esc(L.phase[g.phase])}</h3>`);
    h.push(
      `<ul>\n${g.zeilen.map((z) => `  <li><strong>${esc(z.name)}</strong>${z.funktion ? `: ${esc(z.funktion)}` : ""}</li>`).join("\n")}\n</ul>`,
    );
  }
  if (warum) h.push(`<h2>${esc(T.warum)}</h2>`, `<p>${esc(warum)}</p>`);
  if (schritte.length)
    h.push(
      `<h2>${esc(T.herstellung)}</h2>`,
      `<ol>\n${schritte.map((s) => `  <li>${esc(s)}</li>`).join("\n")}\n</ol>`,
    );
  if (anwendung)
    h.push(`<h2>${esc(T.anwendung)}</h2>`, `<p>${esc(anwendung)}</p>`);
  h.push(
    `<p>${esc(T.schluss)} <a href="${esc(e.labUrl)}">${esc(T.labLink)}</a></p>`,
  );

  // ---------- Pin ----------
  const top = pos
    .filter(
      (p) =>
        p.rohstoff.slug !== "wasser" && p.rohstoff.kategorie !== "konservierer",
    )
    .slice(0, 4)
    .map((p) => p.rohstoff.name.replace(/\s*\([^)]*\)/g, ""));
  const ersterSatz = idee.split(/(?<=[.!?])\s/)[0] ?? "";
  const pinText = [
    ersterSatz,
    top.length ? `${T.pinMit} ${aufzaehlung(top)}.` : "",
    e.haut ? `${T.pinFuer} ${e.haut}.` : "",
    T.pinSchluss,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    titel,
    markdown: md.join("\n\n"),
    html: h.join("\n"),
    pin: {
      titel: kuerze(titel, PIN_TITEL_MAX),
      beschreibung: kuerze(pinText, PIN_TEXT_MAX),
      alt: kuerze(
        `${e.name}, ${T.pinAlt}${top.length ? ` ${T.pinMit.toLowerCase()} ${aufzaehlung(top.slice(0, 3))}` : ""}`,
        250,
      ),
      link,
    },
  };
}
