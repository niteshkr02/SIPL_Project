/* ════════════════════════════════════════════════════════════════════
   CAREERS — Cinematic Recruitment Hero behavior
   Isolated component. Drives the entrance sequence (bg → badge →
   heading (split by line) → description → CTAs → illustration, ~2s
   total), the floating particle/ember field, cursor + scroll parallax
   on the illustration, the magnetic CTAs, and the scroll indicator.
   Falls back to a static, unanimated reveal if GSAP failed to load or
   the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.cah');
  if (!hero) return;

  const bgLayers = hero.querySelectorAll('.cah-glow-wrap, .cah-rays');
  const badge = hero.querySelector('.cah-badge');
  const lines = hero.querySelectorAll('.cah-line-inner');
  const desc = hero.querySelector('.cah-desc');
  const ctaRow = hero.querySelector('.cah-cta-row');
  const visual = hero.querySelector('.cah-visual');
  const particlesLayer = hero.querySelector('.cah-particles');
  const scrollIndicator = hero.querySelector('.cah-scroll-indicator');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── floating gold dust + embers ──
  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const isEmber = Math.random() > .6;
      p.className = 'cah-particle' + (isEmber ? ' ember' : '');
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (isEmber ? 3 + Math.random() * 2.5 : 1.5 + Math.random() * 1.8) + 'px');
      p.style.setProperty('--pd', (10 + Math.random() * 10) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 50) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      particlesLayer.appendChild(p);
    }
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) return;

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (bgLayers.length) tl.fromTo(bgLayers, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'sine.out' }, 0);
    if (badge) tl.fromTo(badge, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .55 }, .15);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, stagger: .12 }, .35);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .85);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, 1.05);
    if (visual) tl.fromTo(visual, { opacity: 0, scale: .92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, .55);
    if (scrollIndicator) tl.fromTo(scrollIndicator, { opacity: 0 }, { opacity: 1, duration: .6 }, 1.4);
  }

  // hero is above the fold — play immediately once layout settles
  if (gsapReady && !reduceMotion) {
    gsap.set([badge, ...lines, desc, ctaRow].filter(Boolean), { opacity: 0 });
    if (visual) gsap.set(visual, { opacity: 0 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });
    if (bgLayers.length) gsap.set(bgLayers, { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  if (reduceMotion || !gsapReady) return;

  // ── magnetic CTAs + ripple ──
  if (ctaRow && window.matchMedia('(hover: hover)').matches) {
    ctaRow.querySelectorAll('.cah-cta').forEach((btn) => {
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
      const btn = e.target.closest('.cah-cta');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'cah-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // ── cursor-following spotlight + subtle parallax on the illustration ──
  // Coalesced into a single requestAnimationFrame per pointermove so the
  // spotlight position and parallax offset are read/written at most once
  // per frame, instead of once per raw pointer event.
  if (window.matchMedia('(hover: hover)').matches) {
    const quickVisualX = visual ? gsap.quickTo(visual, 'x', { duration: .7, ease: 'power3.out' }) : null;
    const quickVisualY = visual ? gsap.quickTo(visual, 'y', { duration: .7, ease: 'power3.out' }) : null;

    let raf = null;
    let pending = null;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      pending = { mx: ((e.clientX - rect.left) / rect.width) * 100, my: ((e.clientY - rect.top) / rect.height) * 100, nx, ny };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', pending.mx + '%');
        hero.style.setProperty('--my', pending.my + '%');
        if (quickVisualX) quickVisualX(pending.nx * -14);
        if (quickVisualY) quickVisualY(pending.ny * -10);
        raf = null;
      });
    });
    hero.addEventListener('mouseleave', () => {
      if (quickVisualX) quickVisualX(0);
      if (quickVisualY) quickVisualY(0);
    });
  }

  // ── scroll effect: background lags behind content, illustration floats,
  //    lighting dims — mirrors the clientele hero's scroll treatment ──
  const glowWrap = hero.querySelector('.cah-glow-wrap');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || 1;
      const progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

      gsap.set(hero.querySelector('.cah-bg'), { y: progress * 36 });
      if (glowWrap) gsap.set(glowWrap, { opacity: 1 - progress * .7 });
      if (visual) gsap.set(visual, { y: progress * -22 });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
