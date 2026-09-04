/* Thaiboo – progressive enhancement. Everything works without this file. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- sticky header shadow ---------- */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  const toggle = $('[data-nav-toggle]');
  const nav = $('#nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      toggle.querySelector('.visually-hidden').textContent = open ? 'Menü schließen' : 'Menü öffnen';
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
  }

  /* ---------- opening status (Europe/Berlin) ---------- */
  const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const berlinNow = () => {
    const parts = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const wd = { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 }[get('weekday')?.replace('.', '')] ?? new Date().getDay();
    return { day: wd, minutes: Number(get('hour')) % 24 * 60 + Number(get('minute')) };
  };
  const status = (week) => {
    const { day, minutes } = berlinNow();
    const byDay = (d) => week.find((w) => w.day === d) || { ranges: [] };
    const today = byDay(day);
    for (const [o, c] of today.ranges) {
      if (minutes >= toMin(o) && minutes < toMin(c)) {
        const left = toMin(c) - minutes;
        return { state: left <= 30 ? 'soon' : 'open', text: left <= 30 ? `Schließt in ${left} Min. (${c} Uhr)` : `Jetzt geöffnet · bis ${c} Uhr` };
      }
    }
    const next = today.ranges.find(([o]) => minutes < toMin(o));
    if (next) {
      const until = toMin(next[0]) - minutes;
      return { state: until <= 60 ? 'soon' : 'closed', text: until <= 60 ? `Öffnet in ${until} Min. (${next[0]} Uhr)` : `Geschlossen · öffnet heute um ${next[0]} Uhr` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7; const w = byDay(d);
      if (w.ranges.length) return { state: 'closed', text: `Geschlossen · öffnet ${i === 1 ? 'morgen' : DAYS[d]} um ${w.ranges[0][0]} Uhr` };
    }
    return { state: 'closed', text: 'Geschlossen' };
  };
  let week = [];
  try { week = JSON.parse(document.body.dataset.hours || '[]'); } catch { week = []; }
  const applyStatus = () => {
    if (!week.length) return;
    const s = status(week);
    $$('[data-status]').forEach((el) => {
      el.classList.remove('is-open', 'is-closed', 'is-soon');
      el.classList.add(`is-${s.state}`);
      const t = el.querySelector('[data-status-text]'); if (t) t.textContent = s.text;
    });
    const today = berlinNow().day;
    $$('.hours-table tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === today));
  };
  applyStatus(); setInterval(applyStatus, 60 * 1000);
  const y = $('[data-year]'); if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- menu: category scroll-spy ---------- */
  const menuNav = $('[data-menu-nav]');
  if (menuNav) {
    const links = $$('a', menuNav);
    const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    const strip = menuNav.querySelector('.menu-nav-inner') || menuNav;
    const setActive = (id) => links.forEach((a) => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', on);
      // scroll the chip strip horizontally only – never the page (scrollIntoView would also scroll vertically)
      if (on) strip.scrollTo({ left: a.offsetLeft - strip.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    });
    if ('IntersectionObserver' in window) {
      const visible = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Infinity));
        let best = null, bestTop = Infinity;
        visible.forEach((top, id) => { if (top < bestTop) { bestTop = top; best = id; } });
        if (best) setActive(best);
      }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, .1] });
      sections.forEach((s) => io.observe(s));
    }
  }

  /* ---------- menu: search + filters ---------- */
  const search = $('[data-menu-search]');
  const filters = $$('[data-filter]');
  const dishes = $$('.dish');
  if (dishes.length && (search || filters.length)) {
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const empty = $('[data-menu-empty]');
    const count = $('[data-menu-count]');
    const apply = () => {
      const q = norm(search?.value.trim() || '');
      const active = filters.filter((f) => f.getAttribute('aria-pressed') === 'true').map((f) => f.dataset.filter);
      let shown = 0;
      dishes.forEach((d) => {
        const hay = norm(d.dataset.search || d.textContent);
        const tags = (d.dataset.tags || '').split(' ');
        const ok = (!q || hay.includes(q)) && active.every((t) => tags.includes(t));
        d.classList.toggle('is-hidden', !ok); if (ok) shown++;
      });
      $$('.menu-category').forEach((c) => c.classList.toggle('is-empty', !$$('.dish:not(.is-hidden)', c).length));
      if (empty) empty.hidden = shown > 0;
      if (count) count.textContent = (q || active.length) ? `${shown} ${shown === 1 ? 'Gericht' : 'Gerichte'} gefunden` : '';
    };
    search?.addEventListener('input', apply);
    filters.forEach((f) => f.addEventListener('click', () => { f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true')); apply(); }));
    const reset = $('[data-menu-reset]');
    reset?.addEventListener('click', () => { if (search) search.value = ''; filters.forEach((f) => f.setAttribute('aria-pressed', 'false')); apply(); search?.focus(); });
  }

  /* ---------- gallery lightbox ---------- */
  const galleryItems = $$('[data-lightbox]');
  if (galleryItems.length && typeof HTMLDialogElement === 'function') {
    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Bildansicht');
    dlg.innerHTML = `<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>
      <button type="button" class="lightbox-btn lightbox-prev" data-prev aria-label="Vorheriges Bild"><svg class="icon"><use href="#i-chevronLeft"></use></svg></button>
      <button type="button" class="lightbox-btn lightbox-next" data-next aria-label="Nächstes Bild"><svg class="icon"><use href="#i-chevron"></use></svg></button>
      <button type="button" class="lightbox-btn lightbox-close" data-close aria-label="Schließen"><svg class="icon"><use href="#i-close"></use></svg></button>`;
    document.body.appendChild(dlg);
    const img = $('img', dlg), cap = $('figcaption', dlg);
    let idx = 0;
    const show = (i) => {
      idx = (i + galleryItems.length) % galleryItems.length;
      const it = galleryItems[idx];
      img.src = it.dataset.lightbox; img.alt = it.dataset.alt || ''; cap.textContent = it.dataset.caption || it.dataset.alt || '';
    };
    galleryItems.forEach((it, i) => it.addEventListener('click', (e) => { e.preventDefault(); show(i); dlg.showModal(); $('[data-close]', dlg).focus(); }));
    $('[data-prev]', dlg).addEventListener('click', () => show(idx - 1));
    $('[data-next]', dlg).addEventListener('click', () => show(idx + 1));
    $('[data-close]', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    let x0 = null;
    dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* ---------- map consent (no third-party requests before consent) ---------- */
  const mapBox = $('[data-map]');
  if (mapBox) {
    const load = () => {
      const f = document.createElement('iframe');
      f.src = mapBox.dataset.map; f.title = 'Google Maps: Standort Thaiboo Moosburg'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      mapBox.appendChild(f); $('[data-map-consent]', mapBox)?.remove();
      try { localStorage.setItem('thaiboo-map-consent', '1'); } catch {}
    };
    $('[data-map-load]', mapBox)?.addEventListener('click', load);
    try { if (localStorage.getItem('thaiboo-map-consent') === '1') load(); } catch {}
  }
})();
