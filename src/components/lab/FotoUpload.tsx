"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";
import { fotoSpeichern } from "@/lib/actions/lab";
import styles from "./lab.module.css";

const MAX_KANTE = 1600;
const ROH_MAX = 15 * 1024 * 1024;

/** Verkleinert ein Foto im Browser auf höchstens 1600 px (WebP, sonst JPEG). Spart Upload-Zeit und Speicher. */
async function verkleinere(datei: File): Promise<Blob> {
  const bild = await createImageBitmap(datei);
  const faktor = Math.min(1, MAX_KANTE / Math.max(bild.width, bild.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bild.width * faktor);
  canvas.height = Math.round(bild.height * faktor);
  canvas.getContext("2d")!.drawImage(bild, 0, 0, canvas.width, canvas.height);
  bild.close();
  const als = (typ: string) =>
    new Promise<Blob | null>((ok) => canvas.toBlob(ok, typ, 0.85));
  const webp = await als("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpg = await als("image/jpeg");
  if (!jpg) throw new Error("Bild konnte nicht umgewandelt werden");
  return jpg;
}

/** Produktfoto einer Rezeptur hochladen, ersetzen oder entfernen (nur Admin). */
export default function FotoUpload({
  rezepturId,
  fotoUrl,
  name,
}: {
  rezepturId: number;
  fotoUrl: string | null;
  name: string;
}) {
  const [url, setUrl] = useState(fotoUrl);
  const [fehler, setFehler] = useState<string | null>(null);
  const [laeuft, starte] = useTransition();
  const eingabe = useRef<HTMLInputElement>(null);

  function senden(blob: Blob | null) {
    const form = new FormData();
    form.set("id", String(rezepturId));
    if (blob)
      form.set(
        "foto",
        new File(
          [blob],
          blob.type === "image/webp" ? "foto.webp" : "foto.jpg",
          { type: blob.type },
        ),
      );
    starte(async () => {
      const r = await fotoSpeichern(form);
      if (r.ok) {
        setUrl(r.url);
        setFehler(null);
      } else {
        setFehler(
          r.fehler === "zuGross"
            ? L.rezeptur.fotoZuGross
            : r.fehler === "keinBild"
              ? L.rezeptur.fotoKeinBild
              : L.rezeptur.fotoFehler,
        );
      }
    });
  }

  async function gewaehlt(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    e.target.value = "";
    if (!datei) return;
    if (!datei.type.startsWith("image/"))
      return setFehler(L.rezeptur.fotoKeinBild);
    if (datei.size > ROH_MAX) return setFehler(L.rezeptur.fotoZuGross);
    try {
      senden(await verkleinere(datei));
    } catch {
      setFehler(L.rezeptur.fotoFehler);
    }
  }

  return (
    <div className={styles.fotoUpload}>
      <div className={styles.fotoVorschau} data-leer={!url || undefined}>
        {url ? (
          <Image
            src={url}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <Icon name="image" size={28} />
        )}
      </div>
      <div className={styles.fotoAktionen}>
        <input
          ref={eingabe}
          id="foto-datei"
          type="file"
          tabIndex={-1}
          aria-hidden="true"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={gewaehlt}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => eingabe.current?.click()}
          disabled={laeuft}
          aria-describedby="foto-hilfe"
        >
          {laeuft
            ? L.rezeptur.fotoLaedt
            : url
              ? L.rezeptur.fotoErsetzen
              : L.rezeptur.fotoWaehlen}
        </button>
        {url && !laeuft && (
          <button
            type="button"
            className={styles.textLink}
            onClick={() => senden(null)}
          >
            {L.rezeptur.fotoEntfernen}
          </button>
        )}
        <p id="foto-hilfe" className="muted">
          {L.rezeptur.fotoHilfe}
        </p>
        {fehler && (
          <p className={styles.fehlerText} role="alert">
            {fehler}
          </p>
        )}
      </div>
    </div>
  );
}
