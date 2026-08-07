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

  // Hide the nav on scroll-down, bring it back on scroll-up (or near the top).
  // Never hide while the mobile menu or a dropdown is open, and never while
  // the nav itself holds keyboard focus (handled in CSS via :focus-within).
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
      a.addEventListener('click', ()=>{ toggle.classList.remove('open'); links.classList.remove('open'); });
    });
  }

  // Dropdown nav items (About / Others): open on enter, close on a short delay after
  // leaving, so a slightly diagonal mouse path into the panel doesn't lose the menu.
  // Touch devices have no hover, so the label instead toggles the dropdown on tap,
  // and tapping anywhere outside closes whichever one is open.
  document.querySelectorAll('.has-dropdown').forEach(item=>{
    let closeTimer;
    const label = item.querySelector('.dropdown-label');
    const setExpanded = v=>{ if(label) label.setAttribute('aria-expanded', String(v)); };
    const open = ()=>{ clearTimeout(closeTimer); item.classList.add('open'); setExpanded(true); };
    const close = ()=>{ item.classList.remove('open'); setExpanded(false); };
    const scheduleClose = ()=>{ closeTimer = setTimeout(close, 350); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', scheduleClose);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', scheduleClose);

    if(label){
      label.setAttribute('role','button');
      label.setAttribute('aria-haspopup','true');
      label.setAttribute('aria-expanded','false');
      if(!canHover){
        label.addEventListener('click', e=>{
          e.preventDefault();
          e.stopPropagation();
          clearTimeout(closeTimer);
          const willOpen = !item.classList.contains('open');
          document.querySelectorAll('.has-dropdown.open').forEach(other=>{
            if(other !== item) other.classList.remove('open');
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
          const lbl = item.querySelector('.dropdown-label');
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
})();
