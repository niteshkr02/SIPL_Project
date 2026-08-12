/* ════════════════════════════════════════════════════════════════════
   CONTACT — Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → eyebrow → headline lines → copy → cards → commitment strip)
   and an extremely subtle scroll parallax on the background photo only
   — text, cards and the hand/person never move. Also brightens the
   CONTACT US HUD very slightly when the cursor is near it. Falls back
   to a static, unanimated reveal if GSAP failed to load or the user
   prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.ch-hero');
  if (!hero) return;

  const photo = hero.querySelector('.ch-visual-img');
  const eyebrow = hero.querySelector('.ch-eyebrow');
  const headingLines = hero.querySelectorAll('.ch-heading .line');
  const desc = hero.querySelector('.ch-desc');
  const cards = hero.querySelectorAll('.ch-card');
  const cardsRow = hero.querySelector('.ch-cards');
  const commit = hero.querySelector('.ch-commit');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const REST_SCALE = 1.035;

  // ── drifting glow particles: plain spans positioned once with
  // randomized CSS custom properties, animated entirely by the shared
  // CSS keyframe (no per-frame JS) ──
  const particleHost = hero.querySelector('#chParticles');
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FF6B00', '#FF7518'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'ch-particle';
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
      if (photo) { photo.style.opacity = 1; photo.style.transform = 'scale(' + REST_SCALE + ')'; }
      [eyebrow, ...headingLines, desc, cardsRow, commit].forEach((el) => { if (el) el.style.opacity = 1; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: 1.06, x: 15 }, { opacity: 1, scale: REST_SCALE, x: 0, duration: 1.7, ease: 'sine.out' }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .7, stagger: .08 }, .2);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .4);
    if (cardsRow) tl.set(cardsRow, { opacity: 1 }, .6);
    cards.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .55 }, .6 + i * .1));
    if (commit) tl.fromTo(commit, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6 }, 1.0);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([eyebrow, desc, cardsRow, commit].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    gsap.set(Array.from(cards), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  // ── extremely subtle scroll parallax on the background photo only
  // (≈14px total travel, well inside the resting scale set above so the
  // overflow:hidden wrapper never reveals an edge), text/cards never move ──
  if (!reduceMotion && photo && !window.matchMedia('(max-width: 900px)').matches) {
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
        photo.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(' + REST_SCALE + ')';
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── subtle HUD brighten when the cursor is near it (desktop pointer
  // only) — never moves the hand, just toggles a class the CSS reacts to ──
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const HUD_X = .735;
    const HUD_Y = .22;
    const RADIUS = 140;
    let raf2 = null;
    hero.addEventListener('mousemove', (e) => {
      if (raf2) return;
      raf2 = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const hudX = rect.left + rect.width * HUD_X;
        const hudY = rect.top + rect.height * HUD_Y;
        const dist = Math.hypot(e.clientX - hudX, e.clientY - hudY);
        hero.classList.toggle('ch-hud-near', dist < RADIUS);
        raf2 = null;
      });
    });
    hero.addEventListener('mouseleave', () => hero.classList.remove('ch-hud-near'));
  }
})();
