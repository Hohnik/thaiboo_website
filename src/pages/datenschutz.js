import { esc } from '../lib/html.js';
import { fill } from '../lib/partials.js';

export default {
  path: '/datenschutz/',
  order: 11,
  priority: 0.2,
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der Website von Thaiboo Moosburg.',
  render(ctx) {
    const { site, legal } = ctx;
    return `
<section class="page-head"><div class="container"><p class="eyebrow">Rechtliches</p><h1>Datenschutz&shy;erklärung</h1><p class="lead">Kurz gesagt: Diese Website setzt keine Cookies, nutzt keine Tracking-Dienste und lädt externe Inhalte (Google Maps) erst nach Ihrem Klick.</p></div></section>
<section class="section section--tight" style="padding-top:0"><div class="container prose">
  <h2>1. Verantwortlicher</h2>
  <p>${fill(legal.ownerName, 'Vor- und Nachname')}<br>${esc(site.legalName)}<br>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}<br>Telefon: ${esc(String(site.phones[0].number).replace(/ /g, ' '))}<br>E-Mail: ${legal.email ? `<a href="mailto:${esc(legal.email)}">${esc(legal.email)}</a>` : fill('', 'E-Mail-Adresse')}</p>

  <h2>2. Hosting und Server-Logfiles</h2>
  <p>Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter automatisch Informationen, die Ihr Browser übermittelt (sogenannte Server-Logfiles): IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene Datenmenge, Browsertyp und Betriebssystem sowie die zuvor besuchte Seite (Referrer). Diese Daten sind technisch erforderlich, um die Website auszuliefern und die Sicherheit der Systeme zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Die Logfiles werden nach ${fill(legal.logRetention, 'Speicherdauer, z. B. 7 Tagen')} gelöscht.</p>
  <p>Hosting-Anbieter: ${fill(legal.hoster, 'Name und Anschrift des Hosters')}. Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.</p>

  <h2>3. Cookies und lokale Speicherung</h2>
  <p>Diese Website setzt keine Cookies und verwendet keine Analyse- oder Werbedienste. Lediglich wenn Sie auf der Kontaktseite die Karte laden, merkt sich Ihr Browser diese Entscheidung in seinem lokalen Speicher (localStorage, Eintrag „thaiboo-map-consent“), damit Sie die Karte beim nächsten Besuch nicht erneut freigeben müssen. Dieser Eintrag enthält keine personenbezogenen Daten, wird nicht an uns übertragen und kann jederzeit über die Browsereinstellungen gelöscht werden (§ 25 Abs. 2 Nr. 2 TDDDG).</p>

  <h2>4. Schriftarten</h2>
  <p>Die verwendeten Schriftarten werden von unserem eigenen Server geladen. Es findet keine Verbindung zu Servern von Google oder anderen Anbietern statt.</p>

  <h2 id="maps">5. Google Maps (nur nach Ihrer Zustimmung)</h2>
  <p>Auf der Kontaktseite bieten wir eine Karte von Google Maps an. Die Karte wird erst geladen, wenn Sie auf „Google Maps laden“ klicken. Erst dann werden Daten (u. a. Ihre IP-Adresse) an Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, übertragen; eine Weiterverarbeitung in den USA ist möglich. Google ist nach dem EU-US Data Privacy Framework zertifiziert. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können die Einwilligung jederzeit widerrufen, indem Sie den localStorage-Eintrag in Ihrem Browser löschen. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a>.</p>
  <p>Die Links „Route planen“ und „In Google Maps öffnen“ führen auf eine externe Google-Seite; auch hierbei gelten die Datenschutzbestimmungen von Google.</p>

  <h2>6. Kontaktaufnahme</h2>
  <p>Wenn Sie uns telefonisch kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Daten (z. B. Name, Telefonnummer, Bestellung) ausschließlich zur Bearbeitung Ihres Anliegens (Art. 6 Abs. 1 lit. b DSGVO). Bestelldaten werden nach Abwicklung gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</p>

  <h2>7. Ihre Rechte</h2>
  <p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Wenden Sie sich dazu an die oben genannten Kontaktdaten.</p>
  <p>Außerdem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, <a href="https://www.lda.bayern.de" target="_blank" rel="noopener">www.lda.bayern.de</a>.</p>

  <h2>8. Aktualität</h2>
  <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand ${fill(legal.updated, 'Monat Jahr')}. Wir passen sie an, wenn sich unsere Website oder die Rechtslage ändert.</p>
</div></section>`;
  },
};
