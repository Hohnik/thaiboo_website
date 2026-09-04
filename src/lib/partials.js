import { esc, icon, fmtPrice } from './html.js';
import { statusChip } from './layout.js';

export const TAGS = {
  vegetarisch: { label: 'Vegetarisch möglich', short: 'Vegetarisch', icon: 'leaf', cls: 'tag--veg' },
  scharf: { label: 'Scharf', short: 'Scharf', icon: 'chili', cls: 'tag--hot' },
  beliebt: { label: 'Beliebt', short: 'Beliebt', icon: 'star', cls: 'tag--pop' },
};

export const tag = (t) => TAGS[t] ? `<span class="tag ${TAGS[t].cls}">${icon(TAGS[t].icon)}${esc(TAGS[t].short)}</span>` : '';

/** Cheapest price of a dish, considering its own prices or the category table. */
export function startingPrice(item, category) {
  const list = item.prices?.length ? item.prices : category.priceTable || [];
  const nums = list.map((p) => p.price).filter((n) => typeof n === 'number');
  if (!nums.length) return null;
  return { min: Math.min(...nums), multiple: nums.length > 1 };
}

export function findDish(menu, no) {
  for (const c of menu.categories) for (const it of c.items) if (it.no === no) return { item: it, category: c };
  return null;
}

/** Card used in "Favoriten" on the home page. */
export function dishCard(ctx, no, sizes = '(min-width: 64em) 22vw, (min-width: 40em) 40vw, 80vw') {
  const found = findDish(ctx.menu, no);
  if (!found) return '';
  const { item, category } = found;
  const sp = startingPrice(item, category);
  return `<article class="dish-card">
    ${item.image ? ctx.img(item.image, { alt: `${item.name}${item.sub ? ' – ' + item.sub : ''}`, sizes }) : ''}
    <div class="tags">${(item.tags || []).map(tag).join('')}</div>
    <h3><a href="/speisekarte/#gericht-${item.no}">${esc(item.name)}</a></h3>
    <p class="dish-sub">${esc(item.sub ? `${item.sub} · ` : '')}${esc(item.desc)}</p>
    <p class="dish-price"><span>${sp ? (sp.multiple ? 'ab ' : '') + fmtPrice(sp.min) : ''}</span><small>Nr. ${item.no}</small></p>
  </article>`;
}

/** Row on the menu page. */
export function dishRow(ctx, item, category) {
  const own = item.prices?.length ? item.prices : null;
  const sp = startingPrice(item, category);
  const tags = item.tags || [];
  let price = '';
  if (own && own.length === 1) price = `<div class="dish-price">${fmtPrice(own[0].price)}</div>`;
  else if (own) price = `<div class="dish-price">ab ${fmtPrice(sp.min)}<small>nach Wahl</small></div>`;
  else if (sp) price = `<div class="dish-price">ab ${fmtPrice(sp.min)}<small>nach Wahl</small></div>`;
  const priceList = own && own.length > 1
    ? `<ul class="dish-price-list" aria-label="Preise nach Wahl">${own.map((p) => `<li>${ctx.menu.proteinIcons[p.label] ? icon(ctx.menu.proteinIcons[p.label]) : ''}${esc(p.label)} <strong>${fmtPrice(p.price)}</strong></li>`).join('')}</ul>`
    : '';
  const codes = item.codes?.length ? `<span class="dish-codes"><a href="#legende" title="Zusatzstoffe und Allergene – zur Legende">${item.codes.join(', ')}</a></span>` : '';
  const extra = item.extra ? `<span class="dish-extra">${esc(item.extra.name)} +${fmtPrice(item.extra.price)}</span>` : '';
  const search = [item.no, item.name, item.sub, item.desc, category.title].filter(Boolean).join(' ');
  return `<article class="dish${item.image ? ' dish--image' : ''}" id="gericht-${item.no}" data-tags="${tags.join(' ')}" data-search="${esc(search)}">
    <span class="dish-no"><span class="visually-hidden">Nr. </span>${item.no}</span>
    <div class="dish-main">
      <h3 class="dish-name">${esc(item.name)}${item.sub ? ` <small>· ${esc(item.sub)}</small>` : ''}</h3>
      ${item.desc ? `<p class="dish-desc">${esc(item.desc)}</p>` : ''}
      ${(tags.length || codes || extra) ? `<div class="dish-foot">${tags.map(tag).join('')}${extra}${codes}</div>` : ''}
    </div>
    ${price}
    ${item.image ? `<div class="dish-thumb">${ctx.img(item.image, { alt: '', sizes: '84px' })}</div>` : ''}
    ${priceList}
  </article>`;
}

export function gallery(ctx, items, { wideFirst = false } = {}) {
  return `<div class="gallery">${items.map((g, i) => `<button type="button" class="gallery-item${wideFirst && i === 0 ? ' gallery-item--wide' : ''}" data-lightbox="${ctx.imgUrl(g.name)}" data-alt="${esc(g.alt)}" aria-label="${esc(g.alt)} – vergrößern">
    ${ctx.img(g.name, { alt: g.alt, sizes: '(min-width: 48em) 25vw, 50vw' })}${icon('zoom')}</button>`).join('')}</div>`;
}

export function ctaBand(ctx, { title = 'Hunger? Rufen Sie einfach an.', text = 'Wir bereiten Ihre Bestellung frisch zu – zum Abholen oder für einen Tisch bei uns. Bitte beachten Sie: Wir akzeptieren nur Barzahlung.' } = {}) {
  const p = ctx.site.phones[0];
  return `<section class="section section--tight"><div class="container"><div class="cta-band">
    <div><h2>${esc(title)}</h2><p>${esc(text)}</p>${statusChip(ctx.site)}</div>
    <div class="btn-group" style="flex-direction:column;align-items:flex-start">
      <a class="cta-phone" href="tel:${p.tel}">${icon('phone')} ${esc(p.display)}</a>
      <a class="btn btn-light" href="/speisekarte/">Speisekarte ansehen ${icon('arrow')}</a>
    </div>
  </div></div></section>`;
}
