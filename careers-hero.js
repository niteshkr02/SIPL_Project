/* ════════════════════════════════════════════════════════════════════
   CAREERS — "Build Your Future With Us." Hero behavior
   Isolated component. Drives the one-time entrance sequence (photo
   reveal → badge → heading lines → copy → CTA → five feature items),
   a small generated network of connection lines/pulsing nodes over the
   dark navy field, and a subtle desktop-only mouse parallax across the
   photo and the ambient sunrise glow. Falls back to a static,
   unanimated reveal if GSAP failed to load or the user prefers reduced
   motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const hero = document.querySelector('.cah');
  if (!hero) return;

  const photo = hero.querySelector('.cah-visual-img');
  const visual = hero.querySelector('.cah-visual');
  const glowWrap = hero.querySelector('.cah-glow-wrap');
  const networkLayer = hero.querySelector('.cah-network');
  const badge = hero.querySelector('.cah-badge');
  const headingLines = hero.querySelectorAll('.cah-heading .line');
  const desc = hero.querySelector('.cah-desc');
  const ctaRow = hero.querySelector('.cah-cta-row');
  const featureItems = hero.querySelectorAll('.cah-feature');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // ── drifting glow particles: plain spans positioned once with
  // randomized CSS custom properties, animated entirely by the shared
  // CSS keyframe (no per-frame JS) ──
  const particleHost = hero.querySelector('#cahParticles');
  if (particleHost && !reduceMotion) {
    const COUNT = 14;
    const hues = ['#FF6B00', '#FF7518'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'cah-particle';
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
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // ── faint career-network: a handful of connection lines with pulsing
  // orange nodes, confined to the dark navy field on the left ──
  function buildNetwork() {
    if (!networkLayer || window.innerWidth < 900) return;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    const points = [
      [6, 18], [24, 10], [15, 38], [32, 30], [10, 58],
      [27, 52], [18, 78], [34, 70], [8, 92],
    ];
    const links = [[0, 1], [0, 2], [2, 3], [1, 3], [2, 4], [4, 5], [3, 5], [4, 6], [6, 7], [5, 7], [6, 8]];

    links.forEach(([a, b]) => {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', points[a][0]);
      line.setAttribute('y1', points[a][1]);
      line.setAttribute('x2', points[b][0]);
      line.setAttribute('y2', points[b][1]);
      line.setAttribute('stroke', 'rgba(255, 255, 255, .14)');
      line.setAttribute('stroke-width', '.2');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line);
    });

    networkLayer.appendChild(svg);

    points.forEach(([x, y], i) => {
      const dot = document.createElement('span');
      dot.className = 'cah-network-node';
      dot.style.setProperty('--x', x + '%');
      dot.style.setProperty('--y', y + '%');
      dot.style.setProperty('--dur', (3 + (i % 4) * .6) + 's');
      dot.style.setProperty('--delay', (i * .45) + 's');
      networkLayer.appendChild(dot);
    });
  }

  function playEntrance() {
    buildNetwork();

    if (!gsapReady || reduceMotion) {
      if (photo) { photo.style.opacity = 1; }
      [badge, desc, ctaRow].forEach((el) => { if (el) el.style.opacity = 1; });
      headingLines.forEach((el) => { el.style.opacity = 1; });
      featureItems.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (photo) tl.fromTo(photo, { opacity: 0, scale: 1.09, y: 15 }, { opacity: 1, scale: 1.05, y: 0, duration: 1.7, ease: 'sine.out' }, 0);
    if (badge) tl.fromTo(badge, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .55 }, .1);
    if (headingLines.length) tl.fromTo(headingLines, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .75, stagger: .1 }, .2);
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .65 }, .4);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .55 }, .55);

    featureItems.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .5 }, .7 + i * .1));
  }

  if (gsapReady && !reduceMotion) {
    gsap.set([badge, desc, ctaRow].filter(Boolean), { opacity: 0 });
    if (headingLines.length) gsap.set(headingLines, { opacity: 0 });
    gsap.set(Array.from(featureItems), { opacity: 0 });
  }
  requestAnimationFrame(playEntrance);

  if (reduceMotion || !gsapReady) return;

  // ── desktop-only mouse parallax: photo and ambient glow move at
  // their own subtle depth, capped well under 15px, text stays put ──
  if (window.matchMedia('(hover: hover)').matches && window.matchMedia('(min-width: 901px)').matches) {
    const quickVisualX = visual ? gsap.quickTo(visual, 'x', { duration: .7, ease: 'power3.out' }) : null;
    const quickVisualY = visual ? gsap.quickTo(visual, 'y', { duration: .7, ease: 'power3.out' }) : null;
    const quickGlowX = glowWrap ? gsap.quickTo(glowWrap, 'x', { duration: .8, ease: 'power3.out' }) : null;
    const quickGlowY = glowWrap ? gsap.quickTo(glowWrap, 'y', { duration: .8, ease: 'power3.out' }) : null;

    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      if (quickVisualX) quickVisualX(-nx * 10);
      if (quickVisualY) quickVisualY(-ny * 8);
      if (quickGlowX) quickGlowX(-nx * 14);
      if (quickGlowY) quickGlowY(-ny * 12);
    });
    hero.addEventListener('mouseleave', () => {
      if (quickVisualX) quickVisualX(0);
      if (quickVisualY) quickVisualY(0);
      if (quickGlowX) quickGlowX(0);
      if (quickGlowY) quickGlowY(0);
    });
  }
})();
