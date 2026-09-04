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
export function picture(manifest, nameOrPath, opts = {}) {
  const name = imgName(nameOrPath);
  const m = manifest[name];
  if (!m) throw new Error(`Unknown image "${nameOrPath}" – expected a file in src/assets/images/`);
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

/** Day keys as stored in site.json, indexed by JS getDay() (0 = Sunday). */
export const DAY_KEYS = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];
export const DAY_LABELS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

/** site.json hours -> [{ day, label, ranges: [[from, to], ...] }] (Sunday first, as the client script expects). */
export function weekFromSite(site) {
  return DAY_KEYS.map((k, i) => ({
    day: i,
    label: DAY_LABELS[i],
    ranges: (site.hours?.days?.[k]?.ranges || []).filter((r) => r && r.from && r.to).map((r) => [r.from, r.to]),
  }));
}

/** Compact human hours string, e.g. "Di–So 11–15 & 17–21 Uhr, Mo Ruhetag". */
export function hoursSummary(site) {
  const week = weekFromSite(site);
  const order = [1, 2, 3, 4, 5, 6, 0].map((i) => week[i]);
  const open = order.filter((d) => d.ranges.length);
  const closed = order.filter((d) => !d.ranges.length);
  if (!open.length) return 'Derzeit geschlossen';
  const short = (l) => l.slice(0, 2);
  const fmt = (t) => t.replace(/:00$/, '');
  const r = open[0].ranges.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(' & ');
  const first = open[0], last = open[open.length - 1];
  const days = first === last ? short(first.label) : `${short(first.label)}–${short(last.label)}`;
  return `${days} ${r} Uhr` + (closed.length ? `, ${closed.map((d) => short(d.label)).join('/')} Ruhetag` : '');
}

/** "08761 726 65 72" -> "+4987617266572" for tel: links. */
export function toTel(display) {
  const digits = String(display || '').replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (digits.startsWith('0')) return '+49' + digits.slice(1);
  return digits;
}

/** "/assets/images/gericht-pad-thai.png" or "gericht-pad-thai" -> "gericht-pad-thai" (manifest key). */
export const imgName = (v) => (v ? String(v).split('/').pop().replace(/\.[^.]+$/, '') : '');

/** Direct URL to the largest fallback rendition (used by the lightbox). */
export function imgUrl(manifest, name, maxW = 1600) {
  const m = manifest[imgName(name)];
  if (!m) throw new Error(`Unknown image "${name}"`);
  const w = m.widths.filter((x) => x <= maxW).pop() ?? m.widths[0];
  return `/assets/img/${imgName(name)}-${w}.${m.fallback}`;
}
