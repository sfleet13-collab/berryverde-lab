"use client";

import { useEffect, useState } from "react";
import { tracking } from "@/config/site";
import type { Dictionary } from "@/i18n";
import styles from "./ConsentBanner.module.css";

type Choice = "all" | "necessary";
const KEY = "consent-v1";
export const OPEN_CONSENT_EVENT = "open-consent";

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

/** Lädt Google Analytics / Ads erst NACH Zustimmung. */
function loadTracking() {
  const ids = [tracking.googleAnalyticsId, tracking.googleAdsId].filter(Boolean);
  if (!ids.length || document.getElementById("gtag-src")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  ids.forEach((id) => w.gtag("config", id, { anonymize_ip: true }));
  const s = document.createElement("script");
  s.id = "gtag-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;
  document.head.appendChild(s);
}

export default function ConsentBanner({ t }: { t: Dictionary["consent"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "all") loadTracking();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- erst im Browser bekannt
    if (!choice) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ohne Speicher gilt die Wahl nur für diesen Besuch */
    }
    setOpen(false);
    if (choice === "all") loadTracking();
    else if (document.getElementById("gtag-src")) window.location.reload();
  }

  if (!open) return null;
  return (
    <div className={styles.banner} role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <p id="consent-title" className={styles.title}>
        {t.title}
      </p>
      <p className={styles.text}>{t.text}</p>
      <div className={styles.actions}>
        {/* Beide Knöpfe gleich gross und gleich auffällig (rechtlich wichtig) */}
        <button type="button" className="btn btn-ghost" onClick={() => decide("necessary")}>
          {t.decline}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => decide("all")}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}
