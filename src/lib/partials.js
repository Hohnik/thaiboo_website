import { esc, icon, fmtPrice, toTel } from './html.js';
import { statusChip } from './layout.js';

export const TAGS = {
  vegetarisch: { label: 'Vegetarisch möglich', short: 'Vegetarisch', icon: 'leaf', cls: 'tag--veg' },
  scharf: { label: 'Scharf', short: 'Scharf', icon: 'chili', cls: 'tag--hot' },
  beliebt: { label: 'Beliebt', short: 'Beliebt', icon: 'star', cls: 'tag--pop' },
};

export const tag = (t) => TAGS[t] ? `<span class="tag ${TAGS[t].cls}">${icon(TAGS[t].icon)}${esc(TAGS[t].short)}</span>` : '';

const validPrices = (list) => (list || []).filter((p) => p && typeof p.price === 'number');
const hasExtra = (item) => item.extra && item.extra.name && typeof item.extra.price === 'number';

/** Cheapest price of a dish, considering its own prices or the category table. */
export function startingPrice(item, category) {
  const own = validPrices(item.prices);
  const list = own.length ? own : validPrices(category.priceTable);
  if (!list.length) return null;
  return { min: Math.min(...list.map((p) => p.price)), multiple: list.length > 1 };
}

export function findDish(menu, no) {
  for (const c of menu.categories) for (const it of c.items) if (Number(it.no) === Number(no)) return { item: it, category: c };
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
  const own = validPrices(item.prices);
  const sp = startingPrice(item, category);
  const tags = item.tags || [];
  const icons = ctx.legend.proteinIcons;
  let price = '';
  if (own.length === 1) price = `<div class="dish-price">${fmtPrice(own[0].price)}</div>`;
  else if (sp) price = `<div class="dish-price">ab ${fmtPrice(sp.min)}<small>nach Wahl</small></div>`;
  const priceList = own.length > 1
    ? `<ul class="dish-price-list" aria-label="Preise nach Wahl">${own.map((p) => `<li>${icons[p.label] ? icon(icons[p.label]) : ''}${esc(p.label || '')} <strong>${fmtPrice(p.price)}</strong></li>`).join('')}</ul>`
    : '';
  const codes = item.codes?.length ? `<span class="dish-codes"><a href="#legende" title="Zusatzstoffe und Allergene – zur Legende">${item.codes.map(esc).join(', ')}</a></span>` : '';
  const extra = hasExtra(item) ? `<span class="dish-extra">${esc(item.extra.name)} +${fmtPrice(item.extra.price)}</span>` : '';
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

/** items: [{ image, alt }] */
export function gallery(ctx, items, { wideFirst = false } = {}) {
  return `<div class="gallery">${items.filter((g) => g && g.image).map((g, i) => `<button type="button" class="gallery-item${wideFirst && i === 0 ? ' gallery-item--wide' : ''}" data-lightbox="${ctx.imgUrl(g.image)}" data-alt="${esc(g.alt || '')}" aria-label="${esc(g.alt || 'Bild')} – vergrößern">
    ${ctx.img(g.image, { alt: g.alt || '', sizes: '(min-width: 48em) 25vw, 50vw' })}${icon('zoom')}</button>`).join('')}</div>`;
}

export function ctaBand(ctx, { title, text } = {}) {
  const p = ctx.site.phones[0];
  const t = title || ctx.content.home.cta.title;
  const x = text || ctx.content.home.cta.text;
  return `<section class="section section--tight"><div class="container"><div class="cta-band">
    <div><h2>${esc(t)}</h2><p>${esc(x)}</p>${statusChip(ctx.site)}</div>
    <div class="btn-group" style="flex-direction:column;align-items:flex-start">
      <a class="cta-phone" href="tel:${toTel(p.number)}">${icon('phone')} ${esc(String(p.number).replace(/ /g, ' '))}</a>
      <a class="btn btn-light" href="/speisekarte/">Speisekarte&nbsp;ansehen ${icon('arrow')}</a>
    </div>
  </div></div></section>`;
}

/** Legal pages: value or a highlighted placeholder the owner still has to fill in. */
export const fill = (value, placeholder) => value ? esc(value) : `<mark class="placeholder">[${esc(placeholder)}]</mark>`;
