/* ════════════════════════════════════════════════════════════════════
   SITE LOADING BAR — thin fixed bar across the top of the viewport,
   visible only while the page is actively loading. Self-contained
   (inline styles, no stylesheet dependency) so it paints instantly,
   even before styles.css arrives. Progress tracks real page-load
   signals (resource completions via PerformanceObserver, then
   DOMContentLoaded, then window 'load') rather than a fixed fake
   timer, so a slow page visibly lingers and a fast one snaps through.
   Include as the FIRST script tag right after <body> on every page.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (document.getElementById('pageLoadBar')) return;

  var bar = document.createElement('div');
  bar.id = 'pageLoadBar';
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText =
    'position:fixed;top:0;left:0;height:3px;width:0%;z-index:99999;' +
    'pointer-events:none;' +
    'background:linear-gradient(90deg,#FF6A1F 0%,#0B2554 100%);' +
    'box-shadow:0 0 10px 1px rgba(255,106,31,.5),0 0 5px rgba(11,37,84,.55);' +
    'transition:width .25s ease-out,opacity .4s ease .1s;' +
    'opacity:1;';

  var mount = document.body || document.documentElement;
  mount.insertBefore(bar, mount.firstChild);

  var pct = 0;
  var done = false;

  function setPct(p) {
    if (p <= pct) return;
    pct = Math.min(p, 100);
    bar.style.width = pct + '%';
  }

  setPct(12);

  var expected = Math.max(
    document.querySelectorAll('script[src],link[rel="stylesheet"],img,link[rel="preload"]').length,
    1
  );
  var finished = 0;

  function onResource() {
    finished++;
    setPct(12 + Math.min(finished / expected, 1) * 63);
  }

  if (window.PerformanceObserver) {
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(onResource);
      });
      po.observe({ type: 'resource', buffered: true });
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    setPct(Math.max(pct, 80));
  });

  function finish() {
    if (done) return;
    done = true;
    setPct(100);
    setTimeout(function () {
      bar.style.opacity = '0';
      setTimeout(function () {
        if (bar.parentNode) bar.parentNode.removeChild(bar);
      }, 500);
    }, 200);
  }

  window.addEventListener('load', finish);
  setTimeout(finish, 6000);
})();