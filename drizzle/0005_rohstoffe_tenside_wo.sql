ALTER TABLE "rezepturen" ADD COLUMN "emulsionstyp" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "spreitung" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "oxidation" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "haltbar_monate" integer;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "fettsaeuren" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "verseifungszahl_koh" numeric(6, 1);--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "schmelzpunkt" integer;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "geeignet_fuer" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "tensid_klasse" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "was_prozent" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "vertraeglichkeit" text;--> statement-breakpoint
ALTER TABLE "rohstoffe" ADD COLUMN "tensid_rolle" text;