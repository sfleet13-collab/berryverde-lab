import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { getRohstoff } from "@/lib/data";
import { requireAdmin } from "@/lib/session";
import RohstoffForm from "@/components/lab/RohstoffForm";
import styles from "@/components/lab/lab.module.css";

type Props = PageProps<"/[lang]/app/rohstoffe/neu">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/app/rohstoffe", title: t.seo.rohstoffForm.title, description: t.seo.rohstoffForm.description, noindex: true });
}

export default async function RohstoffFormPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <section className={styles.seite}>
      <div className={`container ${styles.schmal}`}>
        <h1 className={styles.seitenTitel}>{L.rohstoffForm.titelNeu}</h1>
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt params={params as Promise<{ lang: string; id?: string }>} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ params }: { params: Promise<{ lang: string; id?: string }> }) {
  const { lang, id } = await params;
  const user = await requireAdmin(lang);
  if (id === undefined) return <RohstoffForm r={null} />;
  const r = Number.isInteger(Number(id)) ? await getRohstoff(user, Number(id)) : null;
  if (!r) redirect(`/${lang}/app/rohstoffe`);
  return <RohstoffForm r={r} />;
}
