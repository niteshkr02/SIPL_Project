/* ════════════════════════════════════════════════════════════════════
   MARKET PRESENCE — dual-map behavior layer
   Owns exactly two things: the animated tab crossfade (window.mpSwitchMapTab,
   called by the tab click handlers in the shared inline data script) and the
   scroll-gated entrance choreography for the section chrome (badge, heading,
   map groups, routes, pins). Never touches data, renderPins, renderQuickList,
   updateVendorCard or search — those stay in the shared inline script. The
   panel's own entrance/tilt/ripple stay in market-presence-panel.js.
   Falls back to instant, motion-free behavior if GSAP failed to load or the
   user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';

  // ── animated tab crossfade (replaces an instant display:none/block swap) ──
  window.mpSwitchMapTab = function (showEl, hideEl) {
    if (!showEl || !hideEl) return;

    if (!gsapReady || reduceMotion) {
      hideEl.style.display = 'none';
      showEl.style.display = 'block';
      return;
    }

    gsap.to(hideEl, {
      opacity: 0, scale: .97, filter: 'blur(6px)', duration: .22, ease: 'power2.in', overwrite: 'auto',
      onComplete() {
        hideEl.style.display = 'none';
        showEl.style.display = 'block';
        gsap.fromTo(showEl,
          { opacity: 0, scale: .97, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .5, ease: 'power3.out', clearProps: 'opacity,filter,transform' }
        );
      }
    });
  };

  // ── entrance choreography: badge → heading → map draw → routes → pins ──
  const section = document.getElementById('market-presence');
  if (!section || !gsapReady || reduceMotion) return;

  const kicker = section.querySelector('.mp-head .kicker');
  const kickerGlow = section.querySelector('.mp-kicker-glow');
  const heading = section.querySelector('.mp-head h2');
  const subtitle = section.querySelector('.mp-head p');
  const mapGroups = section.querySelectorAll('.countries-group, .states-group');
  const routes = section.querySelectorAll('.mp-route');
  const pinLayers = section.querySelectorAll('.map-pins-layer');

  function playEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (kicker) tl.from(kicker, { opacity: 0, y: -8, duration: .35 });
    if (kickerGlow) tl.from(kickerGlow, { opacity: 0, scaleX: 0, duration: .35 }, '<');
    if (heading) tl.from(heading, { opacity: 0, y: 20, duration: .45 }, '-=.2');
    if (subtitle) tl.from(subtitle, { opacity: 0, y: 12, duration: .4 }, '-=.25');

    mapGroups.forEach((g) => {
      tl.from(g, { opacity: 0, scale: .96, transformOrigin: '50% 50%', duration: .5 }, '-=.2');
    });

    // routes overlap the tail of the map-group reveal rather than waiting
    // for it, with a capped stagger so a large collection (15 routes)
    // never pushes the total out too far.
    if (routes.length) tl.from(routes, { opacity: 0, duration: .4, stagger: { each: .015, from: 'start' } }, '-=.3');
    // markers fade in as one layer (not staggered per-beacon): .map-pin
    // already owns a permanent percentage-based centering transform and its
    // own opacity transition (for the search-dim fade), so a per-marker
    // GSAP transform tween here has too many ways to collide with those —
    // a single clean opacity fade on the shared overlay is the reliable win.
    if (pinLayers.length) tl.from(pinLayers, { opacity: 0, duration: .45 }, '-=.2');
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(section);
          playEntrance();
        }
      });
    }, { threshold: .15 });
    io.observe(section);
  } else {
    playEntrance();
  }
})();
