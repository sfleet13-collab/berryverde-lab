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
    priceNote: "9 € im Monat oder 59 € im Jahr. Start am 15. November.",
    demo: {
      title: "Probier es aus",
      recipe: "Beispiel: leichte Tagescreme",
      amount: "Menge",
      without: "Konservierer weglassen",
      note: "Vereinfachtes Beispiel. Die geprüften Rezepturen mit allen Angaben findest du in Dein Lab.",
    },
    featuresTitle: "Was Dein Lab für dich prüft und rechnet",
    features: [
      {
        title: "Fehler finden, bevor du rührst",
        text: "Zu wenig Emulgator, Konservierer in der heißen Phase, ein pH-Wert, bei dem nichts mehr schützt: Dein Lab erkennt es und zeigt dir den nächsten gültigen Wert. Ein Klick übernimmt ihn.",
      },
      {
        title: "Tropfen statt Rätselraten",
        text: "Kleine Mengen flüssiger Rohstoffe gibt Dein Lab in Tropfen an, passend zur Pipette der Laborbox. Ab 20 Tropfen wird in Milliliter gemessen. Für Pulver unter einem Gramm sagt dir die Rezeptur, dass du die Feinwaage brauchst.",
      },
      {
        title: "Rezeptkarte, INCI und Etikett",
        text: "Zu jeder Rezeptur bekommst du eine Karte zum Ausdrucken mit Formel, Herstellung und Anwendung. Das Etikett trägt Name, Datum, Haltbarkeit, Chargennummer und die Inhaltsstoffe in der richtigen Reihenfolge.",
      },
    ],
    label: { made: "Hergestellt", best: "Haltbar bis", batch: "Charge", own: "Nur für den Eigengebrauch", name: "Leichte Tagescreme" },
    check: {
      kind: "Fehler",
      title: "Xyliance außerhalb des Bereichs",
      text: "Xyliance arbeitet zuverlässig bei 3 % bis 5 %. Aktuell sind es 2 %.",
      fix: "Xyliance auf 3 % setzen",
    },
    drops: [
      { name: "Tocopherol", amount: "3 Tropfen" },
      { name: "Panthenol", amount: "11 Tropfen" },
      { name: "Mandelöl", amount: "6,5 ml" },
      { name: "Xanthan", amount: "0,10 g · Feinwaage" },
    ],
    libraryTitle: "Eine Bibliothek, die mit dir wächst",
    libraryText: [
      "Zweimal im Monat kommen neue, geprüfte Rezepturen dazu: vom Pulverpeeling ohne Strom bis zur Wintercreme. Du filterst nach Produkttyp, Hautbedürfnis, Ausrüstung und Stufe.",
      "Jede Rezeptur kannst du als eigene Variante speichern und verändern. Der Rechner prüft weiter mit. Und jeder Rohstoff hat einen Steckbrief: was dahintersteckt, was er chemisch ist und als was er wirkt.",
    ],
    stepsTitle: "So kommst du ins Lab",
    steps: [
      { title: "Mitglied werden", text: "Du schließt die Mitgliedschaft bei berryverde ab." },
      { title: "Code per E-Mail", text: "Du meldest dich mit deiner E-Mail-Adresse an und bekommst einen Code. Ein Passwort brauchst du nicht." },
      { title: "Rühren", text: "Rezeptur wählen, Menge eingeben, abwiegen oder tropfen. Die Karte liegt ausgedruckt neben dir." },
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
    ctaBandText: "Die Mitgliedschaft kostet 9 € im Monat oder 59 € im Jahr.",
    ownUse: "Dein Lab ist für den Eigengebrauch gedacht. Keine Heilversprechen, nur Pflege.",
  },
  app: {
    title: "Rezepturen",
    setupTitle: "Login noch nicht eingerichtet",
    setupText: "Sobald der Login eingerichtet ist, ist dieser Bereich geschützt.",
    signIn: "Anmelden",
  },
  auth: {
    title: "Anmelden",
    description: "Gib die E-Mail-Adresse ein, mit der du Mitglied geworden bist. Du bekommst einen Code per E-Mail, ein Passwort brauchst du nicht.",
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
      notAllowed: "Für diese E-Mail-Adresse ist kein Zugang freigeschaltet. Nimm die Adresse, mit der du Mitglied geworden bist.",
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
      title: "Rezeptkarte und Etikett drucken oder als PDF",
      description:
        "Rezeptkarte aus Dein Lab mit Formel, Herstellung, Anwendung, INCI und Etikett. Drucken oder als PDF speichern und beim Rühren danebenlegen. Für Mitglieder.",
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
        "Du hast eine Frage zu einer Rezeptur, zu deinem Zugang oder zur Mitgliedschaft? Schreib Susan über das Formular. Sie liest jede Nachricht persönlich.",
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
      title: "Seite nicht gefunden – zur Startseite",
      description:
        "Diese Seite gibt es nicht oder nicht mehr. Vielleicht hat sich die Adresse geändert. Über die Startseite findest du schnell wieder alles, was du suchst.",
    },
  },
  contact: {
    title: "Frag Susan",
    description: "Schreib mir deine Frage zu einer Rezeptur, zu deinem Zugang oder zur Mitgliedschaft.",
    formTitle: "Deine Nachricht",
    direct: "Schreib mir direkt per E-Mail an",
    nextTitle: "So geht es weiter",
    next: ["Ich lese deine Nachricht persönlich.", "Du bekommst innerhalb von zwei Werktagen eine Antwort.", "Deine Angaben nutze ich nur für deine Anfrage."],
    name: "Name",
    email: "E-Mail-Adresse",
    message: "Nachricht",
    consent: "Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden.",
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
