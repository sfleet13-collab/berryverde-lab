"use client";

/** Öffnet den Cookie-Banner erneut (Widerruf jederzeit möglich). */
export default function ConsentSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("open-consent"))}>
      {label}
    </button>
  );
}
