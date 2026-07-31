/* ════════════════════════════════════════════════════════════════════
   CLIENTELE — Cinematic Trust Hero behavior
   Isolated component. Drives the entrance sequence (bg → badge →
   heading → left trophy composition → right India network draw-in →
   description → stats → CTA, ~2.5s total), the floating particle/ember
   field, cursor + scroll parallax on the flanking visuals, the magnetic
   CTA, and the stat counters. Falls back to a static, unanimated reveal
   if GSAP failed to load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.clh');
  if (!hero) return;

  const bgLayers = hero.querySelectorAll('.clh-glow-wrap, .clh-rays');
  const badge = hero.querySelector('.clh-badge');
  const lines = hero.querySelectorAll('.clh-line-inner');
  const left = hero.querySelector('.clh-left');
  const right = hero.querySelector('.clh-right');
  const desc = hero.querySelector('.clh-desc');
  const statsBar = hero.querySelector('.clh-stats-bar');
  const ctaRow = hero.querySelector('.clh-cta-row');
  const particlesLayer = hero.querySelector('.clh-particles');
  const statNodes = statsBar ? statsBar.querySelectorAll('.counter') : [];
  const outline = hero.querySelector('.clh-india-outline');
  const routes = hero.querySelectorAll('.clh-route');

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
      p.className = 'clh-particle' + (isEmber ? ' ember' : '');
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (isEmber ? 3 + Math.random() * 2.5 : 1.5 + Math.random() * 1.8) + 'px');
      p.style.setProperty('--pd', (10 + Math.random() * 10) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 50) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      particlesLayer.appendChild(p);
    }
  }

  // ── prep SVG paths for a GSAP-driven draw-in (free stroke-dashoffset technique) ──
  function prepDraw(el) {
    if (!el) return 0;
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    return len;
  }

  function triggerCounters() {
    statNodes.forEach((el) => {
      if (el._counted) return;
      el._counted = true;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      if (reduceMotion || !gsapReady) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease: 'expo.out',
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
      });
    });
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      triggerCounters();
      if (outline) { outline.style.strokeDasharray = 'none'; outline.style.strokeDashoffset = '0'; }
      routes.forEach((r) => { r.style.strokeDasharray = 'none'; r.style.strokeDashoffset = '0'; });
      return;
    }

    // dash-offset draw-in prep must happen before the timeline references these values
    const outlineLen = prepDraw(outline);
    const routeLens = Array.from(routes).map(prepDraw);

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (bgLayers.length) tl.fromTo(bgLayers, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'sine.out' }, 0);
    if (badge) tl.fromTo(badge, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .55 }, .15);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, stagger: .12 }, .35);
    if (left) tl.fromTo(left, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8 }, .7);
    if (outline) tl.to(outline, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .75);
    if (routeLens.length) tl.to(routes, { strokeDashoffset: 0, duration: .6, stagger: .12, ease: 'power2.inOut' }, 1.15);
    if (right) tl.fromTo(right, { opacity: 0 }, { opacity: .9, duration: .6 }, .7);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, 1.5);
    if (statsBar) tl.fromTo(statsBar, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6, onStart: triggerCounters }, 1.7);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5 }, 1.95);
  }

  // hero is above the fold — play immediately once layout settles
  if (gsapReady && !reduceMotion) {
    gsap.set([badge, ...lines, left, desc, statsBar, ctaRow].filter(Boolean), { opacity: 0 });
    if (right) gsap.set(right, { opacity: 0 });
    if (bgLayers.length) gsap.set(bgLayers, { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── magnetic CTA + ripple ──
  if (ctaRow && window.matchMedia('(hover: hover)').matches) {
    const btn = ctaRow.querySelector('.clh-cta');
    if (btn) {
      const quickX = gsap.quickTo(btn, 'x', { duration: .35, ease: 'power3.out' });
      const quickY = gsap.quickTo(btn, 'y', { duration: .35, ease: 'power3.out' });
      btn.addEventListener('mouseenter', () => quickY(-3));
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        quickX((e.clientX - rect.left - rect.width / 2) * .3);
        quickY(-3 + (e.clientY - rect.top - rect.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', () => { quickX(0); quickY(0); });
    }
  }

  if (ctaRow) {
    ctaRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.clh-cta');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'clh-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // ── cursor-following spotlight + subtle parallax on the flanking visuals ──
  if (window.matchMedia('(hover: hover)').matches) {
    const quickLeftX = left ? gsap.quickTo(left, 'x', { duration: .7, ease: 'power3.out' }) : null;
    const quickRightX = right ? gsap.quickTo(right, 'x', { duration: .7, ease: 'power3.out' }) : null;

    let raf = null, pending = null;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      pending = { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', pending.x + '%');
        hero.style.setProperty('--my', pending.y + '%');
        raf = null;
      });
      const nx = (e.clientX - rect.left) / rect.width - .5;
      if (quickLeftX) quickLeftX(-nx * 10);
      if (quickRightX) quickRightX(-nx * 10);
    });
    hero.addEventListener('mouseleave', () => {
      if (quickLeftX) quickLeftX(0);
      if (quickRightX) quickRightX(0);
    });
  }

  // ── scroll effect: background lags behind content, flanking visuals float,
  //    lighting dims — mirrors the homepage hero's scroll treatment ──
  const glowWrap = hero.querySelector('.clh-glow-wrap');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || 1;
      const progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

      gsap.set(hero.querySelector('.clh-bg'), { y: progress * 36 });
      if (glowWrap) gsap.set(glowWrap, { opacity: 1 - progress * .7 });
      if (left) gsap.set(left, { y: progress * -18 });
      if (right) gsap.set(right, { y: progress * -18 });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
