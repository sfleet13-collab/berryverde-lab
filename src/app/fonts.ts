import localFont from "next/font/local";

/**
 * Schriften liegen LOKAL im Projekt (src/fonts) – keine Verbindung zu Google.
 * Andere Schrift? Datei (.woff2) in src/fonts legen und hier austauschen.
 */
export const inter = localFont({
  src: "../fonts/inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

/** Überschriften: Bricolage Grotesque – serifenlos mit Charakter */
export const display = localFont({
  src: "../fonts/bricolage-grotesque-latin-wght.woff2",
  variable: "--font-display-face",
  weight: "200 800",
  display: "swap",
});
