"use client";

import styles from "./status.module.css";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className={`container ${styles.status}`} role="alert">
      <h1>Da ist etwas schiefgelaufen</h1>
      <p className="muted">Bitte versuch es gleich noch einmal. · Something went wrong, please try again.</p>
      <button className="btn btn-primary" type="button" onClick={() => reset()}>
        Erneut versuchen · Try again
      </button>
    </section>
  );
}
