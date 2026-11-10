import type { Metadata } from "next";
import { lab, site } from "@/config/site";
import OelChart from "./OelChart";
import styles from "./oel-chart.module.css";

const TITEL = "Dein Öl-Chart";
const BESCHREIBUNG =
  "Das interaktive Öl-Chart von berryverde: zwölf Pflanzenöle und Buttern nach Spreitgeschwindigkeit, mit Hauttyp-Filter und Baukasten für deine eigene Ölmischung.";

export const metadata: Metadata = {
  title: `${TITEL} | berryverde`,
  description: BESCHREIBUNG,
  alternates: { canonical: "/oel-chart-fuer-dich" },
  // Geschenk für Newsletter-Anmeldungen: nicht verlinkt, nicht bei Google
  robots: { index: false, follow: false },
};

export default function OelChartSeite() {
  return (
    <main className={styles.seite}>
      <div className={styles.wrap}>
        <header className={styles.kopf}>
          <p className={styles.label}>berryverde · dein Geschenk</p>
          <h1 className={styles.h1}>Dein Öl-Chart</h1>
          <p className={styles.lede}>
            Jedes Öl verteilt sich anders auf der Haut. Kombinierst du ein
            schnelles, ein mittleres und ein langsames Öl, bekommst du
            Leichtigkeit, Pflege und Schutz in einer Mischung. Hier siehst du,
            welches Öl wohin gehört – und stellst dir deine eigene zusammen.
          </p>
        </header>

        <OelChart />

        <div className={styles.cta}>
          <p>
            Willst du daraus eine echte Rezeptur mit Mengen, Tropfen und
            INCI-Liste? Der Rezept-Rechner in Dein Lab rechnet sie dir aus und
            prüft sie gleich mit.
          </p>
          <a href={`${site.url}/de#${lab.mitgliedAnker}`}>
            Mitglied werden in Dein Lab
          </a>
        </div>

        <footer className={styles.fuss}>
          Einordnung nach dem Spreitmodell (Ansmann), über die Fettsäureketten.
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
