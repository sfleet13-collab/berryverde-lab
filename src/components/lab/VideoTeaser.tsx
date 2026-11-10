"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./videoteaser.module.css";

/**
 * Teaser für die Videos: Eine Creme entsteht in 16 Sekunden (5 Schritte à 3,2 s).
 * Reines SVG + CSS, läuft nur, solange der Abschnitt sichtbar ist.
 * Bei „Bewegung reduzieren“ steht nur der fertige Tiegel da.
 */
export default function VideoTeaser({
  steps,
  heat,
  cool,
  kopf,
  fuss,
}: {
  steps: string[];
  heat: string;
  cool: string;
  /** Überschrift und Einleitung über der Schrittliste */
  kopf: ReactNode;
  /** Inhalt unter der Schrittliste */
  fuss?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.laeuft = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        el.dataset.laeuft = e.isIntersecting ? "true" : "false";
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.teaser} data-laeuft="false">
      <div className={styles.buehne} aria-hidden="true">
        <svg viewBox="0 0 360 290" className={styles.svg}>
          <defs>
            <clipPath id="vt-becher">
              <path d="M121 70V230q0 13 13 13h92q13 0 13-13V70z" />
            </clipPath>
            <clipPath id="vt-tiegel">
              <rect x="132" y="170" width="96" height="78" rx="12" />
            </clipPath>
          </defs>
          <g className={styles.waerme}>
            <g className={styles.wabern}>
              <path d="M150 258q6-6 0-12t0-12" />
              <path d="M180 260q6-6 0-12t0-12" />
              <path d="M210 258q6-6 0-12t0-12" />
            </g>
          </g>
          <g className={styles.becher}>
            <path
              className={styles.glas}
              d="M121 70V230q0 13 13 13h92q13 0 13-13V70z"
            />
            <g clipPath="url(#vt-becher)">
              <rect
                className={styles.wasser}
                x="110"
                y="170"
                width="140"
                height="80"
              />
              <rect
                className={styles.oel}
                x="110"
                y="204"
                width="140"
                height="46"
              />
              <rect
                className={styles.creme}
                x="110"
                y="130"
                width="140"
                height="120"
              />
            </g>
            <path
              className={styles.kontur}
              d="M114 62l7 8V230q0 13 13 13h92q13 0 13-13V70l7-8"
            />
            <path
              className={styles.skala}
              d="M226 110h10M230 140h6M226 170h10M230 200h6"
            />
          </g>
          <g className={styles.kanne}>
            <g transform="rotate(-38 70 50)">
              <path
                className={styles.kannenGlas}
                d="M44 22v48q0 8 8 8h36q8 0 8-8V22"
              />
            </g>
            <path className={styles.strahl} d="M104 58q22 6 44 96" />
          </g>
          <g className={styles.stab}>
            <line
              className={styles.ruehren}
              x1="182"
              y1="30"
              x2="196"
              y2="226"
            />
          </g>
          <g className={styles.pipette}>
            <rect
              className={styles.beere}
              x="174"
              y="4"
              width="16"
              height="22"
              rx="8"
            />
            <path
              className={styles.pipettenGlas}
              d="M177 26h10v34l-5 10-5-10z"
            />
            <circle
              className={`${styles.tropfen} ${styles.beere}`}
              cx="182"
              cy="76"
              r="5"
            />
          </g>
          <g className={styles.thermo}>
            <rect
              className={styles.roehre}
              x="272"
              y="66"
              width="16"
              height="164"
              rx="8"
            />
            <rect
              className={`${styles.quecksilber} ${styles.beere}`}
              x="276"
              y="80"
              width="8"
              height="150"
              rx="4"
            />
            <circle className={styles.beere} cx="280" cy="236" r="13" />
            <text className={`${styles.wert} ${styles.heiss}`} x="300" y="104">
              {heat}
            </text>
            <text className={`${styles.wert} ${styles.kalt}`} x="300" y="176">
              {cool}
            </text>
          </g>
          <g className={styles.tiegel}>
            <rect
              className={styles.glas}
              x="132"
              y="170"
              width="96"
              height="78"
              rx="12"
            />
            <g clipPath="url(#vt-tiegel)">
              <rect
                className={styles.fuellung}
                x="132"
                y="182"
                width="96"
                height="66"
              />
            </g>
            <rect
              className={styles.kontur}
              x="132"
              y="170"
              width="96"
              height="78"
              rx="12"
            />
            <rect
              className={styles.etikett}
              x="150"
              y="206"
              width="60"
              height="24"
              rx="4"
            />
            <path className={styles.etikettStrich} d="M160 218h40" />
            <rect
              className={`${styles.deckel} ${styles.beere}`}
              x="126"
              y="150"
              width="108"
              height="22"
              rx="8"
            />
          </g>
        </svg>
        <div className={styles.balken}>
          {steps.map((s) => (
            <span key={s} />
          ))}
        </div>
      </div>
      <div className={styles.text}>
        {kopf}
        <ol className={styles.schritte}>
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        {fuss}
      </div>
    </div>
  );
}
