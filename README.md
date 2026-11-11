# Niranjan NS — Portfolio

Personal site of **Niranjan NS**, Backend & AI/ML Engineer (B.Tech CSE, Amrita Vishwa Vidyapeetham).

A static site served by GitHub Pages: all content lives in [`data/profile.mjs`](data/profile.mjs) and is pre-rendered into `index.html`, with a lazy-loaded Three.js hero, GSAP + Lenis motion, light/dark themes and a 100/100/100/100 Lighthouse score.

## Run locally

Requires Node 18+.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:4173. The site rebuilds automatically when you edit `data/`, `src/` or `scripts/`.

## Update content

1. Edit `data/profile.mjs` (projects, skills, links, photo, etc.). Use facts from your resume.
2. Replace `assets/Niranjan_NS_Resume.pdf` when your resume changes.
3. Rebuild and lint:

```bash
npm run check
```

If you change your name, role or headline, regenerate the favicons and social image too. This needs Playwright, which you install once with `npm i -D playwright && npx playwright install chromium`:

```bash
npm run assets
```

## Deploy

GitHub Pages serves the repository root as before. The build output (`index.html`, `assets/`, `sitemap.xml`, …) is committed, so there is no CI step. Run `npm run check`, commit and push to the Pages branch.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Build, serve on :4173, rebuild on change |
| `npm run build` | Bundle JS (esbuild), inline minified CSS, copy fonts, render `index.html`, sitemap, robots, manifest |
| `npm run lint` | ESLint (JS) + html-validate (generated HTML) |
| `npm run check` | Build + lint |
| `npm run assets` | Regenerate favicons and `assets/og-image.png` (Playwright) |

## Structure

```
data/profile.mjs        ← all content (single source of truth)
src/css/styles.css      ← design system + styles (inlined into index.html at build)
src/js/main.js          ← theme, nav, smooth scroll, reveals, counters, micro-interactions
src/js/scene.js         ← Three.js hero scene (lazy chunk, desktop + GPU only)
src/js/contact.js       ← contact form + copy-email
src/js/motion.js        ← shared easing/durations + device capability checks
scripts/                ← build, dev server, renderer, icons, project illustrations, image generation
assets/                 ← build output: js/, fonts/, icons/, og-image.png, resume PDF
```
