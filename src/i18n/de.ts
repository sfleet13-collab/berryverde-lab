/**
 * Deutsche Texte. Immer mit ß schreiben – bei Schweizer Schreibweise
 * (site.spelling = "de-CH") wird automatisch zu ss umgewandelt.
 */
const de = {
  meta: {
    title: "Rezeptur-Rechner für Naturkosmetik | Dein Lab von berryverde",
    description:
      "Dein Lab rechnet deine Naturkosmetik-Rezeptur in Gramm und Tropfen um, prüft Emulgator, Konservierung und pH und liefert Rezeptkarte, INCI und Etikett dazu.",
  },
  nav: {
    skip: "Zum Inhalt springen",
    home: "Start",
    app: "Dein Lab öffnen",
    signIn: "Anmelden",
    contact: "Kontakt",
    language: "Sprache wählen",
    themeToLight: "Helles Design aktivieren",
    themeToDark: "Dunkles Design aktivieren",
    menu: "Menü",
  },
  home: {
    title: "Der Rezeptur-Rechner für selbst gerührte Naturkosmetik",
    lead: "Dein Lab rechnet deine Creme in Gramm und Tropfen um, prüft Emulgator, Konservierung und pH-Wert und schlägt die Korrektur gleich vor. Entwickelt von einer Chemielaborantin.",
    ctaPrimary: "Mitglied werden",
    ctaSecondary: "Anmelden",
    priceNote:
      "59 € im Jahr oder 9 € im Monat. Das Monatsabo kündigst du jederzeit zum Monatsende.",
    demo: {
      title: "Probier es aus",
      recipe: "Beispiel: leichte Tagescreme",
      amount: "Menge",
      without: "Konservierer weglassen",
      note: "Vereinfachtes Beispiel. Die geprüften Rezepturen mit allen Angaben findest du in Dein Lab.",
    },
    spreit: {
      title:
        "Oder spiel mit der Spreitkaskade – dem Grundprinzip jeder Rezeptur mit Öl",
      lead: "Jedes Öl verteilt sich anders auf der Haut. Klick ein Öl an und beobachte, wie weit es sich auf der Glasschale ausbreitet. Daraus ergibt sich, wie schnell es einzieht und wie es sich anfühlt.",
      hint: "Klick ein Öl an ↓",
      group: "Öl wählen",
      speed: {
        schnell: "spreitet schnell",
        mittel: "spreitet mittel",
        langsam: "spreitet langsam",
      },
      levelsTitle: "Die drei Spreit-Ebenen",
      levels: [
        {
          key: "schnell",
          title: "Schnell – die Einzieher",
          text: "Squalan, Neutralöl, Kokosöl. Verteilen sich sofort und hinterlassen ein leichtes Hautgefühl.",
        },
        {
          key: "mittel",
          title: "Mittel – die Pflegenden",
          text: "Jojoba, Mandel, Aprikose, Traubenkern, Avocado. Ziehen moderat ein und bringen Wirkstoffe in die oberen Hautschichten.",
        },
        {
          key: "langsam",
          title: "Langsam – die Schützenden",
          text: "Sheabutter, Kakaobutter. Bleiben lange auf der Haut, pflegen und schützen.",
        },
      ],
      cta: "Alle Rohstoffe und Rezepturen freischalten → Mitglied werden",
      ctaNote:
        "In Dein Lab rechnest du aus diesen Ölen deine eigene Rezeptur, mit Mengen, Tropfen und INCI-Liste.",
    },
    featuresTitle: "Was Dein Lab für dich prüft und rechnet",
    features: [
      {
        title: "Fehler finden, bevor du rührst",
        text: "Zu wenig Emulgator, Konservierer in der heißen Phase, ein pH-Wert, bei dem nichts mehr schützt: Dein Lab erkennt es und zeigt dir den nächsten gültigen Wert. Ein Klick übernimmt ihn.",
      },
      {
        title: "Tropfen statt Rätselraten",
        text: "Kleine Mengen flüssiger Rohstoffe gibt Dein Lab in Tropfen an, passend zur Pipette der Laborbox. Über 20 Tropfen wird in Milliliter abgemessen. Für Pulver unter einem Gramm sagt dir die Rezeptur, dass du die Feinwaage brauchst.",
      },
      {
        title: "Rezeptkarte, INCI und Etikett",
        text: "Zu jeder Rezeptur bekommst du eine Karte zum Ausdrucken mit Formel, Herstellung und Anwendung. Das Etikett trägt Name, Datum, Haltbarkeit, Chargennummer und die Inhaltsstoffe in der richtigen Reihenfolge.",
      },
    ],
    label: {
      made: "Hergestellt",
      best: "Haltbar bis",
      batch: "Charge",
      own: "Nur für den Eigengebrauch",
      name: "Leichte Tagescreme",
    },
    check: {
      kind: "Fehler",
      title: "Xyliance außerhalb des Bereichs",
      text: "Xyliance arbeitet zuverlässig bei 3 % bis 5 %. Aktuell sind es 2 %.",
      fix: "Vorschlag: Xyliance auf 3 % setzen",
    },
    drops: [
      { name: "Tocopherol", amount: "3 Tropfen" },
      { name: "Panthenol", amount: "11 Tropfen" },
      { name: "Mandelöl", amount: "6,6 ml" },
      { name: "Xanthan", amount: "0,10 g · Feinwaage" },
    ],
    videos: {
      title: "Susan zeigt dir, wie es geht",
      lead: "Bald im Lab: In Videos zeige ich dir Schritt für Schritt, wie man Rezepturen herstellt. So läuft eine Creme ab:",
      steps: [
        "Fettphase erwärmen",
        "Warme Wasserphase dazugeben",
        "Rühren, bis die Creme bindet",
        "Unter 40 °C den Konservierer zugeben",
        "In den Tiegel abfüllen",
      ],
      kinds: [
        {
          title: "Basis-Videos",
          text: "Hygiene und Werkzeug, Wiegen und Messen, Wasserbad, Emulsion rühren, pH-Wert, Konservierung, Etikett.",
        },
        {
          title: "Rezeptur-Videos",
          text: "Zu ausgewählten Rezepturen rühre ich vor. Du siehst, worauf es bei Temperatur, Rührzeit und Reihenfolge ankommt.",
        },
      ],
      note: "Erste Folgen ab Dezember. Alle Videos laufen direkt in Dein Lab.",
      heat: "70 °C",
      cool: "38 °C",
    },
    libraryTitle: "Eine Bibliothek, die mit dir wächst",
    libraryText: [
      "Die Bibliothek wächst laufend mit neuen, geprüften Rezepturen: vom Pulverpeeling ohne Strom bis zur Wintercreme. Du filterst nach Produkttyp, Hautbedürfnis, Ausrüstung und Stufe.",
      "Jede Rezeptur kannst du als eigene Variante speichern und verändern. Der Rechner prüft weiter mit. Und jeder Rohstoff hat einen Steckbrief: was dahintersteckt, was er chemisch ist und als was er wirkt.",
    ],
    about: {
      title: "Hinter Dein Lab steht Susan",
      text: [
        "Ich bin Chemielaborantin und habe 35 Jahre im Qualitätsmanagement gearbeitet. Dort gilt: erst prüfen, dann freigeben.",
        "Genau so arbeitet Dein Lab. Jede Rezeptur wird gerechnet und geprüft, bevor du rührst: welche Mengen sicher sind, welche Rohstoffe zusammenpassen und woran eine Creme scheitert.",
      ],
      sign: "Susan Fleet, berryverde",
      alt: "Susan Fleet im Laborkittel, lächelnd mit Mundschutz in der Hand",
    },
    pricing: {
      title: "Werde Mitglied in Dein Lab",
      lead: "Ein Zugang für alles: Rechner, Rezepturen, Rohstoffe und Videos.",
      included: [
        "Alle Rezepturen und über 80 Rohstoffe",
        "Rechner mit Prüfung, Rezeptkarte und Etikett",
        "Eigene Rezepturen anlegen und speichern",
        "Videos: Basiswissen und ausgewählte Rezepturen (ab Dezember)",
        "Immer wieder neue Rezepturen",
      ],
      yearly: {
        name: "Jährlich",
        badge: "Du sparst 49 €",
        price: "59 €",
        per: "im Jahr",
        sub: "Weniger als 5 € im Monat",
        terms: "Verlängert sich jährlich, bis du kündigst",
        cta: "Jährlich Mitglied werden",
      },
      monthly: {
        name: "Monatlich",
        price: "9 €",
        per: "im Monat",
        sub: "Zum Ausprobieren",
        terms: "Jederzeit zum Monatsende kündbar",
        cta: "Monatlich Mitglied werden",
      },
      asideTitle: "Gut zu wissen",
      aside: [
        "Bezahlt wird sicher über Tentary, per Karte oder PayPal.",
        "Danach meldest du dich hier mit derselben E-Mail-Adresse an. Dein Zugang ist automatisch freigeschaltet.",
        "Unsicher? Starte monatlich. Du kündigst jederzeit zum Monatsende.",
      ],
    },
    stepsTitle: "So kommst du ins Lab",
    steps: [
      {
        title: "Mitglied werden",
        text: "Du wählst jährlich oder monatlich und bezahlst per Karte oder PayPal.",
      },
      {
        title: "Code per E-Mail",
        text: "Du meldest dich mit der E-Mail-Adresse an, mit der du gekauft hast, und bekommst einen Code. Ein Passwort brauchst du nicht.",
      },
      {
        title: "Rühren",
        text: "Rezeptur wählen, Menge eingeben, abwiegen oder tropfen. Die Karte liegt ausgedruckt neben dir.",
      },
    ],
    faqTitle: "Häufige Fragen",
    faq: [
      {
        q: "Brauche ich Vorkenntnisse?",
        a: "Nein. Jede Rezeptur hat eine Stufe: Anfänger, Mittel oder Profi. Die ersten Rezepturen kommen ohne Erhitzen aus. Der Rechner erklärt bei jeder Meldung, warum etwas nicht passt.",
      },
      {
        q: "Welche Ausrüstung brauche ich?",
        a: "Die Rezepturen sind auf die Laborbox von berryverde abgestimmt, Start oder Pro. Du kannst auch mit eigenen Bechergläsern, Glasstab und Pipette arbeiten. Braucht eine Rezeptur eine Feinwaage, einen Milchaufschäumer oder ein pH-Meter, steht das dabei.",
      },
      {
        q: "Sind Videos dabei?",
        a: "Ja. Als Mitglied siehst du die Basis-Videos und ausgewählte Rezeptur-Videos. Die ersten Folgen kommen ab Dezember. Alle Videos laufen direkt in Dein Lab, du brauchst keinen extra Zugang.",
      },
      {
        q: "Wie schnell bin ich nach dem Kauf drin?",
        a: "Sofort. Du meldest dich mit der E-Mail-Adresse an, mit der du gekauft hast, und bekommst einen Code. Dein Zugang ist automatisch freigeschaltet.",
      },
      {
        q: "Wie kündige ich?",
        a: "Über den Link in deiner Kaufbestätigung von Tentary. Die monatliche Mitgliedschaft endet zum Ende des laufenden Monats, die jährliche zum Ende deines Mitgliedsjahres. Bis dahin bleibt dein Zugang bestehen.",
      },
      {
        q: "Darf ich die Kosmetik verkaufen oder verschenken?",
        a: "Nein. Dein Lab ist nur für den Eigengebrauch gedacht. Wer Kosmetik abgibt, braucht unter anderem eine Sicherheitsbewertung. Das leistet Dein Lab nicht.",
      },
      {
        q: "Kann ich eigene Rezepturen berechnen?",
        a: "Ja. Du legst eigene Rezepturen an oder änderst eine aus der Bibliothek. Deine Rezepturen siehst nur du.",
      },
      {
        q: "Woher bekomme ich die Rohstoffe?",
        a: "Bei manchen Rohstoffen und Geräten findest du einen Link zum Nachbestellen. Ist es ein Provisions-Link, steht das dabei: Kaufst du darüber, erhält berryverde eine kleine Provision. Für dich ändert sich der Preis nicht.",
      },
    ],
    ctaBandTitle: "Bereit für deine erste Rezeptur?",
    ctaBandText:
      "59 € im Jahr oder 9 € im Monat. Alle Rezepturen, Rohstoffe, der Rechner mit Prüfung und ab Dezember die Videos.",
    ownUse:
      "Dein Lab ist für den Eigengebrauch gedacht. Keine Heilversprechen, nur Pflege.",
  },
  app: {
    title: "Rezepturen",
    setupTitle: "Login noch nicht eingerichtet",
    setupText:
      "Sobald der Login eingerichtet ist, ist dieser Bereich geschützt.",
    signIn: "Anmelden",
  },
  auth: {
    title: "Anmelden",
    description:
      "Gib die E-Mail-Adresse ein, mit der du Mitglied geworden bist. Du bekommst einen Code per E-Mail, ein Passwort brauchst du nicht.",
    email: "E-Mail-Adresse",
    sendCode: "Code senden",
    codeSent: "Wir haben dir einen Code an {email} geschickt.",
    code: "Code aus der E-Mail",
    verify: "Anmelden",
    resend: "Code erneut senden",
    otherEmail: "Andere E-Mail-Adresse",
    signOut: "Abmelden",
    notMember: "Noch kein Mitglied?",
    join: "Mitglied werden",
    errors: {
      email: "Bitte gib eine gültige E-Mail-Adresse ein.",
      code: "Der Code stimmt nicht oder ist abgelaufen.",
      send: "Der Code konnte nicht gesendet werden. Bitte versuch es erneut.",
      notAllowed:
        "Für diese E-Mail-Adresse ist kein Zugang freigeschaltet. Nimm die Adresse, mit der du Mitglied geworden bist.",
      config: "Der Login ist noch nicht eingerichtet.",
    },
  },
  seo: {
    app: {
      title: "Rezepturen: Bibliothek und eigene Rezepturen",
      description:
        "Die Rezeptur-Bibliothek von Dein Lab: geprüfte Naturkosmetik-Rezepturen filtern, öffnen, umrechnen und als eigene Variante speichern. Nur für Mitglieder.",
    },
    rezeptur: {
      title: "Rezeptur mit Rechner, Prüfung und INCI-Liste",
      description:
        "Rezeptur in Dein Lab: Menge eingeben, Formel in Gramm und Tropfen ablesen, Prüfung ansehen und Rezeptkarte mit Etikett ausdrucken. Nur für Mitglieder.",
    },
    editor: {
      title: "Eigene Rezeptur berechnen und prüfen lassen",
      description:
        "Eigene Naturkosmetik-Rezeptur in Dein Lab anlegen: Rohstoffe wählen, Anteile eintragen, live prüfen lassen und Korrekturen mit einem Klick übernehmen.",
    },
    karte: {
      title: "Rezeptkarte drucken oder als PDF speichern",
      description:
        "Rezeptkarte aus Dein Lab mit Formel, Herstellung, Anwendung und INCI. Drucken oder als PDF speichern und beim Rühren danebenlegen. Nur für Mitglieder.",
    },
    etikett: {
      title: "Etiketten drucken: rechteckig oder rund",
      description:
        "Etiketten aus Dein Lab mit Name, Herstelldatum, Haltbarkeit, Charge und INCI. Einzeln zum Ausschneiden oder als A4-Bogen drucken. Nur für Mitglieder.",
    },
    rohstoffe: {
      title: "Rohstoffe mit Steckbrief und Einsatzmenge",
      description:
        "Die Rohstoff-Datenbank von Dein Lab: Emulgatoren, Konservierer, Öle und Wirkstoffe mit INCI, Einsatzmenge, pH-Bereich und Steckbrief. Nur für Mitglieder.",
    },
    rohstoffForm: {
      title: "Rohstoff pflegen: Werte, Steckbrief, Einkauf",
      description:
        "Verwaltung der Rohstoff-Datenbank von Dein Lab: Werte, Einsatzmengen, Steckbrief, Tropfenfaktor und Nachbestell-Link eines Rohstoffs bearbeiten. Nur Admin.",
    },
    admin: {
      title: "Verwaltung: Mitglieder und Empfehlungen",
      description:
        "Verwaltung von Dein Lab: Mitglieder freischalten oder ausschalten, Stufen vergeben und die Empfehlungs-Links für Geräte pflegen. Nur für die Betreiberin.",
    },
    keinZugang: {
      title: "Dein Zugang ist noch nicht freigeschaltet",
      description:
        "Für diese E-Mail-Adresse gibt es keinen aktiven Zugang zu Dein Lab. Hier erfährst du, wie du Mitglied wirst oder wen du bei Fragen erreichst.",
    },
    auth: {
      title: "Anmelden per E-Mail-Code, ohne Passwort",
      description:
        "Melde dich in Dein Lab an: E-Mail-Adresse deiner Mitgliedschaft eingeben, Code aus der E-Mail eintippen, fertig. Ein Passwort brauchst du dafür nicht.",
    },
    contact: {
      title: "Frag Susan: Kontakt und Hilfe zur Mitgliedschaft",
      description:
        "Frage zu einer Rezeptur, zu deinem Zugang oder zur Mitgliedschaft? Schreib mir. Ich lese jede Nachricht persönlich und antworte in zwei Werktagen.",
    },
    imprint: {
      title: "Impressum – Angaben zur Anbieterin berryverde",
      description:
        "Impressum von Dein Lab, dem Rezeptur-Rechner von berryverde: Anbieterin, Anschrift, Kontakt und verantwortliche Person nach § 5 DDG auf einen Blick.",
    },
    privacy: {
      title: "Datenschutz – so geht Dein Lab mit Daten um",
      description:
        "Welche Daten Dein Lab speichert, wofür sie gebraucht werden und welche Rechte du hast: die Datenschutzerklärung, klar und verständlich formuliert.",
    },
    terms: {
      title: "Nutzungsbedingungen für den Rezeptur-Rechner",
      description:
        "Die Nutzungsbedingungen von Dein Lab: Leistungsumfang, Nutzung nur für den Eigengebrauch, Haftung und Hinweise zu Provisions-Links. Jederzeit hier abrufbar.",
    },
    notFound: {
      title: "Seite nicht gefunden – zurück zur Startseite",
      description:
        "Diese Seite gibt es nicht oder nicht mehr. Vielleicht hat sich die Adresse geändert. Über die Startseite findest du schnell wieder alles, was du suchst.",
    },
  },
  contact: {
    title: "Frag Susan",
    description:
      "Schreib mir deine Frage zu einer Rezeptur, zu deinem Zugang oder zur Mitgliedschaft.",
    formTitle: "Deine Nachricht",
    directTitle: "Schreib mir eine E-Mail",
    direct: "Schreib mir direkt per E-Mail an",
    nextTitle: "So geht es weiter",
    next: [
      "Ich lese deine Nachricht persönlich.",
      "Du bekommst innerhalb von zwei Werktagen eine Antwort.",
      "Deine Angaben nutze ich nur für deine Anfrage.",
    ],
    name: "Name",
    email: "E-Mail-Adresse",
    message: "Nachricht",
    consent:
      "Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden.",
    privacyLink: "Datenschutzerklärung",
    submit: "Nachricht senden",
    sending: "Wird gesendet …",
    success: "Danke! Deine Nachricht ist angekommen.",
    errors: {
      name: "Bitte gib deinen Namen ein.",
      email: "Bitte gib eine gültige E-Mail-Adresse ein.",
      message: "Bitte schreib eine Nachricht (mindestens 10 Zeichen).",
      consent: "Bitte bestätige die Einwilligung.",
      generic: "Das hat leider nicht geklappt. Bitte versuch es erneut.",
    },
  },
  legal: {
    imprint: "Impressum",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    placeholderTitle: "Platzhalter",
    placeholderText:
      "Dieser Text muss vor dem Go-live ersetzt werden. Erstelle ihn mit einem Generator (z. B. eRecht24) oder lass ihn von einer Anwältin prüfen.",
  },
  consent: {
    title: "Cookies & Datenschutz",
    text: "Cookies für Statistik gibt es nur, wenn du zustimmst. Notwendige Funktionen laufen ohne.",
    accept: "Alle akzeptieren",
    decline: "Nur notwendige",
    settings: "Cookie-Einstellungen",
  },
  footer: {
    rights: "Alle Rechte vorbehalten.",
  },
  notFound: {
    title: "Seite nicht gefunden",
    text: "Diese Seite gibt es nicht oder nicht mehr.",
    back: "Zur Startseite",
  },
  error: {
    title: "Da ist etwas schiefgelaufen",
    text: "Bitte versuch es gleich noch einmal.",
    retry: "Erneut versuchen",
  },
  loading: "Wird geladen …",
};

export default de;
export type Dictionary = typeof de;
