/* ════════════════════════════════════════════════════════════════════
   MISSION, VISION & VALUES — Hero behavior
   Isolated component. Drives the entrance sequence (label → heading →
   description → button → pillar nav → scroll cue), the floating
   particle field, and a soft cursor spotlight. The compass ring motif's
   own motion is pure CSS (see vision-hero.css) — deliberately not
   touched from JS, so nothing fights its transform. Falls back to a
   static reveal if GSAP failed to load or the user prefers reduced
   motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.mvv-hero');
  if (!hero) return;

  const label = hero.querySelector('.mvv-hero-label');
  const heading = hero.querySelector('.mvv-hero-heading');
  const desc = hero.querySelector('.mvv-hero-desc');
  const btn = hero.querySelector('.mvv-hero-btn');
  const pillars = hero.querySelector('.mvv-hero-pillars');
  const scrollCue = hero.querySelector('.mvv-hero-scroll-cue');
  const particlesLayer = hero.querySelector('.mvv-hero-particles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 12 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'mvv-hero-particle';
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
      [label, heading, desc, btn, pillars, scrollCue].forEach((el) => { if (el) el.style.opacity = 1; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (label) tl.fromTo(label, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (heading) tl.fromTo(heading, { opacity: 0, y: 36, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, .28);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .68);
    if (btn) tl.fromTo(btn, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, .9);
    if (pillars) tl.fromTo(pillars, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6 }, 1.08);
    if (scrollCue) tl.fromTo(scrollCue, { opacity: 0 }, { opacity: 1, duration: .6 }, 1.4);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([label, heading, desc, btn, pillars, scrollCue].filter(Boolean), { opacity: 0 });
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
