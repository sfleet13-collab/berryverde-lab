import { site } from "@/config/site";

/**
 * Rechtstexte von Dein Lab. Angaben zur Anbieterin wie auf berryverde.com/impressum.
 * ENTWURF: vor dem Go-live von Susan gegenlesen und rechtlich prüfen lassen.
 */

const ANBIETERIN = {
  name: "Susan Fleet",
  firma: "Digital Business Fleet",
  zusatz: "c/o IP-Management #7023",
  strasse: "Ludwig-Erhard-Straße 18",
  ort: "20459 Hamburg",
  land: "Deutschland",
  email: "susan@berryverde.com",
  telefon: "+41 79 123 26 09",
};

function Anschrift() {
  return (
    <p>
      {ANBIETERIN.name}
      <br />
      {ANBIETERIN.firma}
      <br />
      {ANBIETERIN.zusatz}
      <br />
      {ANBIETERIN.strasse}
      <br />
      {ANBIETERIN.ort}
      <br />
      {ANBIETERIN.land}
    </p>
  );
}

export function Impressum() {
  return (
    <>
      <h2>Angaben gemäß § 5 DDG</h2>
      <Anschrift />
      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${ANBIETERIN.email}`}>{ANBIETERIN.email}</a>
        <br />
        Telefon: {ANBIETERIN.telefon}
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>Susan Fleet, Anschrift wie oben</p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Alle Rezepturen, Berechnungen und Hinweise in {site.name} wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
        Aktualität kann ich dennoch keine Gewähr übernehmen. Die Inhalte ersetzen keine medizinische oder therapeutische Beratung.
      </p>
      <h2>Hinweis zur Anwendung</h2>
      <p>
        {site.name} ist ausschließlich für die Herstellung von Kosmetik zum eigenen Gebrauch gedacht, nicht zum Verkauf oder Verschenken. Teste
        selbst gerührte Kosmetik vor der Anwendung an einer kleinen Hautstelle. Für Unverträglichkeiten oder Hautreaktionen übernehme ich keine
        Haftung.
      </p>
      <h2>Provisions-Links</h2>
      <p>
        {site.name} enthält bei einzelnen Rohstoffen und Geräten Links zu Händlern, unter anderem zu Amazon. Solche Links sind als Provisions-Link
        gekennzeichnet. Kaufst du über einen solchen Link, erhalte ich eine kleine Provision. Für dich ändert sich der Preis nicht. Als
        Amazon-Partnerin verdiene ich an qualifizierten Verkäufen.
      </p>
      <h2>Urheberrecht</h2>
      <p>
        Alle Texte, Rezepturen und Inhalte dieser Anwendung sind urheberrechtlich geschützt. Jede Vervielfältigung, Bearbeitung oder Weitergabe
        bedarf meiner vorherigen schriftlichen Zustimmung.
      </p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    </>
  );
}

export function Datenschutz() {
  return (
    <>
      <p>
        Hier steht, welche Daten {site.name} verarbeitet, wofür und welche Rechte du hast. {site.name} setzt keine Cookies für Werbung oder
        Statistik und lädt keine Schriften oder Skripte von fremden Servern.
      </p>
      <h2>Verantwortliche</h2>
      <Anschrift />
      <p>
        E-Mail: <a href={`mailto:${ANBIETERIN.email}`}>{ANBIETERIN.email}</a>
      </p>

      <h2>Hosting</h2>
      <p>
        {site.name} wird bei Vercel Inc. (USA) gehostet, die Anwendung läuft in der Region Frankfurt. Beim Aufruf verarbeitet Vercel technisch
        notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browser-Angaben, um die Seite auszuliefern und abzusichern.
        Rechtsgrundlage ist mein berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Mit Vercel besteht
        ein Vertrag zur Auftragsverarbeitung; für Übermittlungen in die USA gelten die Standardvertragsklauseln der EU.
      </p>

      <h2>Anmeldung und Mitgliederbereich</h2>
      <p>
        Für den Mitgliederbereich speichere ich deine E-Mail-Adresse, den Zeitpunkt der Freischaltung, deine Stufe und deine eigenen Rezepturen.
        Die Anmeldung läuft ohne Passwort: Du bekommst einen einmaligen Code per E-Mail. Nach der Anmeldung setzt {site.name} ein technisch
        notwendiges Cookie, das dich angemeldet hält. Rechtsgrundlage ist die Erfüllung des Vertrags über die Mitgliedschaft (Art. 6 Abs. 1 lit. b
        DSGVO).
      </p>
      <p>
        Datenbank und Anmeldung betreibt Neon Inc. (USA), die Daten liegen in einem Rechenzentrum in Frankfurt. Den Code verschickt der
        Anmeldedienst von Neon per E-Mail. Auch hier besteht ein Vertrag zur Auftragsverarbeitung mit Standardvertragsklauseln.
      </p>
      <p>
        Deine Daten bleiben gespeichert, solange deine Mitgliedschaft besteht. Nach dem Ende lösche ich Zugang und eigene Rezepturen auf Wunsch
        sofort, sonst spätestens nach zwölf Monaten.
      </p>

      <h2>Kauf der Mitgliedschaft</h2>
      <p>
        Die Mitgliedschaft schließt du über Tentary ab. Für den Kauf und die Zahlung gilt die Datenschutzerklärung von Tentary. Von dort erhalte
        ich die E-Mail-Adresse, mit der du gekauft hast, um deinen Zugang freizuschalten.
      </p>

      <h2>Kontakt</h2>
      <p>
        Wenn du mir schreibst, verarbeite ich deine Angaben (Name, E-Mail-Adresse, Nachricht), um deine Anfrage zu beantworten (Art. 6 Abs. 1
        lit. b und f DSGVO). Nachrichten aus dem Kontaktformular werden über den E-Mail-Dienst Resend an mich zugestellt.
      </p>

      <h2>Statistik ohne Cookies</h2>
      <p>
        Zur Reichweitenmessung nutze ich Vercel Web Analytics. Der Dienst arbeitet ohne Cookies und ohne Wiedererkennung über mehrere Tage;
        ausgewertet werden nur zusammengefasste Zahlen wie Seitenaufrufe. Rechtsgrundlage ist mein berechtigtes Interesse an einer
        bedarfsgerechten Gestaltung (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>Links zu Händlern</h2>
      <p>
        Bei einzelnen Rohstoffen und Geräten stehen Links zu Händlern. Erst wenn du einen solchen Link anklickst, erhält der Händler Daten von
        dir. Bei Provisions-Links kann der Händler erkennen, dass du von {site.name} kommst. Es gilt die Datenschutzerklärung des jeweiligen
        Händlers.
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Schreib
        mir dazu an <a href={`mailto:${ANBIETERIN.email}`}>{ANBIETERIN.email}</a>. Außerdem kannst du dich bei einer
        Datenschutz-Aufsichtsbehörde beschweren.
      </p>
    </>
  );
}

export function Nutzungsbedingungen() {
  return (
    <>
      <p>Diese Bedingungen gelten für die Nutzung von {site.name}, dem Rezeptur-Rechner von berryverde.</p>
      <h2>Leistung</h2>
      <p>
        {site.name} ist eine Web-Anwendung für Mitglieder. Sie enthält einen Rechner für Kosmetik-Rezepturen, eine Bibliothek geprüfter
        Rezepturen, eine Rohstoff-Datenbank sowie Rezeptkarten und Etiketten zum Ausdrucken. Die Mitgliedschaft selbst, ihre Laufzeit, der Preis
        und die Kündigung richten sich nach dem Vertrag, den du über Tentary abschließt.
      </p>
      <h2>Zugang</h2>
      <p>
        Der Zugang ist persönlich und an die E-Mail-Adresse deiner Mitgliedschaft gebunden. Gib deinen Zugang nicht weiter. Endet die
        Mitgliedschaft, endet der Zugang zur Anwendung.
      </p>
      <h2>Nur für den Eigengebrauch</h2>
      <p>
        Alle Rezepturen und Berechnungen sind für Kosmetik gedacht, die du für dich selbst herstellst. Sie sind nicht zum Verkauf oder
        Verschenken bestimmt. Wer Kosmetik an andere abgibt, muss die EU-Kosmetikverordnung einhalten, unter anderem mit einer
        Sicherheitsbewertung. Das leistet {site.name} nicht.
      </p>
      <h2>Sorgfalt beim Rühren</h2>
      <p>
        Der Rechner prüft deine Rezeptur nach festen Regeln und weist auf Fehler hin. Er ersetzt nicht dein eigenes sorgfältiges Arbeiten:
        sauberes Werkzeug, genaues Abmessen, das Einhalten der Hinweise zu Konservierung, pH-Wert und Haltbarkeit. Teste jedes Produkt vor der
        Anwendung an einer kleinen Hautstelle. Die Inhalte sind keine medizinische Beratung und enthalten keine Heilversprechen.
      </p>
      <h2>Haftung</h2>
      <p>
        Ich hafte für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit nach den gesetzlichen Vorschriften.
        Bei leichter Fahrlässigkeit hafte ich nur für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren,
        vertragstypischen Schaden.
      </p>
      <h2>Inhalte und Urheberrecht</h2>
      <p>
        Rezepturen, Texte und Steckbriefe darfst du für dich nutzen und ausdrucken. Eine Weitergabe oder Veröffentlichung ist nicht erlaubt.
        Deine eigenen Rezepturen bleiben deine; nur du siehst sie.
      </p>
      <h2>Provisions-Links</h2>
      <p>
        Einige Links zu Rohstoffen und Geräten sind Provisions-Links und als solche gekennzeichnet. Kaufst du darüber, erhalte ich eine kleine
        Provision. Für dich ändert sich der Preis nicht.
      </p>
    </>
  );
}
