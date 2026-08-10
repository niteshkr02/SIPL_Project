/* ════════════════════════════════════════════════════════════════════
   OUR JOURNEY — Cinematic Road-to-Horizon Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → eyebrow → headline lines → copy → CTA → feature row →
   wave crest line) and an extremely subtle scroll parallax on the
   background photo only — text never moves. Falls back to a static,
   unanimated reveal if GSAP failed to load or the user prefers
   reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.oj-hero');
  if (!hero) return;

  const photo = hero.querySelector('.oj-hero-visual-img');
  const eyebrow = hero.querySelector('.oj-hero-eyebrow');
  const headingLines = hero.querySelectorAll('.oj-hero-heading .line');
  const descs = hero.querySelectorAll('.oj-hero-desc');
  const cta = hero.querySelector('.oj-hero-cta');
  const features = hero.querySelector('.oj-hero-features');
  const featureItems = hero.querySelectorAll('.oj-hero-feature');
  const waveLine = hero.querySelector('.oj-hero-wave-line');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function playEntrance() {
    if (!gsapReady || reduceMotion) {
      if (photo) { photo.style.opacity = 1; photo.style.transform = 'scale(1.035)'; }
      [eyebrow, ...headingLines, ...descs, cta, features].forEach((el) => { if (el) el.style.opacity = 1; });
      if (waveLine) { waveLine.style.opacity = 1; waveLine.style.transform = 'scaleX(1)'; }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1.035, duration: 1.6, ease: 'sine.out' }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .7, stagger: .08 }, .2);
    descs.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .4 + i * .05));
    if (cta) tl.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .55);
    if (features) tl.set(features, { opacity: 1 }, .7);
    featureItems.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .7 + i * .1));
    if (waveLine) tl.fromTo(waveLine, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1, ease: 'power3.inOut' }, .9);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([eyebrow, cta, features].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    if (descs.length) gsap.set(descs, { opacity: 0 });
    gsap.set(Array.from(featureItems), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  // ── extremely subtle scroll parallax on the background photo only
  // (≈14px total travel, well inside the resting scale(1.035) buffer
  // set in journey-hero.css so the overflow:hidden wrapper never
  // reveals an edge), text never moves ──
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
      photo.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(1.035)';
      raf = null;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
