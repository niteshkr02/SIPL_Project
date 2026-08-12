/* ════════════════════════════════════════════════════════════════════
   ALUMINIUM FOIL HERO — vanilla JS, no animation library.
   Owns: entrance reveal (single .ah-loaded class flip, CSS does the
   animating), a drifting particle field weighted toward the
   product/machinery side of the photo, and a light mouse parallax
   across background depth layers only (text never moves). Mirrors
   ferro-hero.js / product-hero.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.ah-hero');
  if (!hero) return;

  const bg = hero.querySelector('.ah-bg');
  const frame = hero.querySelector('.ah-visual-frame');
  const curve = hero.querySelector('.ah-curve');
  const particleHost = hero.querySelector('#ahParticles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  requestAnimationFrame(() => {
    hero.classList.add('ah-loaded');
  });

  // ── drifting particles: plain spans positioned once with randomized
  // CSS custom properties, animated entirely by the shared CSS keyframe
  // (no per-frame JS) — biased toward the right side of the hero
  // (aluminium rolls / machinery) rather than the full width ──
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FF6B00', '#FF8A2E'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'ah-particle';
      const dur = 13 + Math.random() * 11;
      span.style.setProperty('--x', (52 + Math.random() * 46) + '%');
      span.style.setProperty('--size', (2 + Math.random() * 2.5) + 'px');
      span.style.setProperty('--dur', dur + 's');
      span.style.setProperty('--delay', (-Math.random() * dur) + 's');
      span.style.setProperty('--drift', (Math.random() * 36 - 18) + 'px');
      span.style.setProperty('--hue', hues[i % 2]);
      frag.appendChild(span);
    }
    particleHost.appendChild(frag);
  }

  // ── subtle mouse parallax: background glow (0-3px), visual photo
  // (4-8px), decorative curve (2-4px). Text column never moves. ──
  if (canHover && !reduceMotion) {
    let raf = null;
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - .5;
        const py = (e.clientY - rect.top) / rect.height - .5;

        if (bg) bg.style.transform = `translate3d(${px * 4}px, ${py * 4}px, 0)`;
        if (frame) frame.style.transform = `translate3d(${px * -8}px, ${py * -8}px, 0)`;
        if (curve) curve.style.transform = `translate3d(${px * 4}px, ${py * 2}px, 0)`;

        raf = null;
      });
    });

    hero.addEventListener('pointerleave', () => {
      if (bg) bg.style.transform = '';
      if (frame) frame.style.transform = '';
      if (curve) curve.style.transform = '';
    });
  }
})();
