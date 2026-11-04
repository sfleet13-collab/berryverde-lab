import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { inter, display } from "./fonts";
import { site } from "@/config/site";
import { getDictionary } from "@/i18n";
import styles from "./[lang]/status.module.css";

/**
 * 404 für alle unbekannten Adressen (echter Status 404, Inhalt direkt im HTML).
 * Eigenes Dokument, weil das Hauptlayout unter /[lang] liegt (siehe Next-Doku global-not-found).
 * Sprache: Hauptsprache der Seite, Englisch als Zusatz.
 */
const t = getDictionary("de");
const en = getDictionary("en");

export const metadata: Metadata = {
  title: `${t.seo.notFound.title} | ${site.name}`,
  description: t.seo.notFound.description,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="de" className={`${inter.variable} ${display.variable}`}>
      <body>
        <main className={`container ${styles.status}`}>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <h1>{t.notFound.title}</h1>
          <p className="muted">
            {t.notFound.text}
            <br />
            <span lang="en">{en.notFound.text}</span>
          </p>
          <Link className="btn btn-primary" href="/de">
            {t.notFound.back}
          </Link>
          <Link href="/en" lang="en" className="muted">
            {en.notFound.back}
          </Link>
        </main>
        <footer className={`container ${styles.footer}`}>
          <nav aria-label="Rechtliches">
            <Link href="/de/impressum">{t.legal.imprint}</Link>
            <Link href="/de/datenschutz">{t.legal.privacy}</Link>
          </nav>
          <a href={site.credit.url} target="_blank" rel="noopener">
            {site.credit.label}
          </a>
        </footer>
      </body>
    </html>
  );
}
