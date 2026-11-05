import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/auth";
import { ladeRohstoffe } from "@/lib/lab/laden";
import { requireMitglied } from "@/lib/session";
import Editor, { type EditorStart } from "@/components/lab/Editor";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/rezeptur/neu">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/app/rezeptur/neu", title: t.seo.editor.title, description: t.seo.editor.description, noindex: true });
}

const LEER: EditorStart = {
  id: null,
  name: "",
  untertitel: "",
  produkttyp: "emulsion",
  emulsionstyp: "ow",
  produktart: "",
  bereich: "gesicht",
  hautbeduerfnis: "alle",
  ausruestung: "pro",
  chargeG: 50,
  phZiel: 5.2,
  haltbarkeitTage: 90,
  zeitMinuten: null,
  frischcreme: false,
  herstellung: "",
  anwendung: "",
  notiz: "",
  nummer: "",
  blogText: "",
  bibliothek: false,
  status: "entwurf",
  positionen: [],
};

export default async function NeuPage({ params }: PageProps<"/[lang]/app/rezeptur/neu">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <section className={styles.seite}>
      <div className="container">
        <h1 className={styles.seitenTitel}>{L.editor.titelNeu}</h1>
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt lang={lang} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ lang }: { lang: string }) {
  const user = await requireMitglied(lang);
  const rohstoffe = await ladeRohstoffe(user);
  return <Editor start={LEER} rohstoffe={rohstoffe} admin={isAdmin(user)} />;
}
