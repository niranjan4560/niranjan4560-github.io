import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { DUR, EASE, PRELOADER_MS, STAGGER, media } from './motion.js';
import { initContactForm, initCopyButtons } from './contact.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const motionOK = !media.reducedMotion();
const fine = media.finePointer();

window.__siteReady = true;

/* Theme ------------------------------------------------------------------ */
const themeListeners = new Set();
function setTheme(theme, persist) {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  }
  themeListeners.forEach((fn) => fn(theme));
}
$('[data-theme-toggle]')?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  let stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch {
    /* ignore */
  }
  if (!stored) setTheme(e.matches ? 'light' : 'dark', false);
});

/* Smooth scroll ---------------------------------------------------------- */
let lenis = null;
if (motionOK) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* In-page links: smooth scroll + move focus for keyboard / screen-reader users */
const nav = $('[data-nav]');
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const toTop = id === 'top';
    const target = toTop ? $('#main') : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(toTop ? 0 : target, { offset: toTop ? 0 : -(nav.offsetHeight + 8) });
    else if (toTop) window.scrollTo({ top: 0 });
    else target.scrollIntoView();
    target.focus({ preventScroll: true });
    history.replaceState(null, '', toTop ? location.pathname : `#${id}`);
  });
});

/* Nav: scrolled state, mobile menu, active section ----------------------- */
const menu = $('#nav-menu');
const menuBtn = $('[data-menu-toggle]');
function closeMenu() {
  if (!menu?.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}
menuBtn?.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('is-open')) {
    closeMenu();
    menuBtn.focus();
  }
});

const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

const navLinks = new Map($$('[data-nav-link]').map((a) => [a.dataset.navLink, a]));
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a, id) => {
        const on = id === entry.target.id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
navLinks.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) activeObserver.observe(section);
});

/* Split headings into words (visual only — screen readers get the original text) */
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  return text.split(/\s+/).map((word, i) => {
    const outer = document.createElement('span');
    const inner = document.createElement('span');
    outer.className = 'split-word';
    outer.setAttribute('aria-hidden', 'true');
    inner.textContent = word;
    outer.append(inner);
    if (i) el.append(' ');
    el.append(outer);
    return inner;
  });
}

/* Reveals ---------------------------------------------------------------- */
function initReveals() {
  if (!motionOK) return;

  $$('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 110,
      duration: DUR.slow,
      ease: EASE,
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Sibling reveals stagger by index within their parent.
  const groups = new Map();
  $$('[data-reveal]').forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    el.style.setProperty('--i', list.length % 6);
    list.push(el);
    groups.set(el.parentElement, list);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  $$('[data-reveal]').forEach((el) => io.observe(el));

  // Timeline progress line scrubs with scroll.
  const progress = $('[data-timeline-progress]');
  if (progress) {
    gsap.to(progress, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
    });
  }
}

/* Animated counters ------------------------------------------------------ */
function initCounters() {
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (!motionOK) return;
    const state = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      v: end,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = state.v.toFixed(decimals)),
    });
  });
}

/* Hero intro + preloader ------------------------------------------------- */
function heroIntro() {
  if (!motionOK) return;
  gsap.fromTo(
    '[data-hero]',
    { y: 32, opacity: 0 },
    { y: 0, opacity: 1, duration: DUR.slow * 1.2, ease: EASE, stagger: STAGGER, clearProps: 'transform' },
  );
}

function runPreloader() {
  return new Promise((resolve) => {
    if (!root.classList.contains('is-loading')) return resolve(false);
    const count = $('[data-preloader-count]');
    const bar = $('[data-preloader-bar]');
    const state = { p: 0 };
    lenis?.stop();
    gsap
      .timeline({
        onComplete: () => {
          root.classList.remove('is-loading');
          lenis?.start();
          try {
            sessionStorage.setItem('intro', '1');
          } catch {
            /* ignore */
          }
          resolve(true);
        },
      })
      .to(state, {
        p: 100,
        duration: PRELOADER_MS / 1000 - 0.45,
        ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = Math.round(state.p);
          bar.style.transform = `scaleX(${state.p / 100})`;
        },
      })
      .to('.preloader', { yPercent: -100, duration: 0.45, ease: 'expo.inOut' });
  });
}

/* Desktop micro-interactions -------------------------------------------- */
function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

function initTilt() {
  $$('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 7);
      ry(px * 9);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

function initCursor() {
  const cursor = $('.cursor');
  if (!cursor) return;
  root.classList.add('has-cursor');
  const ring = $('.cursor-ring', cursor);
  const dot = $('.cursor-dot', cursor);
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
  window.addEventListener(
    'pointermove',
    (e) => {
      cursor.classList.remove('is-hidden');
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      cursor.classList.toggle('is-hover', !!e.target.closest?.('a, button, input, textarea, [data-tilt]'));
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
}

/* 3D scene (lazy) -------------------------------------------------------- */
function sceneStory() {
  // Continuous position through the page: 0 = hero, 1 = about, 2 = projects …, last = contact.
  const ids = ['top', 'about', 'projects', 'skills', 'experience', 'education', 'contact'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  return () => {
    const y = window.scrollY;
    let t = 0;
    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop;
      const next = sections[i + 1]?.offsetTop ?? document.documentElement.scrollHeight;
      if (y >= top) t = i + Math.min(1, (y - top) / (next - top));
    }
    return t;
  };
}

function initScene() {
  if (!motionOK || !media.canRun3D()) return;
  const canvas = $('[data-scene]');
  const start = async () => {
    try {
      const { createScene } = await import('./scene.js');
      const scene = createScene(canvas, {
        theme: root.dataset.theme,
        story: sceneStory(),
        onReady: () => root.classList.add('has-scene'),
        onFail: () => root.classList.remove('has-scene'),
      });
      themeListeners.add((t) => scene.setTheme(t));
      window.addEventListener('pagehide', () => scene.dispose(), { once: true });
    } catch {
      root.classList.remove('has-scene'); // static fallback stays visible
    }
  };
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  if (document.readyState === 'complete') idle(start);
  else window.addEventListener('load', () => idle(start), { once: true });
}

/* Boot ------------------------------------------------------------------- */
async function boot() {
  initCopyButtons();
  initContactForm();
  initCounters();
  const hadPreloader = await runPreloader();
  initReveals();
  if (hadPreloader) heroIntro();
  if (motionOK && fine) {
    initMagnetic();
    initTilt();
    initCursor();
  }
  initScene();
  // Fonts can shift layout slightly; make sure trigger positions are fresh.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

boot();
