import { berechne, runde, zahl, type Berechnung, type BerechnetePosition } from "./rechner";
import {
  LAB,
  STUFEN_ORDNUNG,
  type DosierBereich,
  type LabPosition,
  type LabRezeptur,
  type LabRohstoff,
  type Phase,
  type Stufe,
} from "./types";

/**
 * PRÜFREGELN nach Regelwerk (Abschnitte 2–6).
 * Die Regeln stehen hier im Code, die Werte (Bereiche, pH, Stufen) kommen aus der Rohstoff-Datenbank.
 * Jede Meldung kann einen Korrekturvorschlag tragen, den der Rechner mit einem Klick übernimmt.
 */

export type Korrektur = {
  label: string;
  /** Anteil einer Zeile setzen */
  setze?: { key: string; prozent: number }[];
  /** Zeile in eine andere Phase verschieben */
  phase?: { key: string; phase: Phase }[];
  /** Zeile zum Ausgleichsposten („ad 100“) machen */
  ausgleich?: string;
  /** Rohstoff ergänzen (Slug aus der Rohstoff-Datenbank) */
  hinzu?: { slug: string; prozent: number; phase: Phase }[];
  /** Rohstoff einer Zeile austauschen */
  ersetze?: { key: string; slug: string; prozent: number; phase: Phase }[];
};

export type Meldung = {
  code: string;
  art: "fehler" | "warnung" | "hinweis";
  titel: string;
  text: string;
  /** Betroffene Zeilen (zum Markieren in der Tabelle) */
  zeilen?: string[];
  korrektur?: Korrektur;
};

export type GeraeteBedarf = { slug: "feinwaage" | "ruehrer" | "ph-meter"; pflicht: boolean; grund: string };

export type Pruefung = {
  berechnung: Berechnung;
  meldungen: Meldung[];
  /** Höchste Stufe der enthaltenen Rohstoffe = Stufe der Rezeptur */
  stufe: Stufe;
  geraete: GeraeteBedarf[];
  /** Haltbarkeit in Tagen, die die Regeln höchstens zulassen (null = keine Vorgabe) */
  haltbarkeitMaxTage: number | null;
  ok: boolean;
};

const pct = (n: number) => `${zahl(n, 2)} %`;

function bereichFuer(r: LabRohstoff, typ: LabRezeptur["produkttyp"]): DosierBereich | null {
  return r.dosierungen.find((d) => d.produkttyp === typ) ?? r.dosierungen.find((d) => d.produkttyp === "alle") ?? null;
}

/** Nächster gültiger Wert innerhalb eines Bereichs. */
function naechster(wert: number, min: number, max: number): number {
  return runde(Math.min(max, Math.max(min, wert)), 2);
}

function hatInci(p: BerechnetePosition, name: string): boolean {
  return p.rohstoff.inci.toLowerCase().includes(name.toLowerCase());
}

