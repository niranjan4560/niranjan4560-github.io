/**
 * Renders the full page from data/profile.mjs into static, semantic HTML.
 * Pre-rendering keeps the content crawlable, readable without JavaScript and free of layout shift.
 */
import * as data from '../data/profile.mjs';
import { icon, iconSprite } from './icons.mjs';
import { projectArt } from './project-art.mjs';

const { site, person, links, about, stats, projects, skills, fundamentals, experience, education } = data;

/** Escape text for HTML element and attribute contexts. */
export const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const ext = (href) => `href="${esc(href)}" target="_blank" rel="noopener noreferrer"`;
const mailto = `mailto:${links.email}`;

/** Heading with an accessible label; JS splits the visible text into animated words. */
const sectionHead = (eyebrow, title, id) => `
      <header class="section-head">
        <p class="eyebrow" data-reveal><span class="eyebrow-index">${esc(eyebrow)}</span></p>
        <h2 class="h2" id="${id}-title" data-split>${esc(title)}</h2>
      </header>`;

const socials = (cls = '') => `
  <ul class="socials ${cls}" aria-label="Profiles">
    <li><a class="icon-btn" ${ext(links.github)} aria-label="GitHub">${icon('github')}</a></li>
    <li><a class="icon-btn" ${ext(links.linkedin)} aria-label="LinkedIn">${icon('linkedin')}</a></li>
    <li><a class="icon-btn" href="${esc(mailto)}" aria-label="Email ${esc(links.email)}">${icon('mail')}</a></li>
  </ul>`;

const header = () => `
<header class="nav" data-nav>
  <div class="nav-inner container">
    <a class="nav-logo" href="#top">
      <span class="logo-mark" aria-hidden="true">${esc(person.initials)}</span>
      <span class="logo-name">${esc(person.name)}</span>
    </a>
    <nav class="nav-links" id="nav-menu" aria-label="Primary">
      <ul>
        ${data.nav.map((n) => `<li><a href="#${n.id}" data-nav-link="${n.id}">${esc(n.label)}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <div class="nav-actions">
      <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Toggle color theme">
        ${icon('sun', 'icon-sun')}${icon('moon', 'icon-moon')}
      </button>
      <a class="btn btn-sm btn-primary" href="${esc(site.resume)}" download data-magnetic>
        ${icon('download')}<span>Resume</span>
      </a>
      <button class="icon-btn nav-menu-btn" type="button" aria-controls="nav-menu" aria-expanded="false" aria-label="Open menu" data-menu-toggle>
        ${icon('menu')}
      </button>
    </div>
  </div>
</header>`;

const hero = () => `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero-fallback" aria-hidden="true"><div class="orb"></div><div class="grid-fade"></div></div>
  <div class="container hero-inner">
    <p class="status-badge" data-hero><span class="pulse" aria-hidden="true"></span>${esc(person.status)}</p>
    <p class="hero-intro" data-hero>
      <strong>${esc(person.name)}</strong><span class="sep" aria-hidden="true">/</span>${esc(person.role)}
    </p>
    <h1 class="display" id="hero-title" data-hero>
      ${esc(person.headline.lead)} <em class="serif">${esc(person.headline.accent)}</em> ${esc(person.headline.tail)}
    </h1>
    <p class="lead hero-sub" data-hero>${esc(person.subline)}</p>
    <div class="hero-ctas" data-hero>
      <a class="btn btn-primary btn-lg" href="#projects" data-magnetic>View projects ${icon('arrow-down')}</a>
      <a class="btn btn-ghost btn-lg" href="${esc(site.resume)}" download data-magnetic>${icon('download')} Download resume</a>
    </div>
    <div class="hero-meta" data-hero>
      ${socials()}
      <ul class="hero-facts">
        <li>${icon('pin')}${esc(person.location)}</li>
        <li>${icon('cap')}B.Tech CSE · Amrita · 2027</li>
      </ul>
    </div>
  </div>
  <a class="scroll-cue" href="#about" aria-label="Scroll to About"><span></span></a>
