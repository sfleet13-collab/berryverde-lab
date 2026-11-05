import { L, nbsp } from "@/i18n/lab";
import styles from "./lab.module.css";

export type RohstoffInfo = {
  funktion: string | null;
  hinweis: string | null;
  was: string | null;
  chemisch: string | null;
  wirkung: string | null;
  stufe: "anfaenger" | "mittel" | "profi";
};

export function Steckbrief({ name, inci, info, titelId }: { name: string; inci: string; info: RohstoffInfo; titelId?: string }) {
  return (
    <div className={styles.steckbriefInhalt}>
      <h2 id={titelId} className={styles.steckbriefName}>
        {name}
      </h2>
      <p className={styles.steckbriefInci}>{inci}</p>
      <dl>
        {info.was && (
          <>
            <dt>{L.rohstoffe.was}</dt>
            <dd>{nbsp(info.was)}</dd>
          </>
        )}
        {info.chemisch && (
          <>
            <dt>{L.rohstoffe.chemisch}</dt>
            <dd>{nbsp(info.chemisch)}</dd>
          </>
        )}
        {info.wirkung && (
          <>
            <dt>{L.rohstoffe.wirkung}</dt>
            <dd>{nbsp(info.wirkung)}</dd>
          </>
        )}
        {info.hinweis && (
          <>
            <dt>{L.rohstoffe.hinweis}</dt>
            <dd>{nbsp(info.hinweis)}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