export function pruefe(rezeptur: LabRezeptur, rohstoffe: Map<number, LabRohstoff>): Pruefung {
  const b = berechne(rezeptur, rohstoffe);
  const m: Meldung[] = [];
  const typ = rezeptur.produkttyp;
  const aktiv = b.positionen.filter((p) => p.prozentEffektiv > 0);
  const nachSlug = (slug: string) => aktiv.find((p) => p.rohstoff.slug === slug);

  // ---------- 0. Ungültige Anteile ----------
  const negativ = b.positionen.filter((p) => !p.adHundert && p.prozent < 0);
  if (negativ.length > 0) {
    m.push({
      code: "negativ",
      art: "fehler",
      titel: "Negativer Anteil",
      text: `Ein Anteil kann nicht unter 0 % liegen (${negativ.map((p) => p.rohstoff.name).join(", ")}).`,
      zeilen: negativ.map((p) => p.key),
      korrektur: { label: "Auf 0 % setzen", setze: negativ.map((p) => ({ key: p.key, prozent: 0 })) },
    });
  }

  // ---------- 1. Summe ----------
  if (b.positionen.length === 0) {
    m.push({ code: "leer", art: "hinweis", titel: "Noch keine Rohstoffe", text: "Füge den ersten Rohstoff hinzu, dann rechnet und prüft Dein Lab mit." });
  } else if (b.hatAusgleich) {
    if (b.summeOhneAusgleich > 100) {
      m.push({
        code: "summe-ueber",
        art: "fehler",
        titel: "Mehr als 100 %",
        text: `Die Rohstoffe ergeben zusammen ${pct(b.summeOhneAusgleich)}. Für den Ausgleich bleibt nichts übrig. Verringere einen Anteil um ${pct(runde(b.summeOhneAusgleich - 100, 3))}.`,
      });
    }
  } else if (Math.abs(b.summe - 100) > 0.005) {
    const diff = runde(100 - b.summe, 3);
    const wasser = b.positionen.find((p) => p.rohstoff.kategorie === "wasser");
    const groesste = [...b.positionen].sort((a, c) => c.prozentEffektiv - a.prozentEffektiv)[0];
    m.push({
      code: "summe",
      art: "fehler",
      titel: `Summe ist ${pct(b.summe)} statt 100 %`,
      text: diff > 0 ? `Es fehlen ${pct(diff)}.` : `Es sind ${pct(-diff)} zu viel.`,
      korrektur: wasser
        ? { label: `${wasser.rohstoff.name} als Ausgleich „ad 100“ setzen`, ausgleich: wasser.key }
        : groesste && groesste.prozentEffektiv + diff > 0
          ? {
              label: `${groesste.rohstoff.name} auf ${pct(runde(groesste.prozentEffektiv + diff, 3))} setzen`,
              setze: [{ key: groesste.key, prozent: runde(groesste.prozentEffektiv + diff, 3) }],
            }
          : undefined,
    });
  }

  // ---------- 2. Produkttyp und Wasser ----------
  if (typ === "wasserfrei" && b.hatWasser) {
    m.push({
      code: "wasser-in-wasserfrei",
      art: "fehler",
      titel: "Wasser in einer wasserfreien Rezeptur",
      text: "Sobald Wasser enthalten ist, braucht das Produkt eine Konservierung. Stelle den Produkttyp auf „Emulsion“ oder „Wässrig“ um oder nimm das Wasser heraus.",
      zeilen: aktiv.filter((p) => p.phase === "wasser" || p.rohstoff.kategorie === "wasser").map((p) => p.key),
    });
  }

  // ---------- 3. Emulgator und Fettphase ----------
  const emulgatoren = aktiv.filter((p) => p.rohstoff.kategorie === "emulgator");
  if (typ === "emulsion") {
    if (emulgatoren.length === 0 && aktiv.length > 0) {
      m.push({
        code: "emulgator-fehlt",
        art: "fehler",
        titel: "Kein Emulgator",
        text: "Eine Emulsion braucht einen Emulgator, sonst trennen sich Fett und Wasser wieder. Standard in Dein Lab ist Xyliance mit 3–5 %.",
        korrektur: { label: "Xyliance mit 4 % ergänzen", hinzu: [{ slug: "xyliance", prozent: 4, phase: "fett" }] },
      });
    }
    for (const e of emulgatoren) {
      const r = e.rohstoff;
      const d = bereichFuer(r, typ);
      const aufFett = r.emulgatorBezug === "fettphase";
      if (d) {
        const ist = aufFett ? (b.fettphase > 0 ? runde((e.prozentEffektiv / b.fettphase) * 100, 1) : 0) : e.prozentEffektiv;
        if (ist < d.min - 0.001 || ist > d.max + 0.001) {
          const zielBezug = naechster(ist, d.min, d.max);
          const ziel = aufFett ? runde((b.fettphase * zielBezug) / 100, 2) : zielBezug;
          m.push({
            code: "emulgator-menge",
            art: "fehler",
            titel: `${r.name} außerhalb des Bereichs`,
            text: aufFett
              ? `${r.name} wird auf die Fettphase gerechnet: ${pct(d.min)} bis ${pct(d.max)} der Fettphase. Aktuell sind es ${pct(ist)}.`
              : `${r.name} arbeitet zuverlässig bei ${pct(d.min)} bis ${pct(d.max)}. Aktuell sind es ${pct(ist)}.`,
            zeilen: [e.key],
            korrektur: e.adHundert ? undefined : { label: `${r.name} auf ${pct(ziel)} setzen`, setze: [{ key: e.key, prozent: ziel }] },
          });
        }
      }
      if (r.fettphaseMin != null && r.fettphaseMax != null && (b.fettphase < r.fettphaseMin - 0.001 || b.fettphase > r.fettphaseMax + 0.001)) {
        const ziel = naechster(b.fettphase, r.fettphaseMin, r.fettphaseMax);
        const diff = runde(ziel - b.fettphase, 3);
        const oel = aktiv
          .filter((p) => p.phase === "fett" && !p.adHundert && (p.rohstoff.kategorie === "oel" || p.rohstoff.kategorie === "butter"))
          .sort((a, c) => c.prozentEffektiv - a.prozentEffektiv)[0];
        m.push({
          code: "fettphase",
          art: "fehler",
          titel: `Fettphase passt nicht zu ${r.name}`,
          text: `${r.name} trägt eine Fettphase von ${pct(r.fettphaseMin)} bis ${pct(r.fettphaseMax)}. Aktuell sind es ${pct(b.fettphase)} (alle Rohstoffe der Fettphase zusammen).`,
          zeilen: [e.key],
          korrektur:
            oel && oel.prozentEffektiv + diff > 0
              ? {
                  label: `${oel.rohstoff.name} auf ${pct(runde(oel.prozentEffektiv + diff, 2))} setzen (Fettphase ${pct(ziel)})`,
                  setze: [{ key: oel.key, prozent: runde(oel.prozentEffektiv + diff, 2) }],
                }
              : undefined,
        });
      }
    }
    // Xyliance unter 25 % Fettphase braucht 0,2 % Xanthan
    const xyl = nachSlug("xyliance");
    if (xyl && b.fettphase < 25 && !nachSlug("xanthan")) {
      m.push({
        code: "xyliance-xanthan",
        art: "warnung",
        titel: "Xanthan fehlt",
        text: "Unter 25 % Fettphase wird eine Emulsion mit Xyliance zu dünn und kann sich absetzen. 0,2 % Xanthan in der Wasserphase stabilisieren sie.",
        zeilen: [xyl.key],
        korrektur: { label: "0,2 % Xanthan ergänzen", hinzu: [{ slug: "xanthan", prozent: 0.2, phase: "wasser" }] },
      });
    }
  }

  // ---------- 4. Konservierung ----------
  const kons = aktiv.filter((p) => p.rohstoff.kategorie === "konservierer");
  const wasserImProdukt = b.hatWasser && typ !== "wasserfrei";
  let haltbarkeitMaxTage: number | null = null;

  if (wasserImProdukt) {
    const alkohol = nachSlug("alkohol");
    const alkoholAnteil = alkohol
      ? typ === "emulsion"
        ? b.wasserphase > 0
          ? (alkohol.prozentEffektiv / b.wasserphase) * 100
          : 0
        : alkohol.prozentEffektiv
      : 0;
    const alkoholMin = typ === "emulsion" ? 12 : 15;
    const alkoholReicht = alkoholAnteil >= alkoholMin - 0.001;
    const standard = kons.filter((p) => p.rohstoff.konsRolle === "standard" && p.rohstoff.konsStatus === "konservierungsmittel");
    const kombiVollstaendig = kons.some(
      (p) => p.rohstoff.konsRolle === "kombi" && p.rohstoff.kombiPartner && p.rohstoff.kombiPartner.split(",").some((s) => nachSlug(s.trim())),
    );
    const nurZusatz = kons.filter((p) => p !== alkohol && !standard.includes(p));

    if (standard.length === 0 && !alkoholReicht && !kombiVollstaendig) {
      const vorschlag: Korrektur =
        typ === "emulsion"
          ? { label: "Cosgard mit 1 % ergänzen (unter 40 °C zugeben)", hinzu: [{ slug: "cosgard", prozent: 1, phase: "kalt" }] }
          : { label: "Verstatil BL mit 2 % ergänzen", hinzu: [{ slug: "verstatil-bl", prozent: 2, phase: "wasser" }] };
      if (alkohol && !alkoholReicht) {
        m.push({
          code: "alkohol-zu-wenig",
          art: "fehler",
          titel: "Alkohol konserviert so noch nicht",
          text:
            typ === "emulsion"
              ? `Alkohol konserviert eine Emulsion ab 12–15 % der Wasserphase. Aktuell sind es ${pct(runde(alkoholAnteil, 1))} der Wasserphase.`
              : `Ein wässriges Produkt braucht 15–18 % Alkohol. Aktuell sind es ${pct(runde(alkoholAnteil, 1))}.`,
          zeilen: [alkohol.key],
          korrektur:
            typ === "waessrig" && !alkohol.adHundert
              ? { label: "Alkohol auf 15 % setzen", setze: [{ key: alkohol.key, prozent: 15 }] }
              : vorschlag,
        });
      } else if (nurZusatz.length > 0) {
        const namen = nurZusatz.map((p) => p.rohstoff.name).join(", ");
        m.push({
          code: "kons-nicht-ausreichend",
          art: "fehler",
          titel: "Konservierung reicht allein nicht",
          text: `${namen} ${nurZusatz.length === 1 ? "schützt" : "schützen"} nicht gegen alle Keime und ${nurZusatz.length === 1 ? "ist" : "sind"} nur als Ergänzung oder in der vorgesehenen Kombination gedacht. Das Produkt braucht zusätzlich ein Konservierungsmittel.`,
          zeilen: nurZusatz.map((p) => p.key),
          korrektur: vorschlag,
        });
      } else if (rezeptur.frischcreme) {
        haltbarkeitMaxTage = LAB.frischcremeTage;
        m.push({
          code: "frischcreme",
          art: "warnung",
          titel: "Frischcreme ohne Konservierer",
          text: `Ohne Konservierer hält das Produkt höchstens ${LAB.frischcremeTage} Tage im Kühlschrank. Kleine Menge anrühren, sauber entnehmen, auf dem Etikett „Frischcreme, kühl lagern“ mit Datum vermerken. Bei Geruch oder Veränderung sofort entsorgen.`,
        });
      } else {
        m.push({
          code: "kons-fehlt",
          art: "fehler",
          titel: "Wasser ohne Konservierer",
          text: "Alles, was Wasser enthält, verkeimt innerhalb weniger Tage. Ergänze einen Konservierer oder kennzeichne die Rezeptur als Frischcreme (7 Tage im Kühlschrank).",
          korrektur: vorschlag,
        });
      }
    } else if (kombiVollstaendig && standard.length === 0 && !alkoholReicht) {
      m.push({
        code: "kons-additiv",
        art: "warnung",
        titel: "Konservierung über Additive",
        text: "Diese Kombination zählt rechtlich nicht als Konservierungsmittel. Sie funktioniert nur vollständig, im richtigen pH-Bereich und bei sehr sauberem Arbeiten. Haltbarkeit knapp ansetzen und das Produkt beobachten.",
        zeilen: kons.map((p) => p.key),
      });
    }

    // Kombi-Partner fehlt
    for (const p of kons) {
      const r = p.rohstoff;
      if (r.konsRolle === "kombi" && r.kombiPartner && !r.kombiPartner.split(",").some((s) => nachSlug(s.trim()))) {
        const partner = [...rohstoffe.values()].find((x) => r.kombiPartner!.split(",").map((s) => s.trim()).includes(x.slug));
        m.push({
          code: "kombi-partner",
          art: "fehler",
          titel: `${r.name} wirkt nur in Kombination`,
          text: `${r.name} gehört immer mit ${partner?.name ?? "seinem Partner"} zusammen. Allein bleibt eine Lücke im Schutz.`,
          zeilen: [p.key],
          korrektur: partner
            ? {
                label: `${partner.name} ergänzen`,
                hinzu: [{ slug: partner.slug, prozent: bereichFuer(partner, typ)?.min ?? 0.5, phase: partner.phase }],
              }
            : undefined,
        });
      }
    }

    // Dosierung, pH und Löslichkeit je Konservierer
    for (const p of kons) {
      const r = p.rohstoff;
      if (r.slug === "alkohol") continue;
      const d = bereichFuer(r, typ);
      // Cosgard: 0,5 % sind erlaubt, wenn 0,2 % Kaliumsorbat ergänzen
      const cosgardKombi =
        r.slug === "cosgard" && p.prozentEffektiv >= 0.5 - 0.001 && (nachSlug("kaliumsorbat")?.prozentEffektiv ?? 0) >= 0.2 - 0.001;
      if (d && !cosgardKombi && (p.prozentEffektiv < d.min - 0.001 || p.prozentEffektiv > d.max + 0.001)) {
        const ziel = naechster(p.prozentEffektiv, d.min, d.max);
        m.push({
          code: "kons-menge",
          art: "fehler",
          titel: `${r.name} falsch dosiert`,
          text:
            p.prozentEffektiv < d.min
              ? `${r.name} schützt erst ab ${pct(d.min)} zuverlässig (Bereich ${pct(d.min)} bis ${pct(d.max)}). Aktuell sind es ${pct(p.prozentEffektiv)}.`
              : `${r.name} ist bis ${pct(d.max)} vorgesehen. Aktuell sind es ${pct(p.prozentEffektiv)}; mehr schützt nicht besser, reizt aber eher.`,
          zeilen: [p.key],
          korrektur: p.adHundert ? undefined : { label: `${r.name} auf ${pct(ziel)} setzen`, setze: [{ key: p.key, prozent: ziel }] },
        });
      }
      const phZuTief = rezeptur.phZiel != null && r.phMin != null && rezeptur.phZiel < r.phMin - 0.001;
      const phZuHoch = rezeptur.phZiel != null && r.phMax != null && rezeptur.phZiel > r.phMax + 0.001;
      if (rezeptur.phZiel != null && (phZuTief || phZuHoch)) {
        const bereich =
          r.phMin != null && r.phMax != null
            ? `bei pH ${zahl(r.phMin, 1)} bis ${zahl(r.phMax, 1)}`
            : r.phMax != null
              ? `nur unter pH ${zahl(r.phMax, 1)}`
              : `erst ab pH ${zahl(r.phMin!, 1)}`;
        m.push({
          code: "kons-ph",
          art: "fehler",
          titel: `pH passt nicht zu ${r.name}`,
          text: `${r.name} wirkt ${bereich}. Der Ziel-pH der Rezeptur ist ${zahl(rezeptur.phZiel, 1)}. Stelle den pH auf ${zahl(phZuTief ? r.phMin! : r.phMax!, 1)} ein oder wähle einen anderen Konservierer.`,
          zeilen: [p.key],
        });
      }
      if (typ === "waessrig" && r.nichtWaessrig) {
        m.push({
          code: "kons-loeslich",
          art: "fehler",
          titel: `${r.name} löst sich hier schlecht`,
          text: `${r.name} ist für Emulsionen gedacht und löst sich in rein wässrigen Produkten nicht zuverlässig. Dafür ist Verstatil BL der Standard.`,
          zeilen: [p.key],
          korrektur: p.adHundert
            ? undefined
            : { label: "Durch Verstatil BL (2 %) ersetzen", ersetze: [{ key: p.key, slug: "verstatil-bl", prozent: 2, phase: "wasser" }] },
        });
      }
    }

    if (kons.length > 0 && rezeptur.phZiel == null) {
      m.push({
        code: "ph-fehlt",
        art: "hinweis",
        titel: "Ziel-pH eintragen",
        text: `Konservierer wirken nur in ihrem pH-Bereich. Für Hautpflege gilt pH ${zahl(LAB.phZielMin, 1)} bis ${zahl(LAB.phZielMax, 1)}. Nach dem Konservieren messen, mit Milchsäure senken oder mit Natron-Lösung heben.`,
      });
    }
    if (haltbarkeitMaxTage == null) haltbarkeitMaxTage = 90;
  }

  // ---------- 5. Vitamin C mit Benzoat oder Sorbat ----------
  const vitC = aktiv.find((p) => hatInci(p, "Ascorbic Acid"));
  const benz = aktiv.filter((p) => hatInci(p, "Sodium Benzoate") || hatInci(p, "Potassium Sorbate") || hatInci(p, "Benzoic Acid") || hatInci(p, "Sorbic Acid"));
  if (vitC && benz.length > 0) {
    m.push({
      code: "vitc-benzoat",
      art: "fehler",
      titel: "Vitamin C verträgt sich nicht mit diesem Konservierer",
      text: `Ascorbinsäure darf nicht mit Benzoaten oder Sorbaten kombiniert werden (${benz.map((p) => p.rohstoff.name).join(", ")}). Wähle einen anderen Konservierer oder lass das Vitamin C weg.`,
      zeilen: [vitC.key, ...benz.map((p) => p.key)],
    });
  }

  // ---------- 6. Zugabe unter 40 °C ----------
  const wirdErhitzt =
    typ === "emulsion" ||
    (typ === "wasserfrei" && aktiv.some((p) => ["butter", "konsistenzgeber", "emulgator"].includes(p.rohstoff.kategorie)));
  if (wirdErhitzt) {
    for (const p of aktiv) {
      const r = p.rohstoff;
      const empfindlich =
        r.kategorie === "konservierer" || r.kategorie === "aetherisches_oel" || (r.tempMax != null && r.tempMax <= LAB.kaltGrenze);
      if (empfindlich && p.phase !== "kalt") {
        m.push({
          code: "zu-heiss",
          art: "fehler",
          titel: `${r.name} erst unter 40 °C zugeben`,
          text: `${r.name} steht in der ${p.phase === "fett" ? "Fettphase" : p.phase === "wasser" ? "Wasserphase" : "Pulverphase"} und würde mit erhitzt. Hitze zerstört die Wirkung. Gehört in die Kaltphase (Zugabe beim Abkühlen unter 40 °C).`,
          zeilen: [p.key],
          korrektur: { label: "In die Kaltphase verschieben", phase: [{ key: p.key, phase: "kalt" }] },
        });
      }
    }
  }

  // ---------- 7. Ätherische Öle ----------
  const eoMax = rezeptur.bereich === "gesicht" ? LAB.aetherischMaxGesicht : LAB.aetherischMaxKoerper;
  if (b.aetherischGesamt > eoMax + 0.001) {
    const eo = aktiv.filter((p) => p.rohstoff.kategorie === "aetherisches_oel");
    m.push({
      code: "aetherisch",
      art: "fehler",
      titel: "Zu viel ätherisches Öl",
      text: `${rezeptur.bereich === "gesicht" ? "Im Gesicht" : "Am Körper"} sind höchstens ${pct(eoMax)} ätherische Öle vorgesehen. Aktuell sind es ${pct(b.aetherischGesamt)}. Nicht für Kinder und nicht in der Schwangerschaft verwenden; Zitrusöle nicht vor Sonne.`,
      zeilen: eo.map((p) => p.key),
      korrektur:
        eo.length === 1 && !eo[0].adHundert
          ? { label: `${eo[0].rohstoff.name} auf ${pct(eoMax)} setzen`, setze: [{ key: eo[0].key, prozent: eoMax }] }
          : undefined,
    });
  } else if (b.aetherischGesamt > 0) {
    m.push({
      code: "aetherisch-hinweis",
      art: "hinweis",
      titel: "Ätherische Öle",
      text: "Nicht für Kinder und nicht in der Schwangerschaft verwenden. Zitrusöle nicht vor dem Sonnenbad auftragen. Allergene beachten.",
    });
  }

  // ---------- 8. Einsatzmengen aller übrigen Rohstoffe ----------
  for (const p of aktiv) {
    const r = p.rohstoff;
    if (p.adHundert || r.kategorie === "konservierer" || r.kategorie === "emulgator" || r.kategorie === "aetherisches_oel") continue;
    const d = bereichFuer(r, typ);
    if (!d) continue;
    if (p.prozentEffektiv < d.min - 0.001 || p.prozentEffektiv > d.max + 0.001) {
      const ziel = naechster(p.prozentEffektiv, d.min, d.max);
      m.push({
        code: "menge",
        art: "warnung",
        titel: `${r.name} außerhalb der üblichen Menge`,
        text: `Üblich sind ${pct(d.min)} bis ${pct(d.max)}${d.hinweis ? ` (${d.hinweis})` : ""}. Aktuell sind es ${pct(p.prozentEffektiv)}.`,
        zeilen: [p.key],
        korrektur: { label: `${r.name} auf ${pct(ziel)} setzen`, setze: [{ key: p.key, prozent: ziel }] },
      });
    }
  }

  // ---------- 9. Antioxidans in Ölmischungen ----------
  const oelAnteil = aktiv.filter((p) => p.rohstoff.kategorie === "oel" || p.rohstoff.kategorie === "butter").reduce((s, p) => s + p.prozentEffektiv, 0);
  if (oelAnteil >= 5 && !aktiv.some((p) => p.rohstoff.kategorie === "antioxidans")) {
    m.push({
      code: "antioxidans",
      art: "warnung",
      titel: "Antioxidans fehlt",
      text: "Öle werden ohne Schutz schneller ranzig. 0,2–0,5 % Tocopherol in der Fettphase verlängern die Haltbarkeit. Tocopherol ist kein Konservierer.",
      korrektur: { label: "0,3 % Tocopherol ergänzen", hinzu: [{ slug: "tocopherol", prozent: 0.3, phase: "fett" }] },
    });
  }

  // ---------- 10. Enzyme ----------
  if (nachSlug("papain")) {
    m.push({
      code: "enzym",
      art: "hinweis",
      titel: "Enzym: trocken und ohne Metall",
      text: "Papain wirkt erst mit Wasser und nur bei pH 5–7. Nicht erhitzen, keinen Metallspatel verwenden, Pulver nicht einatmen.",
    });
  }

  // ---------- 11. Stufe ----------
  const stufe = aktiv.reduce<Stufe>((s, p) => (STUFEN_ORDNUNG[p.rohstoff.stufe] > STUFEN_ORDNUNG[s] ? p.rohstoff.stufe : s), "anfaenger");
  if (stufe !== "anfaenger") {
    const hoch = aktiv.filter((p) => p.rohstoff.stufe === stufe).map((p) => p.rohstoff.name);
    m.push({
      code: "stufe",
      art: "hinweis",
      titel: `Stufe ${stufe === "mittel" ? "Mittel" : "Profi"}`,
      text: `${hoch.join(", ")} ${hoch.length === 1 ? "gehört" : "gehören"} zur Stufe ${stufe === "mittel" ? "Mittel" : "Profi"}. Lies vor dem Rühren den Steckbrief.`,
    });
  }

  // ---------- Geräte ----------
  const geraete: GeraeteBedarf[] = [];
  if (b.brauchtFeinwaage) {
    geraete.push({ slug: "feinwaage", pflicht: true, grund: "Pulver und feste Rohstoffe unter 1 g lassen sich nur mit einer Feinwaage (0,01 g) genau abmessen." });
  }
  if (typ === "emulsion") {
    const anspruchsvoll = emulgatoren.some((e) => ["montanov-68", "dermofeel-gsc"].includes(e.rohstoff.slug));
    geraete.push({
      slug: "ruehrer",
      pflicht: anspruchsvoll,
      grund: anspruchsvoll
        ? "Dieser Emulgator braucht hohe Scherkräfte. Mit dem Glasstab allein wird die Emulsion nicht stabil."
        : "Der Glasstab reicht bei kleinen Mengen. Mit einem Milchaufschäumer wird die Emulsion feiner und stabiler.",
    });
  }
  if (wasserImProdukt && kons.length > 0) {
    geraete.push({ slug: "ph-meter", pflicht: false, grund: "Teststreifen reichen für den Anfang. Ein pH-Meter misst genauer, wenn der Konservierer einen engen pH-Bereich hat." });
  }

  return { berechnung: b, meldungen: m, stufe, geraete, haltbarkeitMaxTage, ok: !m.some((x) => x.art === "fehler") };
}

