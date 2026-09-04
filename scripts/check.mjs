// Post-build sanity checks: every internal link resolves, every page has title/description/canonical,
// and the menu data is consistent (numbers unique, every priced dish has a price source).
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
let errors = 0;
const fail = (m) => { console.error('✖', m); errors++; };

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
  if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(`${rel}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${rel}: missing canonical`);
  if (!/<html lang="de"/.test(html)) fail(`${rel}: missing lang="de"`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: expected exactly one <h1>`);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!exists(m[1])) fail(`${rel}: broken internal link ${m[1]}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/') && !exists(u)) fail(`${rel}: broken srcset ${u}`); }
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!new RegExp(`id="${m[1]}"`).test(html)) fail(`${rel}: dangling anchor #${m[1]}`);
  }
}

const menu = JSON.parse(fs.readFileSync('src/data/menu.json', 'utf8'));
const seen = new Set();
for (const c of menu.categories) for (const it of c.items) {
  if (seen.has(it.no)) fail(`menu: duplicate number ${it.no}`); seen.add(it.no);
  if (!(it.prices?.length || c.priceTable?.length)) fail(`menu: dish ${it.no} "${it.name}" has no price`);
  for (const code of it.codes || []) if (!(menu.legend.additives[code] || menu.legend.allergens[code])) fail(`menu: dish ${it.no} uses unknown code "${code}"`);
  for (const t of it.tags || []) if (!['vegetarisch', 'scharf', 'beliebt'].includes(t)) fail(`menu: dish ${it.no} unknown tag "${t}"`);
}
for (const f of ['sitemap.xml', 'robots.txt', 'site.webmanifest', 'og-image.jpg', '404.html']) if (!fs.existsSync(path.join(DIST, f))) fail(`missing ${f}`);

console.log(errors ? `${errors} problem(s)` : `✔ checks passed (${htmlFiles.length} pages, ${seen.size} dishes)`);
process.exit(errors ? 1 : 0);
