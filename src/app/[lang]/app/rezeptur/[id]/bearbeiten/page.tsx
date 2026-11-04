import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/auth";
import { darfAendern, getRezeptur } from "@/lib/data";
import { ladeRohstoffe } from "@/lib/lab/laden";
import { requireMitglied } from "@/lib/session";
import Editor, { type EditorStart } from "@/components/lab/Editor";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/rezeptur/[id]/bearbeiten">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: `/app/rezeptur/${id}/bearbeiten`, title: t.seo.editor.title, description: t.seo.editor.description, noindex: true });
}

export default function BearbeitenPage({ params }: PageProps<"/[lang]/app/rezeptur/[id]/bearbeiten">) {
  // Hülle ohne Zugriff auf params: Die ID ist erst zur Laufzeit bekannt und wird im Suspense-Teil gelesen.
  const t = getDictionary("de");
  return (
    <section className={styles.seite}>
      <div className="container">
        <h1 className={styles.seitenTitel}>{L.editor.titelBearbeiten}</h1>
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt params={params} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const user = await requireMitglied(lang);
  const r = Number.isInteger(Number(id)) ? await getRezeptur(user, Number(id)) : null;
  if (!r) redirect(`/${lang}/app`);
  if (!darfAendern(user, r)) redirect(`/${lang}/app/rezeptur/${r.id}`);
  const rohstoffe = await ladeRohstoffe(user);
  const start: EditorStart = {
    id: r.id,
    name: r.name,
    untertitel: r.untertitel ?? "",
    produkttyp: r.produkttyp,
    produktart: r.produktart ?? "",
    bereich: r.bereich,
    hautbeduerfnis: r.hautbeduerfnis,
    ausruestung: r.ausruestung,
    chargeG: r.chargeG,
    phZiel: r.phZiel,
    haltbarkeitTage: r.haltbarkeitTage,
    zeitMinuten: r.zeitMinuten,
    frischcreme: r.frischcreme,
    herstellung: r.herstellung ?? "",
    anwendung: r.anwendung ?? "",
    notiz: r.notiz ?? "",
    nummer: r.nummer ?? "",
    blogText: r.blogText ?? "",
    bibliothek: r.bibliothek,
    status: r.status,
    positionen: r.positionen.map((p) => ({ rohstoffId: p.rohstoffId, phase: p.phase, prozent: p.prozent, adHundert: p.adHundert })),
  };
  return <Editor start={start} rohstoffe={rohstoffe} admin={isAdmin(user)} />;
}
