"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EBENEN,
  HAUTTYPEN,
  OELE,
  REIHE,
  fleckGroesse,
  type Hauttyp,
  type Oel,
  type Tempo,
} from "@/lib/oele";
import styles from "./oel-chart.module.css";

const HAUT_KURZ: Record<Hauttyp, string> = {
  trocken: "trocken",
  misch: "Mischhaut",
  oelig: "ölig",
};

const BEISPIELE: { titel: string; fuer: string; oele: string[] }[] = [
  {
    titel: "Leicht und klar",
    fuer: "Mischhaut, zu Unreinheiten neigend",
    oele: ["Squalan", "Jojobaöl", "Sheabutter"],
  },
  {
    titel: "Satt und beruhigend",
    fuer: "trockene, spannende Haut",
    oele: ["Kokosöl", "Mandelöl", "Kakaobutter"],
  },
  {
    titel: "Matt und ausgleichend",
    fuer: "ölige Haut",
    oele: ["Neutralöl (MCT)", "Distelöl", "Sheabutter"],
  },
];

/** Startmischung: drei Öle, die zum selben Hauttyp passen. */
const START_BLEND: Record<Tempo, string> = {
  schnell: "Squalan",
  mittel: "Jojobaöl",
  langsam: "Sheabutter",
};

export default function OelChart() {
  // Glasschale
  const [aktiv, setAktiv] = useState<Oel | null>(null);
  const [vorher, setVorher] = useState<Oel | null>(null);
  const [fleck, setFleck] = useState(0);
  const [lauf, setLauf] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  // Hauttyp-Filter
  const [haut, setHaut] = useState<Hauttyp | "alle">("alle");

  // Baukasten
  const [blend, setBlend] = useState<Record<Tempo, string>>(START_BLEND);

  function waehle(o: Oel) {
    if (aktiv && aktiv.name !== o.name) setVorher(aktiv);
    setAktiv(o);
    setFleck(0);
    setLauf((n) => n + 1);
    window.clearTimeout(timer.current);
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(
      () => setFleck(fleckGroesse(o.spreitung)),
      ruhig ? 0 : 600,
    );
  }

  useEffect(() => {
    const t = window.setTimeout(() => waehle(REIHE[0]), 500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ring = vorher ? fleckGroesse(vorher.spreitung) : 0;

  const gewaehlt = useMemo(
    () =>
      (["schnell", "mittel", "langsam"] as Tempo[])
        .map((t) => OELE.find((o) => o.name === blend[t]))
        .filter((o): o is Oel => Boolean(o)),
    [blend],
  );

  // Hauttypen, zu denen alle drei gewählten Öle passen
  const treffer = useMemo(() => {
    if (gewaehlt.length < 3) return [] as Hauttyp[];
    return HAUTTYPEN.map((h) => h.wert).filter((h) =>
      gewaehlt.every((o) => o.haut.includes(h)),
    );
  }, [gewaehlt]);

  return (
    <>
      <section aria-labelledby="schale-titel">
        <h2 id="schale-titel" className={styles.h2}>
          Wie weit verteilt sich welches Öl?
        </h2>
        <p className={styles.sub}>
          Wähle ein Öl. Der Tropfen fällt in die Glasschale und verteilt sich.
          Je grösser der Fleck, desto schneller spreitet das Öl und desto
          leichter fühlt es sich an. Das Öl davor bleibt als gestrichelter Ring
          zum Vergleich stehen.
        </p>
        <div className={styles.schale}>
          <div className={styles.auswahl} role="group" aria-label="Öl wählen">
            {REIHE.map((o) => (
              <button
                key={o.name}
                type="button"
                aria-pressed={aktiv?.name === o.name}
                onClick={() => waehle(o)}
              >
                {o.name}
              </button>
            ))}
          </div>
          <div className={styles.schalenBereich}>
            <div className={styles.dish} aria-hidden="true">
              <span
                className={styles.ghost}
                style={{ width: `${ring}%`, height: `${ring}%` }}
              />
              <span
                className={styles.splat}
                data-sofort={fleck === 0 || undefined}
                style={{ width: `${fleck}%`, height: `${fleck}%` }}
              />
              <span
                key={`t${lauf}`}
                className={`${styles.droplet} ${lauf ? styles.fall : ""}`}
              />
              <span
                key={`r${lauf}`}
                className={`${styles.ripple} ${lauf ? styles.go : ""}`}
              />
            </div>
            <div className={styles.caption} aria-live="polite">
              {aktiv && (
                <>
                  <strong>{aktiv.name}</strong>
                  <span>
                    {aktiv.tempo} spreitend · {aktiv.notiz}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="ebenen-titel">
        <h2 id="ebenen-titel" className={styles.h2}>
          Die drei Spreit-Ebenen
        </h2>
        <p className={styles.sub}>
          Filtere nach deinem Hauttyp. Die Öle, die nicht dazu passen, treten in
          den Hintergrund.
        </p>

        <div
          className={styles.filter}
          role="group"
          aria-label="Nach Hauttyp filtern"
        >
          <button
            type="button"
            aria-pressed={haut === "alle"}
            onClick={() => setHaut("alle")}
          >
            Alle Hauttypen
          </button>
          {HAUTTYPEN.map((h) => (
            <button
              key={h.wert}
              type="button"
              aria-pressed={haut === h.wert}
              onClick={() => setHaut(h.wert)}
            >
              {h.titel}
            </button>
          ))}
        </div>

        <div className={styles.kaskade}>
          {EBENEN.map((e) => (
            <div
              key={e.tempo}
              className={styles.spalte}
              data-tempo={e.tempo}
              aria-labelledby={`ebene-${e.tempo}`}
            >
              <div className={styles.balken} />
              <h3 id={`ebene-${e.tempo}`} className={styles.h3}>
                {e.titel}
              </h3>
              <p className={styles.tag}>{e.tag}</p>
              {OELE.filter((o) => o.tempo === e.tempo).map((o) => {
                const passt = haut === "alle" || o.haut.includes(haut);
                return (
                  <div
                    key={o.name}
                    className={styles.oel}
                    data-blass={!passt || undefined}
                  >
                    <div className={styles.oelName}>{o.name}</div>
                    <div className={styles.oelNotiz}>{o.notiz}</div>
                    <div className={styles.chips}>
                      {o.haut.map((h) => (
                        <span key={h} className={styles.chip}>
                          {HAUT_KURZ[h]}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="blend-titel">
        <h2 id="blend-titel" className={styles.h2}>
          Deine Mischung aus drei Ölen
        </h2>
        <p className={styles.sub}>
          Je ein Öl pro Ebene ergibt eine ausgewogene Mischung: eines, das
          sofort einzieht, eines, das pflegt, und eines, das schützt.
        </p>
        <div className={styles.baukasten}>
          <div className={styles.reihe}>
            {EBENEN.map((e) => (
              <div key={e.tempo} className={styles.wahl}>
                <label htmlFor={`wahl-${e.tempo}`}>{e.titel}</label>
                <select
                  id={`wahl-${e.tempo}`}
                  value={blend[e.tempo]}
                  onChange={(ev) =>
                    setBlend((b) => ({ ...b, [e.tempo]: ev.target.value }))
                  }
                >
                  {OELE.filter((o) => o.tempo === e.tempo).map((o) => (
                    <option key={o.name} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className={styles.ergebnis} aria-live="polite">
            <h3 className={styles.h3}>
              {gewaehlt.map((o) => o.name).join(" · ")}
            </h3>
            {treffer.length > 0 ? (
              <p>
                Diese drei passen zusammen zu:{" "}
                <strong>
                  {treffer
                    .map(
                      (t) => HAUTTYPEN.find((h) => h.wert === t)?.titel ?? t,
                    )
                    .join(", ")}
                </strong>
                . Starte mit etwa gleichen Teilen und nimm von der Butter
                weniger, wenn es dir zu schwer wird.
              </p>
            ) : (
              <p>
                Die drei Öle sind für unterschiedliche Hauttypen gedacht. Das
                darf so sein, wenn du weisst, was du willst – sonst tausche
                eines aus, bis alle drei zum selben Hauttyp passen.
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="beispiele-titel">
        <h2 id="beispiele-titel" className={styles.h2}>
          Drei fertige Mischungen
        </h2>
        <p className={styles.sub}>Als Startpunkt, wenn du keine Lust auf Suchen hast.</p>
        <div className={styles.beispiele}>
          {BEISPIELE.map((b) => (
            <div key={b.titel} className={styles.beispiel}>
              <h3 className={styles.h3}>{b.titel}</h3>
              <p className={styles.tag}>für {b.fuer}</p>
              <ul>
                {b.oele.map((name) => {
                  const o = OELE.find((x) => x.name === name);
                  return (
                    <li key={name}>
                      {name}
                      <span>{o?.tempo} spreitend</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
