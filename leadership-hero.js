/* ════════════════════════════════════════════════════════════════════
   LEADERSHIP — Cinematic Summit Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → label → heading lines → accent glow → description → CTA →
   scroll cue → wave crest line) and nothing else: no pointer tracking,
   no scroll-driven transforms, so the hero stays perfectly still on
   hover exactly as the design brief requires. Falls back to a static,
   unanimated reveal if GSAP failed to load or the user prefers reduced
   motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.lh');
  if (!hero) return;

  const embersLayer = hero.querySelector('.lh-embers');
  const photo = hero.querySelector('.lh-photo');
  const label = hero.querySelector('.lh-label');
  const headingLines = hero.querySelectorAll('.lh-heading-inner');
  const glow = hero.querySelector('.lh-heading-glow');
  const desc = hero.querySelector('.lh-desc');
  const cta = hero.querySelector('.lh-cta-btn');
  const scrollCue = hero.querySelector('.lh-scroll-cue');
  const waveLine = hero.querySelector('.lh-wave-line');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  // ── drifting embers: spawned once, then animated purely by the
  // shared lhEmberDrift CSS keyframe (transform + opacity only) ──
  function spawnEmbers() {
    if (!embersLayer || reduceMotion) return;
    const count = window.innerWidth < 640 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const e = document.createElement('span');
      e.className = 'lh-ember';
      e.style.setProperty('--ex', (Math.random() * 100) + '%');
      e.style.setProperty('--es', (1.6 + Math.random() * 2.4).toFixed(1) + 'px');
      e.style.setProperty('--ed', (10 + Math.random() * 9).toFixed(1) + 's');
      e.style.setProperty('--edelay', (-Math.random() * 20).toFixed(1) + 's');
      e.style.setProperty('--exd', ((Math.random() - .5) * 46).toFixed(0) + 'px');
      e.style.setProperty('--ec', Math.random() > .5 ? 'var(--accent-hot)' : 'var(--accent)');
      embersLayer.appendChild(e);
    }
  }
  spawnEmbers();

  function playEntrance() {
    if (!gsapReady || reduceMotion) {
      if (glow) glow.style.transform = 'scaleX(1)';
      if (scrollCue) scrollCue.style.opacity = 1;
      if (waveLine) { waveLine.style.opacity = 1; waveLine.style.transform = 'scaleX(1)'; }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'sine.out' }, 0);
    if (label) tl.fromTo(label, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .6 }, .15);
    if (headingLines.length) {
      tl.fromTo(headingLines, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, stagger: .12 }, .3);
    }
    if (glow) tl.fromTo(glow, { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power3.inOut' }, .95);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, 1.05);
    if (cta) tl.fromTo(cta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6 }, 1.2);
    if (scrollCue) tl.fromTo(scrollCue, { opacity: 0 }, { opacity: 1, duration: .6 }, 1.35);
    if (waveLine) tl.fromTo(waveLine, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, .9);
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([photo, label, desc, cta].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    if (glow) gsap.set(glow, { scaleX: 0 });
    if (waveLine) gsap.set(waveLine, { opacity: 0, scaleX: 0 });
  }
  requestAnimationFrame(playEntrance);
})();