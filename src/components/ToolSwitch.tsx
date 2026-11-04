import styles from "./ToolSwitch.module.css";

/**
 * Werkzeug-Umschalter für Susans eigene Werkzeug-Apps (HQ, Launch-Check, Brand-Board …).
 * Steht in jeder Werkzeug-App oben im Kopf, markiert die aktuelle App – so wirken alle
 * wie eine Anwendung mit Reitern. Alle Apps teilen das Neon-Auth-Login (kein neues Anmelden).
 *
 * Einbau: <ToolSwitch current="launch" labels={t.tools} /> im Header, Texte aus i18n.
 * Brand-Board erscheint, sobald NEXT_PUBLIC_BRANDBOARD_URL gesetzt ist (danach neu deployen –
 * NEXT_PUBLIC_* wird beim Bauen fest eingesetzt). Für Kunden-Apps weglassen.
 */
export const TOOL_URLS = {
  hq: "https://susan-hq.vercel.app",
  launch: "https://launch-check-rho.vercel.app",
  brand: process.env.NEXT_PUBLIC_BRANDBOARD_URL?.trim() || "",
} as const;

export type ToolKey = keyof typeof TOOL_URLS;

export type ToolLabels = { label: string; soon: string } & Record<ToolKey, string>;

/** Standardtexte – in Apps aus dem Wörterbuch übergeben (Regel: alle Texte in i18n). */
export const TOOL_LABELS_DE: ToolLabels = { label: "Werkzeuge", soon: "bald", hq: "HQ", launch: "Launch-Check", brand: "Brand-Board" };
export const TOOL_LABELS_EN: ToolLabels = { label: "Tools", soon: "soon", hq: "HQ", launch: "Launch check", brand: "Brand board" };

export default function ToolSwitch({ current, labels = TOOL_LABELS_DE }: { current: ToolKey; labels?: ToolLabels }) {
  return (
    <nav className={styles.switch} aria-label={labels.label}>
      {(Object.keys(TOOL_URLS) as ToolKey[]).map((key) => {
        const href = TOOL_URLS[key];
        if (key === current) {
          return (
            <a key={key} href="#inhalt" className={`${styles.item} ${styles.current}`} aria-current="page">
              {labels[key]}
            </a>
          );
        }
        if (!href) {
          return (
            <span key={key} className={`${styles.item} ${styles.soon}`} aria-disabled="true">
              {labels[key]} <small>({labels.soon})</small>
            </span>
          );
        }
        return (
          <a key={key} className={styles.item} href={href}>
            {labels[key]}
          </a>
        );
      })}
    </nav>
  );
}
