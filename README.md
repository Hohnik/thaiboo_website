# Thaiboo Moosburg – Website

Neue Website für **Thaiboo**, das Thai-Restaurant in der Landshuter Str. 9, 85368 Moosburg an der Isar.
Statische Seite ohne Framework: schnell, barrierearm, DSGVO-freundlich und einfach zu pflegen.

**Live-Vorschau lokal:** `npm install && npm run dev` → http://localhost:4321

---

## Warum ein Redesign?

Audit der bisherigen Seite (React/CRA-Bundle):

| Problem                                                                                  | Auswirkung auf Gäste                                        |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 30 MB Hintergrundvideo im Hero, 235 KB CSS (Bootstrap + AOS), React-Bundle             | Sekundenlanges Laden auf dem Handy, hoher Datenverbrauch    |
| Fließtext in einer Schreibschrift („Clicker Script“)                                     | Kaum lesbar, besonders auf kleinen Displays                 |
| Hash-Routing (`/#/Speisekarte`)                                                          | Speisekarte nicht direkt verlinkbar, nicht bei Google indexierbar |
| Speisekarte als dunkle Bildwand ohne Struktur, Preise nur als Tabelle je Kategorie       | Preis eines Gerichts schwer zu finden, keine Suche/Filter   |
| Kein Hinweis „Jetzt geöffnet / geschlossen“, Öffnungszeiten nur im Hero-Video           | Häufigste Frage bleibt unbeantwortet                        |
| „Nur Barzahlung“ nur als Bild auf der Kontaktseite                                       | Böse Überraschung an der Kasse                              |
| Englisches Cookie-Banner, Google-Maps-iFrame ohne Einwilligung, kein Impressum/Datenschutz | Rechtlich angreifbar (DDG, DSGVO, TDDDG)                   |
| `<meta description>` = „Web site created using create-react-app“, `lang="en"`            | Schlechte Suchergebnis-Snippets                             |

## Was die neue Seite anders macht

**Für Gäste (Conversion & Engagement)**

- **Anrufen ist überall einen Tipp entfernt:** Telefon-Button im Header, im Hero, in jeder CTA-Zeile und in der mobilen Leiste am unteren Bildschirmrand (Anrufen · Speisekarte · Route).
- **Live-Status** „Jetzt geöffnet · bis 21:00 Uhr“ / „Öffnet morgen um 11:00 Uhr“ – berechnet in der Zeitzone Europe/Berlin, aktualisiert sich jede Minute; heutiger Tag in allen Öffnungszeiten-Tabellen hervorgehoben.
- **Speisekarte als echtes Werkzeug:** Sticky-Kategorienavigation mit Scroll-Spy, Suche nach Name oder Nummer, Filter *Vegetarisch möglich / Scharf / Beliebt*, jedes Gericht mit Nummer, „ab“-Preis und Preis-Chips je Hauptzutat, Allergen-Codes mit Legende, Deep-Links (`/speisekarte/#gericht-17`), Druck-Stylesheet.
- **„Nur Barzahlung“** an vier Stellen sichtbar (Hero, Info-Karte, Kontakt, Footer).
- **Favoriten mit Freisteller-Fotos** auf der Startseite, Bubble-Tea- und Catering-Teaser, Galerie mit Lightbox (Tastatur, Swipe).
- **Lesbare Typografie:** Fraunces (Headlines) + Inter (Text), selbst gehostet, flüssige Größen, Kontrast ≥ 4,5:1.

**Technik & Recht**

