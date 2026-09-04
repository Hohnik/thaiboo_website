import { icon } from '../lib/html.js';
export default {
  path: '/404/',
  order: 99,
  sitemap: false,
  title: 'Seite nicht gefunden',
  description: 'Diese Seite gibt es leider nicht.',
  render() {
    return `<section class="page-head"><div class="container">
      <p class="eyebrow">Fehler 404</p>
      <h1>Diese Seite gibt es leider nicht.</h1>
      <p class="lead">Vielleicht hat sich ein Tippfehler eingeschlichen. Hier geht es weiter:</p>
      <div class="btn-group" style="margin-top:1.5rem">
        <a class="btn btn-primary" href="/">Zur Startseite ${icon('arrow')}</a>
        <a class="btn btn-secondary" href="/speisekarte/">Speisekarte</a>
        <a class="btn btn-secondary" href="/kontakt/">Kontakt</a>
      </div>
    </div></section>`;
  },
};
