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
    // No filter/blur here: animating blur on 20 cards at once is expensive
    // enough that weaker devices can drop or stall the tween mid-flight,
    // leaving logos looking like they never finished loading in. Opacity +
    // transform alone stays cheap and reliable, and a tighter stagger gets
    // every card fully visible in well under a second either way.
    gsap.set(cards, { opacity: 0, y: 40, scale: .92 });
    gsap.to(cards, {
      opacity: 1, y: 0, scale: 1,
      duration: .6, ease: EASE, stagger: { each: .035, from: 'start' },
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
  // Card centers are read once (on grid entry + resize), not on every native
  // mousemove — getBoundingClientRect() inside a per-card loop on every
  // mousemove was forcing a synchronous layout read for all ~20 cards at
  // native pointer-event frequency (which can run well past 60Hz), starving
  // the main thread and causing the hover state to visibly stutter/flicker.
  // The whole update is now coalesced into a single requestAnimationFrame
  // per frame, matching the pattern already used for clientele-showcase.js's
  // grid tilt.
  if (window.matchMedia('(hover: hover)').matches) {
    const quickRotX = gsap.quickTo(grid, 'rotationX', { duration: .6, ease: 'power3.out' });
    const quickRotY = gsap.quickTo(grid, 'rotationY', { duration: .6, ease: 'power3.out' });
    const PROXIMITY_RADIUS = 240;

    let gridRect = null;
    let cardCenters = null;
    let pendingX = 0;
    let pendingY = 0;
    let proximityRaf = null;

    function measure() {
      gridRect = grid.getBoundingClientRect();
      cardCenters = cards.map((card) => {
        const cr = card.getBoundingClientRect();
        return { card, cx: cr.left + cr.width / 2, cy: cr.top + cr.height / 2 };
      });
    }

    function applyProximity() {
      proximityRaf = null;
      if (!gridRect) return;
      const nx = (pendingX - gridRect.left) / gridRect.width - .5;
      const ny = (pendingY - gridRect.top) / gridRect.height - .5;
      quickRotY(nx * 2.2);
      quickRotX(-ny * 2.2);

      cardCenters.forEach(({ card, cx, cy }) => {
        if (card.matches(':hover, :focus-visible')) return;
        const dist = Math.hypot(pendingX - cx, pendingY - cy);
        const influence = Math.max(0, 1 - dist / PROXIMITY_RADIUS);
        gsap.to(card, { y: -influence * 3, duration: .4, ease: 'power2.out', overwrite: 'auto' });
      });
    }

    grid.addEventListener('mouseenter', measure);
    window.addEventListener('resize', () => { if (gridRect) measure(); }, { passive: true });

    grid.addEventListener('mousemove', (e) => {
      if (!gridRect) measure();
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (proximityRaf === null) proximityRaf = requestAnimationFrame(applyProximity);
    });

    grid.addEventListener('mouseleave', () => {
      if (proximityRaf !== null) { cancelAnimationFrame(proximityRaf); proximityRaf = null; }
      gridRect = null;
      quickRotX(0);
      quickRotY(0);
      cards.forEach((card) => {
        if (!card.matches(':hover, :focus-visible')) gsap.to(card, { y: 0, duration: .5, ease: 'power2.out' });
      });
    });
  }
})();
