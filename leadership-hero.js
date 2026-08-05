/* ════════════════════════════════════════════════════════════════════
   LEADERSHIP — Executive Portrait Hero behavior
   Isolated component. Drives the entrance sequence (label → heading →
   glow line → description → divider → visual → wave crest line), the
   floating particle field, and a very soft cursor parallax on the
   visual. Falls back to a static, unanimated reveal if GSAP failed to
   load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.lh');
  if (!hero) return;

  const label = hero.querySelector('.lh-label');
  const heading = hero.querySelector('.lh-heading-inner');
  const glow = hero.querySelector('.lh-heading-glow');
  const desc = hero.querySelector('.lh-desc');
  const underline = hero.querySelector('.lh-underline');
  const visual = hero.querySelector('.lh-visual');
  const waveLine = hero.querySelector('.lh-wave-line');
  const particlesLayer = hero.querySelector('.lh-particles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── floating light particles ──
  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'lh-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (1.6 + Math.random() * 2.2).toFixed(1) + 'px');
      p.style.setProperty('--pd', (10 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 50).toFixed(0) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      particlesLayer.appendChild(p);
    }
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      if (glow) glow.style.transform = 'scaleX(1)';
      if (underline) underline.style.transform = 'scaleX(1)';
      if (waveLine) { waveLine.style.opacity = 1; waveLine.style.transform = 'scaleX(1)'; }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (label) tl.fromTo(label, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (heading) tl.fromTo(heading, { opacity: 0, y: 36, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, .28);
    if (glow) tl.fromTo(glow, { scaleX: 0 }, { scaleX: 1, duration: .8, ease: 'power3.inOut' }, .8);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .95);
    if (underline) tl.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.inOut' }, 1.15);
    if (visual) tl.fromTo(visual, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'sine.out' }, .3);
    if (waveLine) tl.fromTo(waveLine, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, .9);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([label, heading, desc].filter(Boolean), { opacity: 0 });
    if (glow) gsap.set(glow, { scaleX: 0 });
    if (underline) gsap.set(underline, { scaleX: 0 });
    if (visual) gsap.set(visual, { opacity: 0 });
    if (waveLine) gsap.set(waveLine, { opacity: 0, scaleX: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── very soft cursor parallax on the visual + spotlight ──
  if (window.matchMedia('(hover: hover)').matches) {
    const quickVisualX = visual ? gsap.quickTo(visual, 'x', { duration: .8, ease: 'power3.out' }) : null;

    let raf = null;
    let pending = null;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      pending = { mx: ((e.clientX - rect.left) / rect.width) * 100, my: ((e.clientY - rect.top) / rect.height) * 100, nx };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', pending.mx + '%');
        hero.style.setProperty('--my', pending.my + '%');
        if (quickVisualX) quickVisualX(pending.nx * -10);
        raf = null;
      });
    });
    hero.addEventListener('mouseleave', () => {
      if (quickVisualX) quickVisualX(0);
    });
  }
})();
