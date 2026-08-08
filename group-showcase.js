/* ════════════════════════════════════════════════════════════════════
   THE GROUP — Premium Industrial Showcase
   Isolated component. Same coverflow carousel architecture as the
   Beyond Steel slider (beyond-steel-slider.js): index-based, infinite
   via shortest-path modulo offsets, center card facing the viewer with
   two neighbors scaled/faded on each side (5 of the 7 units visible at
   once on desktop), the rest parked out of view ready to swing in. A
   static .grp-slot (carousel position) wraps the animated .grp-card so
   the two transform systems never fight over the same inline style.

   Falls back to plain CSS transitions if GSAP failed to load from the
   CDN, so the slider still works (just without the named eases).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.getElementById('groupShowcase');
  const stage = document.getElementById('grpStage');
  if (!root || !stage) return;

  const slots = Array.from(stage.querySelectorAll('.grp-slot'));
  const n = slots.length;
  if (!n) return;

  const cards = slots.map((slot) => slot.querySelector('.grp-card'));
  const dotsWrap = document.getElementById('grpDots');
  const prevBtn = root.querySelector('.grp-arrow.prev');
  const nextBtn = root.querySelector('.grp-arrow.next');
  const status = root.querySelector('.grp-sr-status');
  const timelineItems = Array.from(document.querySelectorAll('#grpTimeline .grp-tl-item'));

  // first slot found for each founding year, so a timeline click jumps
  // straight to the matching unit; units with no data-year (e.g. the
  // newest acquisition) are only reachable via "All"
  const yearToIndex = {};
  slots.forEach((slot, i) => {
    const year = slot.getAttribute('data-year');
    if (year && !(year in yearToIndex)) yearToIndex[year] = i;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.inOut';
  const DURATION = reduceMotion ? 0 : 1.05;
  const AUTOPLAY_MS = 4200;
  const SWIPE_THRESHOLD = 60; // px of drag before it counts as a slide change
  const CLICK_SUPPRESS_THRESHOLD = 6; // px of drag before a click is treated as a drag, not a tap

  // Per-viewport look: magnitude values for side cards, mirrored left/right
  // by sign at apply-time. Center card is always the same everywhere.
  // Level 3 exists purely to park the two farthest units (n=7, so offsets
  // run to ±3) fully invisible — that caps what reads as "visible" at 5.
  const CENTER = { x: 0, scale: 1, opacity: 1, blur: 0, zIndex: 5 };
  const PRESETS = {
    desktop: {
      1: { xMag: 300, scale: .86, opacity: .55, blur: 0, zIndex: 3 },
      2: { xMag: 560, scale: .74, opacity: .16, blur: 0, zIndex: 1 },
      3: { xMag: 780, scale: .68, opacity: 0, blur: 0, zIndex: 0 },
    },
    tablet: {
      1: { xMag: 210, scale: .82, opacity: .45, blur: 0, zIndex: 3 },
      2: { xMag: 380, scale: .68, opacity: 0, blur: 0, zIndex: 1 },
      3: { xMag: 480, scale: .6, opacity: 0, blur: 0, zIndex: 0 },
    },
    mobile: {
      1: { xMag: 180, scale: .82, opacity: 0, blur: 0, zIndex: 1 },
      2: { xMag: 180, scale: .82, opacity: 0, blur: 0, zIndex: 0 },
      3: { xMag: 180, scale: .82, opacity: 0, blur: 0, zIndex: 0 },
    },
  };

  let active = 0;
  let hovered = false;
  let dragging = false;
  let timer = null;

  function getMQ() {
    const w = root.getBoundingClientRect().width || window.innerWidth;
    if (w <= 640) return 'mobile';
    if (w <= 1022) return 'tablet';
    return 'desktop';
  }

  // shortest signed distance from `active`, wrapped into [-floor(n/2), floor(n/2)]
  function signedOffset(i, activeIndex) {
    const raw = ((i - activeIndex) % n + n) % n;
    return raw > n / 2 ? raw - n : raw;
  }

  function targetFor(offset, mq) {
    if (offset === 0) return CENTER;
    const sign = offset < 0 ? -1 : 1;
    const abs = Math.min(Math.abs(offset), 3);
    const p = PRESETS[mq][abs];
    return {
      x: p.xMag * sign,
      scale: p.scale,
      opacity: p.opacity,
      blur: p.blur,
      zIndex: p.zIndex,
    };
  }

  function computeItems() {
    const mq = getMQ();
    return slots.map((slot, i) => {
      const offset = signedOffset(i, active);
      return { slot, card: cards[i], offset, target: targetFor(offset, mq) };
    });
  }

  function applyCardTransform(card, t, duration) {
    if (gsapReady) {
      gsap.to(card, {
        x: t.x, scale: t.scale,
        opacity: t.opacity, filter: `blur(${t.blur}px)`,
        duration, ease: EASE, overwrite: 'auto',
      });
    } else {
      card.style.transition = duration
        ? `transform ${duration}s cubic-bezier(.16,.84,.44,1), opacity ${duration}s ease, filter ${duration}s ease`
        : 'none';
      card.style.transform = `translateX(${t.x}px) scale(${t.scale})`;
      card.style.opacity = t.opacity;
      card.style.filter = `blur(${t.blur}px)`;
    }
  }

  function render(opts) {
    const duration = opts && opts.duration != null ? opts.duration : DURATION;
    const items = computeItems();
    items.forEach(({ slot, card, offset, target }) => {
      slot.style.zIndex = target.zIndex;
      applyCardTransform(card, target, duration);
      const hidden = target.opacity < .05;
      card.style.pointerEvents = hidden ? 'none' : '';
      slot.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      slot.classList.toggle('is-active', offset === 0);

      const hotspots = card.querySelectorAll('.grp-hotspot');
      hotspots.forEach((h) => { h.tabIndex = hidden ? -1 : 0; });
    });
    updateDots();
    updateStatus();
    return items;
  }

  function updateStatus() {
    if (!status) return;
    const name = slots[active].querySelector('.grp-name');
    status.textContent = 'Showing ' + (active + 1) + ' of ' + n + (name ? ': ' + name.textContent : '');
  }

  function updateDots() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((dot, i) => {
      const isActive = i === active;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function goTo(index) {
    active = ((index % n) + n) % n;
    render();
  }

  function userGoTo(index) {
    goTo(index);
    restartAutoplay();
  }

  function next() { goTo(active + 1); }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = setInterval(() => {
      if (!hovered && !dragging && document.visibilityState === 'visible') next();
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }
  function restartAutoplay() { if (timer) startAutoplay(); }

  // ── pagination dots (built from the cards already in the DOM) ──
  if (dotsWrap) {
    slots.forEach((slot, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'grp-dot';
      btn.setAttribute('role', 'tab');
      const name = slot.querySelector('.grp-name');
      btn.setAttribute('aria-label', 'Go to ' + (name ? name.textContent : 'unit ' + (i + 1)));
      btn.addEventListener('click', () => userGoTo(i));
      dotsWrap.appendChild(btn);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => userGoTo(active - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => userGoTo(active + 1));

  // ── timeline: a click-driven year filter, independent of arrow/dot/swipe
  // navigation — it only changes which button is highlighted when the user
  // interacts with the timeline itself, it doesn't track the carousel ──
  timelineItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      timelineItems.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const year = btn.dataset.year;
      if (year === 'all') userGoTo(0);
      else if (year in yearToIndex) userGoTo(yearToIndex[year]);
    });
  });

  // ── keyboard ──
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); userGoTo(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); userGoTo(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); userGoTo(0); }
    else if (e.key === 'End') { e.preventDefault(); userGoTo(n - 1); }
  });

  // ── hover: pause autoplay, lift + glow the center card ──
  function liftCenter(slot, card, on) {
    const item = computeItems().find((it) => it.card === card);
    if (!item || item.offset !== 0) return;
    slot.classList.toggle('is-hovered', on);
    if (!gsapReady) return;
    if (on) {
      gsap.to(card, { scale: 1.03, y: -10, duration: .45, ease: 'power2.out', overwrite: 'auto' });
    } else {
      gsap.to(card, { scale: item.target.scale, y: 0, duration: .45, ease: 'power2.out', overwrite: 'auto' });
    }
  }

  slots.forEach((slot, i) => {
    const card = cards[i];
    card.addEventListener('mouseenter', () => liftCenter(slot, card, true));
    card.addEventListener('mouseleave', () => liftCenter(slot, card, false));

    // off-center cards recenter on click; hotspots keep their own behavior
    card.addEventListener('click', (e) => {
      if (e.target.closest('.grp-hotspot')) return;
      const offset = signedOffset(i, active);
      if (offset !== 0) userGoTo(i);
    });
  });

  root.addEventListener('mouseenter', () => { hovered = true; });
  root.addEventListener('mouseleave', () => { hovered = false; });
  // keyboard users tabbing through cards/arrows/dots get the same autoplay
  // pause hover users get, so a card doesn't advance out from under them
  root.addEventListener('focusin', () => { hovered = true; });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) hovered = false;
  });

  // ── cursor spotlight (mirrors beyond-steel-slider.js, scoped to
  // .grp-card only — rAF-coalesced so a fast mouse sweep never forces
  // more than one style write per painted frame) ──
  if (canHover && !reduceMotion) {
    cards.forEach((card) => {
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

  // ── drag / swipe (pointer events cover both mouse and touch) ──
  let pointerDown = false;
  let captured = false;
  let startX = 0;
  let dragMoved = 0;

  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.grp-hotspot')) return;
    pointerDown = true;
    dragging = false;
    captured = false;
    dragMoved = 0;
    startX = e.clientX;
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    dragMoved = Math.abs(dx);
    if (dragMoved > 4) {
      dragging = true;
      stage.classList.add('dragging');
      if (!reduceMotion) {
        // rubber-band follow: tracks the pointer closely at first, then
        // resists further travel so side cards never fully reveal what's
        // parked off-stage
        const clampedX = Math.max(-110, Math.min(110, dx * .4));
        stage.style.transform = `translateX(${clampedX}px)`;
      }
    }
    if (dragging && !captured && dragMoved > CLICK_SUPPRESS_THRESHOLD) {
      captured = true;
      stage.setPointerCapture(e.pointerId);
    }
  });

  function endDrag(e) {
    if (!pointerDown) return;
    pointerDown = false;
    stage.classList.remove('dragging');
    stage.style.transform = '';
    if (dragging) {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        userGoTo(active + (dx < 0 ? 1 : -1));
      }
      const suppressClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        stage.removeEventListener('click', suppressClick, true);
      };
      stage.addEventListener('click', suppressClick, true);
    }
    dragging = false;
  }
  window.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // ── responsive: re-layout (no animation) when the breakpoint changes ──
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => render({ duration: 0 }));
  });

  // ── initial layout + entrance animation on first scroll into view ──
  render({ duration: 0 });

  function playEntrance() {
    const items = computeItems();
    if (reduceMotion) return;
    items.forEach(({ card, target }) => {
      if (gsapReady) gsap.set(card, { opacity: 0, y: 34, scale: target.scale * .9 });
      else card.style.opacity = 0;
    });
    items
      .slice()
      .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset)) // center assembles first, sides swing in after
      .forEach(({ card, target }, idx) => {
        if (gsapReady) {
          gsap.to(card, {
            opacity: target.opacity, y: 0, scale: target.scale,
            duration: 1, delay: idx * .1, ease: 'power3.out',
          });
        } else {
          card.style.transition = 'opacity .8s ease';
          card.style.opacity = target.opacity;
        }
      });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(root);
          playEntrance();
          startAutoplay();
        }
      });
    }, { threshold: .2 });
    io.observe(root);
  } else {
    startAutoplay();
  }

  // ── magnetic CTA (shared technique with the Hero) ──
  const cta = root.querySelector('.grp-cta');
  if (cta && gsapReady && !reduceMotion && canHover) {
    const quickX = gsap.quickTo(cta, 'x', { duration: .35, ease: 'power3.out' });
    const quickY = gsap.quickTo(cta, 'y', { duration: .35, ease: 'power3.out' });
    cta.addEventListener('mouseenter', () => quickY(-3));
    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      quickX((e.clientX - rect.left - rect.width / 2) * .3);
      quickY(-3 + (e.clientY - rect.top - rect.height / 2) * .35);
    });
    cta.addEventListener('mouseleave', () => { quickX(0); quickY(0); });
  }
  if (cta) {
    cta.addEventListener('click', (e) => {
      const rect = cta.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.3;
      const ripple = document.createElement('span');
      ripple.className = 'grp-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      cta.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }
})();
