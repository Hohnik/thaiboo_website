import { esc, icon, fmtPrice } from '../lib/html.js';
import { hoursTable, statusChip } from '../lib/layout.js';
import { dishCard, gallery, ctaBand } from '../lib/partials.js';

export default {
  path: '/',
  order: 1,
  priority: 1.0,
  changefreq: 'weekly',
  title: 'Start',
  description: 'Thaiboo – Thai-Restaurant in Moosburg an der Isar. Currys, Wok-Gerichte, Suppen und Bubble Tea, frisch zubereitet – vor Ort oder zum Mitnehmen. Di–So 11–15 & 17–21 Uhr. Nur Barzahlung.',
  render(ctx) {
    const { site } = ctx;
    const p = site.phones[0];
    return `
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">Thai-Restaurant · Moosburg an der Isar</p>
      <h1 class="hero-title">Frisch aus dem Wok – <em>Thai-Küche mitten in Moosburg.</em></h1>
      <p class="lead">Currys, Wok-Gerichte, Suppen und Bubble Tea – frisch zubereitet, zum Genießen bei uns oder zum Mitnehmen. Einfach anrufen und vorbestellen.</p>
      ${statusChip(site)}
      <div class="btn-group hero-actions">
        <a class="btn btn-primary btn-lg" href="tel:${p.tel}">${icon('phone')} Jetzt&nbsp;bestellen</a>
        <a class="btn btn-secondary btn-lg" href="/speisekarte/">Speisekarte ${icon('arrow')}</a>
      </div>
      <ul class="hero-meta">
        <li>${icon('pin')}<a href="${esc(site.mapsUrl)}" target="_blank" rel="noopener">${esc(site.address.street)}, ${esc(site.address.city)}</a></li>
        <li>${icon('cash')}${esc(site.payment)}</li>
        <li>${icon('bag')}Auch zum Mitnehmen</li>
      </ul>
    </div>
    <div class="hero-media">
      ${ctx.img('hero-gericht', { alt: 'Dampfendes Wok-Gericht mit Duftreis, Gemüse und Salat auf einem Teller', loading: 'eager', fetchpriority: 'high', sizes: '(min-width: 60em) 46vw, 100vw' })}
      <a class="hero-badge" href="/speisekarte/#gericht-17" aria-label="Beliebt: Pad Thai, ab 8,50 Euro – zur Speisekarte">
        ${ctx.img('gericht-pad-thai', { alt: '', sizes: '64px', width: 64 })}
        <span><strong>Beliebt: Pad Thai</strong><span>ab ${fmtPrice(8.5)} · Nr. 17</span></span>
      </a>
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="info-title">
  <div class="container">
    <h2 id="info-title" class="visually-hidden">Öffnungszeiten, Adresse und Bestellung</h2>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-card-icon">${icon('clock')}</div>
        <h3>Öffnungszeiten</h3>
        ${hoursTable(site)}
        <p class="small">${esc(site.hours.note)}</p>
      </div>
      <div class="info-card">
        <div class="info-card-icon">${icon('pin')}</div>
        <h3>Hier finden Sie uns</h3>
        <p><strong>${esc(site.name)}</strong><br>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</p>
        <p class="small">Direkt an der Landshuter Straße, wenige Gehminuten vom Stadtplatz.</p>
        <a class="btn btn-secondary btn-sm" href="${esc(site.mapsDirectionsUrl)}" target="_blank" rel="noopener">Route planen ${icon('external')}</a>
      </div>
      <div class="info-card">
        <div class="info-card-icon">${icon('bag')}</div>
        <h3>Bestellen &amp; Abholen</h3>
        <p>Rufen Sie an, wir bereiten alles frisch zu. Beim Abholen zahlen Sie bequem bar.</p>
        <p class="small"><strong>${esc(site.payment)}</strong> – keine Kartenzahlung möglich.</p>
        <a class="btn btn-primary btn-sm" href="tel:${p.tel}">${icon('phone')} ${esc(p.display)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="fav-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Unsere Favoriten</p>
      <h2 id="fav-title">Was unsere Gäste am liebsten bestellen</h2>
      <p>Hausgemachte Klassiker aus Thailand – wahlweise vegetarisch, mit Tofu, Hähnchen, Rind, Ente, Garnelen oder Fisch.</p>
    </div>
    <div class="dish-grid">
      ${[17, 13, 35, 38].map((no) => dishCard(ctx, no)).join('')}
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-secondary" href="/speisekarte/">Zur kompletten Speisekarte ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section--alt" aria-labelledby="about-title">
  <div class="container split">
    ${ctx.img('koch', { alt: 'Unser Koch im Thaiboo-Poloshirt vor einer Bambuswand', pictureClass: 'portrait', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">Über uns</p>
      <h2 id="about-title">Mit Leidenschaft für authentische thailändische Küche</h2>
      <p>Willkommen im Thaiboo! Unser erfahrenes Küchenteam bereitet jedes Gericht mit frischen Zutaten und traditionellen Techniken zu – für ein authentisches Geschmackserlebnis in gemütlicher Atmosphäre.</p>
      <ul class="check-list">
        <li>${icon('check')}<span>Frisch gekocht – vom scharfen Curry bis zum knusprigen Wok-Gemüse</span></li>
        <li>${icon('check')}<span>Sie wählen: vegetarisch, Tofu, Hähnchen, Rind, Ente, Garnelen oder Fisch</span></li>
        <li>${icon('check')}<span>Zum Hierbleiben, zum Mitnehmen oder als Catering für Ihre Feier</span></li>
      </ul>
      <a class="btn btn-secondary" href="/ueber-uns/">Mehr über uns ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="more-title">
  <div class="container">
    <h2 id="more-title" class="visually-hidden">Bubble Tea und Catering</h2>
    <div class="teaser-grid">
      <article class="teaser teaser--cutout">
        ${ctx.img('bubble-tea', { alt: 'Zwei Bubble Teas mit Tapioka-Perlen', sizes: '(min-width: 56em) 20vw, 40vw' })}
        <div class="teaser-body">
          <p class="eyebrow">Neu im Thaiboo</p>
          <h3>Bubble Tea</h3>
          <p>Fruchtige Tee- und Soda-Mixes, cremige Milchtees und Latte – mit Tapioka-Perlen, frisch gemixt. Ab ${fmtPrice(5)}.</p>
          <a class="btn btn-secondary btn-sm" href="/speisekarte/#bubble-tea">Alle Sorten ${icon('arrow')}</a>
        </div>
      </article>
      <article class="teaser">
        ${ctx.img('catering-buffet-1', { alt: 'Catering-Buffet mit Wok-Gemüse, Nudeln und Currys in Warmhaltebehältern', sizes: '(min-width: 56em) 20vw, 40vw' })}
        <div class="teaser-body">
          <p class="eyebrow">Für Ihre Feier</p>
          <h3>Catering</h3>
          <p>Hochzeit, Firmenfeier oder Geburtstag: Wir stellen mit Ihnen das passende Thai-Buffet zusammen und liefern es frisch.</p>
          <a class="btn btn-secondary btn-sm" href="/ueber-uns/#catering">Mehr erfahren ${icon('arrow')}</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="gallery-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Einblicke</p>
      <h2 id="gallery-title">Ein Blick ins Thaiboo</h2>
    </div>
    ${gallery(ctx, [
      { name: 'gastraum', alt: 'Gastraum mit dunklen Holztischen, Fensterfront und goldener Buddha-Statue' },
      { name: 'galerie-pad-thai', alt: 'Pad Thai mit Sprossen, Limette und geschnitzter Karotte' },
      { name: 'galerie-buddha-tisch', alt: 'Buddha-Figur neben Pflanzen und der Speisekarte am Fenstertisch' },
      { name: 'galerie-teller-reis', alt: 'Wok-Gericht mit Duftreis, Gemüse und Salatgarnitur' },
      { name: 'galerie-bubble-tea', alt: 'Bubble Teas in Mango und Erdbeere mit Tapioka-Perlen' },
      { name: 'galerie-buddha-orchideen', alt: 'Goldene Buddha-Statue mit Orchideen' },
      { name: 'galerie-zwei-teller', alt: 'Zwei Gerichte mit Reis auf einem weißen Tisch' },
      { name: 'theke-bubble-tea', alt: 'Unser Team hinter der Theke bei der Zubereitung von Bubble Tea' },
    ])}
  </div>
</section>

${ctaBand(ctx)}
`;
  },
};
