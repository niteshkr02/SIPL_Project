/* ════════════════════════════════════════════════════════════════════
   CAREERS — Content Sections behavior
   Isolated component. Each section below is self-contained (guards on
   its own root element existing) so this file works regardless of
   which sections are present. Global .reveal/.reveal-* fade-ins are
   already handled by site.js — this file only adds behavior that
   fade-in alone can't: counters, SVG line draw-in, staggered timeline
   reveal, the gallery lightbox, the testimonial slider, job filtering,
   the FAQ accordion, the newsletter form, the office map, the floating
   HR assistant, and the sticky quick-actions rail.
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
  staggerReveal(document.querySelector('.ccj-timeline'), '.ccj-step', { itemDelay: 140 });
  staggerReveal(document.querySelector('.crp-row'), '.crp-step', { itemDelay: 110 });

  // ════════════════════ LIFE AT SIPL — GALLERY LIGHTBOX ════════════════════
  (function initGallery() {
    const items = Array.from(document.querySelectorAll('.cls-item[data-full]'));
    const lightbox = document.getElementById('clsLightbox');
    if (!items.length || !lightbox) return;

    const imgEl = lightbox.querySelector('.cls-lightbox-img');
    const captionEl = lightbox.querySelector('.cls-lightbox-caption');
    const closeBtn = lightbox.querySelector('.cls-lightbox-close');
    const prevBtn = lightbox.querySelector('.cls-lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.cls-lightbox-nav.next');
    let index = 0;
    let lastFocused = null;

    function show(i) {
      index = (i + items.length) % items.length;
      const item = items[index];
      imgEl.src = item.dataset.full;
      imgEl.alt = item.dataset.caption || '';
      captionEl.textContent = item.dataset.caption || '';
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  })();

  // ════════════════════ EMPLOYEE SUCCESS STORIES — SLIDER ════════════════════
  (function initTestimonialSlider() {
    const wrap = document.querySelector('.ces-wrap');
    if (!wrap) return;
    const viewport = wrap.querySelector('.ces-track-viewport');
    const track = wrap.querySelector('.ces-track');
    const slides = Array.from(track.children);
    const prevBtn = wrap.querySelector('.ces-arrow.prev');
    const nextBtn = wrap.querySelector('.ces-arrow.next');
    const dotsWrap = wrap.querySelector('.ces-dots');
    if (!slides.length) return;

    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ces-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to story ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, di) => d.classList.toggle('active', di === current));
    }

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }

    prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
    wrap.addEventListener('mouseenter', stopAutoplay);
    wrap.addEventListener('mouseleave', startAutoplay);

    // drag support (pointer events cover mouse + touch in one code path)
    let dragging = false;
    let dragStartX = 0;
    let dragDeltaX = 0;

    viewport.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragDeltaX = 0;
      viewport.classList.add('dragging');
      track.style.transition = 'none';
      stopAutoplay();
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dragDeltaX = e.clientX - dragStartX;
      const pct = (dragDeltaX / viewport.clientWidth) * 100;
      track.style.transform = 'translateX(calc(-' + (current * 100) + '% + ' + pct + '%))';
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('dragging');
      track.style.transition = '';
      if (Math.abs(dragDeltaX) > viewport.clientWidth * .15) {
        goTo(current + (dragDeltaX < 0 ? 1 : -1));
      } else {
        goTo(current);
      }
      startAutoplay();
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    goTo(0);
    startAutoplay();
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

  // ════════════════════ OFFICE LOCATIONS — MAP ════════════════════
  (function initOfficeMap() {
    const wrap = document.querySelector('.col-wrap');
    if (!wrap) return;
    const markers = Array.from(wrap.querySelectorAll('.col-marker'));
    const items = Array.from(wrap.querySelectorAll('.col-item'));

    function activate(key) {
      markers.forEach((m) => m.classList.toggle('active', m.dataset.key === key));
      items.forEach((it) => it.classList.toggle('active', it.dataset.key === key));
    }

    markers.forEach((m) => {
      m.addEventListener('mouseenter', () => activate(m.dataset.key));
      m.addEventListener('click', () => activate(m.dataset.key));
    });
    items.forEach((it) => {
      it.addEventListener('mouseenter', () => activate(it.dataset.key));
      it.addEventListener('click', () => activate(it.dataset.key));
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
      apply: { label: 'How do I apply?', reply: 'Scroll down to the Application Form, fill in your details across the 8 sections, attach your resume, and submit. You\'ll get a confirmation on screen once it goes through.', action: () => document.getElementById('careerApplyForm') },
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
