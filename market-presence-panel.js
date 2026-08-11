/* ════════════════════════════════════════════════════════════════════
   MARKET PRESENCE — Premium Enterprise Info Console
   Purely additive: entrance animation, cursor parallax and button ripple
   for #vendorLiveCard (.mpp). Never touches map rendering, pin data,
   search filtering or tab switching — those stay in the shared script.
   Falls back to no-op motion if GSAP failed to load from the CDN.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const panel = document.getElementById('vendorLiveCard');
  if (!panel) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';

  // ── entrance: fade up + scale in once the section is scrolled into view ──
  if (gsapReady && !reduceMotion) {
    gsap.set(panel, { opacity: 0, y: 40, scale: .95 });
  }

  function playEntrance() {
    if (!gsapReady || reduceMotion) return;
    gsap.to(panel, { opacity: 1, y: 0, scale: 1, duration: .9, ease: 'power4.out' });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(panel);
          playEntrance();
        }
      });
    }, { threshold: .2 });
    io.observe(panel);
  } else {
    playEntrance();
  }

  // ── subtle cursor parallax tilt ──
  if (gsapReady && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const quickX = gsap.quickTo(panel, 'rotationY', { duration: .6, ease: 'power3.out' });
    const quickY = gsap.quickTo(panel, 'rotationX', { duration: .6, ease: 'power3.out' });

    panel.style.transformPerspective = 1000;

    panel.addEventListener('mousemove', (e) => {
      // The quick-jump directory holds clickable state names — tilting the
      // whole card while the pointer is over them shifts the name out from
      // under the cursor as it rotates, so clicks there miss. Hold the card
      // flat (and hands off further movement) whenever the pointer is inside it.
      if (e.target.closest('.mpp-directory')) {
        quickX(0);
        quickY(0);
        return;
      }
      const rect = panel.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      quickX(nx * 4);
      quickY(-ny * 4);
    });

    panel.addEventListener('mouseleave', () => {
      quickX(0);
      quickY(0);
    });
  }


  // ── button ripple (primary/secondary contact actions) ──
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.mpp-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const ripple = document.createElement('span');
    ripple.className = 'mpp-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();
