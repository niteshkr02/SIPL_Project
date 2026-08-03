/* ── QUALITY WITHOUT COMPROMISE ──────────────────────────────────────
   Vanilla JS only (no external animation library), following the
   pattern documented in trusted-by-section.js: the shared .reveal /
   .counter system (site.js) handles the header + ring numbers; this
   file only adds what that shared system can't — ring stroke sweep,
   staggered timeline steps, and a lightweight cursor spotlight on the
   quality cards.
   ──────────────────────────────────────────────────────────────── */
(function () {
  const section = document.getElementById('qualitySection');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  /* ── progress rings ── */
  const ringsWrap = section.querySelector('.qw-rings');
  if (ringsWrap && 'IntersectionObserver' in window) {
    const ringObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.qw-ring-item').forEach(function (item) {
          const circle = item.querySelector('.qw-ring-progress');
          if (!circle) return;
          const pct = parseFloat(item.dataset.pct || '0');
          const circumference = parseFloat(circle.getAttribute('stroke-dasharray')) || 314.16;
          const offset = circumference * (1 - pct / 100);
          if (reduceMotion) {
            circle.style.transition = 'none';
            circle.style.strokeDashoffset = offset;
          } else {
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                circle.style.strokeDashoffset = offset;
              });
            });
          }
        });
        ringObs.unobserve(entry.target);
      });
    }, { threshold: .4 });
    ringObs.observe(ringsWrap);
  }

  /* ── timeline stagger ── */
  const rail = section.querySelector('.qw-timeline-rail');
  const steps = rail ? Array.prototype.slice.call(rail.querySelectorAll('.qw-step')) : [];
  if (rail && steps.length && 'IntersectionObserver' in window) {
    const timelineObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        rail.classList.add('is-live');
        steps.forEach(function (step, i) {
          if (reduceMotion) {
            step.classList.add('is-visible');
          } else {
            setTimeout(function () { step.classList.add('is-visible'); }, i * 150);
          }
        });
        timelineObs.unobserve(entry.target);
      });
    }, { threshold: .35 });
    timelineObs.observe(rail);
  }

  /* ── card cursor spotlight ── */
  /* Rect cached on mouseenter, style write coalesced into one rAF per frame
     — never more than one layout read + one style write per painted frame. */
  if (canHover && !reduceMotion) {
    section.querySelectorAll('.qw-card').forEach(function (card) {
      var rect = null;
      var raf = null;
      var px = .5, py = .5;
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        px = (e.clientX - rect.left) / rect.width;
        py = (e.clientY - rect.top) / rect.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
        });
      });
      card.addEventListener('mouseleave', function () {
        rect = null;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    });
  }
})();
