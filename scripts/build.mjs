/**
 * Build: bundles JS, minifies CSS, copies fonts and pre-renders index.html from data/profile.mjs.
 * Output is committed so GitHub Pages can keep serving the repository root with no CI step.
 */
import { build, transform } from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './render.mjs';
import { site, person } from '../data/profile.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = (...p) => join(ROOT, ...p);

const FONTS = [
  '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
  '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
];

function copyFonts() {
  mkdirSync(r('assets/fonts'), { recursive: true });
  for (const f of FONTS) copyFileSync(r('node_modules', f), r('assets/fonts', f.split('/').pop()));
}

async function bundleJs() {
  rmSync(r('assets/js'), { recursive: true, force: true });
  await build({
    entryPoints: [r('src/js/main.js')],
    outdir: r('assets/js'),
    bundle: true,
    splitting: true,
    format: 'esm',
    minify: true,
    target: ['es2020'],
    chunkNames: 'chunks/[name]-[hash]',
    legalComments: 'none',
    logLevel: 'warning',
  });
}

async function css() {
  const src = readFileSync(r('src/css/styles.css'), 'utf8');
  const { code } = await transform(src, { loader: 'css', minify: true, target: ['chrome100', 'safari15', 'firefox100'] });
  return code.trim();
}

function staticFiles() {
  const lastmod = new Date().toISOString().slice(0, 10);
  writeFileSync(
    r('sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}</loc><lastmod>${lastmod}</lastmod><priority>1.0</priority></url>
</urlset>
`,
  );
  writeFileSync(r('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site.url).href}\n`);
  writeFileSync(
    r('site.webmanifest'),
    JSON.stringify(
      {
        name: person.name,
        short_name: person.initials,
        start_url: '.',
        display: 'browser',
        background_color: '#0a0a0c',
        theme_color: '#0a0a0c',
        icons: [
          { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2,
    ) + '\n',
  );
  writeFileSync(r('.nojekyll'), '');
}

const started = performance.now();
copyFonts();
await bundleJs();
// Strip trailing whitespace left by template indentation.
writeFileSync(r('index.html'), renderPage({ css: await css() }).replace(/[ \t]+$/gm, ''));
staticFiles();
console.log(`Built index.html + assets in ${Math.round(performance.now() - started)} ms`);
