/* ════════════════════════════════════════════════════════════════════
   TRUSTED BY — Premium Client Credibility Showcase
   Isolated component. The header badge/heading/subtitle and the bottom
   stats row reuse the site's shared .reveal / .reveal-scale / .counter
   mechanisms (site.js + the stat-counter script) — nothing to do here.
   This file only drives the logo grid: staggered entrance, hover lift,
   and a very soft cursor parallax. Falls back to a static reveal if
   GSAP failed to load from the CDN.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const section = document.getElementById('trustedBy');
  const grid = document.getElementById('tbyGrid');
  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.tby-card'));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── entrance: stagger in once the grid is scrolled into view ──
  function playEntrance() {
    if (!gsapReady || reduceMotion) {
      cards.forEach((c) => { c.style.opacity = 1; });
      return;
    }
    gsap.set(cards, { opacity: 0, y: 40, scale: .92, filter: 'blur(10px)' });
    gsap.to(cards, {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      duration: .8, ease: EASE, stagger: .08,
    });
  }

  if (gsapReady && !reduceMotion) gsap.set(cards, { opacity: 0 });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(grid);
          playEntrance();
        }
      });
    }, { threshold: .15 });
    io.observe(grid);
  } else {
    playEntrance();
  }

  if (reduceMotion || !gsapReady) return;

  // ── hover / keyboard-focus lift (transform lives exclusively in GSAP so
  //    it never fights the CSS :hover rule, which only handles box-shadow
  //    and border-color) ──
  function lift(card, on) {
    gsap.to(card, {
      y: on ? -10 : 0,
      scale: on ? 1.03 : 1,
      duration: .45,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => lift(card, true));
    card.addEventListener('mouseleave', () => lift(card, false));
    card.addEventListener('focus', () => lift(card, true));
    card.addEventListener('blur', () => lift(card, false));
  });

  // ── whole-grid tilt + "nearest card" elevation, both very subtle ──
  if (window.matchMedia('(hover: hover)').matches) {
    const quickRotX = gsap.quickTo(grid, 'rotationX', { duration: .6, ease: 'power3.out' });
    const quickRotY = gsap.quickTo(grid, 'rotationY', { duration: .6, ease: 'power3.out' });
    const PROXIMITY_RADIUS = 240;

    grid.addEventListener('mousemove', (e) => {
      const rect = grid.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      quickRotY(nx * 2.2);
      quickRotX(-ny * 2.2);

      cards.forEach((card) => {
        if (card.matches(':hover, :focus-visible')) return;
        const cr = card.getBoundingClientRect();
        const cx = cr.left + cr.width / 2;
        const cy = cr.top + cr.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const influence = Math.max(0, 1 - dist / PROXIMITY_RADIUS);
        gsap.to(card, { y: -influence * 3, duration: .4, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    grid.addEventListener('mouseleave', () => {
      quickRotX(0);
      quickRotY(0);
      cards.forEach((card) => {
        if (!card.matches(':hover, :focus-visible')) gsap.to(card, { y: 0, duration: .5, ease: 'power2.out' });
      });
    });
  }
})();
