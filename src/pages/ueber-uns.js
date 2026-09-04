import { esc, icon, toTel } from '../lib/html.js';
import { gallery, ctaBand } from '../lib/partials.js';

export default {
  path: '/ueber-uns/',
  order: 3,
  priority: 0.7,
  title: 'Über uns',
  description: 'Lernen Sie das Team von Thaiboo in Moosburg kennen: authentische Thai-Küche, frische Zutaten, Bubble Tea und Catering für Hochzeiten, Firmenfeiern und private Feste.',
  render(ctx) {
    const { site, content } = ctx;
    const c = content.about;
    const p = site.phones[0];
    return `
<section class="page-head page-head--image">
  ${ctx.img(c.hero.image, { alt: '', loading: 'eager', fetchpriority: 'high', sizes: '100vw' })}
  <div class="container">
    <p class="eyebrow">Über uns</p>
    <h1>${esc(c.hero.title)}</h1>
    <p class="lead">${esc(c.hero.lead)}</p>
  </div>
</section>

<section class="section" aria-labelledby="story-title">
  <div class="container split split--media-right">
    ${ctx.img(c.team.image, { alt: c.team.imageAlt || '', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">${esc(c.team.eyebrow)}</p>
      <h2 id="story-title">${esc(c.team.title)}</h2>
      ${(c.team.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join('')}
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="kitchen-title">
  <div class="container split">
    ${ctx.img(c.kitchen.image, { alt: c.kitchen.imageAlt || '', pictureClass: 'portrait', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">${esc(c.kitchen.eyebrow)}</p>
      <h2 id="kitchen-title">${esc(c.kitchen.title)}</h2>
      <p>${esc(c.kitchen.text)}</p>
      <ul class="check-list">
        ${(c.kitchen.bullets || []).map((b) => `<li>${icon('check')}<span><strong>${esc(b.title)}</strong> – ${esc(b.text)}</span></li>`).join('')}
      </ul>
      <a class="btn btn-primary" href="/speisekarte/">Zur Speisekarte ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" id="bubble-tea" aria-labelledby="bt-title">
  <div class="container split split--media-right">
    ${ctx.img(c.bubbleTea.image, { alt: c.bubbleTea.imageAlt || '', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">${esc(c.bubbleTea.eyebrow)}</p>
      <h2 id="bt-title">${esc(c.bubbleTea.title)}</h2>
      <p>${esc(c.bubbleTea.text)}</p>
      <a class="btn btn-secondary" href="/speisekarte/#bubble-tea">Alle Sorten &amp; Preise ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--dark" id="catering" aria-labelledby="catering-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${esc(c.catering.eyebrow)}</p>
      <h2 id="catering-title">${esc(c.catering.title)}</h2>
      <p>${esc(c.catering.intro)}</p>
    </div>
    <div class="split" style="align-items:start">
      <div class="prose">
        ${(c.catering.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join('')}
        <div class="btn-group" style="margin-top:1.5rem">
          <a class="btn btn-light" href="tel:${toTel(p.number)}">${icon('phone')} ${esc(String(p.number).replace(/ /g, ' '))}</a>
          <a class="btn btn-outline-light" href="/kontakt/">Kontakt ${icon('arrow')}</a>
        </div>
      </div>
      ${gallery(ctx, c.catering.images || [])}
    </div>
  </div>
</section>

${ctaBand(ctx)}
`;
  },
};
