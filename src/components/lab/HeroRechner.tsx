"use client";

import { useMemo, useState } from "react";
import { pruefe, wendeAn } from "@/lib/lab/regeln";
import type { LabPosition, LabRohstoff } from "@/lib/lab/types";
import Formel from "./Formel";
import Meldungen from "./Meldungen";
import styles from "./lab.module.css";

type Texte = { title: string; recipe: string; amount: string; without: string; note: string };

/**
 * Der inszenierte Moment der Startseite: ein echter kleiner Rechner.
 * Menge schieben → alles rechnet um. Konservierer weglassen → die Prüfung schlägt an
 * und bietet die Korrektur an. Gleiche Rechen- und Prüflogik wie in der App.
 */
export default function HeroRechner({ rohstoffe, start, t }: { rohstoffe: LabRohstoff[]; start: LabPosition[]; t: Texte }) {
  const [charge, setCharge] = useState(50);
  const [positionen, setPositionen] = useState(start);
  const map = useMemo(() => new Map(rohstoffe.map((r) => [r.id, r])), [rohstoffe]);
  const kons = rohstoffe.find((r) => r.slug === "cosgard");
  const ohne = !positionen.some((p) => p.rohstoffId === kons?.id);

  const p = pruefe({ produkttyp: "emulsion", bereich: "gesicht", chargeG: charge, phZiel: 5.2, frischcreme: false, positionen }, map);
  const wichtig = p.meldungen.filter((m) => m.art !== "hinweis");

  return (
    <div className={styles.demo}>
      <div className={styles.demoKopf}>
        <p className={styles.demoTitel}>{t.recipe}</p>
        <div className={styles.demoMenge}>
          <label htmlFor="demo-menge">{t.amount}</label>
          <input id="demo-menge" type="range" min={30} max={100} step={10} value={charge} onChange={(e) => setCharge(Number(e.target.value))} aria-valuetext={`${charge} Gramm`} />
          <output htmlFor="demo-menge">{charge} g</output>
        </div>
      </div>

      <Formel b={p.berechnung} idPrefix="demo" />

      <label className={styles.demoSchalter}>
        <input
          type="checkbox"
          checked={ohne}
          onChange={(e) => setPositionen(e.target.checked ? positionen.filter((x) => x.rohstoffId !== kons?.id) : start)}
        />
        {t.without}
      </label>

      <Meldungen meldungen={wichtig} onKorrektur={(k) => setPositionen(wendeAn(positionen, k, map, () => `d${positionen.length + 1}`))} />
      <p className={styles.fussnote}>{t.note}</p>
    </div>
  );
}
