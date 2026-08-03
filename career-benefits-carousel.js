/* ════════════════════════════════════════════════════════════════════
   CAREER BENEFITS CAROUSEL — "Why Join Us" premium coverflow carousel
   Isolated component (see career-benefits-carousel.css). Guards on its
   own root element (#cbcCarousel) so it's a no-op on any page that
   doesn't include the markup.

   Positioning model: no cloned slides / no scrolling strip. Each of the
   6 real slides gets a *circular* signed distance from the active
   index (shortest way round, e.g. 5 -> 0 is +1, not -5) and is placed
   with CSS custom properties (--tx/--sc/--op/--z) the browser then
   transitions. That's what makes the loop seamless: going from the
   last slide to the first animates exactly like any other step.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.getElementById('cbcCarousel');
  if (!root) return;

  const trackWrap = root.querySelector('.cbc-track-wrap');
  const track = root.querySelector('.cbc-track');
  const slides = Array.from(track.querySelectorAll('.cbc-slide'));
  const total = slides.length;
  if (!total) return;

  const prevBtn = root.querySelector('.cbc-prev');
  const nextBtn = root.querySelector('.cbc-next');
  const dotsWrap = root.querySelector('.cbc-dots');
  const status = root.querySelector('.cbc-sr-status');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  let activeIndex = 0;
  let cfg = { step: 260, maxDelta: 2, scale: [1, .86, .74], opacity: [1, .55, .16] };
  let autoplayTimer = null;
  const autoplayDelay = parseInt(root.dataset.autoplayDelay, 10) || 4500;
  let isPaused = false;
  let isDragging = false;

  // ── pagination dots (count derives from the slides that exist, not a hardcoded number) ──
  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cbc-dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', 'Go to benefit ' + (i + 1) + ' of ' + total);
    btn.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function circularDelta(i, active) {
    let d = i - active;
    d = ((d % total) + total) % total;
    if (d > total / 2) d -= total;
    return d;
  }

  function computeConfig() {
    const w = window.innerWidth;
    const cardWidth = slides[activeIndex].getBoundingClientRect().width || 320;
    if (w <= 640) {
      // mobile: only the center card is meant to read as "displayed"
      cfg = { step: cardWidth * 1.08, maxDelta: 1, scale: [1, .82], opacity: [1, 0] };
    } else if (w <= 1024) {
      // tablet: center + one neighbor peeking in ≈ two cards on screen
      cfg = { step: cardWidth * 0.82, maxDelta: 1, scale: [1, .88], opacity: [1, .45] };
    } else {
      // desktop: center + both neighbors, third ring kept for smooth depth continuity
      cfg = { step: cardWidth * 0.76, maxDelta: 2, scale: [1, .86, .74], opacity: [1, .55, .16] };
    }
  }

  function render() {
    slides.forEach((slide, i) => {
      const delta = circularDelta(i, activeIndex);
      const absDelta = Math.abs(delta);
      const within = absDelta <= cfg.maxDelta;
      const scale = cfg.scale[Math.min(absDelta, cfg.scale.length - 1)];
      const opacity = within ? cfg.opacity[Math.min(absDelta, cfg.opacity.length - 1)] : 0;

      slide.style.setProperty('--tx', (delta * cfg.step) + 'px');
      slide.style.setProperty('--sc', scale);
      slide.style.setProperty('--op', opacity);
      slide.style.setProperty('--z', total - absDelta);
      slide.classList.toggle('is-center', delta === 0);
      slide.classList.toggle('is-far', absDelta >= 2);
      slide.classList.toggle('is-hidden-visual', !within);
      slide.setAttribute('aria-hidden', delta === 0 ? 'false' : 'true');

      const card = slide.querySelector('.cbc-card');
      if (card) card.tabIndex = delta === 0 ? 0 : -1;
    });

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    if (status) {
      const title = slides[activeIndex].querySelector('h3');
      status.textContent = 'Showing ' + (activeIndex + 1) + ' of ' + total + (title ? ': ' + title.textContent : '');
    }
  }

  function goTo(index, userInitiated) {
    activeIndex = ((index % total) + total) % total;
    render();
    if (userInitiated) restartAutoplay();
  }
  function next(userInitiated) { goTo(activeIndex + 1, userInitiated); }
  function prev(userInitiated) { goTo(activeIndex - 1, userInitiated); }

  // ── autoplay: setTimeout chain (not setInterval) so pause/resume never
  // leaves a stale tick queued up behind the pause ──
  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    autoplayTimer = setTimeout(() => {
      if (!isPaused) next(false);
      startAutoplay();
    }, autoplayDelay);
  }
  function stopAutoplay() {
    if (autoplayTimer) { clearTimeout(autoplayTimer); autoplayTimer = null; }
  }
  function restartAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    startAutoplay();
  }

  root.addEventListener('mouseenter', () => { isPaused = true; });
  root.addEventListener('mouseleave', () => { isPaused = false; });
  root.addEventListener('focusin', () => { isPaused = true; });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) isPaused = false;
  });

  prevBtn.addEventListener('click', () => prev(true));
  nextBtn.addEventListener('click', () => next(true));

  trackWrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(true); }
  });

  // clicking a visible side card brings it to center
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => { if (i !== activeIndex) goTo(i, true); });
  });

  // ── cursor spotlight (mirrors site.js's .panel treatment, scoped to .cbc-card
  // only — rAF-coalesced so a fast mouse sweep never forces more than one
  // style write per painted frame) ──
  if (canHover && !reduceMotion) {
    slides.forEach((slide) => {
      const card = slide.querySelector('.cbc-card');
      if (!card) return;
      let rect = null, raf = null;
      card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
        });
      });
      card.addEventListener('mouseleave', () => { rect = null; if (raf) { cancelAnimationFrame(raf); raf = null; } });
    });
  }

  // ── swipe / drag: the track (not individual slides) follows the pointer
  // live via --drag, then snaps to the nearest slide on release ──
  (function initDrag() {
    let startX = 0, dragX = 0, pointerId = null;
    const dragThreshold = 40;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      dragX = 0;
      isDragging = true;
      isPaused = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;
      dragX = e.clientX - startX;
      track.style.setProperty('--drag', dragX + 'px');
    });

    function endDrag(e) {
      if (!isDragging || e.pointerId !== pointerId) return;
      isDragging = false;
      isPaused = false;
      track.classList.remove('is-dragging');
      track.style.removeProperty('--drag');
      if (dragX > dragThreshold) prev(true);
      else if (dragX < -dragThreshold) next(true);
      dragX = 0;
      pointerId = null;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
  })();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { computeConfig(); render(); }, 150);
  });

  // ── reveal the carousel (background + track slide-up) once it scrolls into view ──
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(root);
        root.classList.add('is-visible');
      });
    }, { threshold: .2 });
    obs.observe(root);
  } else {
    root.classList.add('is-visible');
  }

  computeConfig();
  render();
  startAutoplay();
})();
