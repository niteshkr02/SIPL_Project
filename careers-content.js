/* ════════════════════════════════════════════════════════════════════
   CAREERS — Content Sections behavior
   Isolated component. Each section below is self-contained (guards on
   its own root element existing) so this file works regardless of
   which sections are present. Global .reveal/.reveal-* fade-ins are
   already handled by site.js — this file only adds behavior that
   fade-in alone can't: counters, SVG line draw-in, staggered timeline
   reveal, the testimonial slider, job filtering, the FAQ accordion,
   the newsletter form, the office map, the floating HR assistant, and
   the sticky quick-actions rail.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── shared: animated counters (.counter[data-target]) ──
  // Same convention used on clientele-showcase.js / csr.html: counts up once
  // when the element enters the viewport, then stops observing it.
  (function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    function run(el) {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: .4 });
      counters.forEach((c) => obs.observe(c));
    } else {
      counters.forEach(run);
    }
  })();

  // ── shared: reveal a container + stagger its children once visible ──
  // Used by the L&D roadmap, the career journey timeline and the
  // recruitment process row — all three need more than opacity: a class
  // toggle on the parent (to fire an SVG stroke-dashoffset transition) and
  // a staggered class toggle on each child.
  function staggerReveal(root, itemSelector, { rootClass = 'visible', itemDelay = 90 } = {}) {
    if (!root) return;
    const items = root.querySelectorAll(itemSelector);
    if (!('IntersectionObserver' in window)) {
      root.classList.add(rootClass);
      items.forEach((it) => it.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(root);
        root.classList.add(rootClass);
        items.forEach((it, i) => {
          if (reduceMotion) { it.classList.add('visible'); return; }
          setTimeout(() => it.classList.add('visible'), i * itemDelay);
        });
      });
    }, { threshold: .2 });
    obs.observe(root);
  }

  staggerReveal(document.querySelector('.cld-roadmap'), '.cld-milestone');
  staggerReveal(document.querySelector('.crp-row'), '.crp-step', { itemDelay: 110 });

  // ════════════════════ L&D ROADMAP — INTERACTIVE MILESTONE TOOLTIPS ════════════════════
  (function initLearningTooltips() {
    const roadmap = document.querySelector('.cld-roadmap');
    if (!roadmap) return;
    const milestones = Array.from(roadmap.querySelectorAll('.cld-milestone'));
    const tooltip = roadmap.querySelector('.cld-tooltip');
    const titleEl = tooltip && tooltip.querySelector('.cld-tooltip-title');
    const listEl = tooltip && tooltip.querySelector('.cld-tooltip-list');
    if (!milestones.length || !tooltip || !titleEl || !listEl) return;

    const isTouch = window.matchMedia('(hover: none)').matches;
    let active = null;

    function position(milestone) {
      const roadmapRect = roadmap.getBoundingClientRect();
      const nodeRect = milestone.querySelector('.cld-node').getBoundingClientRect();
      const ttRect = tooltip.getBoundingClientRect();
      const margin = 12;
      const gap = 16;

      let absLeft = nodeRect.left + nodeRect.width / 2 - ttRect.width / 2;
      absLeft = Math.max(margin, Math.min(absLeft, window.innerWidth - margin - ttRect.width));

      const spaceAbove = nodeRect.top - gap - margin;
      const below = spaceAbove < ttRect.height;
      const top = below
        ? (nodeRect.bottom - roadmapRect.top) + gap
        : (nodeRect.top - roadmapRect.top) - ttRect.height - gap;

      tooltip.style.left = (absLeft - roadmapRect.left) + 'px';
      tooltip.style.top = top + 'px';
      tooltip.classList.toggle('cld-tooltip--below', below);

      const arrowX = (nodeRect.left + nodeRect.width / 2) - absLeft;
      tooltip.style.setProperty('--cld-arrow-x', Math.max(18, Math.min(arrowX, ttRect.width - 18)) + 'px');
    }

    function show(milestone) {
      if (active === milestone) return;
      if (active) hide();
      titleEl.textContent = milestone.querySelector('.cld-label').textContent.trim();
      listEl.innerHTML = '';
      milestone.querySelectorAll('.cld-info li').forEach((li) => {
        const item = document.createElement('li');
        item.textContent = li.textContent;
        listEl.appendChild(item);
      });
      active = milestone;
      milestone.setAttribute('aria-expanded', 'true');
      milestone.classList.add('cld-active');
      tooltip.setAttribute('aria-hidden', 'false');
      tooltip.classList.add('is-visible');
      position(milestone);
    }

    function hide() {
      if (!active) return;
      active.setAttribute('aria-expanded', 'false');
      active.classList.remove('cld-active');
      active = null;
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.classList.remove('is-visible');
    }

    milestones.forEach((milestone) => {
      let wasActiveBeforeTap = false;
      milestone.addEventListener('mouseenter', () => { if (!isTouch) show(milestone); });
      milestone.addEventListener('mouseleave', () => { if (!isTouch) hide(); });
      milestone.addEventListener('focus', () => show(milestone));
      milestone.addEventListener('blur', () => hide());
      // Tapping fires touchstart -> focus -> click in that order. Capturing
      // "was this milestone already open" at touchstart (before focus's
      // show() runs) keeps the click handler's open/close toggle honest.
      milestone.addEventListener('touchstart', () => { wasActiveBeforeTap = (active === milestone); }, { passive: true });
      milestone.addEventListener('click', (e) => {
        if (!isTouch) return;
        e.stopPropagation();
        if (wasActiveBeforeTap) hide();
        else show(milestone);
      });
      milestone.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { hide(); milestone.blur(); }
      });
    });

    document.addEventListener('click', (e) => {
      if (active && !active.contains(e.target) && !tooltip.contains(e.target)) hide();
    });
    window.addEventListener('resize', () => { if (active) position(active); });
  })();

  // ════════════════════ CAREER GROWTH JOURNEY — CLICK-TO-SELECT PANEL + SCROLL PROGRESS ════════════════════
  (function initCareerJourney() {
    const timeline = document.getElementById('ccjTimeline');
    const panel = document.getElementById('ccjPanel');
    if (!timeline || !panel) return;
    const steps = Array.from(timeline.querySelectorAll('.ccj-step'));
    const panelIcon = document.getElementById('ccjPanelIcon');
    const panelTier = document.getElementById('ccjPanelTier');
    const panelBadge = document.getElementById('ccjPanelBadge');
    const panelTitle = document.getElementById('ccjPanelTitle');
    const panelList = document.getElementById('ccjPanelList');
    const panelWatermark = document.getElementById('ccjPanelWatermark');
    const panelProgress = document.getElementById('ccjPanelProgress');
    const prevBtn = document.getElementById('ccjPrev');
    const nextBtn = document.getElementById('ccjNext');
    if (!steps.length || !panelIcon || !panelTier || !panelBadge || !panelTitle || !panelList) return;

    // ── panel-footer dots: one per tier, click jumps straight to it ──
    let dots = [];
    if (panelProgress) {
      dots = steps.map((step, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ccj-progress-dot';
        dot.setAttribute('aria-label', step.querySelector('.ccj-step-title').textContent.trim());
        dot.addEventListener('click', () => select(i));
        panelProgress.appendChild(dot);
        return dot;
      });
    }

    // ── click (or arrow-key) selects a tier: updates node states + swaps the content panel ──
    function select(index) {
      const step = steps[index];
      if (!step) return;

      steps.forEach((s, i) => {
        const isSelected = i === index;
        s.classList.toggle('is-selected', isSelected);
        s.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        s.tabIndex = isSelected ? 0 : -1;
      });

      panelIcon.innerHTML = step.querySelector('.ccj-step-icon').innerHTML;
      const tierText = step.querySelector('.ccj-step-tier').textContent.trim();
      panelTier.textContent = tierText;
      panelBadge.textContent = step.dataset.badge || '';
      panelTitle.textContent = step.querySelector('.ccj-step-title').textContent.trim();
      panel.setAttribute('aria-labelledby', step.id);
      panelList.innerHTML = '';
      step.querySelectorAll('.ccj-info li').forEach((li) => {
        const item = document.createElement('li');
        item.textContent = li.textContent;
        panelList.appendChild(item);
      });
      if (panelWatermark) panelWatermark.textContent = tierText.replace(/[^0-9]/g, '') || String(index + 1).padStart(2, '0');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === steps.length - 1;

      if (!reduceMotion) {
        panel.classList.remove('ccj-anim');
        void panel.offsetWidth;
        panel.classList.add('ccj-anim');
      }
    }

    steps.forEach((step, i) => {
      step.addEventListener('click', () => select(i));
      step.addEventListener('keydown', (e) => {
        let target = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = steps[(i + 1) % steps.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = steps[(i - 1 + steps.length) % steps.length];
        else if (e.key === 'Home') target = steps[0];
        else if (e.key === 'End') target = steps[steps.length - 1];
        if (!target) return;
        e.preventDefault();
        target.focus();
        select(steps.indexOf(target));
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      const current = steps.findIndex((s) => s.classList.contains('is-selected'));
      if (current > 0) select(current - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const current = steps.findIndex((s) => s.classList.contains('is-selected'));
      if (current < steps.length - 1) select(current + 1);
    });

    select(0);

    // ── sequential reveal: milestones + icons pop in once the timeline enters view ──
    if ('IntersectionObserver' in window) {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealObs.unobserve(timeline);
          steps.forEach((step, i) => {
            if (reduceMotion) { step.classList.add('visible'); return; }
            setTimeout(() => step.classList.add('visible'), i * 90);
          });
        });
      }, { threshold: .2 });
      revealObs.observe(timeline);
    } else {
      steps.forEach((step) => step.classList.add('visible'));
    }
  })();

  // ════════════════════ OPEN POSITIONS — FILTER + SEARCH ════════════════════
  (function initJobFilters() {
    const grid = document.getElementById('copGrid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.cop-card'));
    const searchInput = document.getElementById('copSearch');
    const deptSelect = document.getElementById('copDept');
    const locSelect = document.getElementById('copLocation');
    const expSelect = document.getElementById('copExperience');
    const countEl = document.getElementById('copCount');
    const emptyEl = document.getElementById('copEmpty');

    function applyFilters() {
      const q = (searchInput.value || '').trim().toLowerCase();
      const dept = deptSelect.value;
      const loc = locSelect.value;
      const exp = expSelect.value;
      let visible = 0;

      cards.forEach((card) => {
        const matchesSearch = !q || card.dataset.search.includes(q);
        const matchesDept = dept === 'all' || card.dataset.dept === dept;
        const matchesLoc = loc === 'all' || card.dataset.location === loc;
        const matchesExp = exp === 'all' || card.dataset.experience === exp;
        const show = matchesSearch && matchesDept && matchesLoc && matchesExp;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });

      countEl.textContent = visible + (visible === 1 ? ' role shown' : ' roles shown');
      emptyEl.classList.toggle('show', visible === 0);
    }

    [searchInput].forEach((el) => el.addEventListener('input', applyFilters));
    [deptSelect, locSelect, expSelect].forEach((el) => el.addEventListener('change', applyFilters));
    applyFilters();
  })();

  // ════════════════════ FAQ ACCORDION ════════════════════
  (function initFaq() {
    const list = document.querySelector('.cfq-list');
    if (!list) return;
    list.querySelectorAll('.cfq-item').forEach((item) => {
      const q = item.querySelector('.cfq-q');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        list.querySelectorAll('.cfq-item.open').forEach((other) => {
          if (other !== item) { other.classList.remove('open'); other.querySelector('.cfq-q').setAttribute('aria-expanded', 'false'); }
        });
        item.classList.toggle('open', !isOpen);
        q.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  })();

  // ════════════════════ NEWSLETTER ════════════════════
  (function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    const successEl = form.querySelector('.cnl-success');
    const errorEl = form.querySelector('.cnl-error');
    const btn = form.querySelector('button[type=submit]');

    // TODO: replace with the Production URL of your n8n Webhook node for newsletter sign-ups.
    const NEWSLETTER_WEBHOOK_URL = 'REPLACE_WITH_N8N_WEBHOOK_URL';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorEl.classList.remove('show');
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (NEWSLETTER_WEBHOOK_URL.startsWith('REPLACE_WITH')) {
        errorEl.textContent = "Newsletter sign-up isn't connected yet. Please try again later.";
        errorEl.classList.add('show');
        return;
      }

      btn.disabled = true;
      fetch(NEWSLETTER_WEBHOOK_URL, { method: 'POST', body: new FormData(form) })
        .then((res) => {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          successEl.classList.add('show');
        })
        .catch(() => {
          errorEl.textContent = 'Something went wrong. Please try again.';
          errorEl.classList.add('show');
        })
        .finally(() => { btn.disabled = false; });
    });
  })();

  // ════════════════════ FINAL CTA — PARTICLES ════════════════════
  (function initFinalCta() {
    const layer = document.querySelector('.cfc-particles');
    if (!layer || reduceMotion) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('span');
      p.className = 'cfc-particle';
      p.style.setProperty('--px', (Math.random() * 100) + '%');
      p.style.setProperty('--ps', (2 + Math.random() * 2) + 'px');
      p.style.setProperty('--pd', (8 + Math.random() * 8) + 's');
      p.style.setProperty('--pdelay', (-Math.random() * 20) + 's');
      p.style.setProperty('--pdx', ((Math.random() - .5) * 40) + 'px');
      layer.appendChild(p);
    }
  })();

  // Final CTA mouse parallax on the floating shapes — throttled to one
  // update per animation frame, matching the hero's pointermove handling.
  (function initFinalCtaParallax() {
    const cfc = document.querySelector('.cfc');
    const shapes = cfc ? cfc.querySelectorAll('.cfc-shape') : [];
    if (!cfc || !shapes.length || reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    let raf = null;
    cfc.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = cfc.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - .5;
        const ny = (e.clientY - rect.top) / rect.height - .5;
        shapes.forEach((s, i) => {
          const depth = (i + 1) * 6;
          s.style.transform = 'translate(' + (nx * depth) + 'px, ' + (ny * depth) + 'px)';
        });
        raf = null;
      });
    });
    cfc.addEventListener('mouseleave', () => {
      shapes.forEach((s) => { s.style.transform = ''; });
    });
  })();

  // ════════════════════ FLOATING HR ASSISTANT ════════════════════
  (function initHrAssistant() {
    const fab = document.getElementById('chaFab');
    const panel = document.getElementById('chaPanel');
    if (!fab || !panel) return;
    const body = panel.querySelector('.cha-body');
    const closeBtn = panel.querySelector('.cha-close');
    const quickBtns = panel.querySelectorAll('.cha-quick-btn');

    // Canned, client-side answers only — this widget does not call any AI
    // service or human agent; it's a fast, honest FAQ + navigation helper.
    const RESPONSES = {
      openings: { label: 'See open roles', reply: 'Here you go — I\'ve scrolled you to our Open Positions board, where you can filter by department, location and experience.', action: () => document.getElementById('openPositions') },
      apply: { label: 'How do I apply?', reply: 'Click any "Apply" button on the page to open the application form, fill in your details across the 8 sections, attach your resume, and submit. You\'ll get a confirmation on screen once it goes through.', action: () => { if (typeof window.openCareerApplyModal === 'function') window.openCareerApplyModal(); return null; } },
      internship: { label: 'Internship info', reply: 'Check out the Internship & Campus Hiring section for programme types, and use the CTA there to register your interest.', action: () => document.getElementById('internshipHiring') },
      hr: { label: 'Contact HR', reply: 'You can reach our HR team directly at info@shakambharigroup.in or 033 6625 5252 — I\'ve also added a link below.', action: null },
    };

    function addMessage(text, sender) {
      const msg = document.createElement('div');
      msg.className = 'cha-msg ' + sender;
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    quickBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const r = RESPONSES[key];
        if (!r) return;
        addMessage(btn.textContent, 'user');
        setTimeout(() => {
          addMessage(r.reply, 'bot');
          if (r.action) {
            const target = r.action();
            if (target) setTimeout(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 350);
          }
        }, 250);
      });
    });

    function openPanel() {
      panel.classList.add('open');
      fab.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
    }

    fab.addEventListener('click', () => {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
  })();

  // ════════════════════ APPLICATION FORM — DRAG & DROP RESUME UPLOAD ════════════════════
  // Progressively enhances the EXISTING #resume input (same id/name/required/
  // accept as before) — never replaces it, so the existing inline submit
  // script's FormData(form) still picks up whatever file ends up assigned to
  // input.files, whether chosen by click, drag-drop, or keyboard.
  (function initResumeDropzone() {
    const dropzone = document.getElementById('resumeDropzone');
    const input = document.getElementById('resume');
    if (!dropzone || !input) return;

    const nameEl = document.getElementById('resumeFileName');
    const sizeEl = document.getElementById('resumeFileSize');
    const progressFill = document.getElementById('resumeProgressFill');
    const removeBtn = document.getElementById('resumeRemoveBtn');

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function showFile(file) {
      nameEl.textContent = file.name;
      sizeEl.textContent = formatSize(file.size);
      dropzone.classList.add('has-file');
      progressFill.style.width = '0%';
      // A genuine local read of the chosen file (not a network upload — there's
      // nothing to upload to yet at this point in the flow) drives a real
      // progress bar rather than a faked timer, so "Upload Progress" reflects
      // actual work the browser is doing.
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) progressFill.style.width = Math.round((e.loaded / e.total) * 100) + '%';
      };
      reader.onload = () => { progressFill.style.width = '100%'; };
      reader.readAsArrayBuffer(file);
    }

    function clearFile() {
      input.value = '';
      dropzone.classList.remove('has-file');
      progressFill.style.width = '0%';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    input.addEventListener('change', () => {
      if (input.files && input.files[0]) showFile(input.files[0]);
    });

    removeBtn.addEventListener('click', (e) => { e.preventDefault(); clearFile(); });

    ['dragenter', 'dragover'].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('is-dragover'); });
    });
    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      showFile(file);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  })();

  // ════════════════════ APPLICATION FORM — ANIMATED VALIDATION ════════════════════
  // 'invalid' doesn't bubble, so it's caught on the capture phase at the form
  // level. Shakes the specific field wrapper that actually failed validity —
  // never the whole form — using the browser's real validity state.
  (function initAnimatedValidation() {
    const form = document.getElementById('careerApplyForm');
    if (!form) return;
    form.addEventListener('invalid', (e) => {
      const field = e.target.closest('.field');
      if (!field) return;
      field.classList.add('car-field-invalid');
      field.classList.remove('car-field-shake');
      void field.offsetWidth;
      field.classList.add('car-field-shake');
      e.target.addEventListener('input', function clearInvalid() {
        field.classList.remove('car-field-invalid');
        e.target.removeEventListener('input', clearInvalid);
      }, { once: true });
    }, true);
  })();

  // ════════════════════ STICKY QUICK ACTIONS ════════════════════
  // Hides while scrolling down, shows while scrolling up — scroll position
  // is read at most once per animation frame via the passive listener below.
  (function initStickyRail() {
    const rail = document.querySelector('.csa-rail');
    if (!rail) return;
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 200;
        rail.classList.toggle('is-hidden', goingDown);
        lastY = y;
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();
})();
