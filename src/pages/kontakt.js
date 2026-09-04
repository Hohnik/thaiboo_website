import { esc, icon } from '../lib/html.js';
import { hoursTable, statusChip } from '../lib/layout.js';

export default {
  path: '/kontakt/',
  order: 4,
  priority: 0.8,
  title: 'Kontakt & Öffnungszeiten',
  description: 'Thaiboo Moosburg – Landshuter Str. 9, 85368 Moosburg an der Isar. Öffnungszeiten Di–So 11–15 & 17–21 Uhr, Montag Ruhetag. Telefon 08761 726 65 72. Nur Barzahlung.',
  render(ctx) {
    const { site } = ctx;
    return `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Kontakt</p>
    <h1>So erreichen Sie uns</h1>
    <p class="lead">Bestellungen, Reservierungen und Fragen zum Catering nehmen wir gerne telefonisch entgegen.</p>
  </div>
</section>

<section class="section section--tight" style="padding-top:0">
  <div class="container contact-grid">
    <div class="card">
      <h2>${icon('clock')} Öffnungszeiten</h2>
      ${statusChip(site)}
      <div style="margin-top:1rem">${hoursTable(site)}</div>
      <p class="small muted" style="margin-top:.75rem">${esc(site.hours.note)}</p>
    </div>
    <div class="card">
      <h2>${icon('phone')} Telefon</h2>
      <ul class="phone-list">
        ${site.phones.map((p) => `<li><a href="tel:${p.tel}">${icon('phone')} ${esc(p.display)}<span>${esc(p.label)}</span></a></li>`).join('')}
      </ul>
      <p class="muted">Am schnellsten erreichen Sie uns während der Öffnungszeiten. Für Bestellungen zum Mitnehmen nennen Sie uns einfach die Nummern der Gerichte.</p>
      <p class="notice">${icon('cash')}<span><strong>${esc(site.payment)}.</strong> ${esc(site.paymentNote)}</span></p>
    </div>
    <div class="card">
      <h2>${icon('pin')} Adresse</h2>
      <address>
        <strong>${esc(site.legalName)}</strong><br>
        ${esc(site.address.street)}<br>
        ${esc(site.address.zip)} ${esc(site.address.city)}
      </address>
      <div class="btn-group" style="margin-top:1.25rem">
        <a class="btn btn-primary" href="${esc(site.mapsDirectionsUrl)}" target="_blank" rel="noopener">Route planen ${icon('external')}</a>
        <a class="btn btn-secondary" href="${esc(site.mapsUrl)}" target="_blank" rel="noopener">In Google Maps öffnen</a>
      </div>
    </div>
    <div class="map" data-map="${esc(site.mapsEmbedUrl)}">
      <div class="map-consent" data-map-consent>
        <div class="map-consent-inner">
          ${icon('pin', 'icon--lg')}
          <strong>Karte anzeigen</strong>
          <p>Mit dem Laden der Karte werden Daten an Google übertragen. Details finden Sie in unserer <a href="/datenschutz/#maps">Datenschutzerklärung</a>.</p>
          <div class="btn-group"><button type="button" class="btn btn-secondary btn-sm" data-map-load>Google Maps laden</button></div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  },
};
