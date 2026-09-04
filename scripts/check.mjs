// Post-build sanity checks: every internal link resolves, every page has title/description/canonical,
// the data files are consistent, and the CMS config references existing files.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
let errors = 0;
const fail = (m) => { console.error('✖', m); errors++; };
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const htmlFiles = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmlFiles.push(p); } };
walk(DIST);

const exists = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return true;
  const p = path.join(DIST, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(DIST, file);
  if (rel.startsWith('admin')) continue;
  if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(`${rel}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${rel}: missing canonical`);
  if (!/<html lang="de"/.test(html)) fail(`${rel}: missing lang="de"`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: expected exactly one <h1>`);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) fail(`${rel}: broken internal link ${m[1]}`);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/') && !exists(u)) fail(`${rel}: broken srcset ${u}`); }
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!new RegExp(`id="${m[1]}"`).test(html)) fail(`${rel}: dangling anchor #${m[1]}`);
}

/* ---- data consistency (what the CMS lets the owner edit) ---- */
const menu = readJSON('src/data/menu.json');
const legend = readJSON('src/data/legend.json');
const content = readJSON('src/data/content.json');
const site = readJSON('src/data/site.json');
const images = new Set(fs.readdirSync('src/assets/images').map((f) => f.replace(/\.[^.]+$/, '')));
const imgOk = (v, where) => { if (v && !images.has(String(v).split('/').pop().replace(/\.[^.]+$/, ''))) fail(`${where}: image "${v}" not found in src/assets/images`); };

const seen = new Set();
for (const c of menu.categories) {
  if (!/^[a-z0-9-]+$/.test(c.id)) fail(`menu: category "${c.title}" has invalid id "${c.id}"`);
  for (const it of c.items) {
    if (seen.has(it.no)) fail(`menu: duplicate number ${it.no}`); seen.add(it.no);
    const own = (it.prices || []).filter((p) => typeof p.price === 'number');
    const table = (c.priceTable || []).filter((p) => typeof p.price === 'number');
    if (!(own.length || table.length)) fail(`menu: dish ${it.no} "${it.name}" has no price`);
    for (const code of it.codes || []) if (!(legend.additives[code] || legend.allergens[code])) fail(`menu: dish ${it.no} uses unknown code "${code}"`);
    for (const t of it.tags || []) if (!['vegetarisch', 'scharf', 'beliebt'].includes(t)) fail(`menu: dish ${it.no} unknown tag "${t}"`);
    imgOk(it.image, `menu: dish ${it.no}`);
  }
}
for (const no of content.home.favorites.dishes || []) if (!seen.has(Number(no))) fail(`content: favourite dish ${no} does not exist in the menu`);
if (!seen.has(Number(content.home.hero.badgeDish))) fail(`content: hero badge dish ${content.home.hero.badgeDish} does not exist`);
imgOk(content.home.hero.image, 'content: hero'); imgOk(content.home.about.image, 'content: about');
for (const t of content.home.teasers || []) imgOk(t.image, `content: teaser "${t.title}"`);
for (const g of content.home.gallery.images || []) imgOk(g.image, 'content: gallery');
for (const k of ['team', 'kitchen', 'bubbleTea']) imgOk(content.about[k].image, `content: about.${k}`);
imgOk(content.about.hero.image, 'content: about.hero');
for (const g of content.about.catering.images || []) imgOk(g.image, 'content: catering');
if (!site.phones?.length) fail('site: at least one phone number is required');
for (const k of ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']) {
  for (const r of site.hours.days[k]?.ranges || []) if (!/^\d{2}:\d{2}$/.test(r.from) || !/^\d{2}:\d{2}$/.test(r.to)) fail(`site: hours ${k} has an invalid time (${r.from}–${r.to})`);
}

/* ---- CMS config references ---- */
const cms = fs.readFileSync('public/admin/config.yml', 'utf8');
for (const m of cms.matchAll(/^\s+file:\s*(\S+)/gm)) if (!fs.existsSync(m[1].replace(/^\//, ''))) fail(`admin/config.yml: file ${m[1]} does not exist`);
if (/REPLACE-ME/.test(cms)) console.warn('⚠ admin/config.yml: base_url still contains the placeholder – CMS login will not work until the authenticator URL is set (docs/CMS-EINRICHTUNG.md)');

for (const f of ['sitemap.xml', 'robots.txt', 'site.webmanifest', 'og-image.jpg', '404.html', '.nojekyll', 'admin/index.html', 'admin/config.yml']) if (!fs.existsSync(path.join(DIST, f))) fail(`missing ${f}`);

console.log(errors ? `${errors} problem(s)` : `✔ checks passed (${htmlFiles.length} pages, ${seen.size} dishes)`);
process.exit(errors ? 1 : 0);
