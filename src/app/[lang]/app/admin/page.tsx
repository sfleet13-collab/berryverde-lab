import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, site } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L, fuelle } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { listGeraete, listZugaenge } from "@/lib/data";
import { geraetSpeichern, zugangLoeschen, zugangSetzen } from "@/lib/actions/lab";
import { requireAdmin } from "@/lib/session";
import CopyBox from "@/components/lab/CopyBox";
import ZugangForm from "@/components/lab/ZugangForm";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/admin">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/app/admin", title: t.seo.admin.title, description: t.seo.admin.description, noindex: true });
}

export default async function AdminPage({ params }: PageProps<"/[lang]/app/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <section className={styles.seite}>
      <div className={`container ${styles.schmal}`}>
        <h1 className={styles.seitenTitel}>{L.admin.titel}</h1>
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt lang={lang} />
        </Suspense>
      </div>
    </section>
  );
}

const DATUM = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });

async function Inhalt({ lang }: { lang: string }) {
  const user = await requireAdmin(lang);
  const [zugaenge, geraete] = await Promise.all([listZugaenge(user), listGeraete(user)]);

  return (
    <>
      <section className={styles.karte} aria-labelledby="zugaenge-titel">
        <h2 id="zugaenge-titel">{L.admin.zugaengeTitel}</h2>
        <p className="muted">{L.admin.zugaengeText}</p>
        <ZugangForm />

        {zugaenge.length === 0 ? (
          <p className={styles.leer}>{L.admin.keineZugaenge}</p>
        ) : (
          <ul className={styles.zugaenge}>
            {zugaenge.map((z) => (
              <li key={z.id} data-aus={!z.aktiv || undefined}>
                <div className={styles.zugangWer}>
                  <strong>{z.email}</strong>
                  <span>
                    {[z.name, DATUM.format(z.createdAt), z.notiz].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <form action={zugangSetzen} className={styles.zugangStufe}>
                  <input type="hidden" name="id" value={z.id} />
                  <label htmlFor={`st-${z.id}`} className="sr-only">
                    {L.admin.stufe}: {z.email}
                  </label>
                  <select id={`st-${z.id}`} name="stufe" defaultValue={z.stufe}>
                    {Object.entries(L.stufe).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={styles.textBtn}>
                    {L.admin.speichern}
                  </button>
                </form>
                <span className={styles.zugangStatus} data-aktiv={z.aktiv || undefined}>
                  {z.aktiv ? L.admin.aktiv : L.admin.aus}
                </span>
                <form action={zugangSetzen}>
                  <input type="hidden" name="id" value={z.id} />
                  <input type="hidden" name="aktiv" value={z.aktiv ? "0" : "1"} />
                  <button type="submit" className={styles.textBtn}>
                    {z.aktiv ? L.admin.ausschalten : L.admin.einschalten}
                  </button>
                </form>
                {!z.aktiv && (
                  <form action={zugangLoeschen}>
                    <input type="hidden" name="id" value={z.id} />
                    <button type="submit" className={styles.textBtn} data-gefahr>
                      {L.admin.entfernen}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}

        <CopyBox label={L.admin.einladungTitel} text={fuelle(L.admin.einladungText, { url: `${site.url}/de/anmelden` })} />
      </section>

      <section className={styles.karte} aria-labelledby="geraete-titel">
        <h2 id="geraete-titel">{L.admin.geraeteTitel}</h2>
        <p className="muted">{L.admin.geraeteText}</p>
        <ul className={styles.geraeteAdmin}>
          {geraete.map((g) => (
            <li key={g.id}>
              <form action={geraetSpeichern}>
                <input type="hidden" name="id" value={g.id} />
                <div className={`${styles.feld} ${styles.breit}`}>
                  <label htmlFor={`g-${g.id}`}>{g.name}</label>
                  <input id={`g-${g.id}`} name="link" type="url" defaultValue={g.link ?? ""} placeholder={L.admin.link} />
                </div>
                <label className={styles.haken}>
                  <input type="checkbox" name="affiliate" defaultChecked={g.linkAffiliate} />
                  {L.admin.affiliate}
                </label>
                <button type="submit" className="btn btn-ghost">
                  {L.admin.speichern}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.karte} aria-labelledby="rohstoffe-titel">
        <h2 id="rohstoffe-titel">{L.admin.rohstoffeTitel}</h2>
        <p className="muted">{L.admin.rohstoffeText}</p>
        <Link className="btn btn-ghost" href={`/${lang}/app/rohstoffe`}>
          {L.admin.zuRohstoffen}
        </Link>
      </section>
    </>
  );
}
