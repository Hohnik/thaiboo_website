// One SVG sprite, injected once per page. Icons are 24x24, stroke based (Lucide-style), drawn by hand.
const paths = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
  chili: '<path d="M8 4c2 0 3 1 3 3 0 5-3 10-8 13 5-1 9-5 11-9 1-2 2-3 4-4 2-1 3-2 3-4h-3c-2 0-3 1-4 2-1-1-2-1-3-1H8z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9-1 10-5 16-9 16z"/><path d="M4 20c4-6 8-9 12-11"/>',
  star: '<path d="m12 3 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.4 6.3 20.5l1.2-6.4L2.8 9.7l6.4-.8z"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  chicken: '<path d="M14 4a3 3 0 0 1 3 3v1l3 1-3 2v1a5 5 0 0 1-5 5H9l-3 4-1-1 2-4-3-1 3-3V9a5 5 0 0 1 5-5z"/>',
  beef: '<path d="M4 9c0-3 4-5 8-5s8 2 8 5v3c0 4-3 7-8 7s-8-3-8-7z"/><path d="M9 11h.01M15 11h.01M10 15c1 1 3 1 4 0"/>',
  shrimp: '<path d="M6 8c0-3 2-5 6-5 5 0 8 3 8 8 0 4-3 7-7 7h-2"/><path d="M6 8h9c1 0 2 1 2 2s-1 2-2 2H9"/><path d="M11 12c-3 0-5 2-6 5l3 3"/>',
  fish: '<path d="M2 12c3-4 7-6 11-6 4 0 7 2 9 6-2 4-5 6-9 6-4 0-8-2-11-6z"/><path d="M13 6v12M16 11h.01"/>',
  duck: '<path d="M9 6a3 3 0 0 1 6 0v2l3 1-3 1v2c3 0 5 2 5 4H6c-3 0-4-2-4-4h7z"/>',
  tofu: '<path d="M4 8 12 4l8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  cup: '<path d="M6 3h12l-1.5 16a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z"/><path d="M5 8h14"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="16" r="1"/>',
  party: '<path d="M4 20 8 8l8 8z"/><path d="m14 4 1 2M18 8l2 1M16 2v1M20 4l-1 1"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
};

export const sprite = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">` +
  Object.entries(paths)
    .map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</symbol>`)
    .join('') +
  `</svg>`;
