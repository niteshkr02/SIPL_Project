/* ════════════════════════════════════════════════════════════════════
   INSIGHT — Cinematic Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → eyebrow → headline lines → copy → CTA → three-item feature
   row) and an extremely subtle scroll parallax on the background photo
   only — text never moves. Falls back to a static, unanimated reveal
   if GSAP failed to load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.ins-hero');
  if (!hero) return;

  const photo = hero.querySelector('.ins-hero-visual-img');
  const eyebrow = hero.querySelector('.ins-hero-eyebrow');
  const headingLines = hero.querySelectorAll('.ins-hero-heading .line');
  const desc = hero.querySelector('.ins-hero-desc');
  const cta = hero.querySelector('.ins-hero-cta');
  const features = hero.querySelectorAll('.ins-feature');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // ── drifting glow particles: plain spans positioned once with
  // randomized CSS custom properties, animated entirely by the shared
  // CSS keyframe (no per-frame JS) ──
  const particleHost = hero.querySelector('#insHeroParticles');
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FF6B00', '#FF7518'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'ins-hero-particle';
      const dur = 14 + Math.random() * 12;
      span.style.setProperty('--x', (Math.random() * 100) + '%');
      span.style.setProperty('--size', (2 + Math.random() * 2.5) + 'px');
      span.style.setProperty('--dur', dur + 's');
      span.style.setProperty('--delay', (-Math.random() * dur) + 's');
      span.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
      span.style.setProperty('--hue', hues[i % 2]);
      frag.appendChild(span);
    }
    particleHost.appendChild(frag);
  }

  function playEntrance() {
    if (!gsapReady || reduceMotion) {
      if (photo) { photo.style.opacity = 1; photo.style.transform = 'scale(1.02)'; }
      [eyebrow, ...headingLines, desc, cta].forEach((el) => { if (el) el.style.opacity = 1; });
      features.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: 1.075 }, { opacity: 1, scale: 1.055, duration: 1.7, ease: 'sine.out' }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .7, stagger: .08 }, .2);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .4);
    if (cta) tl.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .55);
    features.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .7 + i * .1));
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([eyebrow, cta].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    if (desc) gsap.set(desc, { opacity: 0 });
    gsap.set(Array.from(features), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  // ── extremely subtle scroll parallax on the background photo only
  // (≈14px total travel, well inside the resting scale(1.055) buffer
  // set in insight-hero.css so the overflow:hidden wrapper never
  // reveals an edge), text and features never move ──
  if (reduceMotion || !photo || window.matchMedia('(max-width: 900px)').matches) return;

  const MAX_SHIFT = 14;
  let heroTop = 0;
  let heroHeight = 0;
  const measure = () => {
    const rect = hero.getBoundingClientRect();
    heroTop = rect.top + window.scrollY;
    heroHeight = rect.height;
  };
  measure();
  window.addEventListener('resize', measure);

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const progress = Math.min(1, Math.max(0, (window.scrollY - heroTop + heroHeight) / heroHeight));
      const shift = (progress - .5) * MAX_SHIFT;
      photo.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(1.055)';
      raf = null;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
