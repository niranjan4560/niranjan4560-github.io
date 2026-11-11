/**
 * Generates favicon PNGs and the 1200×630 Open Graph image from HTML using Playwright.
 * Run with `npm run assets` after changing your name/role. Requires Playwright + Chromium:
 *   npm i -D playwright && npx playwright install chromium
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { person, site } from '../data/profile.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = (...p) => join(ROOT, ...p);

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright not found. Install it with: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const font = (file) => `data:font/woff2;base64,${readFileSync(r('assets/fonts', file)).toString('base64')}`;
const fontCss = `
@font-face{font-family:Geist;src:url(${font('geist-latin-wght-normal.woff2')});font-weight:100 900}
@font-face{font-family:Mono;src:url(${font('geist-mono-latin-wght-normal.woff2')});font-weight:100 900}
@font-face{font-family:Serif;src:url(${font('instrument-serif-latin-400-italic.woff2')});font-style:italic}
*{margin:0;box-sizing:border-box}`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#0a0a0c"/>
  <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#8b93ff" stroke-opacity=".45" stroke-width="2"/>
  <text x="32" y="43" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="26" font-weight="700" fill="#ededef">${person.initials}</text>
</svg>
`;

const ogHtml = `<!doctype html><html><head><style>${fontCss}
body{width:1200px;height:630px;background:#0a0a0c;color:#ededef;font-family:Geist;position:relative;overflow:hidden;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 70% at 30% 40%,#000 20%,transparent 75%)}
.orb{position:absolute;width:620px;height:620px;right:-140px;top:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#c7cbff 0%,transparent 35%),radial-gradient(circle at 60% 65%,#6c74f5 0%,transparent 60%);filter:blur(40px);opacity:.55}
.top,.bottom{position:relative;display:flex;align-items:center;gap:16px;font-family:Mono;font-size:22px;color:#a3a3ab}
.mark{width:52px;height:52px;border-radius:14px;background:#ededef;color:#0a0a0c;display:grid;place-items:center;font-weight:700;font-size:18px}
.badge{margin-left:auto;padding:10px 18px;border:1px solid rgba(255,255,255,.18);border-radius:999px;font-family:Geist;font-size:22px;color:#ededef;display:flex;gap:10px;align-items:center}
.badge i{width:10px;height:10px;border-radius:50%;background:#34d399;display:block}
h1{position:relative;font-size:84px;line-height:1.02;letter-spacing:-.045em;font-weight:560;max-width:900px}
h1 em{font-family:Serif;font-weight:400;color:#8b93ff}
</style></head><body><div class="grid"></div><div class="orb"></div>
<div class="top"><span class="mark">${person.initials}</span><span>${person.name} · ${person.role}</span><span class="badge"><i></i>${person.status}</span></div>
<h1>${person.headline.lead} <em>${person.headline.accent}</em> ${person.headline.tail}</h1>
<div class="bottom">FastAPI · Python · PostgreSQL · XGBoost · LLMs · Docker</div>
</body></html>`;

const iconHtml = (size) => `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px}svg{width:100%;height:100%;display:block}</style></head><body>${faviconSvg}</body></html>`;

mkdirSync(r('assets/icons'), { recursive: true });
writeFileSync(r('favicon.svg'), faviconSvg);

const browser = await chromium.launch();
const shoot = async (html, width, height, out, transparent = false) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate('document.fonts.ready');
  await page.screenshot({ path: r(out), omitBackground: transparent });
  await page.close();
};

await shoot(ogHtml, 1200, 630, site.ogImage);
for (const [size, name] of [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  await shoot(iconHtml(size), size, size, `assets/icons/${name}`, true);
}
await browser.close();
console.log('Generated favicon set and Open Graph image.');
