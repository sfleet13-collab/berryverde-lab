ALTER TABLE "zugaenge" ADD COLUMN "quelle" text DEFAULT 'manuell' NOT NULL;--> statement-breakpoint
ALTER TABLE "zugaenge" ADD COLUMN "geprueft_am" timestamp with time zone;