/**
 * STARTBESTAND für Dein Lab.
 * Quelle der Regelwerte: claude/berryverde-regelwerk.md (Stand 4.11.2026, von Susan geprüft).
 * Dichten und Steckbriefe sind Orientierungswerte bis zum Abgleich mit den Datenblättern der Lieferanten.
 *
 * Wird beim Deployment eingespielt (scripts/seed.ts): nur NEUE Einträge, bestehende werden nie überschrieben.
 * Pflege danach im Admin-Bereich der App.
 */

type S = "anfaenger" | "mittel" | "profi";
type Typ = "emulsion" | "wasserfrei" | "waessrig" | "tensid" | "alle";

import { seedErweiterung, seedZusatz } from "./seed-data-erweiterung";

export type SeedRohstoff = {
  slug: string;
  name: string;
  handelsnamen?: string;
  inci: string;
  kategorie:
    | "wasser" | "emulgator" | "coemulgator" | "konsistenzgeber" | "wachs" | "tensid" | "oel" | "butter" | "konservierer" | "antioxidans"
    | "feuchtigkeit" | "wirkstoff" | "aetherisches_oel" | "pulver" | "peeling" | "ph_regler" | "sonstiges";
  funktion: string;
  phase: "fett" | "wasser" | "kalt" | "pulver";
  form: "fluessig" | "fest" | "pulver";
  dichte?: number;
  phMin?: number;
  phMax?: number;
  tempMax?: number;
  loeslichkeit?: "wasser" | "oel" | "beides" | "unloeslich";
  stufe: S;
  hinweis?: string;
  was: string;
  chemisch: string;
  wirkung: string;
  // Konservierer
  wirk?: [string, string, string];
  breitband?: boolean;
  konsStatus?: "konservierungsmittel" | "additiv" | "rohstoff";
  konsRolle?: "standard" | "ko" | "kombi";
  kombiPartner?: string;
  nichtWaessrig?: boolean;
  // Emulgatoren
  emulgatorTyp?: "ow" | "wo";
  hlb?: number;
  fettphase?: [number, number];
  emulgatorBezug?: "gesamt" | "fettphase";
  hautgefuehl?: string;
  konsistenzgeberNoetig?: boolean;
  // Öle, Buttern, Wachse
  spreitung?: "schnell" | "mittel" | "langsam";
  oxidation?: "stabil" | "mittel" | "empfindlich";
  haltbarMonate?: number;
  fettsaeuren?: string;
  verseifungszahlKoh?: number;
  schmelzpunkt?: number;
  geeignetFuer?: string;
  // Tenside
  tensidKlasse?: "anionisch" | "amphoter" | "nichtionisch";
  wasProzent?: number;
  vertraeglichkeit?: "sehr gut" | "gut" | "akzeptabel";
  tensidRolle?: "basistensid" | "kotensid" | "mischtensid";
  /** Quellen der Werte (URLs), werden beim Rohstoff hinterlegt. */
  quellen?: string[];
  dos?: [Typ, number, number, string?][];
};

const REGELWERK = "Regelwerk Dein Lab, 4.11.2026";
export const SEED_QUELLE = `${REGELWERK}; Dichte und Steckbrief: Orientierungswerte, mit Datenblatt des Lieferanten abgleichen`;

