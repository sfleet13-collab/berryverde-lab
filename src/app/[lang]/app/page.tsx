import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/config/site";
import { getDictionary, type Dictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import { authConfigured, getCurrentUser, isAdmin, type SessionUser } from "@/lib/auth";
import Icon from "@/components/Icon";
import { listItems } from "@/lib/data";
import { removeItem, toggleItem } from "@/lib/actions/items";
import AddItemForm from "@/components/AddItemForm";
import { signOut } from "@/lib/actions/auth";
import styles from "./app.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  // Geschützte Bereiche gehören nicht in Google
  return pageMetadata({ lang, path: "/app", title: t.seo.app.title, description: t.seo.app.description, noindex: true });
}

export default async function AppPage({ params }: PageProps<"/[lang]/app">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <section className="section">
      <div className="container">
        <h1 className={styles.title}>{t.app.title}</h1>
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <AppContent lang={lang} t={t} />
        </Suspense>
      </div>
    </section>
  );
}

async function AppContent({ lang, t }: { lang: Locale; t: Dictionary }) {
  if (!authConfigured) {
    return (
      <div className={styles.notice} role="note">
        <strong>{t.app.setupTitle}</strong>
        <p>{t.app.setupText}</p>
        <Preview t={t} />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/anmelden`);

  const items = await listItems(user);
  return <AppView lang={lang} t={t} user={user} items={items} />;
}

type Items = Awaited<ReturnType<typeof listItems>>;

/** Darstellung von „Mein Bereich“ – getrennt von Login und Daten, damit sie sich einzeln prüfen lässt. */
function AppView({ lang, t, user, items }: { lang: Locale; t: Dictionary; user: SessionUser; items: Items }) {
  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <p className="muted">
          {t.app.signedInAs} <strong>{user.email ?? user.name}</strong> · {t.app.role}:{" "}
          <strong>{t.app.roles[user.role]}</strong>
        </p>
        <form action={signOut}>
          <input type="hidden" name="lang" value={lang} />
          <button type="submit" className="btn btn-ghost">
            {t.auth.signOut}
          </button>
        </form>
      </div>
      <div className={styles.intro} role="note">
        <h2 className={styles.introTitle}>{t.app.introTitle}</h2>
        <p>{t.app.introText}</p>
        {isAdmin(user) && <p>{t.app.introAdmin}</p>}
        <p className="muted">{t.app.introNote}</p>
      </div>

      <div className={styles.listHead}>
        <h2 className={styles.h2}>{isAdmin(user) ? t.app.allItems : t.app.itemsTitle}</h2>
        {items && items.length > 0 && (
          <p className={styles.count}>
            {t.app.count
              .replace("{open}", String(items.filter((i) => !i.done).length))
              .replace("{done}", String(items.filter((i) => i.done).length))}
          </p>
        )}
      </div>

      {items === null ? (
        <p className="muted">{t.app.dbMissing}</p>
      ) : (
        <>
          <AddItemForm t={t.app} />
          {items.length === 0 ? (
            <p className="muted">{t.app.empty}</p>
          ) : (
            <ul className={styles.list}>
              {items.map((i) => (
                <li key={i.id} className={i.done ? styles.done : undefined}>
                  <form action={toggleItem}>
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="done" value={i.done ? "0" : "1"} />
                    <button
                      type="submit"
                      className={styles.check}
                      aria-pressed={i.done}
                      aria-label={`${i.done ? t.app.markOpen : t.app.markDone}: ${i.title}`}
                      title={i.done ? t.app.markOpen : t.app.markDone}
                    >
                      <Icon name="check" />
                    </button>
                  </form>
                  <span className={styles.itemText}>
                    <strong className={styles.itemTitle}>{i.title}</strong>
                    {i.note && <span className={styles.itemNote}>{i.note}</span>}
                    {isAdmin(user) && i.userId !== user.id && (
                      <small className={styles.owner}>
                        {t.app.from} {i.ownerEmail ?? "?"}
                      </small>
                    )}
                  </span>
                  <a
                    className={styles.claude}
                    href={claudeLink(t, i.title, i.note)}
                    target="_blank"
                    rel="noopener"
                    title={t.app.toClaudeHint}
                  >
                    {t.app.toClaude} <span aria-hidden="true">↗</span>
                    <span className="sr-only">: {i.title}</span>
                  </a>
                  <form action={removeItem}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" className={styles.remove} aria-label={`${t.app.remove}: ${i.title}`} title={t.app.remove}>
                      ×
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/** Öffnet Claude mit vorausgefüllter Idee (claude.ai/new?q=…). */
function claudeLink(t: Dictionary, title: string, note: string | null) {
  const prompt = t.app.claudePrompt.replace("{title}", title).replace("{note}", note?.trim() || t.app.noDetails);
  return `https://claude.ai/new?q=${encodeURIComponent(prompt.slice(0, 4000))}`;
}

/** Vorschau, solange der Login noch nicht eingerichtet ist. */
function Preview({ t }: { t: Dictionary }) {
  const demo = ["Buchungs-App für Fotoshootings", "Spar-App als Download verkaufen", "Helferplan für Vereinsfeste"];
  return (
    <div className={styles.panel} aria-label="Vorschau">
      <h2 className={styles.h2}>{t.app.itemsTitle}</h2>
      <ul className={styles.list}>
        {demo.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

