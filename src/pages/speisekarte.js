import { esc, icon, fmtPrice, toTel } from '../lib/html.js';
import { statusChip } from '../lib/layout.js';
import { dishRow, ctaBand, TAGS } from '../lib/partials.js';

export default {
  path: '/speisekarte/',
  order: 2,
  priority: 0.9,
  changefreq: 'weekly',
  title: 'Speisekarte',
  description: 'Speisekarte Thaiboo Moosburg: Vorspeisen, Suppen, Thai-Currys, Nudel- und Wok-Gerichte, Salate, Nachtisch, Bubble Tea und Getränke – mit allen Preisen. Vegetarisch, Tofu, Hähnchen, Rind, Ente, Garnelen oder Fisch.',
  render(ctx) {
    const { menu, drinks, site, legend, content } = ctx;
    const c = content.menu;
    const cats = menu.categories;
    const navItems = [...cats.map((k) => ({ id: k.id, title: k.title })), { id: 'extras', title: 'Extras' }, { id: 'bubble-tea', title: 'Bubble Tea' }, { id: 'getraenke', title: 'Getränke' }];
    const priceTable = (k) => (k.priceTable || []).some((p) => typeof p.price === 'number')
      ? `<div><div class="price-table-label">Preis nach Hauptzutat</div><ul class="price-table">${k.priceTable.filter((p) => typeof p.price === 'number').map((p) => `<li>${legend.proteinIcons[p.label] ? icon(legend.proteinIcons[p.label]) : ''}${esc(p.label || '')} <strong>${fmtPrice(p.price)}</strong></li>`).join('')}</ul></div>`
      : '';

    const categories = cats.map((k) => `
<section class="menu-category" id="${esc(k.id)}" aria-labelledby="${esc(k.id)}-title">
  <div class="menu-category-head">
    <div><h2 id="${esc(k.id)}-title">${esc(k.title)}</h2>${k.intro ? `<p>${esc(k.intro)}</p>` : ''}</div>
    ${priceTable(k)}
  </div>
  <div class="dish-list">${(k.items || []).map((it) => dishRow(ctx, it, k)).join('')}</div>
</section>`).join('');

    const bt = drinks.bubbleTea;
    const bubble = `
<section class="menu-category" id="bubble-tea" aria-labelledby="bubble-tea-title">
  <div class="menu-category-head"><div><h2 id="bubble-tea-title">${esc(bt.title)}</h2>${bt.intro ? `<p>${esc(bt.intro)}</p>` : ''}</div></div>
  <div class="drinks-grid drinks-grid--3">
    ${(bt.groups || []).map((g) => `<div class="drinks-group"><h3>${esc(g.title)} <span class="price">${fmtPrice(g.price)}</span></h3>${g.note ? `<p>${esc(g.note)}</p>` : ''}<ul class="flavour-list">${(g.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
  </div>
</section>`;

    const dr = drinks.drinks;
    const drinkSections = `
<section class="menu-category" id="getraenke" aria-labelledby="getraenke-title">
  <div class="menu-category-head"><div><h2 id="getraenke-title">${esc(dr.title)}</h2></div></div>
  <div class="drinks-grid">
    ${(dr.groups || []).map((g) => `<div class="drinks-group"><h3>${esc(g.title)}</h3><ul class="drinks-list">${(g.items || []).map((i) => `<li><span>${esc(i.name)}${i.size ? ` <span class="size">${esc(i.size)}</span>` : ''}</span><strong>${fmtPrice(i.price)}</strong></li>`).join('')}</ul></div>`).join('')}
  </div>
</section>`;

    const extras = `
<section class="menu-category" id="extras" aria-labelledby="extras-title">
  <div class="menu-category-head"><div><h2 id="extras-title">${esc(menu.extras.title)}</h2>${menu.extras.intro ? `<p>${esc(menu.extras.intro)}</p>` : ''}</div></div>
  <ul class="extras-grid">${(menu.extras.items || []).map((e) => `<li><span>${esc(e.name)}</span><strong>+ ${fmtPrice(e.price)}</strong></li>`).join('')}</ul>
</section>`;

    const legendSection = `
<section class="menu-category" id="legende" aria-labelledby="legende-title">
  <div class="menu-category-head"><div><h2 id="legende-title">Zusatzstoffe &amp; Allergene</h2><p>${esc(c.legendIntro)}</p></div></div>
  <div class="legend">
    <div><h3 class="small" style="font-family:var(--font-body);text-transform:uppercase;letter-spacing:.08em">Zusatzstoffe</h3><dl>${Object.entries(legend.additives).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    <div><h3 class="small" style="font-family:var(--font-body);text-transform:uppercase;letter-spacing:.08em">Allergene</h3><dl>${Object.entries(legend.allergens).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
  </div>
</section>`;

    return `
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Speisekarte</p>
    <h1>${esc(c.title)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="btn-group" style="margin-top:1.25rem;align-items:center">
      ${statusChip(site)}
      <a class="btn btn-primary btn-sm" href="tel:${toTel(site.phones[0].number)}">${icon('phone')} ${esc(String(site.phones[0].number).replace(/ /g, ' '))}</a>
    </div>
  </div>
</section>

<nav class="menu-nav" aria-label="Kategorien" data-menu-nav>
  <div class="container menu-nav-inner">
    ${navItems.map((n) => `<a href="#${esc(n.id)}">${esc(n.title)}</a>`).join('')}
  </div>
</nav>

<div class="container" style="padding-top:clamp(1.5rem,4vw,2.5rem)">
  <div class="menu-tools" role="search">
    <label class="search"><span class="visually-hidden">Gericht suchen</span>${icon('search')}<input type="search" data-menu-search placeholder="Gericht oder Nummer suchen …" autocomplete="off" enterkeyhint="search"></label>
    <div class="filter-group" role="group" aria-label="Filter">
      ${Object.entries(TAGS).map(([k, t]) => `<button type="button" class="filter" data-filter="${k}" aria-pressed="false">${icon(t.icon)}${esc(t.label)}</button>`).join('')}
    </div>
    <p class="small muted" data-menu-count aria-live="polite" style="margin:0"></p>
  </div>
  <p class="notice notice--info" style="margin-bottom:clamp(1.5rem,4vw,2.5rem)">${icon('info')}<span><strong>Gut zu wissen:</strong> ${esc(c.notice)}</span></p>

  <div data-menu-empty hidden class="menu-empty" style="margin-bottom:2rem"><p><strong>Kein Gericht gefunden.</strong> Versuchen Sie einen anderen Begriff oder entfernen Sie die Filter.</p><button type="button" class="btn btn-secondary btn-sm" data-menu-reset>Filter zurücksetzen</button></div>

  ${categories}
  ${extras}
  ${bubble}
  ${drinkSections}
  ${legendSection}
</div>

${ctaBand(ctx, c.cta)}
`;
  },
};
