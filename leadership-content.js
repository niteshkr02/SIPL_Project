/* ════════════════════════════════════════════════════════════════════
   LEADERSHIP — Content Sections behavior
   Isolated component. Staggers the two executive cards and the six
   values items into view, and drives the CTA band's floating particles,
   glow ripple and lift on the "Contact Us" button. Global .reveal
   fade-ins are already handled by site.js — this file only adds the
   stagger/particle/ripple behavior that alone can't.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── reveal a container + stagger its children once visible ──
  function staggerReveal(root, itemSelector, { rootClass = 'visible', itemDelay = 110 } = {}) {
    if (!root) return;
    const items = root.querySelectorAll(itemSelector);
    if (!('IntersectionObserver' in window)) {
      root.classList.add(rootClass);
      items.forEach((it) => it.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(root);
        root.classList.add(rootClass);
        items.forEach((it, i) => {
          if (reduceMotion) { it.classList.add('visible'); return; }
          setTimeout(() => it.classList.add('visible'), i * itemDelay);
        });
      });
    }, { threshold: .15 });
    obs.observe(root);
  }

  staggerReveal(document.querySelector('.lt-grid'), '.lt-card');
  staggerReveal(document.querySelector('.lv-strip'), '.lv-item', { itemDelay: 80 });

  // ── CTA band: floating particles ──
  const ctaParticles = document.querySelector('.lcta-particles');
  if (ctaParticles && !reduceMotion) {
    const count = window.innerWidth < 640 ? 8 : 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'lcta-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (1.6 + Math.random() * 2.2).toFixed(1) + 'px');
      p.style.setProperty('--pd', (10 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 50).toFixed(0) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      ctaParticles.appendChild(p);
    }
  }

  // ── CTA button: ripple on click ──
  const ctaBtn = document.querySelector('.lcta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'lcta-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ctaBtn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  if (reduceMotion || typeof window.gsap === 'undefined') return;

  // ── magnetic CTA button ──
  if (ctaBtn && window.matchMedia('(hover: hover)').matches) {
    const quickX = gsap.quickTo(ctaBtn, 'x', { duration: .35, ease: 'power3.out' });
    const quickY = gsap.quickTo(ctaBtn, 'y', { duration: .35, ease: 'power3.out' });
    ctaBtn.addEventListener('mouseenter', () => quickY(-3));
    ctaBtn.addEventListener('mousemove', (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      quickX((e.clientX - rect.left - rect.width / 2) * .25);
      quickY(-3 + (e.clientY - rect.top - rect.height / 2) * .3);
    });
    ctaBtn.addEventListener('mouseleave', () => { quickX(0); quickY(0); });
  }
})();
