/**
 * Deutsche Texte. Immer mit ß schreiben – bei Schweizer Schreibweise
 * (site.spelling = "de-CH") wird automatisch zu ss umgewandelt.
 */
const de = {
  meta: {
    title: "Susan App Starter – Die Basis für schnelle, sichere Web-Apps",
    description:
      "Vorlage für moderne Web-Apps: Login, Datenbank, Rollen, SEO und Datenschutz sind von Anfang an eingebaut. Du baust nur noch, was deine App besonders macht.",
  },
  nav: {
    skip: "Zum Inhalt springen",
    home: "Start",
    app: "Mein Bereich",
    contact: "Kontakt",
    language: "Sprache wählen",
    themeToLight: "Helles Design aktivieren",
    themeToDark: "Dunkles Design aktivieren",
    menu: "Menü",
  },
  home: {
    title: "Deine App startet nicht bei null.",
    lead: "Login, Datenbank, Rollen, SEO und Datenschutz sind schon da. Du baust nur noch das, was deine App besonders macht.",
    ctaPrimary: "Zum Bereich",
    ctaSecondary: "Kontakt aufnehmen",
    demo: {
      signIn: "Anmelden",
      email: "lena@beispiel.ch",
      codeLabel: "Code aus deiner E-Mail",
      signedIn: "Angemeldet",
      hello: "Hallo Lena",
      entriesTitle: "Meine Einträge",
      entries: ["Angebot Café Mondschein", "Rechnung Oktober", "Kundentermin vorbereiten"],
      role: "Nutzerin",
    },
    featuresTitle: "Alles Wichtige ist schon eingebaut",
    auth: {
      title: "Login mit Rollen",
      text: "Anmeldung per E-Mail-Code oder Google. Jede Person sieht nur ihre eigenen Daten, Admins sehen alles.",
      people: [
        { name: "Lena Meier", role: "Admin" },
        { name: "Tom Keller", role: "Nutzer" },
        { name: "Aylin Demir", role: "Nutzerin" },
      ],
    },
    seo: {
      title: "Bei Google gefunden",
      text: "Saubere Überschriften, Meta-Daten, Sitemap und Vorschaubilder sind auf jeder Seite gesetzt.",
      serpQuery: "meine app kontakt",
      serpUrl: "meine-app.ch › kontakt",
      serpTitle: "Kontakt | Meine App",
      serpText: "Schreib uns eine Nachricht. Wir melden uns schnellstmöglich.",
    },
    privacy: {
      title: "Datenschutz eingebaut",
      text: "Tracking nur mit Einwilligung, Rechtsseiten vorbereitet.",
      stats: [
        { value: "0", label: "Cookies vor Zustimmung" },
        { value: "0", label: "Google-Verbindungen" },
      ],
    },
    lang: {
      title: "Zweisprachig",
      text: "Deutsch und Englisch mit Umschalter, auch in Schweizer Schreibweise.",
      de: "Deine App startet hier.",
      en: "Your app starts here.",
    },
    stepsTitle: "So entsteht eine neue App",
    steps: [
      { title: "Vorlage kopieren", text: "Ein Klick in GitHub, und das Projekt steht." },
      { title: "Marke anpassen", text: "Farben, Schriften und Texte an einer Stelle ändern." },
      { title: "Funktion bauen", text: "Nur noch das, was diese App einzigartig macht." },
      { title: "Prüfen und live", text: "Launch-Check, dann geht die App online." },
    ],
    ctaBandTitle: "Bereit für die nächste App?",
    ctaBandText: "Schreib mir, was deine App können soll.",
  },
  app: {
    title: "Mein Bereich",
    description: "Dein persönlicher Bereich.",
    setupTitle: "Login noch nicht eingerichtet",
    setupText:
      "Sobald NEON_AUTH_COOKIE_SECRET in den Umgebungsvariablen steht, ist dieser Bereich geschützt. Bis dahin siehst du hier eine Vorschau.",
    addLabel: "Neue Idee",
    addPlaceholder: "Idee, z. B. Buchungs-App für Fotoshootings",
    noteLabel: "Details zur Idee",
    notePlaceholder: "Details (optional): Für wen? Was soll sie können? Was nervt heute?",
    add: "Speichern",
    saving: "Speichert …",
    saved: "Gespeichert ✓",
    errors: { empty: "Bitte schreib zuerst deine Idee.", failed: "Das hat nicht geklappt. Bitte versuch es erneut." },
    introTitle: "Deine Ideen-Sammlung",
    introText:
      "Notier hier jede Idee für eine App oder Webseite – am Handy, iPad oder Mac, alles ist überall gleich. Mit „An Claude“ öffnet sich ein Chat mit Claude, deine Idee steht schon drin. Ist sie umgesetzt, hakst du sie ab.",
    introAdmin: "Als Admin siehst du auch die Ideen anderer Nutzer – mit Absender.",
    introNote: "Nur du hast Zugang. Die Seite ist privat und erscheint nicht bei Google.",
    count: "{open} offen · {done} umgesetzt",
    markDone: "Als umgesetzt markieren",
    markOpen: "Wieder öffnen",
    remove: "Löschen",
    toClaude: "An Claude",
    toClaudeHint: "Öffnet Claude mit dieser Idee",
    claudePrompt:
      "Ich habe eine Idee für eine App oder Webseite und möchte sie mit meiner Vorlage susan-app-starter umsetzen.\n\nIdee: {title}\n\nDetails: {note}\n\nBitte hilf mir Schritt für Schritt: Was braucht es, wie würdest du es bauen, und was ist der erste Schritt?",
    noDetails: "(noch keine)",
    from: "von",
    allItems: "Alle Ideen",
    signedInAs: "Angemeldet als",
    dbMissing: "Datenbank noch nicht verbunden. Trage DATABASE_URL ein, dann erscheinen hier deine Einträge.",
    empty: "Noch keine Ideen. Schreib oben deine erste – auch ein halber Gedanke reicht.",
    itemsTitle: "Meine Ideen",
    signIn: "Anmelden",
    role: "Rolle",
    roles: { user: "Nutzer", admin: "Admin" },
  },
  auth: {
    title: "Anmelden",
    description: "Melde dich mit einem Code per E-Mail oder mit Google an.",
    google: "Weiter mit Google",
    or: "oder",
    email: "E-Mail-Adresse",
    sendCode: "Code senden",
    codeSent: "Wir haben dir einen Code an {email} geschickt.",
    code: "Code aus der E-Mail",
    verify: "Anmelden",
    resend: "Code erneut senden",
    otherEmail: "Andere E-Mail-Adresse",
    signOut: "Abmelden",
    errors: {
      email: "Bitte gib eine gültige E-Mail-Adresse ein.",
      code: "Der Code stimmt nicht oder ist abgelaufen.",
      send: "Der Code konnte nicht gesendet werden. Bitte versuch es erneut.",
      notAllowed: "Für diese E-Mail-Adresse ist kein Zugang freigeschaltet.",
      config: "Der Login ist noch nicht eingerichtet.",
      google: "Die Anmeldung mit Google hat nicht geklappt.",
    },
  },
  seo: {
    app: {
      title: "Meine Ideen – sammeln, ordnen, umsetzen",
      description:
        "Deine private Ideen-Sammlung: Ideen für Apps und Webseiten notieren, auf allen Geräten griffbereit haben und mit einem Klick an Claude zur Umsetzung geben.",
    },
    auth: {
      title: "Anmelden per E-Mail-Code oder Google",
      description:
        "Melde dich ohne Passwort an: Wir schicken dir einen Code per E-Mail, oder du nutzt dein Google-Konto. Schnell, sicher und in wenigen Sekunden erledigt.",
    },
    contact: {
      title: "Kontakt – schreib uns deine Anfrage",
      description:
        "Du hast eine Frage oder ein Projekt im Kopf? Schreib uns über das Kontaktformular. Wir lesen jede Nachricht persönlich und melden uns schnellstmöglich.",
    },
    imprint: {
      title: "Impressum – Angaben zum Anbieter",
      description:
        "Impressum mit allen Pflichtangaben zum Anbieter: Name, Anschrift, Kontakt und verantwortliche Person. So weißt du jederzeit, wer hinter dieser App steht.",
    },
    privacy: {
      title: "Datenschutz – so gehen wir mit Daten um",
      description:
        "Welche Daten wir speichern, wofür wir sie nutzen und welche Rechte du hast: Unsere Datenschutzerklärung erklärt es klar und verständlich, ohne Fachchinesisch.",
    },
    terms: {
      title: "AGB – Allgemeine Geschäftsbedingungen",
      description:
        "Die Allgemeinen Geschäftsbedingungen regeln die Nutzung dieser App: Leistungen, Pflichten, Haftung und Kündigung. Klar formuliert und jederzeit hier abrufbar.",
    },
    notFound: {
      title: "Seite nicht gefunden – zur Startseite",
      description:
        "Diese Seite gibt es nicht oder nicht mehr. Vielleicht hat sich die Adresse geändert. Über die Startseite findest du schnell wieder alles, was du suchst.",
    },
  },
  contact: {
    title: "Kontakt",
    description: "Schreib uns eine Nachricht. Wir melden uns schnellstmöglich.",
    formTitle: "Deine Nachricht",
    nextTitle: "So geht es weiter",
    next: ["Wir lesen deine Nachricht persönlich.", "Du bekommst innerhalb von zwei Werktagen eine Antwort.", "Deine Angaben nutzen wir nur für deine Anfrage."],
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
    terms: "AGB",
    placeholderTitle: "Platzhalter",
    placeholderText:
      "Dieser Text muss vor dem Go-live ersetzt werden. Erstelle ihn mit einem Generator (z. B. eRecht24) oder lass ihn von einer Anwältin prüfen.",
  },
  consent: {
    title: "Cookies & Datenschutz",
    text: "Wir verwenden Cookies für Statistik und Werbung nur, wenn du zustimmst. Notwendige Funktionen laufen ohne Cookies.",
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
