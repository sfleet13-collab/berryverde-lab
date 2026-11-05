"use client";

import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";

/** Drucken oder als PDF speichern (Druckdialog des Browsers). */
export default function PrintButtons({ label = L.karte.drucken }: { label?: string }) {
  return (
    <button type="button" className="btn btn-primary" onClick={() => window.print()}>
      <Icon name="print" />
      {label}
    </button>
  );
}
