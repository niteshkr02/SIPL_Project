/* ════════════════════════════════════════════════════════════════════
   AWARDS & RECOGNITION — Premium Museum-Style Gallery
   Isolated component. Reads award data straight off the DOM (data-year
   on each .awx-slot; title/issuer/description already in the markup),
   so the HTML stays the single source of truth. Drives an infinite,
   index-based carousel — the same proven approach as the Beyond Steel
   slider, generalized to a variable visible-card count (3/2/1) and a
   filterable dataset (the year timeline).

   Reuses the existing global openCertModal()/closeCertModal() for the
   "View Details" lightbox — that component is untouched.
   Falls back to a static, unanimated layout if GSAP failed to load.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const section = document.getElementById('awardsGallery');
  const track = document.getElementById('awxTrack');
  if (!section || !track) return;

  const slotEls = Array.from(track.querySelectorAll('.awx-slot'));
  if (!slotEls.length) return;

  const slots = slotEls.map((slotEl) => ({
    slotEl,
    cardEl: slotEl.querySelector('.awx-card'),
    detailsBtn: slotEl.querySelector('.awx-details-btn'),
    year: Number(slotEl.dataset.year),
    title: slotEl.querySelector('.awx-title') ? slotEl.querySelector('.awx-title').textContent.trim() : '',
    issuer: slotEl.querySelector('.awx-issuer') ? slotEl.querySelector('.awx-issuer').textContent.trim() : '',
  }));

  // "View Details" opens the existing certificate lightbox (openCertModal is a
  // global defined earlier in the page and left untouched by this redesign).
  slots.forEach((slot) => {
    if (!slot.detailsBtn) return;
    slot.detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.openCertModal === 'function') {
        window.openCertModal(slot.detailsBtn.dataset.certImg, slot.detailsBtn.dataset.certTitle);
      }
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';
  const DURATION = reduceMotion ? 0 : 0.95;
  const GAP = 32;

  const liveRegion = document.getElementById('awxLiveRegion');
  const progressFill = document.getElementById('awxProgressFill');
  const prevBtn = document.querySelector('.awx-arrow.prev');
  const nextBtn = document.querySelector('.awx-arrow.next');
  const timelineEl = document.getElementById('awxTimeline');
  const yearButtons = timelineEl ? Array.from(timelineEl.querySelectorAll('.awx-year-btn')) : [];
  const indicator = document.getElementById('awxTimelineIndicator');

  let activeIndex = 0;
  let activeYear = null; // null = all years

  function getVisibleData() {
    return activeYear == null ? slots : slots.filter((s) => s.year === activeYear);
  }

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1180) return 2;
    return 3;
  }

  function windowRange(count) {
    return [-Math.floor((count - 1) / 2), Math.ceil((count - 1) / 2)];
  }

  // shortest signed distance from `active`, wrapped into [-floor(n/2), floor(n/2)]
  function signedOffset(i, active, n) {
    const raw = ((i - active) % n + n) % n;
    return raw > n / 2 ? raw - n : raw;
  }

  function getCardStep() {
    const w = slots[0].slotEl.getBoundingClientRect().width;
    return (w || 300) + GAP;
  }

  function targetFor(offset, inWindow, step) {
    if (!inWindow) {
      const sign = offset < 0 ? -1 : 1;
      return { x: sign * step * 1.35, scale: .85, opacity: 0, z: 0 };
    }
    const isActive = offset === 0;
    return { x: offset * step, scale: isActive ? 1.06 : .94, opacity: 1, z: isActive ? 3 : 2 };
  }

  function applySlot(slotEl, target, duration) {
    slotEl.style.zIndex = target.z;
    if (gsapReady) {
      gsap.to(slotEl, { x: target.x, scale: target.scale, opacity: target.opacity, duration, ease: EASE, overwrite: 'auto' });
    } else {
      slotEl.style.transition = duration ? `transform ${duration}s cubic-bezier(.16,.84,.44,1), opacity ${duration}s ease` : 'none';
      slotEl.style.transform = `translateX(${target.x}px) scale(${target.scale})`;
      slotEl.style.opacity = target.opacity;
    }
  }

  function updateProgress(n, idx) {
    if (!progressFill) return;
    const seg = n > 0 ? 100 / n : 100;
    progressFill.style.width = seg + '%';
    progressFill.style.left = (idx * seg) + '%';
  }

  function updateTimelineUI() {
    yearButtons.forEach((btn) => {
      const isAll = btn.dataset.year === 'all';
      const isActive = isAll ? activeYear == null : Number(btn.dataset.year) === activeYear;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (!indicator || !timelineEl) return;
    const activeBtn = yearButtons.find((b) => b.classList.contains('active'));
    if (!activeBtn) return;
    const trackRect = timelineEl.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicator.style.width = btnRect.width + 'px';
    indicator.style.transform = `translateX(${btnRect.left - trackRect.left}px)`;
  }

  function render(opts) {
    const duration = opts && opts.duration != null ? opts.duration : DURATION;
    const visible = getVisibleData();
    const n = visible.length;
    const vc = Math.min(getVisibleCount(), Math.max(n, 1));
    const [lo, hi] = windowRange(vc);
    const step = getCardStep();

    slots.forEach((slot) => {
      const vIndex = visible.indexOf(slot);
      const filteredOut = vIndex === -1;
      const offset = filteredOut ? 99 : signedOffset(vIndex, activeIndex, n);
      const inWindow = !filteredOut && offset >= lo && offset <= hi;

      applySlot(slot.slotEl, targetFor(offset, inWindow, step), duration);
      slot.slotEl.classList.toggle('is-active', inWindow && offset === 0);

      const hidden = !inWindow;
      slot.slotEl.style.pointerEvents = hidden ? 'none' : '';
      slot.slotEl.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      if (slot.detailsBtn) slot.detailsBtn.tabIndex = hidden ? -1 : 0;
    });

    updateProgress(n, n ? activeIndex : 0);

    if (liveRegion) {
      const active = visible[((activeIndex % n) + n) % n];
      if (active) liveRegion.textContent = `Showing: ${active.title}, ${active.issuer}, ${active.year}`;
    }
  }

  function goTo(index) {
    const n = getVisibleData().length;
    if (!n) return;
    activeIndex = ((index % n) + n) % n;
    render();
  }
  function next() { goTo(activeIndex + 1); }
  function prev() { goTo(activeIndex - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => prev());
  if (nextBtn) nextBtn.addEventListener('click', () => next());

  // ripple on the nav arrows
  [prevBtn, nextBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement('span');
      ripple.className = 'awx-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ── year timeline filter ──
  yearButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isAll = btn.dataset.year === 'all';
      const year = isAll ? null : Number(btn.dataset.year);
      activeYear = (activeYear === year) ? null : year;
      activeIndex = 0;
      updateTimelineUI();
      render();
    });
  });

  // ── keyboard ──
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(getVisibleData().length - 1); }
  });

  // ── wheel (cooldown so a single trackpad gesture doesn't fire many steps) ──
  let wheelCooldown = false;
  track.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12) return;
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    if (delta > 0) next(); else prev();
    setTimeout(() => { wheelCooldown = false; }, 550);
  }, { passive: false });

  // ── drag / swipe (pointer events cover mouse + touch); a live nudge on the
  //    whole track gives tactile follow, then releases into an index snap ──
  let pointerDown = false, dragging = false, captured = false;
  let startX = 0, dragMoved = 0, lastPointerX = 0, lastMoveTime = 0, velocity = 0;
  const CLICK_SUPPRESS_THRESHOLD = 6;

  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.awx-details-btn')) return;
    pointerDown = true;
    dragging = false;
    captured = false;
    dragMoved = 0;
    startX = e.clientX;
    lastPointerX = e.clientX;
    lastMoveTime = performance.now();
    velocity = 0;
  });

  track.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    const now = performance.now();
    const dtMs = Math.max(now - lastMoveTime, 1);
    velocity = (e.clientX - lastPointerX) / (dtMs / 1000);
    dragMoved = Math.abs(e.clientX - startX);

    if (dragMoved > 4) {
      dragging = true;
      track.classList.add('dragging');
    }
    if (dragging && gsapReady && !reduceMotion) {
      gsap.set(track, { x: (e.clientX - startX) * .85 });
    }
    if (dragging && !captured && dragMoved > CLICK_SUPPRESS_THRESHOLD) {
      captured = true;
      track.setPointerCapture(e.pointerId);
    }
    lastPointerX = e.clientX;
    lastMoveTime = now;
  });

  function endDrag(e) {
    if (!pointerDown) return;
    pointerDown = false;
    track.classList.remove('dragging');

    if (dragging) {
      const endX = (e && e.clientX != null) ? e.clientX : lastPointerX;
      const totalDx = endX - startX;
      const step = getCardStep();
      const projected = totalDx + velocity * .15;
      const steps = Math.round(-projected / step);
      if (steps !== 0) goTo(activeIndex + steps);
      else render();

      if (gsapReady) gsap.to(track, { x: 0, duration: .6, ease: 'power3.out', overwrite: 'auto' });

      const suppressClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        track.removeEventListener('click', suppressClick, true);
      };
      track.addEventListener('click', suppressClick, true);
    }
    dragging = false;
  }
  window.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // ── subtle whole-track parallax tilt on mouse movement ──
  if (gsapReady && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const quickRotX = gsap.quickTo(track, 'rotationX', { duration: .6, ease: 'power3.out' });
    const quickRotY = gsap.quickTo(track, 'rotationY', { duration: .6, ease: 'power3.out' });
    track.addEventListener('mousemove', (e) => {
      if (dragging) return;
      const rect = track.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      quickRotY(nx * 2.5);
      quickRotX(-ny * 2.5);
    });
    track.addEventListener('mouseleave', () => { quickRotX(0); quickRotY(0); });
  }

  // ── breathing float + hover lift (own transform layer, separate from the
  //    slot's carousel-position transform, so the two never conflict) ──
  function startBreathing(cardEl) {
    if (!gsapReady || reduceMotion) return;
    cardEl._breatheTween = gsap.to(cardEl, {
      y: 8,
      duration: 6 + Math.random() * 2,
      delay: Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  function setHover(slot, on) {
    slot.slotEl.classList.toggle('is-hovered', on);
    if (!gsapReady || reduceMotion) return;
    if (on) {
      if (slot.cardEl._breatheTween) slot.cardEl._breatheTween.pause();
      gsap.to(slot.cardEl, { y: -12, rotationX: 3, rotationY: -3, scale: 1.03, duration: .45, ease: EASE, overwrite: 'auto' });
    } else {
      gsap.to(slot.cardEl, {
        y: 0, rotationX: 0, rotationY: 0, scale: 1, duration: .45, ease: EASE, overwrite: 'auto',
        onComplete: () => { if (slot.cardEl._breatheTween) slot.cardEl._breatheTween.resume(); },
      });
    }
  }

  slots.forEach((slot) => {
    slot.cardEl.addEventListener('mouseenter', () => setHover(slot, true));
    slot.cardEl.addEventListener('mouseleave', () => setHover(slot, false));
    if (slot.detailsBtn) {
      slot.detailsBtn.addEventListener('focus', () => setHover(slot, true));
      slot.detailsBtn.addEventListener('blur', () => setHover(slot, false));
    }
    startBreathing(slot.cardEl);
  });

  // ── responsive re-layout (no animation) on breakpoint / resize ──
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => { render({ duration: 0 }); updateTimelineUI(); });
  });

  // ── initial layout + entrance ──
  render({ duration: 0 });
  updateTimelineUI();

  function playEntrance() {
    const cardEls = slots.map((s) => s.cardEl);
    if (!gsapReady || reduceMotion) {
      cardEls.forEach((c) => { c.style.opacity = 1; });
      return;
    }
    gsap.set(cardEls, { opacity: 0, y: 60, scale: .9, filter: 'blur(10px)' });
    gsap.to(cardEls, {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      duration: .9, ease: EASE, stagger: .08,
    });
  }

  if (gsapReady && !reduceMotion) gsap.set(slots.map((s) => s.cardEl), { opacity: 0 });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(track);
          playEntrance();
        }
      });
    }, { threshold: .15 });
    io.observe(track);
  } else {
    playEntrance();
  }
})();
