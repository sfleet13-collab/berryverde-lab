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

/** Überschriften: Playfair Display – die Schrift von berryverde.com */
export const display = localFont({
  src: [
    { path: "../fonts/playfair-display-latin-wght.woff2", style: "normal" },
    { path: "../fonts/playfair-display-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-display-face",
  weight: "400 900",
  display: "swap",
});
