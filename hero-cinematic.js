/* ════════════════════════════════════════════════════════════════════
   HERO — Cinematic Industrial Backdrop
   Isolated component. Drives the entrance sequence, magnetic/ripple CTA
   interaction, a very soft background parallax, and a scroll effect
   (background lags behind content, blueprint grid fades, furnace glow
   dims). Leaves the existing #embers particle canvas and the
   cursor-spotlight (--mx/--my) script completely alone — this file only
   adds new behavior around them.
   Falls back to a static, unanimated reveal if GSAP failed to load.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const bg = hero.querySelector('.hero-bg');
  const heroContent = hero.querySelector('.hero-content');
  // .hero-line is a static overflow:hidden mask; .hero-line-inner is what
  // actually animates, so each line wipes into view from behind its mask
  const lines = hero.querySelectorAll('.hero-line-inner');
  const lede = hero.querySelector('p.lede');
  const ctaRow = hero.querySelector('.hero-cta-row');
  const kicker = hero.querySelector('.hero-kicker');
  const statsRow = hero.querySelector('.hero-stats');
  // Deliberately a different class from the site-wide .counter — that shared
  // mechanism triggers off an IntersectionObserver, and the hero is visible
  // immediately at load, so it would count these up before the GSAP entrance
  // below even reveals the row. Counting here is synced to that timeline.
  const statNodes = statsRow ? statsRow.querySelectorAll('.hero-counter') : [];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── entrance: cinematic sequence ──
  function playEntrance() {
    if (!gsapReady || reduceMotion) {
      if (bg) bg.style.opacity = 1;
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (kicker) tl.fromTo(kicker, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .7 }, .1);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, stagger: .14 }, .25);
    if (lede) tl.fromTo(lede, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8 }, .55);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7 }, .7);
    if (statsRow) tl.fromTo(statsRow, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, onStart: triggerStatCounters }, .85);
    if (bg) tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'sine.out' }, 0);
  }

  function triggerStatCounters() {
    statNodes.forEach((el) => {
      if (el._counted) return;
      el._counted = true;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      if (reduceMotion) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'expo.out',
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
      });
    });
  }

  // hero is above the fold — play immediately once fonts/layout settle, rather
  // than waiting on an IntersectionObserver the user will never see fire
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── magnetic CTA buttons + ripple ──
  // (the -3px baseline replaces the shared .btn-primary/.btn-ghost :hover
  // lift, which an inline GSAP transform would otherwise silently suppress)
  if (ctaRow && window.matchMedia('(hover: hover)').matches) {
    ctaRow.querySelectorAll('.btn').forEach((btn) => {
      const quickX = gsap.quickTo(btn, 'x', { duration: .35, ease: 'power3.out' });
      const quickY = gsap.quickTo(btn, 'y', { duration: .35, ease: 'power3.out' });
      btn.addEventListener('mouseenter', () => quickY(-3));
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        quickX((e.clientX - rect.left - rect.width / 2) * .3);
        quickY(-3 + (e.clientY - rect.top - rect.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', () => { quickX(0); quickY(0); });
    });
  }

  if (ctaRow) {
    ctaRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'hero-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // ── very soft background parallax on cursor movement ──
  if (bg && window.matchMedia('(hover: hover)').matches) {
    const skyline = bg.querySelector('.hero-skyline');
    const routes = bg.querySelector('.hero-routes');
    const wireframes = bg.querySelectorAll('.hero-wireframe');

    const quickSkyX = skyline ? gsap.quickTo(skyline, 'x', { duration: .8, ease: 'power3.out' }) : null;
    const quickRouteX = routes ? gsap.quickTo(routes, 'x', { duration: .9, ease: 'power3.out' }) : null;
    const quickRouteY = routes ? gsap.quickTo(routes, 'y', { duration: .9, ease: 'power3.out' }) : null;
    const quickWireX = gsap.utils.toArray(wireframes).map((w) => gsap.quickTo(w, 'x', { duration: 1, ease: 'power3.out' }));

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      if (quickSkyX) quickSkyX(nx * 8);
      if (quickRouteX) quickRouteX(nx * 16);
      if (quickRouteY) quickRouteY(ny * 10);
      quickWireX.forEach((fn, i) => fn(nx * (14 + i * 6)));
    });
    hero.addEventListener('mouseleave', () => {
      if (quickSkyX) quickSkyX(0);
      if (quickRouteX) quickRouteX(0);
      if (quickRouteY) quickRouteY(0);
      quickWireX.forEach((fn) => fn(0));
    });
  }

  // ── scroll effect: background lags, blueprint fades, furnace glow dims ──
  // (targets the wrapper, not .hero-glow itself, which owns its own CSS
  // breathing animation — animations always win over inline opacity for the
  // same element/property, so dimming has to happen one layer up)
  const glow = hero.querySelector('.hero-glow-wrap');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || 1;
      const progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

      if (bg) gsap.set(bg, { y: progress * 40 });
      hero.style.setProperty('--blueprint-fade', String(1 - progress * .85));
      if (glow) gsap.set(glow, { opacity: 1 - progress * .7 });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