- Kein Framework, kein Tracking, keine Cookies → kein Cookie-Banner nötig.
- Google Maps wird erst nach Klick geladen (Einwilligung; Merker in `localStorage`).
- Schriften vom eigenen Server (Google-Fonts-Abmahnthema vermieden).
- Bilder werden beim Build in AVIF/WebP/JPEG in 6 Breiten erzeugt, `width`/`height` gegen Layout-Sprünge, Lazy Loading; Startseite ≈ 360 KB beim ersten Aufruf (vorher > 30 MB).
- Saubere URLs (`/speisekarte/`, `/ueber-uns/`, `/kontakt/`), `lang="de"`, deutsche Meta-Beschreibungen, Open Graph, **schema.org/Restaurant** (Öffnungszeiten, Adresse, Geo, Telefon, `paymentAccepted: Cash`, Menü-Link), `sitemap.xml`, `robots.txt`, Favicons, 404-Seite.
- Impressum und Datenschutzerklärung angelegt (siehe *Offene Punkte*).
- Barrierefreiheit: Landmarken, Skip-Link, sichtbarer Fokus, ARIA für Navigation/Status/Lightbox, `prefers-reduced-motion`, axe-core ohne Verstöße.

## Struktur

```
build.mjs              Build-Skript (Seiten rendern, Bilder erzeugen, Assets kopieren, Dev-Server)
scripts/check.mjs      Prüft nach dem Build Links, Anker, Meta-Daten und Menü-Daten
src/
  data/site.json       Adresse, Telefon, Öffnungszeiten, Zahlungshinweis (im CMS editierbar)
  data/menu.json       Speisekarte: Kategorien, Gerichte, Preise, Codes, Tags, Extras (CMS)
  data/drinks.json     Bubble Tea und Getränke (CMS)
  data/content.json    Alle Seitentexte, Favoriten, Kacheln, Galerie (CMS)
  data/legal.json      Angaben für Impressum & Datenschutz (CMS)
  data/legend.json     Allergen-/Zusatzstoff-Legende und Icons (technisch)
  data/config.json     Domain, Koordinaten, Maps-Links (technisch)
  pages/*.js           Eine Datei pro Seite (index, speisekarte, ueber-uns, kontakt, impressum, datenschutz, 404)
  lib/                 Layout (Header/Footer/SEO), Partials (Gericht, Galerie, CTA), Icons, Helfer
  styles/main.css      Design-System (Tokens, Komponenten, responsive, print)
  scripts/main.js      Progressive Enhancement (Status, Nav, Filter, Lightbox, Karte)
  assets/images/       Originalbilder (werden beim Build optimiert)
  assets/fonts/        Fraunces + Inter (variable, woff2)
public/                Wird 1:1 nach dist/ kopiert (Manifest, admin/ = Redaktionsoberfläche)
docs/CMS-EINRICHTUNG.md  Anleitung: GitHub Pages, Login, Bedienung
dist/                  Build-Ergebnis – das wird auf den Webspace hochgeladen
```

## Inhalte pflegen – ohne Programmierkenntnisse