/**
 * Wendet einen Korrekturvorschlag auf die Positionen an.
 * Wird ein Rohstoff ergänzt und es gibt keinen Ausgleichsposten, wird die größte
 * Position derselben Phase (sonst die größte überhaupt) um denselben Anteil verringert.
 */
export function wendeAn(
  positionen: LabPosition[],
  k: Korrektur,
  rohstoffe: Map<number, LabRohstoff>,
  neuerKey: () => string,
): LabPosition[] {
  let out = positionen.map((p) => ({ ...p }));
  const nachSlug = (slug: string) => [...rohstoffe.values()].find((r) => r.slug === slug);

  for (const s of k.setze ?? []) out = out.map((p) => (p.key === s.key ? { ...p, prozent: s.prozent } : p));
  for (const s of k.phase ?? []) out = out.map((p) => (p.key === s.key ? { ...p, phase: s.phase } : p));
  if (k.ausgleich) out = out.map((p) => ({ ...p, adHundert: p.key === k.ausgleich }));
  for (const e of k.ersetze ?? []) {
    const r = nachSlug(e.slug);
    if (!r) continue;
    const alt = out.find((p) => p.key === e.key);
    const diff = alt ? e.prozent - alt.prozent : 0;
    out = out.map((p) => (p.key === e.key ? { ...p, rohstoffId: r.id, prozent: e.prozent, phase: e.phase } : p));
    if (!out.some((p) => p.adHundert) && diff !== 0) out = gleicheAus(out, diff, e.key);
  }
  for (const h of k.hinzu ?? []) {
    const r = nachSlug(h.slug);
    if (!r || out.some((p) => p.rohstoffId === r.id)) continue;
    const key = neuerKey();
    out.push({ key, rohstoffId: r.id, phase: h.phase, prozent: h.prozent, adHundert: false });
    if (!out.some((p) => p.adHundert)) out = gleicheAus(out, h.prozent, key, h.phase);
  }
  return out;
}

function gleicheAus(positionen: LabPosition[], diff: number, ausserKey: string, phase?: Phase): LabPosition[] {
  const kandidaten = positionen.filter((p) => p.key !== ausserKey && p.prozent - diff > 0);
  const ziel =
    [...kandidaten].filter((p) => !phase || p.phase === phase).sort((a, b) => b.prozent - a.prozent)[0] ??
    [...kandidaten].sort((a, b) => b.prozent - a.prozent)[0];
  if (!ziel) return positionen;
  return positionen.map((p) => (p.key === ziel.key ? { ...p, prozent: runde(p.prozent - diff, 3) } : p));
}
