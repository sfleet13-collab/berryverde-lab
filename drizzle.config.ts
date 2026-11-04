import { defineConfig } from "drizzle-kit";

/** Datenbank-Tabellen anlegen/aktualisieren: npm run db:push */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
