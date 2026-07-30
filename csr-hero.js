/* ════════════════════════════════════════════════════════════════════
   CORPORATE SOCIAL RESPONSIBILITY — Community Trust Hero behavior
   Isolated component. Drives the entrance sequence (badge → heading →
   description → counters → CTA → background lighting → particles),
   the magnetic/ripple CTA, the cursor spotlight and the floating dust
   field. Falls back to a static, unanimated reveal if GSAP failed to
   load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.csrh');
  if (!hero) return;

  const badge = hero.querySelector('.csrh-badge');
  const lines = hero.querySelectorAll('.csrh-line-inner');
  const desc = hero.querySelector('.csrh-desc');
  const stats = hero.querySelector('.csrh-stats');
  const ctaRow = hero.querySelector('.csrh-cta-row');
  const bgLighting = hero.querySelectorAll('.csrh-glow-wrap, .csrh-rays');
  const particlesLayer = hero.querySelector('.csrh-particles');
  const statNodes = stats ? stats.querySelectorAll('.counter') : [];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── floating dust: generated once, then purely CSS-driven ──
  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'csrh-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (2 + Math.random() * 2.4).toFixed(1) + 'px');
      p.style.setProperty('--pd', (10 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 60).toFixed(0) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      particlesLayer.appendChild(p);
    }
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
        v: target, duration: 1.5, ease: 'expo.out',
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
      });
    });
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      triggerCounters();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (badge) tl.fromTo(badge, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .7 }, .1);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, stagger: .14 }, .3);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 }, .62);
    if (stats) tl.fromTo(stats, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, onStart: triggerCounters }, .82);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, 1);
    if (bgLighting.length) tl.fromTo(bgLighting, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'sine.out' }, 1.05);
    if (particlesLayer) tl.fromTo(particlesLayer, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'sine.out' }, 1.3);
  }

  // hero is above the fold — play immediately once layout settles
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── magnetic CTA + ripple ──
  if (ctaRow && window.matchMedia('(hover: hover)').matches) {
    const btn = ctaRow.querySelector('.csrh-cta');
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
      const btn = e.target.closest('.csrh-cta');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'csrh-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // ── cursor-following spotlight ──
  if (window.matchMedia('(hover: hover)').matches) {
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
    });
  }
})();