const basisRohstoffe: SeedRohstoff[] = [
  // ---------- Wasser ----------
  {
    slug: "wasser", name: "Wasser, destilliert", inci: "Aqua", kategorie: "wasser", funktion: "Basis der Wasserphase",
    phase: "wasser", form: "fluessig", dichte: 1, loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Destilliertes Wasser verwenden, kein Leitungswasser. Angebrochene Flaschen bald verbrauchen.",
    was: "Die Grundlage jeder Creme und Lotion. Destilliertes Wasser enthält keine Mineralien und Kalk, die eine Emulsion stören oder den Konservierer schwächen.",
    chemisch: "H₂O ohne gelöste Salze.",
    wirkung: "Lösungsmittel für wasserlösliche Wirkstoffe und Träger der Feuchtigkeit.",
  },

  // ---------- Emulgatoren ----------
  {
    slug: "xyliance", name: "Xyliance", inci: "Cetearyl Wheat Straw Glycosides, Cetearyl Alcohol", kategorie: "emulgator",
    funktion: "Emulgator O/W, Standard in Dein Lab", phase: "fett", form: "fest", phMin: 2, phMax: 12, loeslichkeit: "oel", stufe: "anfaenger",
    emulgatorTyp: "ow", fettphase: [20, 45], emulgatorBezug: "gesamt", hautgefuehl: "leicht und matt", konsistenzgeberNoetig: false,
    hinweis: "Robust, funktioniert mit jeder Methode, auch One-Pot. Unter 25 % Fettphase 0,2 % Xanthan ergänzen.",
    was: "Ein pflanzlicher Emulgator aus Weizenstroh und Fettalkoholen. Er verzeiht Fehler und ist deshalb der Standard für den Einstieg.",
    chemisch: "Zuckertensid (Alkylglykosid) kombiniert mit Cetearylalkohol.",
    wirkung: "Verbindet Fett und Wasser zu einer stabilen Creme mit leichtem, mattem Hautgefühl.",
    dos: [["emulsion", 3, 5]],
  },
  {
    slug: "montanov-68", name: "Montanov 68", inci: "Cetearyl Alcohol, Cetearyl Glucoside", kategorie: "emulgator",
    funktion: "Emulgator O/W für reichhaltige Cremes", phase: "fett", form: "fest", phMin: 5.5, phMax: 6.5, loeslichkeit: "oel", stufe: "mittel",
    emulgatorTyp: "ow", fettphase: [25, 40], emulgatorBezug: "gesamt", hautgefuehl: "cremig, pflegend", konsistenzgeberNoetig: false,
    hinweis: "Mag hohe Scherkräfte: Milchaufschäumer oder Handrührer verwenden. pH Creme 5,5–6, Lotion 6,5.",
    was: "Emulgator für die Wintercreme. Bildet Strukturen, die der Hautbarriere ähneln, und macht Cremes spürbar reichhaltig.",
    chemisch: "Cetearylglucosid (Zuckertensid) mit Cetearylalkohol.",
    wirkung: "Emulgiert und gibt gleichzeitig Konsistenz, ein zusätzlicher Konsistenzgeber ist nicht nötig.",
    dos: [["emulsion", 4, 5]],
  },
  {
    slug: "emulsan", name: "Emulsan", inci: "Methyl Glucose Sesquistearate", kategorie: "emulgator",
    funktion: "Emulgator O/W", phase: "fett", form: "fest", phMin: 3.5, phMax: 8.5, loeslichkeit: "oel", stufe: "mittel",
    emulgatorTyp: "ow", fettphase: [15, 40], emulgatorBezug: "gesamt", hautgefuehl: "glättend, leicht filmbildend",
    was: "Ein milder Emulgator auf Zuckerbasis, der sich für leichte bis mittlere Cremes eignet.",
    chemisch: "Ester aus Methylglucose und Stearinsäure.",
    wirkung: "Emulgiert und hinterlässt einen feinen, glättenden Film.",
    dos: [["emulsion", 2, 4]],
  },
  {
    slug: "dermofeel-gsc", name: "Dermofeel GSC", inci: "Glyceryl Stearate Citrate", kategorie: "emulgator",
    funktion: "Emulgator O/W für leichte Emulsionen", phase: "fett", form: "fest", phMin: 4, phMax: 7, loeslichkeit: "oel", stufe: "profi",
    emulgatorTyp: "ow", fettphase: [10, 30], emulgatorBezug: "gesamt", hautgefuehl: "leicht", konsistenzgeberNoetig: true,
    hinweis: "Braucht 1–2 % Konsistenzgeber und hohe Scherkräfte. Verträgt Elektrolyte und unterschiedliche pH-Werte.",
    was: "Emulgator für sehr leichte Fluids und Lotionen mit wenig Fettphase.",
    chemisch: "Ester aus Glycerin, Stearinsäure und Zitronensäure (anionisch).",
    wirkung: "Emulgiert auch geringe Fettmengen stabil, wenn kräftig gerührt wird.",
    dos: [["emulsion", 2, 4]],
  },
  {
    slug: "olivem-900", name: "Olivem 900", inci: "Sorbitan Olivate", kategorie: "emulgator",
    funktion: "Emulgator W/O", phase: "fett", form: "fest", loeslichkeit: "oel", stufe: "profi",
    emulgatorTyp: "wo", emulgatorBezug: "gesamt", fettphase: [50, 100], hautgefuehl: "reichhaltig",
    hinweis: "Herstellerangabe: 3–10 % vom ganzen Produkt, Fettphase mindestens 50 %. Wasser portionsweise einarbeiten.",
    was: "Emulgator für Wasser-in-Öl-Cremes, also sehr reichhaltige, schützende Pflege.",
    chemisch: "Ester aus Sorbitan und den Fettsäuren des Olivenöls.",
    wirkung: "Bindet Wasser in einer Fettgrundlage und ergibt einen schützenden Film.",
    dos: [["emulsion", 3, 10]],
  },

  // ---------- Konsistenzgeber ----------
  {
    slug: "cetylalkohol", name: "Cetylalkohol", inci: "Cetyl Alcohol", kategorie: "konsistenzgeber",
    funktion: "Konsistenzgeber", phase: "fett", form: "fest", loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein Fettalkohol in weißen Plättchen. Er hat nichts mit Trinkalkohol zu tun und trocknet die Haut nicht aus.",
    chemisch: "Langkettiger Fettalkohol (C16), pflanzlich gewonnen.",
    wirkung: "Macht Cremes fester und stabiler und gibt ein samtiges Hautgefühl.",
    dos: [["alle", 1, 4]],
  },
  {
    slug: "sheabutter", name: "Sheabutter", inci: "Butyrospermum Parkii Butter", kategorie: "butter",
    funktion: "Pflegende Butter, Konsistenzgeber", phase: "fett", form: "fest", loeslichkeit: "oel", stufe: "anfaenger",
    was: "Das Fett aus den Nüssen des afrikanischen Karitébaums. Bei Raumtemperatur fest, schmilzt auf der Haut.",
    chemisch: "Pflanzenfett mit hohem Anteil an Stearin- und Ölsäure und unverseifbaren Bestandteilen.",
    wirkung: "Pflegt trockene Haut, macht Cremes reichhaltiger und Balsame fester.",
    dos: [["emulsion", 3, 10]],
  },
  {
    slug: "xanthan", name: "Xanthan", inci: "Xanthan Gum", kategorie: "konsistenzgeber",
    funktion: "Gelbildner für die Wasserphase", phase: "wasser", form: "pulver", loeslichkeit: "wasser", stufe: "mittel",
    hinweis: "Mit Glycerin anreiben, dann ins Wasser geben, sonst klumpt es.",
    was: "Ein Verdickungsmittel, das Bakterien aus Zucker herstellen. Winzige Mengen reichen.",
    chemisch: "Natürliches Polysaccharid (Mehrfachzucker).",
    wirkung: "Dickt die Wasserphase an und verhindert, dass sich leichte Emulsionen absetzen.",
    dos: [["alle", 0.2, 0.5]],
  },

  // ---------- Konservierer ----------
  {
    slug: "cosgard", name: "Cosgard", handelsnamen: "Geogard 221, Biogard", inci: "Benzyl Alcohol, Dehydroacetic Acid", kategorie: "konservierer",
    funktion: "Konservierer, Standard für Emulsionen", phase: "kalt", form: "fluessig", dichte: 1.05, phMin: 2, phMax: 7, tempMax: 40, loeslichkeit: "beides", stufe: "anfaenger",
    wirk: ["++", "+", "+"], breitband: true, konsStatus: "konservierungsmittel", konsRolle: "standard", nichtWaessrig: true,
    hinweis: "Ziel-pH 5–5,5. Alternativ 0,5 % Cosgard plus 0,2 % Kaliumsorbat. In rein wässrigen Produkten schlecht löslich.",
    was: "Der Standard-Konservierer in Dein Lab. Er ist für Naturkosmetik zugelassen und wirkt in einem weiten pH-Bereich.",
    chemisch: "Mischung aus Benzylalkohol und Dehydracetsäure.",
    wirkung: "Schützt Cremes und Lotionen vor Bakterien, Hefen und Schimmel.",
    dos: [["emulsion", 1, 1.15]],
  },
  {
    slug: "rokonsal-bsb-n", name: "Rokonsal BSB-N", inci: "Benzyl Alcohol, Glycerin, Benzoic Acid, Sorbic Acid", kategorie: "konservierer",
    funktion: "Konservierer für Emulsionen", phase: "kalt", form: "fluessig", dichte: 1.1, phMax: 5.4, tempMax: 40, stufe: "mittel",
    wirk: ["++", "+", "+"], breitband: true, konsStatus: "konservierungsmittel", konsRolle: "standard", nichtWaessrig: true,
    hinweis: "Wirkt nur unter pH 5,4.",
    was: "Eine Alternative zu Cosgard mit organischen Säuren. Verlangt einen sauer eingestellten pH-Wert.",
    chemisch: "Benzylalkohol mit Benzoesäure und Sorbinsäure in Glycerin.",
    wirkung: "Breitband-Schutz gegen Bakterien, Hefen und Schimmel in Emulsionen.",
    dos: [["emulsion", 1, 1]],
  },
  {
    slug: "euxyl-k903", name: "Euxyl K903", inci: "Benzyl Alcohol, Benzoic Acid, Dehydroacetic Acid, Tocopherol", kategorie: "konservierer",
    funktion: "Konservierer für Emulsionen", phase: "kalt", form: "fluessig", dichte: 1.1, phMin: 5, phMax: 5.5, tempMax: 40, stufe: "mittel",
    wirk: ["++", "++", "++"], breitband: true, konsStatus: "konservierungsmittel", konsRolle: "standard", nichtWaessrig: true,
    hinweis: "Nur für Emulsionen. Enger pH-Bereich: 5,0–5,5.",
    was: "Ein sehr wirksamer Konservierer, der einen genau eingestellten pH-Wert braucht.",
    chemisch: "Benzylalkohol mit Benzoesäure und Dehydracetsäure, stabilisiert mit Tocopherol.",
    wirkung: "Sehr guter Schutz gegen Bakterien, Hefen und Schimmel.",
    dos: [["emulsion", 0.4, 1.2]],
  },
  {
    slug: "geogard-ect", name: "Geogard ECT", handelsnamen: "Preservative Eco", inci: "Benzyl Alcohol, Salicylic Acid, Glycerin, Sorbic Acid", kategorie: "konservierer",
    funktion: "Konservierer, auch bei höherem pH", phase: "kalt", form: "fluessig", dichte: 1.1, phMin: 3, phMax: 8, tempMax: 40, stufe: "mittel",
    wirk: ["++", "+", "+"], breitband: true, konsStatus: "konservierungsmittel", konsRolle: "standard",
    hinweis: "Wirkspektrum laut Hersteller prüfen.",
    was: "Ein Konservierer, der auch dann noch arbeitet, wenn der pH-Wert etwas höher liegt.",
    chemisch: "Benzylalkohol mit Salicylsäure und Sorbinsäure in Glycerin.",
    wirkung: "Breitband-Schutz in einem weiten pH-Bereich.",
    dos: [["alle", 0.6, 1]],
  },
  {
    slug: "verstatil-bl", name: "Verstatil BL", inci: "Aqua, Sodium Levulinate, Sodium Benzoate", kategorie: "konservierer",
    funktion: "Konservierer, Standard für wässrige Produkte", phase: "kalt", form: "fluessig", dichte: 1.1, phMin: 4.5, phMax: 5.5, tempMax: 40, loeslichkeit: "wasser", stufe: "mittel",
    wirk: ["++", "+", "o"], breitband: false, konsStatus: "konservierungsmittel", konsRolle: "standard",
    hinweis: "Nicht mit Vitamin C (Ascorbinsäure) kombinieren.",
    was: "Der Standard für Gesichtswasser und Sprays ohne Öl, weil er sich vollständig in Wasser löst.",
    chemisch: "Wässrige Lösung aus Natriumlävulinat und Natriumbenzoat.",
    wirkung: "Schützt wässrige Produkte vor Bakterien und Hefen, gegen Schimmel schwächer.",
    dos: [["alle", 1.5, 2.5]],
  },
  {
    slug: "alkohol", name: "Alkohol (Ethanol, unvergällt)", inci: "Alcohol", kategorie: "konservierer",
    funktion: "Rohstoff mit konservierender Wirkung", phase: "kalt", form: "fluessig", dichte: 0.81, tempMax: 40, loeslichkeit: "beides", stufe: "mittel",
    wirk: ["++", "+", "+"], breitband: true, konsStatus: "rohstoff", konsRolle: "standard",
    hinweis: "Emulsion: 12–15 % der Wasserphase. Gesichtswasser: 15–18 %. Kann trockene Haut reizen.",
    was: "Trinkalkohol in kosmetischer Qualität. In ausreichender Menge konserviert er ohne weiteren Zusatz.",
    chemisch: "Ethanol, etwa 96 Vol.-%.",
    wirkung: "Hemmt Keime, wirkt erfrischend und entfettend.",
  },
  {
    slug: "kaliumsorbat", name: "Kaliumsorbat (Granulat)", inci: "Potassium Sorbate", kategorie: "konservierer",
    funktion: "Ko-Konservierer gegen Hefen und Schimmel", phase: "kalt", form: "pulver", phMin: 4, phMax: 5.4, tempMax: 40, loeslichkeit: "wasser", stufe: "profi",
    wirk: ["o", "++", "++"], breitband: false, konsStatus: "konservierungsmittel", konsRolle: "ko",
    hinweis: "Nie allein: gegen Bakterien wirkt es kaum. Nicht mit Vitamin C kombinieren. Als Lösung 1:5 entspricht 1 % der Lösung 0,2 % Granulat.",
    was: "Das Kaliumsalz der Sorbinsäure, bekannt aus Lebensmitteln. Ergänzt andere Konservierer.",
    chemisch: "Kaliumsalz der Sorbinsäure.",
    wirkung: "Schließt die Lücke gegen Hefen und Schimmel, braucht einen sauren pH-Wert.",
    dos: [["alle", 0.2, 0.2]],
  },
  {
    slug: "dermosoft-1388-eco", name: "Dermosoft 1388 eco", inci: "Glycerin, Aqua, Sodium Levulinate, Sodium Anisate", kategorie: "konservierer",
    funktion: "Multifunktionelles Additiv, nur mit GMCY", phase: "kalt", form: "fluessig", dichte: 1.2, phMin: 4.5, phMax: 5.5, tempMax: 40, loeslichkeit: "wasser", stufe: "profi",
    wirk: ["++", "+", "++"], breitband: false, konsStatus: "additiv", konsRolle: "kombi", kombiPartner: "dermosoft-gmcy",
    hinweis: "Nur als Kombination mit Dermosoft GMCY (3,5 % + 0,5 %). Rechtlich kein Konservierungsmittel.",
    was: "Ein Additiv aus pflanzlichen Säuresalzen, das zusammen mit GMCY Keime hemmt.",
    chemisch: "Natriumlävulinat und Natriumanisat in Glycerin und Wasser.",
    wirkung: "Hemmt in Kombination Bakterien, Hefen und Schimmel.",
    dos: [["alle", 3.5, 3.5]],
  },
  {
    slug: "dermosoft-gmcy", name: "Dermosoft GMCY", inci: "Glyceryl Caprylate", kategorie: "konservierer",
    funktion: "Multifunktionelles Additiv, nur mit 1388 eco", phase: "kalt", form: "fluessig", dichte: 1, phMin: 4.5, phMax: 5.5, tempMax: 40, loeslichkeit: "oel", stufe: "profi",
    breitband: false, konsStatus: "additiv", konsRolle: "kombi", kombiPartner: "dermosoft-1388-eco",
    hinweis: "Nur als Kombination mit Dermosoft 1388 eco (0,5 % + 3,5 %).",
    was: "Ein rückfettender Co-Emulgator, der zusätzlich Keime hemmt.",
    chemisch: "Ester aus Glycerin und Caprylsäure.",
    wirkung: "Verstärkt die Wirkung von Dermosoft 1388 eco.",
    dos: [["alle", 0.5, 0.5]],
  },

  // ---------- Feuchtigkeit und Wirkstoffe ----------
  {
    slug: "glycerin", name: "Glycerin", inci: "Glycerin", kategorie: "feuchtigkeit",
    funktion: "Feuchthaltemittel", phase: "wasser", form: "fluessig", dichte: 1.26, loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Ab 5 % wird das Hautgefühl klebrig.",
    was: "Ein klarer, süßlicher Sirup pflanzlichen Ursprungs und einer der am besten untersuchten Feuchtigkeitsspender.",
    chemisch: "Dreiwertiger Alkohol (Propan-1,2,3-triol).",
    wirkung: "Bindet Wasser in der obersten Hautschicht.",
    dos: [["alle", 2, 5]],
  },
  {
    slug: "panthenol", name: "Panthenol (D-Panthenol 75 %)", inci: "Panthenol, Aqua", kategorie: "wirkstoff",
    funktion: "Beruhigender Wirkstoff", phase: "kalt", form: "fluessig", dichte: 1.2, tempMax: 40, loeslichkeit: "wasser", stufe: "anfaenger",
    was: "Die Vorstufe von Vitamin B5 als zähe, klare Flüssigkeit.",
    chemisch: "Alkohol der Pantothensäure, hier als 75-prozentige Lösung.",
    wirkung: "Spendet Feuchtigkeit und beruhigt beanspruchte Haut.",
    dos: [["alle", 0.5, 2]],
  },
  {
    slug: "allantoin", name: "Allantoin", inci: "Allantoin", kategorie: "wirkstoff",
    funktion: "Glättender Wirkstoff", phase: "wasser", form: "pulver", loeslichkeit: "wasser", stufe: "mittel",
    hinweis: "Löst sich kalt schlecht: in der warmen Wasserphase lösen.",
    was: "Ein weißes Pulver, das in der Natur unter anderem im Beinwell vorkommt.",
    chemisch: "Abkömmling der Harnsäure (5-Ureidohydantoin).",
    wirkung: "Macht die Haut weich und glatt.",
    dos: [["alle", 0.2, 0.5]],
  },
  {
    slug: "hyaluron", name: "Hyaluronsäure (hochmolekular)", inci: "Sodium Hyaluronate", kategorie: "wirkstoff",
    funktion: "Feuchtigkeitsbinder", phase: "wasser", form: "pulver", phMin: 5, phMax: 7, loeslichkeit: "wasser", stufe: "mittel",
    hinweis: "Vorquellen lassen: aufs Wasser streuen und warten, bis ein Gel entsteht.",
    was: "Ein Pulver, das ein Vielfaches seines Gewichts an Wasser bindet und ein klares Gel bildet.",
    chemisch: "Natriumsalz der Hyaluronsäure, ein langkettiges Polysaccharid.",
    wirkung: "Bildet einen feuchtigkeitsbindenden Film auf der Haut.",
    dos: [["alle", 0.1, 0.5]],
  },
  {
    slug: "niacinamid", name: "Niacinamid", inci: "Niacinamide", kategorie: "wirkstoff",
    funktion: "Wirkstoff für ein ebenmäßiges Hautbild", phase: "wasser", form: "pulver", phMin: 5, phMax: 6, loeslichkeit: "wasser", stufe: "mittel",
    was: "Vitamin B3 als gut wasserlösliches Pulver.",
    chemisch: "Amid der Nicotinsäure.",
    wirkung: "Unterstützt die Hautbarriere und verfeinert das Hautbild.",
    dos: [["alle", 2, 4]],
  },
  {
    slug: "papain", name: "Papain", inci: "Papain", kategorie: "wirkstoff",
    funktion: "Enzymatisches Peeling", phase: "pulver", form: "pulver", phMin: 5, phMax: 7, tempMax: 40, loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Nur trocken lagern, nicht erhitzen, nicht einatmen, kein Metallspatel. Über 1 % nur für Profis.",
    was: "Ein Enzym aus der Papaya. Es wird erst aktiv, wenn Wasser dazukommt.",
    chemisch: "Protease, also ein eiweißspaltendes Enzym.",
    wirkung: "Löst die Verbindungen abgestorbener Hautschüppchen, ganz ohne Reiben.",
    dos: [["alle", 0.5, 1]],
  },

  // ---------- Öle und Antioxidantien ----------
  {
    slug: "jojobaoel", name: "Jojobaöl", inci: "Simmondsia Chinensis Seed Oil", kategorie: "oel",
    funktion: "Basisöl", phase: "fett", form: "fluessig", dichte: 0.865, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Genau genommen ein flüssiges Wachs aus den Samen des Jojobastrauchs. Sehr lange haltbar.",
    chemisch: "Wachsester aus langkettigen Fettsäuren und Fettalkoholen.",
    wirkung: "Zieht gut ein, fettet nicht nach und eignet sich für jeden Hauttyp.",
  },
  {
    slug: "mandeloel", name: "Mandelöl", inci: "Prunus Amygdalus Dulcis Oil", kategorie: "oel",
    funktion: "Basisöl", phase: "fett", form: "fluessig", dichte: 0.915, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein mildes, klassisches Pflegeöl aus süßen Mandeln.",
    chemisch: "Triglyceride mit viel Ölsäure und Linolsäure.",
    wirkung: "Pflegt trockene und empfindliche Haut, zieht mittelschnell ein.",
  },
  {
    slug: "squalan", name: "Squalan", inci: "Squalane", kategorie: "oel",
    funktion: "Leichtes Öl", phase: "fett", form: "fluessig", dichte: 0.81, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein sehr leichtes, geruchloses Öl, meist aus Oliven oder Zuckerrohr gewonnen.",
    chemisch: "Gesättigter Kohlenwasserstoff, die stabile Form des hauteigenen Squalens.",
    wirkung: "Zieht schnell ein, glättet und wird nicht ranzig.",
    dos: [["emulsion", 2, 10]],
  },
  {
    slug: "cacayoel", name: "Cacayöl", handelsnamen: "Kahai-Öl", inci: "Caryodendron Orinocense Seed Oil", kategorie: "oel",
    funktion: "Wirkstofföl", phase: "fett", form: "fluessig", dichte: 0.92, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein Öl aus den Nüssen des südamerikanischen Cacay-Baums.",
    chemisch: "Triglyceride mit sehr hohem Linolsäure-Anteil.",
    wirkung: "Leichtes Öl für reife und anspruchsvolle Haut.",
  },
  {
    slug: "paranussoel", name: "Paranussöl", inci: "Bertholletia Excelsa Seed Oil", kategorie: "oel",
    funktion: "Wirkstofföl", phase: "fett", form: "fluessig", dichte: 0.92, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein nährendes Öl aus den Samen des Paranussbaums im Amazonasgebiet.",
    chemisch: "Triglyceride mit Ölsäure, Linolsäure und Palmitinsäure.",
    wirkung: "Reichhaltige Pflege für trockene Haut.",
  },
  {
    slug: "tocopherol", name: "Tocopherol", handelsnamen: "Vitamin E, gemischte Tocopherole", inci: "Tocopherol", kategorie: "antioxidans",
    funktion: "Antioxidans für Öle", phase: "fett", form: "fluessig", dichte: 0.95, loeslichkeit: "oel", stufe: "anfaenger",
    hinweis: "Schützt Öle vor dem Ranzigwerden. Kein Konservierer.",
    was: "Natürliches Vitamin E als zähes, bernsteinfarbenes Öl.",
    chemisch: "Gemisch aus alpha-, beta-, gamma- und delta-Tocopherol.",
    wirkung: "Fängt Sauerstoff ab und verlängert so die Haltbarkeit der Öle.",
    dos: [["alle", 0.2, 0.5]],
  },
  {
    slug: "rosmarinextrakt", name: "Rosmarinextrakt (CO₂)", inci: "Rosmarinus Officinalis Leaf Extract", kategorie: "antioxidans",
    funktion: "Antioxidans für Öle", phase: "fett", form: "fluessig", dichte: 0.95, loeslichkeit: "oel", stufe: "anfaenger",
    was: "Ein konzentrierter Auszug aus Rosmarinblättern, mit Kohlensäure gewonnen.",
    chemisch: "Enthält Carnosolsäure und Carnosol.",
    wirkung: "Schützt Öle vor Oxidation, allein oder zusammen mit Tocopherol.",
    dos: [["alle", 0.05, 0.1]],
  },
  {
    slug: "aetherisches-oel", name: "Ätherisches Öl", inci: "Parfum", kategorie: "aetherisches_oel",
    funktion: "Duft", phase: "kalt", form: "fluessig", dichte: 0.9, tempMax: 40, loeslichkeit: "oel", stufe: "mittel",
    hinweis: "Gesicht höchstens 0,5 %, Körper höchstens 1 %. Nicht für Kinder, nicht in der Schwangerschaft. Zitrusöle nicht vor Sonne. Auf dem Etikett das verwendete Öl mit seiner INCI nennen.",
    was: "Hochkonzentrierter Pflanzenduft. Platzhalter für das Öl deiner Wahl.",
    chemisch: "Gemisch flüchtiger Pflanzenstoffe, oft mit deklarationspflichtigen Allergenen.",
    wirkung: "Gibt Duft. In kleiner Menge einsetzen.",
  },

  // ---------- Pulver und Peeling ----------
  {
    slug: "kaolin", name: "Weiße Tonerde (Kaolin)", inci: "Kaolin", kategorie: "pulver",
    funktion: "Milde Basis für Masken und Peelings", phase: "pulver", form: "pulver", loeslichkeit: "unloeslich", stufe: "anfaenger",
    was: "Die mildeste aller Tonerden, ein feines weißes Pulver.",
    chemisch: "Aluminiumsilikat (Schichtsilikat).",
    wirkung: "Reinigt sanft und bindet wenig Fett, auch für empfindliche Haut.",
  },
  {
    slug: "gruene-tonerde", name: "Grüne Tonerde", inci: "Illite", kategorie: "pulver",
    funktion: "Klärende Tonerde", phase: "pulver", form: "pulver", loeslichkeit: "unloeslich", stufe: "anfaenger",
    hinweis: "INCI je nach Lieferant Illite oder Montmorillonite: Angabe auf der Packung prüfen.",
    was: "Eine eisenhaltige Tonerde mit grünlicher Farbe.",
    chemisch: "Eisenhaltiges Schichtsilikat.",
    wirkung: "Nimmt Talg stärker auf als Kaolin und klärt das Hautbild.",
  },
  {
    slug: "maisstaerke", name: "Maisstärke", inci: "Zea Mays Starch", kategorie: "pulver",
    funktion: "Macht Pulver geschmeidig", phase: "pulver", form: "pulver", loeslichkeit: "unloeslich", stufe: "anfaenger",
    was: "Feines Stärkepulver aus Mais.",
    chemisch: "Pflanzliches Polysaccharid.",
    wirkung: "Macht den angerührten Brei geschmeidig und nimmt Feuchtigkeit auf.",
  },
  {
    slug: "peelingsalz", name: "Peelingsalz, fein, abgerundet", inci: "Sodium Chloride", kategorie: "peeling",
    funktion: "Mechanisches Peeling", phase: "pulver", form: "pulver", loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Fürs Gesicht nur feines, abgerundetes Peelingsalz. Kein grobes oder scharfkantiges Salz, kein Zucker.",
    was: "Sehr feines Salz mit rund geschliffenen Körnern.",
    chemisch: "Natriumchlorid.",
    wirkung: "Poliert die Haut. Im feuchten Brei löst es sich teilweise an, dadurch bleibt das Peeling mild.",
    dos: [["wasserfrei", 0, 20]],
  },
  {
    slug: "jojobaperlen", name: "Jojobawachs-Perlen", inci: "Hydrogenated Jojoba Oil", kategorie: "peeling",
    funktion: "Mechanisches Peeling, sehr sanft", phase: "pulver", form: "pulver", loeslichkeit: "unloeslich", stufe: "anfaenger",
    was: "Kleine runde Kügelchen aus gehärtetem Jojobaöl.",
    chemisch: "Hydrierte Wachsester.",
    wirkung: "Rollen über die Haut und peelen ohne Kratzen.",
  },

  // ---------- pH ----------
  {
    slug: "milchsaeure", name: "Milchsäure 10 %", inci: "Aqua, Lactic Acid", kategorie: "ph_regler",
    funktion: "pH senken", phase: "kalt", form: "fluessig", dichte: 1.02, loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Tropfenweise zugeben, nach jedem Tropfen rühren und messen.",
    was: "Verdünnte Milchsäure zum Einstellen des pH-Werts.",
    chemisch: "2-Hydroxypropansäure in Wasser.",
    wirkung: "Senkt den pH-Wert in den hautfreundlichen Bereich von 5,0 bis 5,5.",
  },
  {
    slug: "natronloesung", name: "Natron-Lösung", inci: "Aqua, Sodium Bicarbonate", kategorie: "ph_regler",
    funktion: "pH heben", phase: "kalt", form: "fluessig", dichte: 1.05, loeslichkeit: "wasser", stufe: "anfaenger",
    hinweis: "Tropfenweise zugeben, nach jedem Tropfen rühren und messen.",
    was: "In Wasser gelöstes Natriumhydrogencarbonat.",
    chemisch: "Natriumhydrogencarbonat in Wasser.",
    wirkung: "Hebt einen zu sauren pH-Wert an.",
  },
];

