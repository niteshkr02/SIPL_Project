/* ════════════════════════════════════════════════════════════════════
   NAILS & HARDWARE HERO — vanilla JS, no animation library. Owns:
   entrance reveal (single .nh-loaded class flip, CSS does the
   animating), a drifting ember-particle field biased toward the text
   side, and a very subtle mouse parallax across the background
   gradient, the reference photo and the text column. Particles and
   parallax are desktop/no-reduced-motion only. Mirrors wire-rods-
   hero.js / structural-tubes-hero.js / steel-strip-hero.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.nh-hero');
  if (!hero) return;

  const bg = hero.querySelector('.nh-bg');
  const frame = hero.querySelector('.nh-visual-frame');
  const content = hero.querySelector('.nh-content');
  const particleHost = hero.querySelector('#nhParticles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  requestAnimationFrame(() => {
    hero.classList.add('nh-loaded');
  });

  // ── drifting ember particles: same floating-pulse technique as the
  // home hero / other product heroes, but biased toward the left/content
  // side (5%-55%) rather than the photo — the photo already has its own
  // baked-in sparks, so this reads as ambient atmosphere behind the text
  // instead of a duplicate spark layer ──
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FF6A1F', '#FFA23D'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'nh-particle';
      const dur = 13 + Math.random() * 11;
      span.style.setProperty('--x', (5 + Math.random() * 50) + '%');
      span.style.setProperty('--size', (2 + Math.random() * 2.5) + 'px');
      span.style.setProperty('--dur', dur + 's');
      span.style.setProperty('--delay', (-Math.random() * dur) + 's');
      span.style.setProperty('--drift', (Math.random() * 36 - 18) + 'px');
      span.style.setProperty('--hue', hues[i % 2]);
      frag.appendChild(span);
    }
    particleHost.appendChild(frag);
  }

  // ── subtle mouse parallax: background gradient (2-4px), reference
  // photo (opposite direction, slightly stronger for depth), text
  // column (1-2px). The whole artwork stays visually unified — nothing
  // separates from the photo. ──
  if (canHover && !reduceMotion) {
    let raf = null;
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - .5;
        const py = (e.clientY - rect.top) / rect.height - .5;

        if (bg) bg.style.transform = `translate3d(${px * 3}px, ${py * 3}px, 0)`;
        if (frame) frame.style.transform = `translate3d(${px * -5}px, ${py * -5}px, 0)`;
        if (content) content.style.transform = `translate3d(${px * 1.5}px, ${py * 1.5}px, 0)`;

        raf = null;
      });
    });

    hero.addEventListener('pointerleave', () => {
      if (bg) bg.style.transform = '';
      if (frame) frame.style.transform = '';
      if (content) content.style.transform = '';
    });
  }
})();
