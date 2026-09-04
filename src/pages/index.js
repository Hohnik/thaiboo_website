import { esc, icon, fmtPrice, toTel } from '../lib/html.js';
import { hoursTable, statusChip } from '../lib/layout.js';
import { dishCard, gallery, ctaBand, findDish, startingPrice } from '../lib/partials.js';

export default {
  path: '/',
  order: 1,
  priority: 1.0,
  changefreq: 'weekly',
  title: 'Start',
  description: 'Thaiboo – Thai-Restaurant in Moosburg an der Isar. Currys, Wok-Gerichte, Suppen und Bubble Tea, frisch zubereitet – vor Ort oder zum Mitnehmen. Di–So 11–15 & 17–21 Uhr. Nur Barzahlung.',
  render(ctx) {
    const { site, config, content } = ctx;
    const c = content.home;
    const p = site.phones[0];
    const badge = findDish(ctx.menu, c.hero.badgeDish);
    const badgePrice = badge ? startingPrice(badge.item, badge.category) : null;
    return `
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
      <h1 class="hero-title">${esc(c.hero.title)} <em>${esc(c.hero.titleAccent)}</em></h1>
      <p class="lead">${esc(c.hero.lead)}</p>
      ${statusChip(site)}
      <div class="btn-group hero-actions">
        <a class="btn btn-primary btn-lg" href="tel:${toTel(p.number)}">${icon('phone')} Jetzt&nbsp;bestellen</a>
        <a class="btn btn-secondary btn-lg" href="/speisekarte/">Speisekarte ${icon('arrow')}</a>
      </div>
      <ul class="hero-meta">
        <li>${icon('pin')}<a href="${esc(config.mapsUrl)}" target="_blank" rel="noopener">${esc(site.address.street)}, ${esc(site.address.city)}</a></li>
        <li>${icon('cash')}${esc(site.payment)}</li>
        <li>${icon('bag')}Auch zum Mitnehmen</li>
      </ul>
    </div>
    <div class="hero-media">
      ${ctx.img(c.hero.image, { alt: c.hero.imageAlt, loading: 'eager', fetchpriority: 'high', sizes: '(min-width: 60em) 46vw, 100vw' })}
      ${badge && badge.item.image ? `<a class="hero-badge" href="/speisekarte/#gericht-${badge.item.no}" aria-label="${esc(c.hero.badgeLabel)}, ${badgePrice ? 'ab ' + fmtPrice(badgePrice.min) : ''} – zur Speisekarte">
        ${ctx.img(badge.item.image, { alt: '', sizes: '64px', width: 64 })}
        <span><strong>${esc(c.hero.badgeLabel)}</strong><span>${badgePrice ? (badgePrice.multiple ? 'ab ' : '') + fmtPrice(badgePrice.min) : ''} · Nr. ${badge.item.no}</span></span>
      </a>` : ''}
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
        <p class="small">${esc(c.infoCards.addressHint)}</p>
        <a class="btn btn-secondary btn-sm" href="${esc(config.mapsDirectionsUrl)}" target="_blank" rel="noopener">Route planen ${icon('external')}</a>
      </div>
      <div class="info-card">
        <div class="info-card-icon">${icon('bag')}</div>
        <h3>Bestellen &amp; Abholen</h3>
        <p>${esc(c.infoCards.orderText)}</p>
        <p class="small"><strong>${esc(site.payment)}</strong> – keine Kartenzahlung möglich.</p>
        <a class="btn btn-primary btn-sm" href="tel:${toTel(p.number)}">${icon('phone')} ${esc(String(p.number).replace(/ /g, ' '))}</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="fav-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${esc(c.favorites.eyebrow)}</p>
      <h2 id="fav-title">${esc(c.favorites.title)}</h2>
      <p>${esc(c.favorites.intro)}</p>
    </div>
    <div class="dish-grid">
      ${(c.favorites.dishes || []).map((no) => dishCard(ctx, no)).join('')}
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-secondary" href="/speisekarte/">Zur kompletten Speisekarte ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section--alt" aria-labelledby="about-title">
  <div class="container split">
    ${ctx.img(c.about.image, { alt: c.about.imageAlt, pictureClass: 'portrait', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">${esc(c.about.eyebrow)}</p>
      <h2 id="about-title">${esc(c.about.title)}</h2>
      <p>${esc(c.about.text)}</p>
      <ul class="check-list">
        ${(c.about.bullets || []).map((b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}
      </ul>
      <a class="btn btn-secondary" href="/ueber-uns/">Mehr über uns ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="more-title">
  <div class="container">
    <h2 id="more-title" class="visually-hidden">Bubble Tea und Catering</h2>
    <div class="teaser-grid">
      ${(c.teasers || []).map((t) => `<article class="teaser${t.cutout ? ' teaser--cutout' : ''}">
        ${ctx.img(t.image, { alt: t.imageAlt || '', sizes: '(min-width: 56em) 20vw, 40vw' })}
        <div class="teaser-body">
          <p class="eyebrow">${esc(t.eyebrow)}</p>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.text)}</p>
          ${t.link ? `<a class="btn btn-secondary btn-sm" href="${esc(t.link)}">${esc(t.linkLabel || 'Mehr erfahren')} ${icon('arrow')}</a>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="gallery-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${esc(c.gallery.eyebrow)}</p>
      <h2 id="gallery-title">${esc(c.gallery.title)}</h2>
    </div>
    ${gallery(ctx, c.gallery.images || [])}
  </div>
</section>

${ctaBand(ctx)}
`;
  },
};