</section>`;

const aboutSection = () => {
  const photo = person.photo
    ? `<img src="${esc(person.photo)}" alt="Portrait of ${esc(person.name)}" width="640" height="760" loading="lazy" decoding="async">`
    : `<div class="photo-placeholder" role="img" aria-label="Portrait placeholder for ${esc(person.name)}">
          <span class="ph-initials" aria-hidden="true">${esc(person.initials)}</span>
          <span class="ph-note" aria-hidden="true">Photo coming soon</span>
        </div>`;
  return `
<section class="section about" id="about" aria-labelledby="about-title" tabindex="-1">
  <div class="container">
    ${sectionHead('01 — About', 'Backend first, with models that ship.', 'about')}
    <div class="about-grid">
      <figure class="about-photo" data-reveal>
        <div class="photo-frame" data-tilt>${photo}</div>
        <figcaption>${esc(person.name)} · ${esc(person.location)}</figcaption>
      </figure>
      <div class="about-copy">
        ${about.paragraphs.map((p) => `<p data-reveal>${esc(p)}</p>`).join('\n        ')}
        <ul class="chips" aria-label="Focus areas" data-reveal>
          ${about.focus.map((f) => `<li class="chip chip-accent">${esc(f)}</li>`).join('')}
        </ul>
      </div>
    </div>
    <ul class="stats" aria-label="Highlights">
      ${stats
        .map(
          (s) => `<li class="stat" data-reveal>
        <span class="stat-value"><span data-count="${s.value}" data-decimals="${s.decimals ?? 0}">${s.decimals ? s.value.toFixed(s.decimals) : s.value}</span>${esc(s.suffix)}</span>
        <span class="stat-label">${esc(s.label)}</span>
      </li>`,
        )
        .join('\n      ')}
    </ul>
  </div>
