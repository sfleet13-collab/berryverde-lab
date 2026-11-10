/**
 * Datentrennung und Rechte gegen eine echte Postgres-Datenbank im Speicher (PGlite),
 * mit den echten Migrationen aus /drizzle.
 * Aufruf: npm run test (läuft mit --conditions=react-server, damit "server-only" lädt).
 */
import assert from "node:assert/strict";
import { before, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../db/schema";
import { setDbForTests } from "../db";
import { seedRohstoffe } from "../db/seed-data";
import type { SessionUser } from "./auth";
import * as data from "./data";

const admin: SessionUser = {
  id: "admin-1",
  email: "susan@example.test",
  role: "admin",
  mitglied: true,
  stufe: "profi",
};
const anna: SessionUser = {
  id: "anna-1",
  email: "anna@example.test",
  role: "user",
  mitglied: true,
  stufe: "anfaenger",
};
const berta: SessionUser = {
  id: "berta-1",
  email: "berta@example.test",
  role: "user",
  mitglied: true,
  stufe: "anfaenger",
};
const fremd: SessionUser = {
  id: "fremd-1",
  email: "x@example.test",
  role: "user",
  mitglied: false,
  stufe: "anfaenger",
};

let kaolin = 0;
let papain = 0;

const eingabe = (
  name: string,
  extra: Partial<data.RezepturEingabe> = {},
): data.RezepturEingabe => ({
  name,
  untertitel: null,
  produkttyp: "wasserfrei",
  emulsionstyp: null,
  produktart: "Peeling",
  bereich: "gesicht",
  hautbeduerfnis: "alle",
  ausruestung: "start",
  stufe: "anfaenger",
  zeitMinuten: 10,
  chargeG: 30,
  haltbarkeitTage: 180,
  phZiel: null,
  frischcreme: false,
  geraete: "",
  herstellung: null,
  anwendung: null,
  notiz: null,
  positionen: [
    { rohstoffId: kaolin, phase: "pulver", prozent: 99, adHundert: false },
    { rohstoffId: papain, phase: "pulver", prozent: 1, adHundert: false },
  ],
  ...extra,
});

before(async () => {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  setDbForTests(db);
  for (const s of seedRohstoffe.filter((r) =>
    ["kaolin", "papain"].includes(r.slug),
  )) {
    const id = await data.saveRohstoff(
      admin,
      null,
      {
        slug: s.slug,
        name: s.name,
        inci: s.inci,
        kategorie: s.kategorie,
        phase: s.phase,
        form: s.form,
        stufe: s.stufe,
      },
      (s.dos ?? []).map(([produkttyp, min, max]) => ({
        produkttyp,
        min,
        max,
        hinweis: null,
      })),
    );
    if (s.slug === "kaolin") kaolin = id;
    else papain = id;
  }
});

test("Rohstoffe: Mitglieder lesen, nur Admin ändert, ohne Zugang nichts", async () => {
  const liste = await data.listRohstoffe(anna);
  assert.equal(liste.length, 2);
  assert.deepEqual(
    liste
      .find((r) => r.slug === "papain")!
      .dosierungen.map((d) => [d.min, d.max]),
    [[0.5, 1]],
  );
  await assert.rejects(() =>
    data.saveRohstoff(
      anna,
      kaolin,
      {
        slug: "kaolin",
        name: "Gehackt",
        inci: "X",
        kategorie: "pulver",
        phase: "pulver",
        form: "pulver",
      },
      [],
    ),
  );
  await assert.rejects(() => data.listRohstoffe(fremd));
});

test("Ausgeblendeter Rohstoff: Mitglieder sehen ihn nicht, Admin schon", async () => {
  const id = await data.saveRohstoff(
    admin,
    null,
    {
      slug: "versteckt",
      name: "Versteckt",
      inci: "Hidden",
      kategorie: "sonstiges",
      phase: "wasser",
      form: "fluessig",
      aktiv: false,
    },
    [],
  );
  assert.ok(!(await data.listRohstoffe(anna)).some((r) => r.id === id));
  assert.ok(
    !(await data.listRohstoffe(anna, { auchInaktive: true })).some(
      (r) => r.id === id,
    ),
  );
  assert.ok(
    (await data.listRohstoffe(admin, { auchInaktive: true })).some(
      (r) => r.id === id,
    ),
  );
  assert.equal(await data.getRohstoff(anna, id), null);
});

test("Rezepturen: Anna sieht Bertas Rezeptur nicht und kann sie weder ändern noch löschen", async () => {
  const a = await data.saveRezeptur(anna, null, eingabe("Annas Peeling"));
  const b = await data.saveRezeptur(berta, null, eingabe("Bertas Peeling"));

  assert.deepEqual(
    (await data.listRezepturen(anna)).map((r) => r.name),
    ["Annas Peeling"],
  );
  assert.equal(await data.getRezeptur(anna, b), null);
  await assert.rejects(() => data.saveRezeptur(anna, b, eingabe("Übernommen")));
  await data.deleteRezeptur(anna, b);
  assert.equal((await data.getRezeptur(berta, b))!.name, "Bertas Peeling");
  assert.equal((await data.getRezeptur(berta, b))!.positionen.length, 2);
  await assert.rejects(() => data.copyRezeptur(anna, b));

  // Admin sieht beide
  assert.equal((await data.listRezepturen(admin)).length, 2);
  // eigene ändern und löschen geht
  await data.saveRezeptur(anna, a, eingabe("Annas Peeling 2"));
  assert.equal((await data.getRezeptur(anna, a))!.name, "Annas Peeling 2");
  await data.deleteRezeptur(anna, a);
  assert.equal(await data.getRezeptur(anna, a), null);
});

test("Bibliothek: Mitglied kann sich nicht selbst in die Bibliothek setzen", async () => {
  const id = await data.saveRezeptur(
    anna,
    null,
    eingabe("Schummel", {
      bibliothek: true,
      status: "freigegeben",
      nummer: "R-999",
      blogText: "x",
    }),
  );
  const r = (await data.getRezeptur(anna, id))!;
  assert.equal(r.bibliothek, false);
  assert.equal(r.status, "entwurf");
  assert.equal(r.nummer, null);
  assert.equal(await data.getRezeptur(berta, id), null);
});

test("Bibliothek: Entwurf unsichtbar, freigegeben für alle sichtbar, aber nicht änderbar", async () => {
  const id = await data.saveRezeptur(
    admin,
    null,
    eingabe("R-Test", { bibliothek: true, status: "entwurf", nummer: "R-100" }),
  );
  assert.equal(await data.getRezeptur(anna, id), null);
  await data.saveRezeptur(
    admin,
    id,
    eingabe("R-Test", {
      bibliothek: true,
      status: "freigegeben",
      nummer: "R-100",
    }),
  );
  assert.equal((await data.getRezeptur(anna, id))!.nummer, "R-100");
  assert.ok((await data.listRezepturen(berta)).some((r) => r.id === id));
  await assert.rejects(() => data.saveRezeptur(anna, id, eingabe("Kaputt")));
  await data.deleteRezeptur(anna, id);
  assert.ok(await data.getRezeptur(admin, id));

  // Kopie wird eine eigene, private Rezeptur
  const kopie = await data.copyRezeptur(anna, id);
  const k = (await data.getRezeptur(anna, kopie))!;
  assert.equal(k.userId, anna.id);
  assert.equal(k.bibliothek, false);
  assert.equal(k.status, "entwurf");
  assert.equal(k.nummer, null);
  assert.equal(k.varianteVon, id);
  assert.equal(k.positionen.length, 2);
  assert.equal(await data.getRezeptur(berta, kopie), null);
});

test("Ohne Zugang: keine Rezepturen lesen oder schreiben", async () => {
  await assert.rejects(() => data.listRezepturen(fremd));
  await assert.rejects(() => data.saveRezeptur(fremd, null, eingabe("Nein")));
  await assert.rejects(() => data.getRezeptur(fremd, 1));
});

test("Zugänge: nur Admin; erneutes Freischalten aktiviert wieder", async () => {
  await assert.rejects(() => data.listZugaenge(anna));
  await assert.rejects(() =>
    data.addZugang(anna, "boese@example.test", null, "profi", null),
  );
  await data.addZugang(admin, " Neu@Example.test ", "Neu", "anfaenger", null);
  let [z] = await data.listZugaenge(admin);
  assert.equal(z.email, "neu@example.test");
  assert.equal(z.aktiv, true);
  await data.updateZugang(admin, z.id, { aktiv: false });
  await data.addZugang(admin, "neu@example.test", null, "mittel", null);
  [z] = await data.listZugaenge(admin);
  assert.equal(z.aktiv, true);
  assert.equal(z.stufe, "mittel");
  assert.equal(z.name, "Neu");
  assert.equal((await data.listZugaenge(admin)).length, 1);
});

test("Zugänge aus Tentary: Kauf schaltet frei, Abo-Ende deaktiviert, manuelle bleiben", async () => {
  await data.systemZugangAusTentary(" Kaeuferin@Example.test ");
  let z = (await data.listZugaenge(admin)).find(
    (x) => x.email === "kaeuferin@example.test",
  )!;
  assert.equal(z.aktiv, true);
  assert.equal(z.quelle, "tentary");
  assert.ok(z.geprueftAm);
  assert.ok((await data.systemTentaryZugaenge()).some((x) => x.id === z.id));

  await data.systemTentaryErgebnis(z.id, false);
  z = (await data.listZugaenge(admin)).find((x) => x.id === z.id)!;
  assert.equal(z.aktiv, false, "Abo beendet");

  // Neuer Kauf: wieder aktiv
  await data.systemZugangAusTentary("kaeuferin@example.test");
  z = (await data.listZugaenge(admin)).find((x) => x.id === z.id)!;
  assert.equal(z.aktiv, true);

  // Admin schaltet von Hand frei: Quelle manuell, der Abgleich fasst ihn nicht mehr an
  await data.addZugang(admin, "kaeuferin@example.test", null, "mittel", null);
  z = (await data.listZugaenge(admin)).find((x) => x.id === z.id)!;
  assert.equal(z.quelle, "manuell");
  await data.systemTentaryErgebnis(z.id, false);
  z = (await data.listZugaenge(admin)).find((x) => x.id === z.id)!;
  assert.equal(z.aktiv, true);
  assert.ok(!(await data.systemTentaryZugaenge()).some((x) => x.id === z.id));
});
