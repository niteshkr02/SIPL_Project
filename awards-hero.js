/* ════════════════════════════════════════════════════════════════════
   AWARDS & CERTIFICATIONS — Cinematic Trophy Hero behavior
   Isolated component. Drives the one-time entrance sequence (trophy
   reveal → badge → headline lines → copy → CTA → four-item achievement
   row → wave line draw), a small restrained gold-particle drift, and an
   extremely subtle scroll parallax on the background photo only — text
   never moves. Falls back to a static, unanimated reveal if GSAP failed
   to load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.awh');
  if (!hero) return;

  const photo = hero.querySelector('.awh-visual-img');
  const badge = hero.querySelector('.awh-badge');
  const headingLines = hero.querySelectorAll('.awh-heading .line');
  const desc = hero.querySelector('.awh-desc');
  const cta = hero.querySelector('.awh-cta');
  const features = hero.querySelector('.awh-features');
  const featureItems = hero.querySelectorAll('.awh-feature');
  const featuresMobile = hero.querySelector('.awh-features-mobile');
  const featureItemsMobile = hero.querySelectorAll('.awh-feature-m');
  const waveLine = hero.querySelector('.awh-wave-line');
  const particlesLayer = hero.querySelector('.awh-particles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // ── a small, restrained number of gold particles ──
  function spawnParticles() {
    if (!particlesLayer || reduceMotion || window.innerWidth < 900) return;
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'awh-particle';
      p.style.setProperty('--px', (55 + Math.random() * 40) + '%');
      p.style.setProperty('--ps', (2 + Math.random() * 2) + 'px');
      p.style.setProperty('--pd', (6 + Math.random() * 6).toFixed(1) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 40).toFixed(0) + 'px');
      p.style.setProperty('--pc', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      particlesLayer.appendChild(p);
    }
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      if (photo) { photo.style.opacity = 1; photo.style.transform = 'scale(1)'; }
      [badge, ...headingLines, desc, cta, features, featuresMobile].forEach((el) => { if (el) el.style.opacity = 1; });
      featureItems.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      featureItemsMobile.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      if (waveLine) { waveLine.style.opacity = 1; waveLine.style.transform = 'scaleX(1)'; }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: .94, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'sine.out' }, 0);
    if (badge) tl.fromTo(badge, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .7, stagger: .08 }, .2);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .4);
    if (cta) tl.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 }, .55);

    if (features) tl.set(features, { opacity: 1 }, .7);
    featureItems.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .7 + i * .1));

    if (featuresMobile) tl.set(featuresMobile, { opacity: 1 }, .7);
    featureItemsMobile.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .7 + i * .1));

    if (waveLine) tl.fromTo(waveLine, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, .5);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([badge, cta, features, featuresMobile].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    if (desc) gsap.set(desc, { opacity: 0 });
    gsap.set(Array.from(featureItems), { opacity: 0 });
    gsap.set(Array.from(featureItemsMobile), { opacity: 0 });
    if (waveLine) gsap.set(waveLine, { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  // ── extremely subtle scroll parallax on the background photo only
  // (≈14px total travel, well inside the resting scale(1) the photo
  // settles to after entrance), text and features never move ──
  if (reduceMotion || !photo || window.matchMedia('(max-width: 900px)').matches) return;

  const MAX_SHIFT = 14;
  let heroTop = 0;
  let heroHeight = 0;
  const measure = () => {
    const rect = hero.getBoundingClientRect();
    heroTop = rect.top + window.scrollY;
    heroHeight = rect.height;
  };
  measure();
  window.addEventListener('resize', measure);

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const progress = Math.min(1, Math.max(0, (window.scrollY - heroTop + heroHeight) / heroHeight));
      const shift = (progress - .5) * MAX_SHIFT;
      photo.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0) scale(1)';
      raf = null;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
