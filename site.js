// Shared site behavior: glass nav scroll state, mobile menu, dark mode, reveal-on-scroll.
(function(){
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const themeToggle = document.querySelector('.theme-toggle');

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

  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
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
  document.querySelectorAll('.has-dropdown').forEach(item=>{
    let closeTimer;
    const open = ()=>{ clearTimeout(closeTimer); item.classList.add('open'); };
    const scheduleClose = ()=>{ closeTimer = setTimeout(()=>item.classList.remove('open'), 350); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', scheduleClose);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', scheduleClose);
  });

  const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  },{ threshold:.15 });
  revealEls.forEach(el=>revealObs.observe(el));
})();
