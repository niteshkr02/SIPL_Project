/* ── QUALITY WITHOUT COMPROMISE ──────────────────────────────────────
   Vanilla JS only (no external animation library). The shared .reveal
   -left / .reveal-right / .counter mechanisms (site.js + the inline
   stat-counter script) handle the panel fade-ins and the stat rail
   numbers; this file only adds what that shared system can't — the
   staggered reveal of the editorial list rows and the process rail
   steps.
   ──────────────────────────────────────────────────────────────── */
(function () {
  const section = document.getElementById('qualitySection');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function staggerReveal(list, delayStep) {
    list.forEach(function (el, i) {
      if (reduceMotion) {
        el.classList.add('is-visible');
      } else {
        setTimeout(function () { el.classList.add('is-visible'); }, i * delayStep);
      }
    });
  }

  /* ── editorial list rows ── */
  const rows = Array.prototype.slice.call(section.querySelectorAll('.qs-row'));
  if (rows.length && 'IntersectionObserver' in window) {
    const rowsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        staggerReveal(rows, 90);
        rowsObs.disconnect();
      });
    }, { threshold: .2 });
    rowsObs.observe(rows[0]);
  } else {
    staggerReveal(rows, 0);
  }

  /* ── process rail steps ── */
  const track = section.querySelector('.qs-journey-track');
  const steps = track ? Array.prototype.slice.call(track.querySelectorAll('.qs-jstep')) : [];

  function revealSteps() {
    steps.forEach(function (el, i) {
      const setProgress = function () {
        el.classList.add('is-visible');
        track.style.setProperty('--qs-progress', (i + 1) / steps.length);
      };
      if (reduceMotion) {
        setProgress();
      } else {
        setTimeout(setProgress, i * 130);
      }
    });
  }

  if (track && steps.length && 'IntersectionObserver' in window) {
    const stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealSteps();
        stepObs.disconnect();
      });
    }, { threshold: .3 });
    stepObs.observe(track);
  } else if (track) {
    revealSteps();
  }
})();
