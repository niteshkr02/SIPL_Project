/* ════════════════════════════════════════════════════════════════════
   HERO — Premium Industrial Landing Split
   Isolated component, 100% vanilla JS (no animation library, no Canvas).
   Owns: the entrance reveal (a single `.hero-loaded` class flip — every
   element's own CSS transition in hero-cinematic.css does the actual
   animating), the stat counters, magnetic/ripple CTA interaction, the
   cursor-spotlight, the drifting particle field, and a light scroll
   parallax on the background layer.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const bg = hero.querySelector('.hero-bg');
  const ctaRow = hero.querySelector('.hero-cta-row');
  const counters = hero.querySelectorAll('.hero-counter');
  const particleHost = hero.querySelector('#heroParticles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  // ── entrance: flip one class, let CSS transitions (with their own
  // per-element delays) handle the reveal ──
  requestAnimationFrame(() => {
    hero.classList.add('hero-loaded');
  });

  // ── stat counters (kicks off alongside the metric card / achievement
  // bar reveal rather than waiting on a scroll-triggered observer, since
  // the hero is above the fold and already visible at load) ──
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);

    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * easeOutExpo(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  setTimeout(() => counters.forEach(animateCounter), reduceMotion ? 0 : 450);

  // ── magnetic CTA buttons + ripple ──
  if (ctaRow && canHover && !reduceMotion) {
    ctaRow.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * .3;
        const y = -3 + (e.clientY - rect.top - rect.height / 2) * .35;
        btn.style.transition = '';
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = '';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .35s cubic-bezier(.16,.84,.44,1)';
        btn.style.transform = '';
      });
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

  // ── cursor-following ember spotlight (drives --mx/--my on .hero::after) ──
  if (canHover && !reduceMotion) {
    let raf = null;
    let pending = null;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      pending = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', pending.x + '%');
        hero.style.setProperty('--my', pending.y + '%');
        raf = null;
      });
    });
  }

  // ── drifting glow particles: a handful of plain spans, positioned once
  // with randomized CSS custom properties, then animated entirely by the
  // shared CSS keyframe (no per-frame JS) ──
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FFC24B', '#FF6A1F'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'hero-particle';
      const dur = 16 + Math.random() * 14;
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

  // ── scroll effect: background lags behind content, blueprint grid fades ──
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || 1;
      const progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

      if (bg) bg.style.transform = `translateY(${progress * 40}px)`;
      hero.style.setProperty('--blueprint-fade', String(1 - progress * .85));

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
