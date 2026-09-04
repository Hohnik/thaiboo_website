// Small HTML helpers shared by the build and the page templates.

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** 8.5 -> "8,50 €" */
export const fmtPrice = (n) =>
  `${Number(n).toFixed(2).replace('.', ',')} €`;

export const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');

/** Inline SVG icon from the sprite that the layout injects. */
export const icon = (name, cls = '') =>
  `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

/**
 * Responsive <picture>. `manifest` is produced by build.mjs (see images()).
 * sizes: the CSS `sizes` attribute, defaults to full width on mobile / half on desktop.
 */
export function picture(manifest, name, opts = {}) {
  const m = manifest[name];
  if (!m) throw new Error(`Unknown image "${name}"`);
  const {
    alt = '',
    sizes = '(min-width: 64em) 50vw, 100vw',
    className,
    loading = 'lazy',
    fetchpriority,
    decoding = 'async',
    width,
    height,
    pictureClass,
  } = opts;
  const srcset = (fmt) =>
    m.widths.map((w) => `/assets/img/${name}-${w}.${fmt} ${w}w`).join(', ');
  const largest = m.widths[m.widths.length - 1];
  const fallback = `/assets/img/${name}-${largest}.${m.fallback}`;
  const w = width ?? m.width;
  const h = height ?? Math.round((m.height / m.width) * w);
  return `<picture${pictureClass ? ` class="${esc(pictureClass)}"` : ''}>
<source type="image/avif" srcset="${srcset('avif')}" sizes="${esc(sizes)}">
<source type="image/webp" srcset="${srcset('webp')}" sizes="${esc(sizes)}">
<img src="${fallback}" srcset="${srcset(m.fallback)}" sizes="${esc(sizes)}" width="${w}" height="${h}"${attrs({ alt, class: className, loading, fetchpriority, decoding })}>
</picture>`;
}

/** Turn "11:00" into minutes since midnight. */
export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Compact human hours string, e.g. "Di–So 11–15 & 17–21 Uhr, Mo Ruhetag". */
export function hoursSummary(hours) {
  const open = hours.week.filter((d) => d.ranges.length);
  const closed = hours.week.filter((d) => !d.ranges.length);
  const short = (l) => l.slice(0, 2);
  const r = open[0].ranges.map(([a, b]) => `${a.replace(':00', '')}–${b.replace(':00', '')}`).join(' & ');
  // days are stored Sunday-first; present Tuesday..Sunday if that is the open run
  const order = [2, 3, 4, 5, 6, 0].map((i) => hours.week.find((d) => d.day === i));
  const first = order[0], last = order[order.length - 1];
  return `${short(first.label)}–${short(last.label)} ${r} Uhr` + (closed.length ? `, ${closed.map((d) => short(d.label)).join('/')} Ruhetag` : '');
}

/** Direct URL to the largest fallback rendition (used by the lightbox). */
export function imgUrl(manifest, name, maxW = 1600) {
  const m = manifest[name];
  if (!m) throw new Error(`Unknown image "${name}"`);
  const w = m.widths.filter((x) => x <= maxW).pop() ?? m.widths[0];
  return `/assets/img/${name}-${w}.${m.fallback}`;
}