/** Startbestand: Grundliste (Regelwerk) + neue Felder aus der Recherche + Erweiterung (Öle, Emulgatoren, Tenside). */
export const seedRohstoffe: SeedRohstoff[] = [
  ...basisRohstoffe.map((r) => {
    const z = seedZusatz[r.slug];
    return z ? { ...z.z, ...r, quellen: [...(r.quellen ?? []), ...z.quellen] } : r;
  }),
  ...seedErweiterung,
];

export const seedGeraete = [
  { slug: "feinwaage", name: "Feinwaage (0,01 g)", beschreibung: "Für Pulver, Buttern und alles unter 1 g. Eine Küchenwaage ist dafür zu ungenau." },
  { slug: "ruehrer", name: "Milchaufschäumer oder Handrührer", beschreibung: "Macht Emulsionen feiner und stabiler als der Glasstab." },
  { slug: "ph-meter", name: "pH-Meter", beschreibung: "Misst genauer als Teststreifen, wenn ein Konservierer einen engen pH-Bereich braucht." },
];

/** Erste Rezeptur der Bibliothek (freigegeben am 4.11.2026). */
export const seedRezepturen = [
  {
    nummer: "R-001",
    name: "Enzym-Pulverpeeling",
    untertitel: "Sanfte Klärung",
    produkttyp: "wasserfrei" as const,
    produktart: "Peeling",
    bereich: "gesicht" as const,
    hautbeduerfnis: "alle",
    ausruestung: "start" as const,
    zeitMinuten: 10,
    chargeG: 30,
    haltbarkeitTage: 183,
    geraete: "feinwaage",
    herstellung: [
      "Geräte mit Isopropanol 70 % auswischen und vollständig trocknen lassen.",
      "Weiße Tonerde, Maisstärke und grüne Tonerde im Becherglas (100 ml) mit dem Glasstab mischen, bis die Farbe gleichmäßig ist.",
      "Peelingsalz unterheben, zuletzt das Papain einrühren. Den Staub nicht einatmen.",
      "In den trockenen Tiegel füllen, verschließen und beschriften.",
    ].join("\n"),
    anwendung:
      "1 gestrichenen Teelöffel Pulver mit etwa gleich viel lauwarmem Wasser zu einem Brei anrühren. Auf das feuchte Gesicht auftragen, 1 Minute sanft kreisen, 3–5 Minuten einwirken lassen, lauwarm abspülen. 1–2-mal pro Woche. Nicht bei gereizter Haut, nicht in die Augen. Reste des Breis nicht aufbewahren.",
    blogText:
      "Weiße und grüne Tonerde, Maisstärke, ein Enzym aus der Papaya und feines rundes Salz. Warum die Mischung funktioniert: Tonerden klären, Stärke macht es sanft, Papain löst, was die Haut nicht mehr braucht, Salz poliert.",
    notiz:
      "Papain 1 %: Preis und Wirkung; der Brei liegt bei pH 6–7, Papain ist aktiv bei pH 5–7. Fallback ohne Feinwaage: 1 gestrichener kleiner Spatel ≈ 0,3 g Papain (ungenau). Keine ätherischen Öle im Pulver.",
    positionen: [
      ["kaolin", 50],
      ["maisstaerke", 20],
      ["gruene-tonerde", 15],
      ["peelingsalz", 14],
      ["papain", 1],
    ] as [string, number][],
    variante: null as string | null,
  },
  {
    nummer: "R-001-S",
    name: "Enzym-Pulverpeeling sensibel",
    untertitel: "Sanfte Klärung ohne Salz",
    produkttyp: "wasserfrei" as const,
    produktart: "Peeling",
    bereich: "gesicht" as const,
    hautbeduerfnis: "sensibel",
    ausruestung: "start" as const,
    zeitMinuten: 10,
    chargeG: 30,
    haltbarkeitTage: 183,
    geraete: "feinwaage",
    herstellung: [
      "Geräte mit Isopropanol 70 % auswischen und vollständig trocknen lassen.",
      "Weiße Tonerde, Maisstärke und grüne Tonerde im Becherglas (100 ml) mit dem Glasstab mischen, bis die Farbe gleichmäßig ist.",
      "Zuletzt das Papain einrühren. Den Staub nicht einatmen.",
      "In den trockenen Tiegel füllen, verschließen und beschriften.",
    ].join("\n"),
    anwendung:
      "1 gestrichenen Teelöffel Pulver mit etwa gleich viel lauwarmem Wasser zu einem Brei anrühren. Auf das feuchte Gesicht auftragen und 3–5 Minuten einwirken lassen, ohne zu reiben. Lauwarm abspülen. 1-mal pro Woche. Nicht bei gereizter Haut, nicht in die Augen. Reste des Breis nicht aufbewahren.",
    blogText:
      "Die Variante für empfindliche Haut kommt ganz ohne Salz aus: Hier arbeitet nur das Enzym aus der Papaya, die Tonerden klären und die Stärke macht den Brei weich.",
    notiz: "Variante von R-001: Salz weggelassen, Kaolin auf 64 %.",
    positionen: [
      ["kaolin", 64],
      ["maisstaerke", 20],
      ["gruene-tonerde", 15],
      ["papain", 1],
    ] as [string, number][],
    variante: "R-001",
  },
];
