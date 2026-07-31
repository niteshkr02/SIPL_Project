/* ════════════════════════════════════════════════════════════════════
   CLIENTELE — Premium Client Trust Ecosystem behavior
   Isolated component. Drives the section entrance (badge → heading →
   subtitle → metrics → cards), the filter chips, card hover lift +
   whole-grid parallax, the detail panel, the magnetic CTA and the
   occasional floating particle. Falls back to a static, unanimated
   reveal if GSAP failed to load or the user prefers reduced motion.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const section = document.getElementById('clientele');
  if (!section) return;

  const badge = section.querySelector('.cli-badge');
  const heading = section.querySelector('.cli-head h2');
  const divider = section.querySelector('.cli-divider');
  const subtitle = section.querySelector('.cli-head p');
  const metrics = section.querySelector('.cli-metrics');
  const metricNodes = metrics ? metrics.querySelectorAll('.counter') : [];
  const filters = section.querySelector('.cli-filters');
  const grid = section.querySelector('.cli-grid');
  const cards = grid ? Array.from(grid.querySelectorAll('.cli-card')) : [];
  const ctaRow = section.querySelector('.cli-cta-row');
  const particlesLayer = section.querySelector('.cli-particles');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = typeof window.gsap !== 'undefined';
  const EASE = 'power4.out';

  function triggerCounters() {
    metricNodes.forEach((el) => {
      if (el._counted) return;
      el._counted = true;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      if (reduceMotion || !gsapReady) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease: 'expo.out',
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
      });
    });
  }

  function spawnParticles() {
    if (!particlesLayer || reduceMotion) return;
    for (let i = 0; i < 9; i++) {
      const p = document.createElement('span');
      p.className = 'cli-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (2 + Math.random() * 2) + 'px');
      p.style.setProperty('--pd', (7 + Math.random() * 8) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 30) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 40) + 'px');
      particlesLayer.appendChild(p);
    }
  }

  function playEntrance() {
    spawnParticles();

    if (!gsapReady || reduceMotion) {
      triggerCounters();
      cards.forEach((c) => { c.style.opacity = 1; });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 40, scale: .95, filter: 'blur(8px)' });

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    if (badge) tl.fromTo(badge, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .6 }, 0);
    if (heading) tl.fromTo(heading, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, .12);
    if (divider) tl.fromTo(divider, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .6 }, .32);
    if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7 }, .4);
    if (metrics) tl.fromTo(metrics, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, onStart: triggerCounters }, .58);
    if (filters) tl.fromTo(filters, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, .75);
    if (cards.length) tl.to(cards, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .8, stagger: { each: .02, from: 'start' } }, .85);
    if (ctaRow) tl.fromTo(ctaRow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, '-=.3');
  }

  if (gsapReady && !reduceMotion) gsap.set(cards, { opacity: 0 });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.unobserve(section);
          playEntrance();
        }
      });
    }, { threshold: .1 });
    io.observe(section);
  } else {
    playEntrance();
  }

  // ── filter chips ──
  if (filters && cards.length) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.cli-filter-btn');
      if (!btn) return;
      filters.querySelectorAll('.cli-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const cats = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        if (!gsapReady || reduceMotion) {
          card.classList.toggle('is-hidden', !show);
          return;
        }
        if (show) {
          card.classList.remove('is-hidden');
          gsap.fromTo(card, { opacity: 0, y: 14, scale: .95 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: EASE });
        } else {
          gsap.to(card, {
            opacity: 0, y: 14, scale: .95, duration: .3, ease: 'power2.in',
            onComplete: () => card.classList.add('is-hidden'),
          });
        }
      });
    });
  }

  // ── detail panel ──
  const overlay = document.getElementById('cliPanelOverlay');
  const panelLogo = document.getElementById('cliPanelLogo');
  const panelName = document.getElementById('cliPanelName');
  const panelTags = document.getElementById('cliPanelTags');
  const panelDesc = document.getElementById('cliPanelDesc');
  let lastFocused = null;

  const SECTOR_COPY = {
    government: 'A public infrastructure body Shakambhari Group is proud to supply reinforcement and structural steel to, meeting government quality and compliance standards.',
    psu: 'A public sector undertaking Shakambhari Group partners with, supplying steel that meets the rigorous quality benchmarks of national enterprise.',
    defence: 'A defence and strategic organisation supplied under the same quality discipline Shakambhari Group applies across every critical project.',
    infrastructure: 'An infrastructure leader building the roads, bridges and public works that Shakambhari steel helps reinforce.',
    power: 'A power sector organisation relying on Shakambhari steel for the structural integrity of energy infrastructure.',
    construction: 'A leading EPC and construction partner building nationally significant projects with Shakambhari steel.',
  };

  function openPanel(card) {
    const img = card.querySelector('.cli-card-logo img');
    const name = card.querySelector('.cli-card-name');
    const tagEls = card.querySelectorAll('.cli-card-tag');
    if (panelLogo) panelLogo.innerHTML = img ? `<img src="${img.currentSrc || img.src}" alt="${img.alt}">` : '';
    if (panelName) panelName.textContent = name ? name.textContent.trim() : '';
    if (panelTags) {
      panelTags.innerHTML = '';
      tagEls.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'cli-card-tag';
        span.textContent = t.textContent;
        panelTags.appendChild(span);
      });
    }
    const primaryCat = (card.dataset.category || '').split(' ')[0];
    if (panelDesc) panelDesc.textContent = SECTOR_COPY[primaryCat] || 'A trusted Shakambhari Group partner in nation-building infrastructure.';

    lastFocused = document.activeElement;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.cli-panel-close').focus();
  }

  function closePanel() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.cli-panel-close')) closePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closePanel();
    });
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openPanel(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(card); }
    });
  });

  if (reduceMotion || !gsapReady) return;

  // ── card hover lift ──
  function lift(card, on) {
    gsap.to(card, { y: on ? -12 : 0, scale: on ? 1.03 : 1, duration: .45, ease: 'power3.out', overwrite: 'auto' });
  }
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => lift(card, true));
    card.addEventListener('mouseleave', () => lift(card, false));
    card.addEventListener('focus', () => lift(card, true));
    card.addEventListener('blur', () => lift(card, false));
  });

  // ── whole-grid tilt parallax ──
  if (grid && window.matchMedia('(hover: hover)').matches) {
    const quickRotX = gsap.quickTo(grid, 'rotationX', { duration: .6, ease: 'power3.out' });
    const quickRotY = gsap.quickTo(grid, 'rotationY', { duration: .6, ease: 'power3.out' });
    grid.style.transformStyle = 'preserve-3d';
    grid.addEventListener('mousemove', (e) => {
      const rect = grid.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - .5;
      const ny = (e.clientY - rect.top) / rect.height - .5;
      quickRotY(nx * 1.8);
      quickRotX(-ny * 1.8);
    });
    grid.addEventListener('mouseleave', () => { quickRotX(0); quickRotY(0); });
  }

  // ── magnetic CTA + shine already handled by CSS ──
  if (ctaRow && window.matchMedia('(hover: hover)').matches) {
    const btn = ctaRow.querySelector('.cli-cta');
    if (btn) {
      const quickX = gsap.quickTo(btn, 'x', { duration: .35, ease: 'power3.out' });
      const quickY = gsap.quickTo(btn, 'y', { duration: .35, ease: 'power3.out' });
      btn.addEventListener('mouseenter', () => quickY(-3));
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        quickX((e.clientX - rect.left - rect.width / 2) * .3);
        quickY(-3 + (e.clientY - rect.top - rect.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', () => { quickX(0); quickY(0); });
    }
  }
})();
