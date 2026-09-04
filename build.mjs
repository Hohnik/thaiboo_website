#!/usr/bin/env node
// Static site builder for thaiboo-moosburg.de
//   node build.mjs            -> builds into dist/
//   node build.mjs --serve    -> builds and serves dist/ on http://localhost:4321
//   node build.mjs --watch    -> rebuilds on changes in src/ and public/
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, '.cache', 'img');
const args = new Set(process.argv.slice(2));

const WIDTHS = [320, 480, 640, 960, 1280, 1600];
const readJSON = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }
async function copyDir(from, to) {
  if (!fss.existsSync(from)) return;
  await fs.cp(from, to, { recursive: true });
}
const hashOf = (buf) => crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);

/* ---------- images ---------- */
async function buildImages() {
  const sharp = (await import('sharp')).default;
  const srcDir = path.join(SRC, 'assets', 'images');
  const outDir = path.join(DIST, 'assets', 'img');
  await ensureDir(outDir); await ensureDir(CACHE);
  const files = (await fs.readdir(srcDir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  const manifest = {};
  const jobs = [];
  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, '');
    const src = path.join(srcDir, file);
    const stat = await fs.stat(src);
    const meta = await sharp(src).metadata();
    const fallback = meta.hasAlpha ? 'png' : 'jpg';
    const widths = WIDTHS.filter((w) => w < meta.width);
    if (!widths.includes(meta.width) && meta.width <= 1600) widths.push(meta.width);
    if (!widths.length) widths.push(Math.min(meta.width, 1600));
    manifest[name] = { width: meta.width, height: meta.height, widths, fallback };
    for (const w of widths) {
      for (const fmt of ['avif', 'webp', fallback]) {
        const out = path.join(outDir, `${name}-${w}.${fmt}`);
        const cacheKey = `${name}-${w}.${fmt}-${stat.size}-${Math.floor(stat.mtimeMs)}`;
        const cached = path.join(CACHE, cacheKey);
        jobs.push(async () => {
          if (fss.existsSync(cached)) { await fs.copyFile(cached, out); return; }
          let p = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
          if (fmt === 'avif') p = p.avif({ quality: 55, effort: 4 });
          else if (fmt === 'webp') p = p.webp({ quality: 78 });
          else if (fmt === 'png') p = p.png({ compressionLevel: 9, palette: false });
          else p = p.jpeg({ quality: 80, mozjpeg: true });
          await p.toFile(out);
          await fs.copyFile(out, cached);
        });
      }
    }
  }
  // run with limited concurrency
  const limit = 6; let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => { while (i < jobs.length) await jobs[i++](); }));

  // favicons, touch icon, og image
  const logo = path.join(srcDir, 'logo.png');
  for (const s of [32, 192, 512]) {
    await sharp(logo).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(DIST, `icon-${s}.png`));
  }
  await sharp(logo).resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(path.join(DIST, 'logo-96.png'));
  await sharp(logo).resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 85 }).toFile(path.join(DIST, 'logo-96.webp'));
  await sharp(logo).resize(180, 180, { fit: 'contain', background: '#fbf6ee' }).png().toFile(path.join(DIST, 'apple-touch-icon.png'));
  await sharp(logo).resize(88, 88, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(path.join(DIST, 'logo-88.png'));
  await sharp(logo).resize(88, 88, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 85 }).toFile(path.join(DIST, 'logo-88.webp'));
  await sharp(path.join(srcDir, 'hero-gericht.jpg')).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile(path.join(DIST, 'og-image.jpg'));
  return manifest;
}

/* ---------- pages ---------- */
async function buildPages(manifest, assets) {
  const { layout } = await import(pathToFileURL(path.join(SRC, 'lib', 'layout.js')).href + `?t=${Date.now()}`);
  const { picture, imgUrl } = await import(pathToFileURL(path.join(SRC, 'lib', 'html.js')).href + `?t=${Date.now()}`);
  const data = {};
  for (const f of ['site', 'config', 'menu', 'drinks', 'legend', 'content', 'legal']) data[f] = await readJSON(path.join(SRC, 'data', `${f}.json`));
  const ctx = { ...data, assets, manifest, img: (name, opts) => picture(manifest, name, opts), imgUrl: (name, w) => imgUrl(manifest, name, w) };

  const pagesDir = path.join(SRC, 'pages');
  const files = (await fs.readdir(pagesDir)).filter((f) => f.endsWith('.js'));
  const pages = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(pagesDir, f)).href + `?t=${Date.now()}`);
    pages.push(mod.default);
  }
  pages.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  for (const page of pages) {
    const body = page.render(ctx);
    const html = layout({ ...page, body, ctx });
    const outPath = page.path === '/404/' ? path.join(DIST, '404.html') : path.join(DIST, page.path, 'index.html');
    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, html);
  }
  // sitemap + robots
  const site = data.config;
  const urls = pages.filter((p) => p.sitemap !== false).map((p) => `  <url><loc>${site.url}${p.path}</loc><changefreq>${p.changefreq || 'monthly'}</changefreq><priority>${p.priority ?? 0.6}</priority></url>`).join('\n');
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${site.url}/sitemap.xml\n`);
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');
  return pages;
}

/* ---------- assets ---------- */
async function buildAssets() {
  const css = await fs.readFile(path.join(SRC, 'styles', 'main.css'), 'utf8');
  const cssName = `main.${hashOf(css)}.css`;
  await ensureDir(path.join(DIST, 'assets', 'css'));
  await fs.writeFile(path.join(DIST, 'assets', 'css', cssName), css);
  const js = await fs.readFile(path.join(SRC, 'scripts', 'main.js'), 'utf8');
  const jsName = `main.${hashOf(js)}.js`;
  await ensureDir(path.join(DIST, 'assets', 'js'));
  await fs.writeFile(path.join(DIST, 'assets', 'js', jsName), js);
  await copyDir(path.join(SRC, 'assets', 'fonts'), path.join(DIST, 'assets', 'fonts'));
  await copyDir(path.join(ROOT, 'public'), DIST);
  return { css: `/assets/css/${cssName}`, js: `/assets/js/${jsName}` };
}

async function build() {
  const t0 = Date.now();
  await fs.rm(DIST, { recursive: true, force: true });
  await ensureDir(DIST);
  const [manifest, assets] = await Promise.all([buildImages(), buildAssets()]);
  const pages = await buildPages(manifest, assets);
  console.log(`✔ built ${pages.length} pages, ${Object.keys(manifest).length} images in ${Date.now() - t0} ms`);
}

/* ---------- dev server ---------- */
function serve(port = 4321) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
  http.createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(DIST, p);
    if (fss.existsSync(file) && fss.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fss.existsSync(file)) file = path.join(DIST, '404.html');
    const status = file.endsWith('404.html') ? 404 : 200;
    res.writeHead(status, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    fss.createReadStream(file).pipe(res);
  }).listen(port, () => console.log(`▶ http://localhost:${port}`));
}

await build();
if (args.has('--watch')) {
  let timer;
  for (const dir of [SRC, path.join(ROOT, 'public')]) {
    if (!fss.existsSync(dir)) continue;
    fss.watch(dir, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(() => build().catch((e) => console.error(e)), 150); });
  }
  console.log('… watching src/ and public/');
}
if (args.has('--serve') || args.has('--watch')) serve(Number(process.env.PORT) || 4321);
