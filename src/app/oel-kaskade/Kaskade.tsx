"use client";

import { useEffect, useRef, useState } from "react";
import { EBENEN, OELE, REIHE, fleckGroesse, type Oel } from "@/lib/oele";
import styles from "./kaskade.module.css";

/** Meldet die Höhe an die einbettende Seite (WordPress-iframe passt sich an). */
function useHoeheMelden() {
  useEffect(() => {
    if (window.parent === window) return;
    const melden = () =>
      window.parent.postMessage(
        {
          typ: "bv-oel-kaskade-hoehe",
          hoehe: document.documentElement.scrollHeight,
        },
        "*",
      );
    const ro = new ResizeObserver(melden);
    ro.observe(document.body);
    melden();
    return () => ro.disconnect();
  }, []);
}

export default function Kaskade() {
  const [aktiv, setAktiv] = useState<Oel | null>(null);
  const [vorher, setVorher] = useState<Oel | null>(null);
  const [fleck, setFleck] = useState(0);
  const [lauf, setLauf] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  useHoeheMelden();

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

  // Erstes Öl nach kurzer Pause fallen lassen
  useEffect(() => {
    const t = window.setTimeout(() => waehle(REIHE[0]), 500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ring = vorher ? fleckGroesse(vorher.spreitung) : 0;

  return (
    <>
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

      <h2 className={styles.h2}>Die drei Spreit-Ebenen</h2>
      <p className={styles.sub}>
        Einordnung nach dem Spreitmodell (Ansmann), über die Fettsäureketten.
      </p>
      <div className={styles.kaskade}>
        {EBENEN.map((e) => (
          <section
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
            {OELE.filter((o) => o.tempo === e.tempo).map((o) => (
              <div key={o.name} className={styles.oel}>
                <div className={styles.oelName}>{o.name}</div>
                <div className={styles.oelNotiz}>{o.notiz}</div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
