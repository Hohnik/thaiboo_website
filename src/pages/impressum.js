import { esc, toTel } from '../lib/html.js';
import { fill } from '../lib/partials.js';

export default {
  path: '/impressum/',
  order: 10,
  priority: 0.2,
  title: 'Impressum',
  description: 'Impressum von Thaiboo, Landshuter Str. 9, 85368 Moosburg an der Isar.',
  render(ctx) {
    const { site, legal } = ctx;
    const phone = site.phones[0];
    return `
<section class="page-head"><div class="container"><p class="eyebrow">Rechtliches</p><h1>Impressum</h1></div></section>
<section class="section section--tight" style="padding-top:0"><div class="container prose">
  <h2>Angaben gemäß § 5 DDG</h2>
  <p>${fill(legal.ownerName, 'Vor- und Nachname der Inhaberin / des Inhabers')}<br>
  ${esc(site.legalName)}<br>
  ${esc(site.address.street)}<br>
  ${esc(site.address.zip)} ${esc(site.address.city)}</p>

  <h2>Kontakt</h2>
  <p>Telefon: <a href="tel:${toTel(phone.number)}">${esc(String(phone.number).replace(/ /g, ' '))}</a><br>
  E-Mail: ${legal.email ? `<a href="mailto:${esc(legal.email)}">${esc(legal.email)}</a>` : fill('', 'E-Mail-Adresse')}</p>

  <h2>Umsatzsteuer-ID</h2>
  <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: ${fill(legal.vatId, 'USt-IdNr., falls vorhanden – sonst Steuernummer angeben')}</p>

  <h2>Aufsichtsbehörde</h2>
  <p>Gaststättenerlaubnis erteilt durch: ${fill(legal.authority, 'zuständige Behörde, z. B. Stadt Moosburg a. d. Isar / Landratsamt Freising')}</p>

  <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
  <p>${fill(legal.ownerName, 'Vor- und Nachname')}, Anschrift wie oben.</p>

  <h2>Verbraucherstreitbeilegung</h2>
  <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

  <h2>Haftung für Inhalte</h2>
  <p>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität – insbesondere von Preisen und Öffnungszeiten – übernehmen wir jedoch keine Gewähr. Maßgeblich sind die Angaben im Restaurant.</p>

  <h2>Haftung für Links</h2>
  <p>Unsere Website enthält Links zu externen Websites Dritter (z. B. Google Maps), auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter verantwortlich.</p>

  <h2>Urheberrecht</h2>
  <p>Die auf dieser Website veröffentlichten Inhalte, Fotos und Grafiken unterliegen dem deutschen Urheberrecht. Jede Verwendung außerhalb der Grenzen des Urheberrechts bedarf der schriftlichen Zustimmung.</p>
</div></section>`;
  },
};
