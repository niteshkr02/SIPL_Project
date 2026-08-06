/* ════════════════════════════════════════════════════════════════════
   MISSION, VISION & VALUES — Content Sections behavior
   Isolated component. Staggers feature/value/promise/milestone items
   into view, animates the vision stat counters once scrolled into
   view, spawns the ambient particle fields on the royal-blue sections,
   and drives the CTA band's ripple + magnetic button. Global .reveal
   fade-ins are already handled by site.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── reveal a container + stagger its children once visible ──
  function staggerReveal(root, itemSelector, { itemDelay = 100 } = {}) {
    if (!root) return;
    const items = root.querySelectorAll(itemSelector);
    if (!('IntersectionObserver' in window)) {
      items.forEach((it) => it.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(root);
        items.forEach((it, i) => {
          if (reduceMotion) { it.classList.add('visible'); return; }
          setTimeout(() => it.classList.add('visible'), i * itemDelay);
        });
      });
    }, { threshold: .15 });
    obs.observe(root);
  }

  staggerReveal(document.querySelector('.mvv-feature-grid'), '.mvv-feature');
  staggerReveal(document.querySelector('.mvv-stat-row'), '.mvv-stat-item', { itemDelay: 120 });
  staggerReveal(document.querySelector('.mvv-node-strip'), '.mvv-value-node', { itemDelay: 90 });
  staggerReveal(document.querySelector('.mvv-promise-strip'), '.mvv-promise-item', { itemDelay: 90 });
  staggerReveal(document.querySelector('.mvv-timeline'), '.mvv-milestone', { itemDelay: 120 });

  // ── journey timeline: fill the connecting line once it scrolls into view ──
  const timelineRoot = document.querySelector('.mvv-timeline');
  if (timelineRoot) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        timelineRoot.classList.add('filled');
        obs.unobserve(timelineRoot);
      });
    }, { threshold: .3 });
    obs.observe(timelineRoot);
  }

  // ── vision split-visual reveal (plain fade, no stagger needed) ──
  document.querySelectorAll('.mvv-split-visual').forEach((el) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
      });
    }, { threshold: .2 });
    obs.observe(el);
  });

  // ── vision stat counters: count up once the row scrolls into view ──
  const statRow = document.querySelector('.mvv-stat-row');
  if (statRow) {
    const nums = statRow.querySelectorAll('.mvv-stat-num');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(statRow);
        nums.forEach((num) => {
          const target = parseInt(num.dataset.count, 10) || 0;
          const suffix = num.dataset.suffix || '';
          if (reduceMotion) { num.textContent = target + suffix; return; }
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            num.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      });
    }, { threshold: .4 });
    obs.observe(statRow);
  }

  // ── ambient particles for the royal-blue sections ──
  function spawnParticles(layer, count) {
    if (!layer || reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'mvv-navy-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (1.4 + Math.random() * 2) + 'px');
      p.style.setProperty('--pd', (12 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 22).toFixed(1) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 40).toFixed(0) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      layer.appendChild(p);
    }
  }
  document.querySelectorAll('.mvv-navy-particles').forEach((layer) => {
    spawnParticles(layer, window.innerWidth < 640 ? 6 : 12);
  });

  // ── CTA band: ripple on click + magnetic hover ──
  const ctaBtn = document.querySelector('.mvv-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'mvv-cta-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ctaBtn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  if (reduceMotion || typeof window.gsap === 'undefined') return;

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