</section>`;
};

const projectLinks = (p) => {
  const items = [];
  if (p.links.live) items.push(`<a class="link-arrow" ${ext(p.links.live)}>Live demo ${icon('external')}<span class="sr-only"> for ${esc(p.title)}</span></a>`);
  if (p.links.repo) items.push(`<a class="link-arrow" ${ext(p.links.repo)}>Source ${icon('github')}<span class="sr-only"> for ${esc(p.title)}</span></a>`);
  // TODO: replace with project-specific repo / demo links once available (data/profile.mjs).
  if (!items.length) items.push(`<a class="link-arrow" ${ext(links.github)}>More on GitHub ${icon('external')}<span class="sr-only"> (${esc(p.title)})</span></a>`);
  return items.join('');
};

const projectCard = (p, i) => `
      <article class="project" aria-labelledby="proj-${p.slug}" data-reveal>
        <div class="project-media" data-tilt>
          <div class="gradient-border" aria-hidden="true"></div>
          ${
            p.image
              ? `<img src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" width="1280" height="800" loading="lazy" decoding="async">`
              : projectArt(p.art, p.title)
          }
          <span class="project-metric"><strong>${esc(p.metric.value)}</strong> ${esc(p.metric.label)}</span>
        </div>
        <div class="project-body">
          <p class="project-meta"><span>${String(i + 1).padStart(2, '0')}</span><span>${esc(p.kind)}</span><span>${esc(p.date)}</span></p>
          <h3 class="h3" id="proj-${p.slug}">${esc(p.title)}</h3>
          <p class="project-summary">${esc(p.summary)}</p>
          <dl class="psi">
            <div><dt>Problem</dt><dd>${esc(p.problem)}</dd></div>
            <div><dt>Solution</dt><dd>${esc(p.solution)}</dd></div>
            <div><dt>Impact</dt><dd>${esc(p.impact)}</dd></div>
          </dl>
          <ul class="chips" aria-label="Tech stack">${p.stack.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>
          <div class="project-links">${projectLinks(p)}</div>
        </div>
      </article>`;

const projectsSection = () => `
<section class="section projects" id="projects" aria-labelledby="projects-title" tabindex="-1">
  <div class="container">
    ${sectionHead('02 — Selected work', 'Projects, from model to production.', 'projects')}
    <div class="project-list">${projects.map(projectCard).join('')}
    </div>
  </div>
</section>`;

const skillsSection = () => `
<section class="section skills" id="skills" aria-labelledby="skills-title" tabindex="-1">
  <div class="container">
    ${sectionHead('03 — Toolkit', 'Skills, grouped by what I use them for.', 'skills')}
    <ul class="skill-grid">
      ${skills
        .map(
          (s, i) => `<li class="skill-tile${i < 2 ? ' skill-tile-primary' : ''}" data-reveal data-tilt>
        <div class="skill-head">${icon(s.icon)}<h3 class="h4">${esc(s.group)}</h3></div>
        <ul class="chips">${s.items.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>
      </li>`,
        )
        .join('\n      ')}
    </ul>
    <p class="fundamentals" data-reveal><span>Foundations</span>${fundamentals.map((f) => `<span class="dot-item">${esc(f)}</span>`).join('')}</p>
  </div>
</section>`;

const experienceSection = () => `
<section class="section experience" id="experience" aria-labelledby="experience-title" tabindex="-1">
  <div class="container narrow">
    ${sectionHead('04 — Experience', 'Leadership & continuous learning.', 'experience')}
    <ol class="timeline" data-timeline>
      <li class="timeline-line" aria-hidden="true"><span data-timeline-progress></span></li>
      ${experience
        .map(
          (e) => `<li class="tl-item" data-reveal>
        <div class="tl-dot" aria-hidden="true"></div>
        <div class="tl-card">
          <p class="tl-date">${esc(e.date)}</p>
          <h3 class="h4">${esc(e.role)}</h3>
          <p class="tl-org">${esc(e.org)}</p>
          <ul class="tl-points">${e.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
        </div>
      </li>`,
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;

const educationSection = () => `
<section class="section education" id="education" aria-labelledby="education-title" tabindex="-1">
  <div class="container">
    ${sectionHead('05 — Education', 'Education & beyond the classroom.', 'education')}
    <div class="edu-grid">
      ${education
        .map(
          (e) => `<article class="edu-card" data-reveal>
        <p class="tl-date">${esc(e.date)}</p>
        <h3 class="h4">${esc(e.school)}</h3>
        <p class="edu-degree">${esc(e.degree)}</p>
        <p class="edu-detail"><span>${esc(e.detail)}</span><span class="muted">${esc(e.place)}</span></p>
      </article>`,
        )
        .join('\n      ')}
      <article class="edu-card edu-extra" data-reveal>
        <h3 class="h4">Languages</h3>
        <ul class="chips">${data.languages.map((l) => `<li class="chip">${esc(l)}</li>`).join('')}</ul>
        <h3 class="h4">Off the keyboard</h3>
        <ul class="chips">${data.hobbies.map((l) => `<li class="chip">${esc(l)}</li>`).join('')}</ul>
      </article>
    </div>
  </div>
</section>`;

const contactSection = () => `
<section class="section contact" id="contact" aria-labelledby="contact-title" tabindex="-1">
  <div class="container">
    <div class="contact-card">
      <div class="gradient-border" aria-hidden="true"></div>
      <div class="contact-copy">
        <p class="status-badge"><span class="pulse" aria-hidden="true"></span>${esc(person.status)}</p>
        <h2 class="h2" id="contact-title" data-split>${esc(data.contact.heading)}</h2>
        <p class="lead">${esc(data.contact.text)}</p>
        <ul class="contact-links">
          <li>
            <a class="contact-link" href="${esc(mailto)}">${icon('mail')}<span>${esc(links.email)}</span></a>
            <button class="icon-btn copy-btn" type="button" data-copy="${esc(links.email)}" aria-label="Copy email address">${icon('copy', 'icon-copy')}${icon('check', 'icon-check')}</button>
          </li>
          <li><a class="contact-link" ${ext(links.linkedin)}>${icon('linkedin')}<span>linkedin.com/in/niranjan-n-s</span></a></li>
          <li><a class="contact-link" ${ext(links.github)}>${icon('github')}<span>github.com/niranjan4560</span></a></li>
          <li><a class="contact-link" href="${esc(links.phoneHref)}">${icon('phone')}<span>${esc(links.phone).replaceAll(' ', '&nbsp;')}</span></a></li>
        </ul>
      </div>
      <form class="contact-form" data-contact-form data-email="${esc(links.email)}"${data.contact.formEndpoint ? ` data-endpoint="${esc(data.contact.formEndpoint)}"` : ''} novalidate>
        <div class="field">
          <label for="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" name="message" rows="5" required></textarea>
        </div>
        <button class="btn btn-primary btn-lg" type="submit" data-magnetic>Send message ${icon('arrow-right')}</button>
        <p class="form-status" role="status" aria-live="polite" data-form-status></p>
      </form>
    </div>
  </div>
</section>`;

const footer = () => `
<footer class="footer">
  <div class="container footer-inner">
    <p>© <span data-year>${new Date().getFullYear()}</span> ${esc(person.name)}. Built with care in Kerala.</p>
    ${socials('socials-sm')}
    <a class="link-arrow" href="#top">Back to top ${icon('arrow-up')}</a>
  </div>
</footer>`;

const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: site.url,
    image: new URL(site.ogImage, site.url).href,
    jobTitle: person.role,
    description: site.description,
    email: `mailto:${links.email}`,
    sameAs: [links.linkedin, links.github],
    address: { '@type': 'PostalAddress', addressRegion: 'Kerala', addressCountry: 'IN' },
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Amrita Vishwa Vidyapeetham' }],
    knowsAbout: ['FastAPI', 'Python', 'PostgreSQL', 'Machine Learning', 'XGBoost', 'LLM integration', 'Docker'],
  }).replaceAll('<', '\\u003c');

/**
 * Runs before first paint: sets the theme (no flash) and motion/preloader flags.
 * A failsafe reveals content if the main bundle never boots.
 */
const headScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}
if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';d.dataset.theme=t;
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm){d.classList.add('js-motion');var seen=null;try{seen=sessionStorage.getItem('intro')}catch(e){}
if(!seen&&matchMedia('(min-width: 1024px) and (pointer: fine)').matches)d.classList.add('is-loading');}
setTimeout(function(){if(!window.__siteReady)d.classList.remove('js-motion','is-loading')},4000);})();`;

export function renderPage({ css }) {
  const ogUrl = new URL(site.ogImage, site.url).href;
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<meta name="author" content="${esc(person.name)}">
<link rel="canonical" href="${esc(site.url)}">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(site.title)}">
<meta property="og:description" content="${esc(site.description)}">
<meta property="og:url" content="${esc(site.url)}">
<meta property="og:image" content="${esc(ogUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(person.name)} — ${esc(person.role)}">
<meta property="og:locale" content="${esc(site.locale)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(site.title)}">
<meta name="twitter:description" content="${esc(site.description)}">
<meta name="twitter:image" content="${esc(ogUrl)}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/instrument-serif-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin>
<script>${headScript}</script>
<style>${css}</style>
<script type="application/ld+json">${jsonLd()}</script>
<script type="module" src="assets/js/main.js"></script>
</head>
<body>
${iconSprite()}
<a class="skip-link" href="#main">Skip to content</a>
<div class="preloader" aria-hidden="true">
  <div class="preloader-inner">
    <span class="preloader-name">${esc(person.name)}</span>
    <span class="preloader-count" data-preloader-count>0</span>
  </div>
  <div class="preloader-bar"><span data-preloader-bar></span></div>
</div>
<div class="scene" aria-hidden="true"><canvas data-scene></canvas></div>
<div class="cursor is-hidden" aria-hidden="true"><span class="cursor-ring"></span><span class="cursor-dot"></span></div>
${header()}
<main id="main" tabindex="-1">
${hero()}
${aboutSection()}
${projectsSection()}
${skillsSection()}
${experienceSection()}
${educationSection()}
${contactSection()}
</main>
${footer()}
</body>
</html>
`;
}
