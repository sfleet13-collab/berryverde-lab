CREATE TABLE "geraete" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"beschreibung" text,
	"link" text,
	"link_affiliate" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rezeptur_positionen" (
	"id" serial PRIMARY KEY NOT NULL,
	"rezeptur_id" integer NOT NULL,
	"rohstoff_id" integer NOT NULL,
	"phase" text NOT NULL,
	"prozent" numeric(6, 3) DEFAULT 0 NOT NULL,
	"ad_hundert" boolean DEFAULT false NOT NULL,
	"reihenfolge" integer DEFAULT 0 NOT NULL,
	"hinweis" text
);
--> statement-breakpoint
CREATE TABLE "rezepturen" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nummer" text,
	"name" text NOT NULL,
	"untertitel" text,
	"produkttyp" text NOT NULL,
	"produktart" text,
	"bereich" text DEFAULT 'gesicht' NOT NULL,
	"hautbeduerfnis" text DEFAULT 'alle' NOT NULL,
	"ausruestung" text DEFAULT 'start' NOT NULL,
	"stufe" text DEFAULT 'anfaenger' NOT NULL,
	"zeit_minuten" integer,
	"charge_g" numeric(7, 2) DEFAULT 30 NOT NULL,
	"haltbarkeit_tage" integer,
	"ph_ziel" numeric(4, 2),
	"frischcreme" boolean DEFAULT false NOT NULL,
	"geraete" text DEFAULT '' NOT NULL,
	"herstellung" text,
	"anwendung" text,
	"blog_text" text,
	"notiz" text,
	"status" text DEFAULT 'entwurf' NOT NULL,
	"bibliothek" boolean DEFAULT false NOT NULL,
	"variante_von" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rohstoff_dosierungen" (
	"id" serial PRIMARY KEY NOT NULL,
	"rohstoff_id" integer NOT NULL,
	"produkttyp" text NOT NULL,
	"min" numeric(6, 3) NOT NULL,
	"max" numeric(6, 3) NOT NULL,
	"hinweis" text
);
--> statement-breakpoint
CREATE TABLE "rohstoffe" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"handelsnamen" text,
	"inci" text NOT NULL,
	"kategorie" text NOT NULL,
	"funktion" text,
	"phase" text NOT NULL,
	"form" text NOT NULL,
	"dichte" numeric(5, 3),
	"tropfenfaktor" numeric(6, 4),
	"ph_min" numeric(4, 2),
	"ph_max" numeric(4, 2),
	"temp_max" integer,
	"loeslichkeit" text,
	"stufe" text DEFAULT 'anfaenger' NOT NULL,
	"lieferant" text,
	"kauf_link" text,
	"kauf_link_affiliate" boolean DEFAULT false NOT NULL,
	"steckbrief_was" text,
	"steckbrief_chemisch" text,
	"steckbrief_wirkung" text,
	"hinweis" text,
	"quelle" text,
	"wirk_bakterien" text,
	"wirk_hefen" text,
	"wirk_schimmel" text,
	"breitband" boolean,
	"kons_status" text,
	"kons_rolle" text,
	"kombi_partner" text,
	"nicht_waessrig" boolean DEFAULT false NOT NULL,
	"emulgator_typ" text,
	"hlb" numeric(4, 1),
	"fettphase_min" numeric(5, 2),
	"fettphase_max" numeric(5, 2),
	"emulgator_bezug" text,
	"hautgefuehl" text,
	"konsistenzgeber_noetig" boolean,
	"aktiv" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zugaenge" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"stufe" text DEFAULT 'anfaenger' NOT NULL,
	"aktiv" boolean DEFAULT true NOT NULL,
	"notiz" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stufe" text DEFAULT 'anfaenger' NOT NULL;--> statement-breakpoint
ALTER TABLE "rezeptur_positionen" ADD CONSTRAINT "rezeptur_positionen_rezeptur_id_rezepturen_id_fk" FOREIGN KEY ("rezeptur_id") REFERENCES "public"."rezepturen"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezeptur_positionen" ADD CONSTRAINT "rezeptur_positionen_rohstoff_id_rohstoffe_id_fk" FOREIGN KEY ("rohstoff_id") REFERENCES "public"."rohstoffe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rohstoff_dosierungen" ADD CONSTRAINT "rohstoff_dosierungen_rohstoff_id_rohstoffe_id_fk" FOREIGN KEY ("rohstoff_id") REFERENCES "public"."rohstoffe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "geraete_slug_idx" ON "geraete" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "positionen_rezeptur_idx" ON "rezeptur_positionen" USING btree ("rezeptur_id");--> statement-breakpoint
CREATE INDEX "rezepturen_user_id_idx" ON "rezepturen" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rezepturen_bibliothek_idx" ON "rezepturen" USING btree ("bibliothek");--> statement-breakpoint
CREATE UNIQUE INDEX "dosierung_rohstoff_typ_idx" ON "rohstoff_dosierungen" USING btree ("rohstoff_id","produkttyp");--> statement-breakpoint
CREATE UNIQUE INDEX "rohstoffe_slug_idx" ON "rohstoffe" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "zugaenge_email_idx" ON "zugaenge" USING btree ("email");