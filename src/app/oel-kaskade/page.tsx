import type { Metadata } from "next";
import { site } from "@/config/site";
import Kaskade from "./Kaskade";
import styles from "./kaskade.module.css";

const TITEL = "Spreitkaskade: Welches Öl zieht schnell ein?";
const BESCHREIBUNG =
  "Die Öl-Spreitkaskade von berryverde: Wähle ein Öl und sieh, wie weit es spreitet. Schnell, mittel oder langsam – für deine eigene Pflegeöl-Mischung.";

export const metadata: Metadata = {
  title: `${TITEL} | berryverde`,
  description: BESCHREIBUNG,
  alternates: { canonical: "/oel-kaskade" },
  // Eingebettetes Goodie: Ranken soll der Blogartikel auf berryverde.com, nicht diese Seite
  robots: { index: false, follow: true },
  openGraph: {
    title: TITEL,
    description: BESCHREIBUNG,
    type: "website",
    locale: "de_DE",
    siteName: "berryverde",
  },
};

export default function OelKaskadeSeite() {
  return (
    <main className={styles.seite}>
      <div className={styles.wrap}>
        <h1 className={styles.h1}>Die Öl-Kaskade</h1>
        <p className={styles.lede}>
          Wähle ein Öl und sieh, wie weit es spreitet. Je grösser der Fleck,
          desto schneller zieht es ein und desto leichter fühlt es sich an. Die
          besten Pflegeöle kombinierst du aus allen drei Ebenen.
        </p>

        <Kaskade />

        <div className={styles.cta}>
          <p>
            Willst du daraus eine echte Rezeptur mit Mengen, Tropfen und INCI –
            und deinen Blend selbst zusammenstellen? Das kannst du im berryverde
            Rezept-Rechner.
          </p>
          <a href={site.url} target="_blank" rel="noopener">
            Zum Rezept-Rechner
          </a>
        </div>

        <footer className={styles.fuss}>
          Patch-Test nicht vergessen, besonders bei empfindlicher Haut.
          <div className={styles.made}>
            Made with ♥ by{" "}
            <a href={site.credit.url} target="_blank" rel="noopener">
              Susan Fleet
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
