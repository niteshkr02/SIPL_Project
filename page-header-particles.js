/* ════════════════════════════════════════════════════════════════════
   PAGE HEADER — drifting glow-dot particles, shared by every page that
   uses the generic `.page-header`. Mirrors hero-cinematic.js /
   product-hero.js: a handful of plain spans injected once with
   randomized CSS custom properties, animated entirely by the CSS
   keyframe (no per-frame JS).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var host = document.querySelector('.page-header-particles');
  if (!host) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var COUNT = 14;
  var hues = ['#FF6A1F', '#FFC24B'];
  var frag = document.createDocumentFragment();
  for (var i = 0; i < COUNT; i++) {
    var span = document.createElement('span');
    span.className = 'page-header-particle';
    var dur = 14 + Math.random() * 12;
    span.style.setProperty('--x', (Math.random() * 100) + '%');
    span.style.setProperty('--size', (2 + Math.random() * 2.5) + 'px');
    span.style.setProperty('--dur', dur + 's');
    span.style.setProperty('--delay', (-Math.random() * dur) + 's');
    span.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
    span.style.setProperty('--hue', hues[i % 2]);
    frag.appendChild(span);
  }
  host.appendChild(frag);
})();
