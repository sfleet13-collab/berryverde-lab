import Link from "next/link";
import { locales, type Locale } from "@/config/site";
import styles from "./Toggle.module.css";

/** DE | EN Umschalter (Darstellung). `rest` = aktueller Pfad ohne Sprache. */
export default function LangLinks({ lang, label, rest = "" }: { lang: Locale; label: string; rest?: string }) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          className={styles.item}
          aria-current={l === lang ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
