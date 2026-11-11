# Changelog

## 2.0.0 — Premium redesign (Nov 2026)

### What changed
- **Content rebuilt from the 2026 resume only.** Removed claims that are not on the resume: the "UI/UX workshop", "Why Hire Me" and "Career Goals" sections, percentage skill bars, the typewriter roles ("Full-Stack Developer", "ML Engineer in Progress") and the WhatsApp link. Added the GitHub link, a resume download and the problem → solution → impact framing for each project.
- **Positioning:** the hero now says who you are and what you deliver in one line: *"I build backends that put machine learning to work."* It's followed by a single supporting sentence and two CTAs (View projects / Download resume).
- **Architecture:** went from one hand-written 40 KB HTML file to content in `data/profile.mjs`, pre-rendered to static HTML at build time. GitHub Pages still serves the repo root, so no deploy changes are needed.
- **Sections:** Hero → About (story, photo, animated stats) → Projects → Skills → Experience (leadership & learning timeline) → Education → Contact (form + direct links + "Open to opportunities" badge). A sticky nav highlights the active section and always shows a Resume button.

### What was added
- **3D hero** (Three.js): an iridescent faceted core, orbit rings and a connected "data constellation" with mouse parallax and generated environment reflections. As you scroll into About, the core turns, grows and shifts colour while the field disperses and fades. Rendering then stops.
  - It only runs on screens ≥ 1024 px with a real GPU, ≥ 4 cores, no Save-Data and no reduced-motion preference. Everyone else gets a static gradient orb.
  - DPR is capped at 1.5. The scene pauses when the tab is hidden, handles context loss, and disposes everything on `pagehide`.
- **Motion:** a short preloader (1.1 s, first visit per session, desktop only), word-by-word heading reveals, staggered section reveals, animated counters, a scroll-scrubbed timeline line, Lenis smooth scrolling, magnetic buttons, 3D tilt on cards, a custom cursor ring and animated conic gradient borders.
- **Themes:** dark/light toggle that defaults to the system setting and is remembered. The theme is set before first paint, so there's no flash.
- **Contact form:** composes an email in the visitor's mail app. Set `contact.formEndpoint` (e.g. a Formspree URL) to post messages directly instead. There's also a copy-email button.
- **SEO:**
  - title and description, canonical URL
  - Open Graph and Twitter cards with a generated 1200×630 image
  - JSON-LD `Person` schema
  - `sitemap.xml`, `robots.txt`, `site.webmanifest`
  - favicons: SVG, 32 px, Apple touch icon, 192/512 px
- **Accessibility:** skip link, semantic landmarks, visible focus rings, focus moves to the target section on in-page navigation, accessible names on all icon buttons, and split headings keep their full text for screen readers. Everything still works without JavaScript.
- **Tooling:** esbuild bundling, ESLint, html-validate, and a dev server with rebuild on change.

### Dependencies (all dev-only; output is bundled)
- `three`: hero 3D scene (tree-shaken, lazy-loaded chunk).
- `gsap`: ScrollTrigger-driven reveals, counters, preloader and micro-interactions.
- `lenis`: smooth scrolling, synced with ScrollTrigger.
- `esbuild`: bundling and minifying JS/CSS.
- `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`: self-hosted fonts, with no third-party font request.
- `eslint`, `@eslint/js`, `globals`, `html-validate`: linting.

### Design system (`src/css/styles.css`)
- **Palette:** one neutral scale (`--n-0` … `--n-950`, warm zinc) and one indigo accent (`--a-300` … `--a-700`), mapped to semantic tokens (`--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, …) per theme. All text pairs meet WCAG AA.
- **Type:** Geist (UI/body), Instrument Serif italic (accent words), Geist Mono (labels/chips). Fluid scale with `clamp()`, from `--fs-xs` to `--fs-display`.
- **Spacing:** 4 px base (`--s-1` … `--s-9`), fluid `--s-section` and `--gutter`, 76 rem max width.
- **Shape and depth:** radii `--r-sm/md/lg/full`, shadows `--shadow-sm/md/lg`, `--glow`, and a glass surface (`--glass`) used only on the nav, badges and pills.
- **Motion:** one easing (`--ease-out` ≈ `expo.out`) and three durations (180 / 350 / 900 ms), mirrored in `src/js/motion.js`.

### Verification
- `npm run build` and `npm run lint` pass. No console errors or warnings.
- Checked at 375, 768, 1280 and 1920 px in both themes, with no horizontal overflow.
- Lighthouse (local, mobile and desktop): Performance 100, Accessibility 100, Best Practices 100, SEO 100. CLS 0.
- Reduced-motion and no-JS modes show all content. The mobile menu, keyboard navigation and form validation all work.

## TODO: please supply or confirm
- [ ] **Photo:** add a square-ish portrait at `assets/photo.webp` (≥ 800 px) and set `person.photo` in `data/profile.mjs`.
- [ ] **Project links:** add repo and/or live-demo URLs for each project (`projects[].links`). They currently point to your GitHub profile.
- [ ] **Project media:** add screenshots (16:10, WebP) at `assets/projects/<slug>.webp` and set `projects[].image`. On-brand illustrations are shown until then.
- [ ] **Metrics:** RepVault has no measured number. Add one if you have it (e.g. reads saved, latency), along with any user or traffic numbers for the other projects. Marked `TODO: add metric` in the data file.
- [ ] **Site URL:** confirm the public URL in `site.url`. It's currently `https://niranjan4560.github.io/niranjan4560-github.io/`. If you rename the repo to `niranjan4560.github.io` it will serve from the domain root, which also makes `robots.txt` effective. The old README pointed to `niranjanns.github.io`.
- [ ] **Status:** confirm "Open to opportunities". Should it say internships, full-time, or a start date?
- [ ] **Phone number:** it's shown publicly, as on the old site. Remove it from `links` if you'd rather not.
- [ ] **Contact form backend (optional):** create a Formspree (or similar) form and set `contact.formEndpoint`.
- [ ] **Experience:** add any internships or jobs to `experience` as soon as you have them.
