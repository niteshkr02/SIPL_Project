/* ════════════════════════════════════════════════════════════════════
   BEYOND STEEL — Premium 3D Card View Slider
   Isolated component. Reads the 5 pillar cards already in the DOM
   (#bs3dStage .bs3d-slot) and drives them with GSAP along an invisible
   circular path: center card facing the viewer, one card peeking on
   each side, the rest parked out of view ready to swing in.

   Falls back to plain CSS transitions if GSAP failed to load from the
   CDN, so the slider still works (just without the named eases).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.getElementById('bs3d');
  const stage = document.getElementById('bs3dStage');
  if (!root || !stage) return;

  const slots = Array.from(stage.querySelectorAll('.bs3d-slot'));
  const n = slots.length;
  if (!n) return;

  const cards = slots.map((slot) => slot.querySelector('.bs3d-card'));
  const dotsWrap = document.getElementById('bs3dDots');
  const prevBtn = root.querySelector('.bs3d-prev');
  const nextBtn = root.querySelector('.bs3d-next');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.inOut';
  const DURATION = reduceMotion ? 0 : 1.05;
  const AUTOPLAY_MS = 3500;
  const SWIPE_THRESHOLD = 60; // px of drag before it counts as a slide change
  const CLICK_SUPPRESS_THRESHOLD = 6; // px of drag before a click is treated as a drag, not a tap

  // Per-viewport look: magnitude values for side cards, mirrored left/right
  // by sign at apply-time. Center card is always the same everywhere.
  const CENTER = { x: 0, z: 0, rotY: 0, scale: 1, opacity: 1, blur: 0, zIndex: 5 };
  const PRESETS = {
    desktop: {
      1: { xMag: 290, z: -140, rotMag: 20, scale: .86, opacity: .5, blur: 1.5, zIndex: 3 },
      2: { xMag: 540, z: -260, rotMag: 30, scale: .7, opacity: 0, blur: 3, zIndex: 1 },
    },
    tablet: {
      1: { xMag: 195, z: -110, rotMag: 18, scale: .8, opacity: .4, blur: 1.5, zIndex: 3 },
      2: { xMag: 340, z: -220, rotMag: 28, scale: .66, opacity: 0, blur: 3, zIndex: 1 },
    },
    mobile: {
      1: { xMag: 170, z: -160, rotMag: 22, scale: .82, opacity: 0, blur: 2, zIndex: 1 },
      2: { xMag: 170, z: -160, rotMag: 22, scale: .82, opacity: 0, blur: 2, zIndex: 0 },
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
    const abs = Math.min(Math.abs(offset), 2);
    const p = PRESETS[mq][abs];
    return {
      x: p.xMag * sign,
      z: p.z,
      rotY: -p.rotMag * sign,
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
        x: t.x, z: t.z, rotationY: t.rotY, scale: t.scale,
        opacity: t.opacity, filter: `blur(${t.blur}px)`,
        duration, ease: EASE, overwrite: 'auto',
      });
    } else {
      card.style.transition = duration
        ? `transform ${duration}s cubic-bezier(.16,.84,.44,1), opacity ${duration}s ease, filter ${duration}s ease`
        : 'none';
      card.style.transform = `translateX(${t.x}px) translateZ(${t.z}px) rotateY(${t.rotY}deg) scale(${t.scale})`;
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
      card.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      card.tabIndex = offset === 0 ? 0 : -1;
    });
    updateDots();
    return items;
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
      btn.className = 'bs3d-dot';
      btn.setAttribute('role', 'tab');
      const label = slot.querySelector('h4');
      btn.setAttribute('aria-label', 'Go to ' + (label ? label.textContent : 'slide ' + (i + 1)));
      btn.addEventListener('click', () => userGoTo(i));
      dotsWrap.appendChild(btn);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => userGoTo(active - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => userGoTo(active + 1));

  // ── keyboard ──
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); userGoTo(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); userGoTo(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); userGoTo(0); }
    else if (e.key === 'End') { e.preventDefault(); userGoTo(n - 1); }
  });

  // ── hover: pause autoplay, lift + glow the center card ──
  function liftCenter(card, on) {
    const item = computeItems().find((it) => it.card === card);
    if (!item || item.offset !== 0) return;
    card.classList.toggle('is-hovered', on);
    if (!gsapReady) return;
    if (on) {
      gsap.to(card, { scale: 1.03, y: -10, duration: .45, ease: 'power2.out', overwrite: 'auto' });
    } else {
      gsap.to(card, { scale: item.target.scale, y: 0, duration: .45, ease: 'power2.out', overwrite: 'auto' });
    }
  }

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => liftCenter(card, true));
    card.addEventListener('mouseleave', () => liftCenter(card, false));

    // side cards recenter on click; the center card is left to navigate normally
    card.addEventListener('click', (e) => {
      const offset = signedOffset(i, active);
      if (offset !== 0) {
        e.preventDefault();
        userGoTo(i);
      }
    });
  });

  root.addEventListener('mouseenter', () => { hovered = true; });
  root.addEventListener('mouseleave', () => { hovered = false; });

  // ── drag / swipe (pointer events cover both mouse and touch) ──
  let pointerDown = false;
  let captured = false;
  let startX = 0;
  let dragMoved = 0;

  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
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
        const clampedX = Math.max(-40, Math.min(40, dx * .12));
        const clampedRot = Math.max(-8, Math.min(8, -dx / 22));
        stage.style.transform = `translateX(${clampedX}px) rotateY(${clampedRot}deg)`;
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

  // ── responsive: re-lay-out (no animation) when the breakpoint changes ──
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
            duration: 1, delay: idx * .12, ease: 'power3.out',
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
    }, { threshold: .3 });
    io.observe(root);
  } else {
    startAutoplay();
  }
})();
