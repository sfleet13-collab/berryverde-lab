"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./spreit.module.css";

type Tempo = "schnell" | "mittel" | "langsam";
type Texte = { hint: string; group: string; speed: Record<Tempo, string> };

/** Die neun Öle der Spreitkaskade (Spreitmodell nach Ansmann), in der Reihenfolge schnell → langsam. */
const OELE: { name: string; tempo: Tempo }[] = [
  { name: "Squalan", tempo: "schnell" },
  { name: "Neutralöl", tempo: "schnell" },
  { name: "Kokosöl", tempo: "schnell" },
  { name: "Jojoba", tempo: "mittel" },
  { name: "Mandel", tempo: "mittel" },
  { name: "Aprikose", tempo: "mittel" },
  { name: "Avocado", tempo: "mittel" },
  { name: "Sheabutter", tempo: "langsam" },
  { name: "Kakaobutter", tempo: "langsam" },
];

type Phase = "aus" | "tropfen" | "spreiten";

/**
 * Glasschale mit Tropfen: Der Tropfen wird in 240 px gerendert und per scale verkleinert (sauberer Rand).
 * Ablauf: kleiner Tropfen erscheint (scale 0.1), danach spreitet er auf die Stufe seiner Ebene.
 */
export default function SpreitDemo({ t }: { t: Texte }) {
  const [oel, setOel] = useState<(typeof OELE)[number] | null>(null);
  const [phase, setPhase] = useState<Phase>("aus");
  const [lauf, setLauf] = useState(0);
  const timer = useRef<number[]>([]);

  useEffect(() => () => timer.current.forEach(window.clearTimeout), []);

  function waehle(o: (typeof OELE)[number]) {
    timer.current.forEach(window.clearTimeout);
    setOel(o);
    setPhase("aus");
    setLauf((n) => n + 1); // neuer Tropfen: Element wird neu gesetzt, ohne Rück-Animation
    timer.current = [
      window.setTimeout(() => setPhase("tropfen"), 50),
      window.setTimeout(() => setPhase("spreiten"), 500),
    ];
  }

  return (
    <div className={styles.buehne}>
      <div className={styles.glasRahmen}>
        <div className={styles.glas} aria-hidden="true">
          <span className={styles.hinweis} data-weg={oel ? "" : undefined}>
            {t.hint}
          </span>
          {oel && (
            <span
              key={lauf}
              className={styles.tropfen}
              data-tempo={oel.tempo}
              data-phase={phase}
            />
          )}
        </div>
      </div>
      <p className={styles.status} aria-live="polite">
        {oel ? `${oel.name} – ${t.speed[oel.tempo]}` : " "}
      </p>
      <div className={styles.oele} role="group" aria-label={t.group}>
        {OELE.map((o) => (
          <button
            key={o.name}
            type="button"
            aria-pressed={oel?.name === o.name}
            onClick={() => waehle(o)}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
