import { esc, icon, hoursSummary, weekFromSite, toTel, DAY_LABELS } from './html.js';
import { sprite } from './icons.js';

const NAV = [
  { href: '/speisekarte/', label: 'Speisekarte' },
  { href: '/ueber-uns/', label: 'Über uns' },
  { href: '/kontakt/', label: 'Kontakt' },
];

export function jsonLd(ctx) {
  const { site, config } = ctx;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const spec = [];
  for (const d of weekFromSite(site)) for (const [o, c] of d.ranges) spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days[d.day], opens: o, closes: c });
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${config.url}/#restaurant`,
    name: site.name,
    alternateName: site.legalName,
    url: config.url,
    image: `${config.url}/og-image.jpg`,
    logo: `${config.url}/icon-512.png`,
    telephone: toTel(site.phones[0].number),
    servesCuisine: ['Thai', 'Asiatisch'],
    priceRange: '€€',
    paymentAccepted: 'Cash',
    currenciesAccepted: 'EUR',
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.zip, addressLocality: site.address.city, addressRegion: config.region, addressCountry: config.country },
    geo: { '@type': 'GeoCoordinates', latitude: config.geo.lat, longitude: config.geo.lng },
    hasMap: config.mapsUrl,
    openingHoursSpecification: spec,
    hasMenu: `${config.url}/speisekarte/`,
    acceptsReservations: 'True',
  };
}

export function hoursTable(site, { compact = false } = {}) {
  const week = weekFromSite(site);
  const rows = [1, 2, 3, 4, 5, 6, 0].map((i) => {
    const d = week[i];
    const t = d.ranges.length ? d.ranges.map(([a, b]) => `<span class="hours-range">${esc(a)}–${esc(b)} Uhr</span>`).join('') : 'Ruhetag';
    return `<tr data-day="${d.day}"${d.ranges.length ? '' : ' class="is-closed"'}><th scope="row">${esc(compact ? d.label.slice(0, 2) : d.label)}</th><td>${t}</td></tr>`;
  }).join('');
  return `<table class="hours-table${compact ? ' hours-table--compact' : ''}"><caption class="visually-hidden">Öffnungszeiten</caption><tbody>${rows}</tbody></table>`;
}

export function statusChip(site, cls = '') {
  return `<span class="status ${cls}" data-status role="status" aria-live="polite"><span class="status-dot" aria-hidden="true"></span><span data-status-text>${esc(hoursSummary(site))}</span></span>`;
}

export const phoneLink = (p, cls = '', extra = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="tel:${toTel(p.number)}">${icon('phone')}${extra}${esc(String(p.number).replace(/ /g, ' '))}</a>`;

export function layout({ path, title, description, body, ctx, bodyClass = '', extraLd, ogType = 'website', noindex = false }) {
  const { site, config, assets } = ctx;
  const fullTitle = path === '/' ? `${site.name} – Thai-Restaurant in ${site.address.city}` : `${title} · ${site.name} Moosburg`;
  const canonical = `${config.url}${path === '/404/' ? '' : path}`;
  const ld = [jsonLd(ctx), ...(extraLd || [])];
  const phone = site.phones[0];
  const nbsp = (s) => esc(String(s).replace(/ /g, ' '));
  return `<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#fbf6ee">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${config.url}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="${esc(bodyClass)}" data-hours='${JSON.stringify(weekFromSite(site))}'>
${sprite()}
<a class="skip-link" href="#main">Zum Inhalt springen</a>
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} – Startseite">
      <picture><source type="image/webp" srcset="/logo-88.webp"><img src="/logo-88.png" width="44" height="44" alt="" class="brand-logo" decoding="async"></picture>
      <span class="brand-name">Thai<span>boo</span></span>
    </a>
    <nav class="nav" id="nav" aria-label="Hauptnavigation">
      <ul class="nav-list">
        ${NAV.map((n) => `<li><a href="${n.href}"${path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="header-actions">
      <a class="btn btn-primary btn-sm header-cta" href="tel:${toTel(phone.number)}">${icon('phone')}<span class="header-cta-text">${nbsp(phone.number)}</span><span class="visually-hidden">anrufen</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" data-nav-toggle>
        <span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="visually-hidden">Menü öffnen</span>
      </button>
    </div>
  </div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="/"><picture><source type="image/webp" srcset="/logo-88.webp"><img src="/logo-88.png" width="44" height="44" alt="" class="brand-logo" loading="lazy" decoding="async"></picture><span class="brand-name">Thai<span>boo</span></span></a>
      <p>${esc(site.tagline)}. Frisch gekocht, zum Genießen vor Ort oder zum Mitnehmen.</p>
      <p class="footer-cash">${icon('cash')} ${esc(site.payment)}</p>
    </div>
    <div>
      <h2 class="footer-title">Kontakt</h2>
      <address class="footer-address">
        <a href="${esc(config.mapsUrl)}" target="_blank" rel="noopener">${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</a>
      </address>
      <ul class="footer-list">
        ${site.phones.map((p) => `<li>${phoneLink(p, '', ' ')} <span class="muted">(${esc(p.label)})</span></li>`).join('')}
      </ul>
    </div>
    <div>
      <h2 class="footer-title">Öffnungszeiten</h2>
      ${hoursTable(site, { compact: true })}
      <p class="muted small">${esc(site.hours.note)}</p>
    </div>
    <div>
      <h2 class="footer-title">Seiten</h2>
      <ul class="footer-list">
        <li><a href="/">Start</a></li>
        ${NAV.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}
        <li><a href="/impressum/">Impressum</a></li>
        <li><a href="/datenschutz/">Datenschutz</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© <span data-year>${new Date().getFullYear()}</span> ${esc(site.legalName)} · ${esc(site.address.city)}</p>
    <p class="muted small">Alle Preise in Euro inkl. MwSt. Änderungen vorbehalten.</p>
  </div>
</footer>
<nav class="mobile-bar" aria-label="Schnellzugriff">
  <a href="tel:${toTel(phone.number)}">${icon('phone')}<span>Anrufen</span></a>
  <a href="/speisekarte/"${path === '/speisekarte/' ? ' aria-current="page"' : ''}>${icon('bag')}<span>Speisekarte</span></a>
  <a href="${esc(config.mapsDirectionsUrl)}" target="_blank" rel="noopener">${icon('pin')}<span>Route</span></a>
</nav>
<script src="${assets.js}" defer></script>
</body>
</html>
`;
}
