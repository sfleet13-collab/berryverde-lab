import { boolean, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * GRUNDREGEL: Jede Tabelle mit Nutzerdaten hat eine Spalte user_id.
 * So sieht jede Person nur ihre eigenen Daten (siehe src/lib/data.ts).
 */

/** Rolle pro Nutzer: "user" (Standard) oder "admin". user_id = ID aus Neon Auth. */
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Ideen-Sammlung (Titel, Details, umgesetzt) – pro App durch die echten Inhalte ersetzen. */
export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    note: text("note"),
    done: boolean("done").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("items_user_id_idx").on(t.userId)],
);

export type Profile = typeof profiles.$inferSelect;
export type Item = typeof items.$inferSelect;
