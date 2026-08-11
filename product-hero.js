/* ════════════════════════════════════════════════════════════════════
   PRODUCT HERO — vanilla JS, no animation library.
   Owns: entrance reveal (single .ph-loaded class flip, CSS does the
   animating), the drifting glow-dot particle field, and a light mouse
   parallax across background depth layers only (text never moves).
   Mirrors hero-cinematic.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.product-hero');
  if (!hero) return;

  const bg = hero.querySelector('.ph-bg');
  const frame = hero.querySelector('.ph-visual-frame');
  const particleHost = hero.querySelector('#phParticles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  requestAnimationFrame(() => {
    hero.classList.add('ph-loaded');
  });

  // ── drifting glow particles: plain spans positioned once with
  // randomized CSS custom properties, animated entirely by the shared
  // CSS keyframe (no per-frame JS) — rise bottom to top across the hero ──
  if (particleHost && !reduceMotion) {
    const COUNT = 16;
    const hues = ['#FF6B00', '#FF7518'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'ph-particle';
      const dur = 14 + Math.random() * 12;
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

  if (canHover && !reduceMotion) {
    let raf = null;
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - .5;
        const py = (e.clientY - rect.top) / rect.height - .5;

        if (bg) bg.style.transform = `translate(${px * 10}px, ${py * 10}px)`;
        if (frame) frame.style.transform = `translate(${px * -6}px, ${py * -6}px)`;

        raf = null;
      });
    });

    hero.addEventListener('pointerleave', () => {
      if (bg) bg.style.transform = '';
      if (frame) frame.style.transform = '';
    });
  }
})();
