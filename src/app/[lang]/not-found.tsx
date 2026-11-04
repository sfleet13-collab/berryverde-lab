import Link from "next/link";
import styles from "./status.module.css";

/** 404-Seite (zweisprachig, da hier die Sprache nicht sicher bekannt ist). */
export default function NotFound() {
  return (
    <section className={`container ${styles.status}`}>
      <p className={styles.code} aria-hidden="true">404</p>
      <h1>Seite nicht gefunden</h1>
      <p className="muted">Diese Seite gibt es nicht oder nicht mehr. · This page doesn’t exist.</p>
      <Link className="btn btn-primary" href="/">
        Zur Startseite · Home
      </Link>
    </section>
  );
}
