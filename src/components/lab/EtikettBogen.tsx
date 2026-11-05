import { L } from "@/i18n/lab";
import { BOEGEN, type EtikettDaten, type Format } from "@/lib/lab/etikett";
import styles from "./lab.module.css";

/** A4-Blatt in echter Grösse: ein Etikett zum Ausschneiden oder ein ganzer Bogen im Raster. */
export default function EtikettBogen({ format, bogen, daten }: { format: Format; bogen: boolean; daten: EtikettDaten }) {
  const raster = BOEGEN[format];
  const positionen = bogen
    ? Array.from({ length: raster.spalten * raster.zeilen }, (_, i) => ({
        x: raster.links + (i % raster.spalten) * raster.abstandX,
        y: raster.oben + Math.floor(i / raster.spalten) * raster.abstandY,
      }))
    : [{ x: 10, y: 10 }];
  return (
    <div className={styles.bogenRahmen}>
      <div className={styles.bogen} data-einzeln={!bogen || undefined} aria-label={L.karte.vorschau}>
        {positionen.map((pos, i) => (
          <Etikett key={i} format={format} d={daten} style={{ left: `${pos.x}mm`, top: `${pos.y}mm` }} />
        ))}
      </div>
    </div>
  );
}

function Etikett({ format, d, style }: { format: Format; d: EtikettDaten; style: React.CSSProperties }) {
  if (format === "rund") {
    return (
      <div className={styles.etikettK} style={style}>
        <p className={styles.etikettName2}>{d.name}</p>
        {d.frischcreme && <p className={styles.etikettFrisch2}>{L.karte.frischcreme}</p>}
        <dl className={styles.etikettZeilen}>
          <div>
            <dt>{L.karte.hergestellt}</dt>
            <dd>{d.hergestellt}</dd>
          </div>
          <div>
            <dt>{L.karte.haltbarBis}</dt>
            <dd>{d.haltbarBis}</dd>
          </div>
          <div>
            <dd>{d.charge}</dd>
          </div>
        </dl>
      </div>
    );
  }
  return (
    <div className={styles.etikettR} style={style}>
      <p className={styles.etikettName2}>{d.name}</p>
      <dl className={styles.etikettZeilen}>
        {d.frischcreme && (
          <div>
            <dd className={styles.etikettFrisch2}>{L.karte.frischcreme}</dd>
          </div>
        )}
        <div>
          <dt>{L.karte.hergestellt}</dt>
          <dd>{d.hergestellt}</dd>
        </div>
        <div>
          <dt>{L.karte.haltbarBis}</dt>
          <dd>{d.haltbarBis}</dd>
        </div>
        <div>
          <dt>{L.karte.charge}</dt>
          <dd>{d.charge}</dd>
        </div>
      </dl>
      <p className={styles.etikettInci2}>{d.inci}</p>
      <p className={styles.etikettFuss}>Nur für den Eigengebrauch</p>
    </div>
  );
}
