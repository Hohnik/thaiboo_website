# Inhalte selbst pflegen – Einrichtung von Redaktionsoberfläche und Hosting

Die Website hat unter **https://thaiboo-moosburg.de/admin/** eine Redaktionsoberfläche (Sveltia CMS).
Dort ändert der Inhaber Preise, Gerichte, Öffnungszeiten, Texte und Fotos in Formularen.
Jede Speicherung landet als Änderung im GitHub-Repository; GitHub baut die Seite neu und
veröffentlicht sie nach etwa zwei Minuten – kostenlos über GitHub Pages.

Die Einrichtung ist einmalig und dauert etwa 30 Minuten. Alles ist kostenlos.

---

## Teil 1 – GitHub Pages aktivieren (Hosting)

1. Das Repository `hohnik/thaiboo_website` muss **öffentlich** sein (GitHub Pages ist nur für
   öffentliche Repositories kostenlos). Alle Inhalte stehen ohnehin auf der Website; Geheimnisse
   liegen nicht im Repository.
2. Im Repository: **Settings → Pages → Build and deployment → Source: „GitHub Actions“** wählen.
3. Den Branch `claude/thaiboo-moosburg-redesign-u6w0t3` nach `main` mergen (Pull Request).
   Der Workflow `.github/workflows/deploy.yml` baut die Seite und veröffentlicht sie.
   Die Seite ist danach unter `https://hohnik.github.io/thaiboo_website/` erreichbar.

   > Hinweis: Unter der `github.io`-Adresse liegt die Seite in einem Unterordner, deshalb laden dort
   > Bilder, Schriften und Stylesheet nicht (die Seite verwendet absolute Pfade wie `/assets/…`).
   > Das ist erwartbar und nur ein Zwischenzustand: Sobald die eigene Domain (nächster Schritt)
   > eingerichtet ist, stimmt alles. Ob der Build funktioniert, sieht man vorher schon unter
   > *Actions* am grünen Haken.

4. **Eigene Domain:** Settings → Pages → „Custom domain“: `thaiboo-moosburg.de` eintragen und
   speichern. Beim Domain-Anbieter (dort, wo thaiboo-moosburg.de registriert ist) diese DNS-Einträge
   setzen:

   | Typ   | Name  | Wert                    |
   | ----- | ----- | ----------------------- |
   | A     | @     | 185.199.108.153         |
   | A     | @     | 185.199.109.153         |
   | A     | @     | 185.199.110.153         |
   | A     | @     | 185.199.111.153         |
   | CNAME | www   | hohnik.github.io        |

   Nach der DNS-Umstellung (bis zu 24 h) in den Pages-Einstellungen **„Enforce HTTPS“** aktivieren.
   GitHub stellt das Zertifikat automatisch aus.

## Teil 2 – Login für die Redaktionsoberfläche

GitHub Pages kann keinen Server-Code ausführen. Für den Login mit GitHub-Konto braucht Sveltia CMS
deshalb einen winzigen Hilfsdienst („Authenticator“), der kostenlos bei Cloudflare läuft.

1. **Cloudflare-Konto** anlegen (kostenlos): https://dash.cloudflare.com/sign-up
2. Den Authenticator mit einem Klick installieren:
   https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth
   Nach der Installation im Cloudflare-Dashboard unter *Workers & Pages* den Dienst
   `sveltia-cms-auth` öffnen und die Worker-URL kopieren, z. B.
   `https://sveltia-cms-auth.mein-name.workers.dev`.
3. **OAuth-App bei GitHub anlegen:** https://github.com/settings/applications/new
   - Application name: `Thaiboo CMS`
   - Homepage URL: `https://thaiboo-moosburg.de`
   - Authorization callback URL: `<Worker-URL>/callback`
   Danach **„Generate a new client secret“** klicken. Client ID und Client Secret notieren.
4. Zurück im Cloudflare-Dashboard beim Worker: **Settings → Variables and Secrets** – drei Einträge:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client Secret (als *Secret* / verschlüsselt speichern)
   - `ALLOWED_DOMAINS` = `thaiboo-moosburg.de, www.thaiboo-moosburg.de, hohnik.github.io`
   Speichern und „Deploy“.
5. In `public/admin/config.yml` die Zeile `base_url:` auf die Worker-URL setzen
   (statt `https://sveltia-cms-auth.REPLACE-ME.workers.dev`) und committen.

## Teil 3 – Inhaber als Bearbeiter freischalten

1. Der Inhaber legt ein kostenloses GitHub-Konto an: https://github.com/signup
2. Im Repository: **Settings → Collaborators → Add people** → das Konto einladen, Rolle „Write“.
3. Der Inhaber nimmt die Einladung an (E-Mail) und öffnet https://thaiboo-moosburg.de/admin/
   → „Sign in with GitHub“. Fertig.

---

## Bedienung (für den Inhaber)

- **Speisekarte → Gerichte & Kategorien:** Jede Kategorie aufklappen, Gericht anklicken, Preis,
  Beschreibung, Kennzeichnung (Vegetarisch / Scharf / Beliebt) oder Foto ändern.
  „Beliebt“ markierte Gerichte bekommen ein goldenes Label und den Filter auf der Speisekarte.
  Gerichte lassen sich per Griff verschieben, duplizieren und löschen.
- **Preise nach Hauptzutat:** Bei Currys, Nudel- und Wok-Gerichten steht der Preis pro Hauptzutat
  oben in der Kategorie („Preise nach Hauptzutat“). Ein Gericht mit eigenem Festpreis bekommt
  stattdessen einen Eintrag unter „Eigene Preise“.
- **Öffnungszeiten & Kontakt:** Zeiten pro Wochentag; Liste leer lassen = Ruhetag. Die Anzeige
  „Jetzt geöffnet“ auf der Website rechnet automatisch damit.
- **Texte & Bilder:** Alle Überschriften, Absätze, die Favoriten auf der Startseite (Nummern
  aus der Speisekarte), die Kacheln, die Galerie.
- **Fotos:** Im Bildfeld „Auswählen“ → „Hochladen“. Handyfotos werden beim Hochladen automatisch
  verkleinert. Für Gerichte auf der Startseite eignen sich freigestellte Fotos (transparenter
  Hintergrund, PNG). Bildbeschreibung ausfüllen – sie hilft Google und Screenreadern.
- **Impressum & Datenschutz:** Name, E-Mail, USt-ID usw. eintragen; leere Felder werden auf der
  Website gelb als „[…]“ angezeigt, bis sie ausgefüllt sind.
- Nach **„Speichern“** dauert es etwa zwei Minuten, bis die Änderung online ist. Unter
  `https://github.com/hohnik/thaiboo_website/actions` sieht man den Fortschritt; ein roter
  Haken bedeutet, dass die Prüfung etwas gefunden hat (z. B. eine Gericht-Nummer, die es doppelt gibt).
  Die alte Version bleibt in dem Fall online.

## Lokal testen (Entwickler)

`npm run dev` starten, im Chrome/Edge http://localhost:4321/admin/ öffnen und
**„Work with Local Repository“** wählen – der Projektordner wird ausgewählt und die Änderungen
landen direkt in den Dateien, ohne Login. `npm run check` prüft danach die Daten.
