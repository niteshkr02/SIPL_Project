// Shared site behavior: glass nav scroll state, mobile menu, dark mode, reveal-on-scroll.
(function(){
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const themeToggle = document.querySelector('.theme-toggle');
  const canHover = window.matchMedia('(hover: hover)').matches;

  if(themeToggle){
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.addEventListener('click', ()=>{
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
      try{ localStorage.setItem('theme', next); }catch(e){}
    });
  }

  // Subtle magnetic pull on the "Get In Touch" pill — nudges toward the
  // cursor on hover, snaps back with a CSS transition on leave.
  const navCta = document.querySelector('.nav-cta');
  if(navCta && canHover && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    navCta.addEventListener('mousemove', (e)=>{
      const rect = navCta.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width/2) * .25;
      const y = (e.clientY - rect.top - rect.height/2) * .3;
      navCta.style.transition = '';
      navCta.style.transform = `translate(${x}px, ${y}px)`;
    });
    navCta.addEventListener('mouseleave', ()=>{
      navCta.style.transition = 'transform .3s cubic-bezier(.16,.84,.44,1)';
      navCta.style.transform = '';
    });
  }

  // Auto-hide the nav on scroll-down, bring it back on scroll-up (or near
  // the top) — from anywhere on the page, not just the very top (see
  // OVERLAY NAVIGATION in styles.css). Never hide while the mobile menu or
  // a dropdown is open, and never while the nav itself holds keyboard focus
  // (handled in CSS via :focus-within).
  let lastScrollY = window.scrollY;
  function onScroll(){
    if(!nav) return;
    const y = window.scrollY;
    if(y > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const menuOpen = (toggle && toggle.classList.contains('open')) ||
      document.querySelector('.has-dropdown.open');
    if(!menuOpen){
      if(y > lastScrollY + 4 && y > 120) nav.classList.add('nav-hidden');
      else if(y < lastScrollY - 4 || y < 120) nav.classList.remove('nav-hidden');
    }
    lastScrollY = y <= 0 ? 0 : y;
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  if(toggle && links){
    toggle.addEventListener('click', ()=>{
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a=>{
      // Flyout/dropdown triggers (e.g. "Steel", "Wire Rods & Wires") are <a> tags
      // that also toggle a nested submenu open on tap — closing the whole mobile
      // menu on that same tap would hide the submenu before it's ever seen, so
      // only real "leaf" navigation links get the close-on-click behavior.
      const next = a.nextElementSibling;
      const isFlyoutTrigger = a.parentElement.classList.contains('has-dropdown') &&
        next && (next.classList.contains('dropdown') || next.classList.contains('dropdown-flyout'));
      if(isFlyoutTrigger) return;
      a.addEventListener('click', ()=>{ toggle.classList.remove('open'); links.classList.remove('open'); });
    });
  }

  // Dropdown nav items (About / Others): open on enter, close on a short delay after
  // leaving, so a slightly diagonal mouse path into the panel doesn't lose the menu.
  // Touch devices have no hover, so the label instead toggles the dropdown on tap,
  // and tapping anywhere outside closes whichever one is open.
  // .has-dropdown items can nest (a top-level "Products" panel containing its
  // own "Steel" flyout trigger, which can itself contain further flyouts), so
  // every lookup here is scoped to direct children (":scope >") and every
  // "close others" pass is careful to leave ancestors/descendants of the item
  // being opened alone — only true sibling branches get closed.
  document.querySelectorAll('.has-dropdown').forEach(item=>{
    let closeTimer;
    const label = item.querySelector(':scope > a, :scope > .dropdown-label');
    const flyout = item.querySelector(':scope > .dropdown-flyout');
    const setExpanded = v=>{ if(label) label.setAttribute('aria-expanded', String(v)); };
    const open = ()=>{
      clearTimeout(closeTimer); item.classList.add('open'); setExpanded(true);
      // Nested flyouts cascade rightward; near the right edge of the viewport
      // (mainly the 1181-1280px band where the desktop nav first kicks in),
      // flip the panel to open leftward instead so it never runs off-screen.
      if(flyout && canHover){
        flyout.classList.remove('flyout-left');
        if(flyout.getBoundingClientRect().right > window.innerWidth) flyout.classList.add('flyout-left');
      }
    };
    const close = ()=>{ item.classList.remove('open'); setExpanded(false); };
    const scheduleClose = ()=>{ closeTimer = setTimeout(close, 350); };
    // Hover/focus auto-open is a desktop-only convenience. On touch devices a
    // tap fires "focusin" just before "click", so if this ran unconditionally
    // the click handler's open/close toggle below would see the item as
    // already-open (from focusin) and immediately flip it back closed in the
    // same gesture — the tap would appear to do nothing.
    if(canHover){
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', scheduleClose);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', scheduleClose);
    }

    if(label){
      if(label.tagName !== 'A') label.setAttribute('role','button');
      label.setAttribute('aria-haspopup','true');
      label.setAttribute('aria-expanded','false');
      if(!canHover){
        label.addEventListener('click', e=>{
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(closeTimer);
          const willOpen = !item.classList.contains('open');
          document.querySelectorAll('.has-dropdown.open').forEach(other=>{
            if(other !== item && !other.contains(item) && !item.contains(other)) other.classList.remove('open');
          });
          item.classList.toggle('open', willOpen);
          setExpanded(willOpen);
        });
      }
    }
  });
  if(!canHover){
    document.addEventListener('click', e=>{
      document.querySelectorAll('.has-dropdown.open').forEach(item=>{
        if(!item.contains(e.target)){
          item.classList.remove('open');
          const lbl = item.querySelector(':scope > a, :scope > .dropdown-label');
          if(lbl) lbl.setAttribute('aria-expanded','false');
        }
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  },{ threshold:.15 });
  revealEls.forEach(el=>revealObs.observe(el));

  // Cursor spotlight + subtle tilt on generic .panel cards (shared across pages).
  // Rect is cached on mouseenter (not re-read on every mousemove) and the
  // style update is coalesced into a single requestAnimationFrame per frame,
  // so a fast mouse sweep never forces more than one layout read + one style
  // write per painted frame.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(canHover && !reduceMotion){
    document.querySelectorAll('.panel').forEach(panel=>{
      let rect = null;
      let raf = null;
      let px = .5, py = .5;
      panel.addEventListener('mouseenter', ()=>{ rect = panel.getBoundingClientRect(); });
      panel.addEventListener('mousemove', e=>{
        if(!rect) rect = panel.getBoundingClientRect();
        px = (e.clientX - rect.left) / rect.width;
        py = (e.clientY - rect.top) / rect.height;
        if(raf) return;
        raf = requestAnimationFrame(()=>{
          raf = null;
          panel.style.setProperty('--mx', (px*100)+'%');
          panel.style.setProperty('--my', (py*100)+'%');
          panel.style.setProperty('--ry', ((px-.5)*6)+'deg');
          panel.style.setProperty('--rx', ((.5-py)*6)+'deg');
        });
      });
      panel.addEventListener('mouseleave', ()=>{
        rect = null;
        if(raf){ cancelAnimationFrame(raf); raf = null; }
        panel.style.setProperty('--rx','0deg');
        panel.style.setProperty('--ry','0deg');
      });
    });
  }

  // Sitewide ambient cursor glow (dark mode only) — one fixed div, created
  // once on eligible devices, moved via translate3d and coalesced through
  // rAF exactly like the .panel spotlight above. Visibility (not existence)
  // toggles with theme/viewport so switching themes or resizing never has
  // to recreate the element — it just fades via the CSS opacity transition.
  if(canHover && !reduceMotion && window.innerWidth > 860){
    const glow = document.createElement('div');
    glow.className = 'dm-cursor-glow';
    document.body.appendChild(glow);
    let gx = window.innerWidth/2, gy = window.innerHeight/2, graf = null;
    document.addEventListener('mousemove', e=>{
      gx = e.clientX; gy = e.clientY;
      if(graf) return;
      graf = requestAnimationFrame(()=>{
        graf = null;
        glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      });
    }, { passive:true });
    const syncGlowVisibility = ()=>{
      const active = document.documentElement.getAttribute('data-theme') === 'dark' && window.innerWidth > 860;
      glow.classList.toggle('dm-glow-active', active);
    };
    syncGlowVisibility();
    window.addEventListener('resize', syncGlowVisibility, { passive:true });
    if(themeToggle) themeToggle.addEventListener('click', syncGlowVisibility);
  }
})();
