/* ════════════════════════════════════════════════════════════════════
   CLIENTELE — "Our Strength. Your Trust." Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → eyebrow → heading lines → underline → copy → three feature
   items), a small rising-ember particle field over the plate's own
   wave band, and a very subtle desktop-only mouse parallax across the
   photo, the ambient glow and the particle layer (each at its own
   depth). Falls back to a static, unanimated reveal if GSAP failed to
   load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.cnh');
  if (!hero) return;

  const photo = hero.querySelector('.cnh-visual-img');
  const visual = hero.querySelector('.cnh-visual');
  const glowWrap = hero.querySelector('.cnh-glow-wrap');
  const particlesLayer = hero.querySelector('.cnh-particles');
  const eyebrow = hero.querySelector('.cnh-eyebrow');
  const headingLines = hero.querySelectorAll('.cnh-heading .line');
  const underline = hero.querySelector('.cnh-underline');
  const desc = hero.querySelector('.cnh-desc');
  const features = hero.querySelector('.cnh-features');
  const featureItems = hero.querySelectorAll('.cnh-feature');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // ── tiny embers rising through the plate's own wave band ──
  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 900 ? 0 : 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'cnh-particle';
      p.style.setProperty('--px', (55 + Math.random() * 42) + '%');
      p.style.setProperty('--ps', (2 + Math.random() * 2.2) + 'px');
      p.style.setProperty('--pd', (7 + Math.random() * 6) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 12) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 40) + 'px');
      particlesLayer.appendChild(p);
    }
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      if (photo) { photo.style.opacity = 1; }
      [eyebrow, underline, desc, features].forEach((el) => { if (el) el.style.opacity = 1; });
      headingLines.forEach((el) => { el.style.opacity = 1; });
      featureItems.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: 1.09 }, { opacity: 1, scale: 1.05, duration: 1.7, ease: 'sine.out' }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .8, stagger: .1 }, .25);
    if (underline) tl.fromTo(underline, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .5, transformOrigin: 'left center' }, .55);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .65);

    if (features) tl.set(features, { opacity: 1 }, .85);
    featureItems.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .85 + i * .12));
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([eyebrow, underline, desc, features].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    gsap.set(Array.from(featureItems), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── desktop-only mouse parallax: photo, ambient glow and particles
  // each move at their own subtle depth, capped well under 10px ──
  if (window.matchMedia('(hover: hover)').matches && window.matchMedia('(min-width: 901px)').matches) {
    const quickVisualX = visual ? gsap.quickTo(visual, 'x', { duration: .7, ease: 'power3.out' }) : null;
    const quickVisualY = visual ? gsap.quickTo(visual, 'y', { duration: .7, ease: 'power3.out' }) : null;
    const quickGlowX = glowWrap ? gsap.quickTo(glowWrap, 'x', { duration: .8, ease: 'power3.out' }) : null;
    const quickGlowY = glowWrap ? gsap.quickTo(glowWrap, 'y', { duration: .8, ease: 'power3.out' }) : null;
    const quickPartX = particlesLayer ? gsap.quickTo(particlesLayer, 'x', { duration: .6, ease: 'power3.out' }) : null;

    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      if (quickVisualX) quickVisualX(-nx * 8);
      if (quickVisualY) quickVisualY(-ny * 6);
      if (quickGlowX) quickGlowX(-nx * 12);
      if (quickGlowY) quickGlowY(-ny * 10);
      if (quickPartX) quickPartX(-nx * 5);
    });
    hero.addEventListener('mouseleave', () => {
      if (quickVisualX) quickVisualX(0);
      if (quickVisualY) quickVisualY(0);
      if (quickGlowX) quickGlowX(0);
      if (quickGlowY) quickGlowY(0);
      if (quickPartX) quickPartX(0);
    });
  }
})();
