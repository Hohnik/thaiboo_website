import { esc, icon, fmtPrice } from '../lib/html.js';
import { gallery, ctaBand } from '../lib/partials.js';

export default {
  path: '/ueber-uns/',
  order: 3,
  priority: 0.7,
  title: 'Über uns',
  description: 'Lernen Sie das Team von Thaiboo in Moosburg kennen: authentische Thai-Küche, frische Zutaten, Bubble Tea und Catering für Hochzeiten, Firmenfeiern und private Feste.',
  render(ctx) {
    const { site } = ctx;
    const p = site.phones[0];
    return `
<section class="page-head page-head--image">
  ${ctx.img('gastraum', { alt: '', loading: 'eager', fetchpriority: 'high', sizes: '100vw' })}
  <div class="container">
    <p class="eyebrow">Über uns</p>
    <h1>Ein Stück Thailand in Moosburg</h1>
    <p class="lead">Mit einer Leidenschaft für authentische thailändische Küche bieten wir eine breite Auswahl an Gerichten mit verschiedenen Aromen und Geschmacksrichtungen – in einer warmen, einladenden Atmosphäre.</p>
  </div>
</section>

<section class="section" aria-labelledby="story-title">
  <div class="container split split--media-right">
    ${ctx.img('team', { alt: 'Das Thaiboo-Team: vier Personen in weißen und schwarzen Poloshirts vor einer Bambuswand', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">Unser Team</p>
      <h2 id="story-title">Gemeinsam schaffen wir unvergessliche Geschmackserlebnisse</h2>
      <p>Unser Team besteht aus leidenschaftlichen und erfahrenen Köchen, die jede Speise mit viel Liebe und Hingabe zubereiten. Jede und jeder Einzelne trägt dazu bei, dass Sie als Gast ein unvergessliches kulinarisches Erlebnis genießen können.</p>
      <p>Unsere Köche haben jahrelange Erfahrung in der Zubereitung asiatischer Gerichte und legen Wert auf frische, hochwertige Zutaten. Wir sind stolz auf unser Team – und darauf, dass sich jeder Gast bei uns wie zu Hause fühlt.</p>
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="kitchen-title">
  <div class="container split">
    ${ctx.img('koch', { alt: 'Unser Koch mit verschränkten Armen vor einer Bambuswand', pictureClass: 'portrait', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">Unsere Küche</p>
      <h2 id="kitchen-title">Erleben Sie die Aromen Asiens in jedem Bissen</h2>
      <p>Ob Sie eine Vorliebe für scharfe thailändische Currys haben, wahlweise mit Reis oder verschiedenen Nudeln, oder lieber gebratenes Gemüse mit Garnelen, Rind, knuspriger Ente, Hähnchen oder Tofu genießen – bei uns finden Sie sicher etwas, das Ihrem Geschmack entspricht.</p>
      <ul class="check-list">
        <li>${icon('check')}<span><strong>Frisch &amp; hausgemacht</strong> – jedes Gericht wird nach Bestellung zubereitet</span></li>
        <li>${icon('check')}<span><strong>Ihre Wahl</strong> – vegetarisch, Tofu, Hähnchen, Rind, Ente, Garnelen oder Fisch</span></li>
        <li>${icon('check')}<span><strong>Für unterwegs</strong> – alle Gerichte auch zum Mitnehmen</span></li>
      </ul>
      <a class="btn btn-primary" href="/speisekarte/">Zur Speisekarte ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" id="bubble-tea" aria-labelledby="bt-title">
  <div class="container split split--media-right">
    ${ctx.img('theke-bubble-tea', { alt: 'Unsere Mitarbeiterinnen bereiten Bubble Tea an der Theke zu', sizes: '(min-width: 56em) 45vw, 100vw' })}
    <div class="prose">
      <p class="eyebrow">Bubble Tea</p>
      <h2 id="bt-title">Genießen Sie jetzt auch unsere Bubble Teas</h2>
      <p>Wir bieten Milchtees, Früchtetees und Soda-Mixes – frisch gemixt mit Tapioka-Perlen. Von Mango über Lychee bis Taro Latte: über zwanzig Sorten ab ${fmtPrice(5)}, auch zum Mitnehmen.</p>
      <a class="btn btn-secondary" href="/speisekarte/#bubble-tea">Alle Sorten &amp; Preise ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--dark" id="catering" aria-labelledby="catering-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Catering</p>
      <h2 id="catering-title">Thai-Buffet für Ihre Feier</h2>
      <p>Unser Restaurant bietet nicht nur ein unvergessliches kulinarisches Erlebnis in unseren Räumlichkeiten, sondern auch einen Catering-Service für Ihre besonderen Anlässe.</p>
    </div>
    <div class="split" style="align-items:start">
      <div class="prose">
        <p>Egal, ob Sie eine Hochzeit, eine Firmenveranstaltung oder eine private Feier planen: Unser erfahrenes Catering-Team stellt mit Ihnen das passende Menü für Ihre Gäste zusammen. Wir verwenden nur beste, frische Zutaten und bereiten alle Gerichte mit viel Liebe und Sorgfalt zu.</p>
        <p>Kontaktieren Sie uns, um mehr über unsere Catering-Angebote zu erfahren – wir helfen Ihnen gerne, Ihre Veranstaltung zu einem vollen Erfolg zu machen.</p>
        <div class="btn-group" style="margin-top:1.5rem">
          <a class="btn btn-light" href="tel:${p.tel}">${icon('phone')} ${esc(p.display)}</a>
          <a class="btn btn-outline-light" href="/kontakt/">Kontakt ${icon('arrow')}</a>
        </div>
      </div>
      ${gallery(ctx, [
        { name: 'catering-buffet-1', alt: 'Buffet mit Currys, Wok-Gemüse und Nudeln' },
        { name: 'catering-satay', alt: 'Satay-Spieße mit geschnitzter Tomatenrose' },
        { name: 'catering-fruehlingsrollen', alt: 'Frühlingsrollen und Dips am Buffet' },
        { name: 'catering-curry', alt: 'Rotes Curry und Wok-Gemüse in Warmhaltebehältern' },
      ])}
    </div>
  </div>
</section>

${ctaBand(ctx)}
`;
  },
};
