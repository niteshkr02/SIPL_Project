/* ════════════════════════════════════════════════════════════════════
   MISSION, VISION & VALUES — Hero behavior
   Isolated component. Drives the one-time entrance sequence (eyebrow →
   heading → description → rule → pillars, staggered) and a floating
   ember field over the photo. The photo's own float and the orbital
   ring's spin are pure CSS (see vision-hero.css) — deliberately not
   touched from JS so nothing fights their transform. Falls back to a
   static reveal if GSAP failed to load or the user prefers reduced
   motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.mvv-hero');
  if (!hero) return;

  const eyebrow = hero.querySelector('.mvv-hero-eyebrow');
  const heading = hero.querySelector('.mvv-hero-heading');
  const desc = hero.querySelector('.mvv-hero-desc');
  const rule = hero.querySelector('.mvv-hero-rule');
  const pillars = hero.querySelector('.mvv-hero-pillars');
  const pillarItems = hero.querySelectorAll('.mvv-hero-pillar');
  const particlesLayer = hero.querySelector('.mvv-hero-particles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 0 : 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'mvv-hero-particle';
      // biased to the left/center scrim zone, where they read as ambient
      // dust rather than competing with the photo's own detail on the right
      p.style.setProperty('--px', (Math.random() * 58) + '%');
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

    const els = [eyebrow, heading, desc, rule, pillars];
    if (!gsapReady || reduceMotion) {
      els.forEach((el) => { if (el) el.style.opacity = 1; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (heading) tl.fromTo(heading, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .8 }, .2);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7 }, .4);
    if (rule) tl.fromTo(rule, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5 }, .5);
    if (pillars) tl.set(pillars, { opacity: 1 }, .55);
    pillarItems.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, .55 + i * .1);
    });
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([eyebrow, heading, desc, rule, pillars].filter(Boolean), { opacity: 0 });
    gsap.set(Array.from(pillarItems), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  if (window.matchMedia('(hover: hover)').matches) {
    // Cache the bounding rect instead of reading it on every pointermove —
    // getBoundingClientRect() forces a synchronous layout read, and on a
    // high-poll-rate mouse that fired hundreds of times a second.
    let heroRect = hero.getBoundingClientRect();
    const updateHeroRect = () => { heroRect = hero.getBoundingClientRect(); };
    window.addEventListener('resize', updateHeroRect);
    hero.addEventListener('pointerenter', updateHeroRect);

    let raf = null;
    let pendingX = 0;
    let pendingY = 0;
    hero.addEventListener('pointermove', (e) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const px = pendingX - heroRect.left;
        const py = pendingY - heroRect.top;
        // px offsets feed translate3d() only (compositor-only) — never
        // background-position, which would repaint the spotlight layer.
        hero.style.setProperty('--mx', px + 'px');
        hero.style.setProperty('--my', py + 'px');
        raf = null;
      });
    });
  }
})();
