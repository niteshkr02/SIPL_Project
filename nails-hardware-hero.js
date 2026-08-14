/* ════════════════════════════════════════════════════════════════════
   NAILS & HARDWARE HERO — vanilla JS, no animation library. Owns:
   entrance reveal (single .nh-loaded class flip, CSS does the
   animating) and a very subtle mouse parallax across the background
   gradient, the reference photo and the text column. Desktop only —
   skipped on touch/no-hover devices and whenever prefers-reduced-motion
   is set. Mirrors wire-rods-hero.js / structural-tubes-hero.js.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.nh-hero');
  if (!hero) return;

  const bg = hero.querySelector('.nh-bg');
  const frame = hero.querySelector('.nh-visual-frame');
  const content = hero.querySelector('.nh-content');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  requestAnimationFrame(() => {
    hero.classList.add('nh-loaded');
  });

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