Unter **`/admin/`** (z. B. https://thaiboo-moosburg.de/admin/) gibt es eine Redaktionsoberfläche
([Sveltia CMS](https://sveltiacms.app/)). Der Inhaber meldet sich mit seinem GitHub-Konto an und ändert
in Formularen:

| Bereich                     | Datei                      | Was sich ändern lässt                                                        |
| --------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| Speisekarte                 | `src/data/menu.json`       | Kategorien, Gerichte, Preise, Preise je Hauptzutat, Kennzeichnung *Vegetarisch / Scharf / Beliebt*, Allergen-Codes, Fotos, Extras |
| Bubble Tea & Getränke       | `src/data/drinks.json`     | Sorten, Gruppen, Preise                                                      |
| Öffnungszeiten & Kontakt    | `src/data/site.json`       | Zeiten pro Wochentag (leer = Ruhetag), Telefonnummern, Adresse, Zahlungshinweis |
| Texte & Bilder              | `src/data/content.json`    | Alle Überschriften und Absätze, Favoriten der Startseite, Kacheln, Galerie, Catering-Fotos |
| Impressum & Datenschutz     | `src/data/legal.json`      | Name, E-Mail, USt-ID, Behörde, Hoster, Stand                                 |

Fotos werden im Bildfeld hochgeladen, beim Upload automatisch verkleinert (max. 2000 px, WebP) und in
`src/assets/images/` abgelegt; der Build erzeugt daraus alle Größen und Formate.
Jede Speicherung ist ein Commit – die Änderung ist nach etwa zwei Minuten online, und jede Version
lässt sich über die Git-Historie wiederherstellen.

Die Formulare sind in `public/admin/config.yml` definiert (deutsche Beschriftungen, Pflichtfelder,
Formatprüfungen). Technische Einstellungen, die der Inhaber nicht sehen soll (Domain, Koordinaten,
Maps-Links), stehen in `src/data/config.json`; die Allergen-Legende in `src/data/legend.json`.

**Einrichtung von Login und Hosting:** Schritt für Schritt in [`docs/CMS-EINRICHTUNG.md`](docs/CMS-EINRICHTUNG.md).

Natürlich lassen sich die JSON-Dateien auch weiterhin direkt bearbeiten; `npm run check` prüft danach
Nummern, Preise, Codes und Bildverweise.

## Build & Deployment

```bash
npm install          # einmalig (einzige Abhängigkeit: sharp für die Bildoptimierung)
npm run build        # erzeugt dist/
npm run check        # Qualitätsprüfung (Links, Daten, CMS-Konfiguration)
npm run dev          # Build + Watch + Server auf http://localhost:4321 (Admin: /admin/)
```

**GitHub Pages (kostenlos, empfohlen):** Der Workflow `.github/workflows/deploy.yml` baut bei jedem Push,
führt die Prüfung aus und veröffentlicht den `main`-Branch auf GitHub Pages. Einmalig in den
Repository-Einstellungen *Pages → Source: GitHub Actions* wählen und die Domain eintragen
(Details in `docs/CMS-EINRICHTUNG.md`). Pull Requests und andere Branches werden nur gebaut und geprüft.

`dist/` ist reines HTML/CSS/JS und läuft ebenso auf jedem anderen Webspace (FTP-Upload), bei
Netlify/Vercel/Cloudflare Pages (Build-Command `npm run build`, Output `dist`).
Der Server sollte `/speisekarte/` auf `speisekarte/index.html` auflösen (Standard) und `404.html` als
Fehlerseite ausliefern. Empfohlene Cache-Header: `assets/**` lange cachen (Dateinamen enthalten einen
Hash), HTML kurz.

## Offene Punkte für den Inhaber

Diese Angaben lagen nicht vor und sind auf den Seiten gelb markiert (`[…]`). Sie lassen sich im CMS unter *Impressum & Datenschutz* eintragen:

1. **Impressum:** Vor- und Nachname der Inhaberin/des Inhabers, E-Mail-Adresse, USt-IdNr. bzw. Steuernummer, erlaubniserteilende Behörde.
2. **Datenschutz:** Hosting-Anbieter (bei GitHub Pages: „GitHub, Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA“), Speicherdauer der Logfiles, Stand (Monat/Jahr). Bitte vor Veröffentlichung juristisch prüfen lassen.
0. **CMS-Login:** Authenticator einrichten und `base_url` in `public/admin/config.yml` setzen (`docs/CMS-EINRICHTUNG.md`).
3. **Allergen-Code „o“** wird auf der alten Karte verwendet, ist aber nicht Teil der gesetzlichen Liste – in der Legende steht daher „siehe Aushang im Restaurant“. Bitte klären und in `menu.json` eintragen.
4. Tags *Beliebt* wurden nach den Gerichten mit Foto auf der alten Seite vergeben (Pad Thai, Gaeng Kiow Wan, Yam Nua, gebackene Banane …) – gerne nach echten Verkaufszahlen anpassen.
5. Preise und Öffnungszeiten wurden 1:1 von der alten Seite übernommen; bitte auf Aktualität prüfen.
