// Company profile sheets: a card grid where each card opens a slide-up detail
// sheet (bottom sheet on mobile, centered modal on desktop) with a sliding
// pill tab bar inside. All content is static HTML already in the page,
// hidden/shown via classes — this file only wires up the interaction.
(function () {
  const overlay = document.getElementById('cpOverlay');
  if (!overlay) return;
  const sheet = overlay.querySelector('.cp-sheet');
  const cards = document.querySelectorAll('.cp-card');
  const profiles = document.querySelectorAll('.cp-profile');
  let lastFocused = null;

  function openProfile(id) {
    profiles.forEach(p => p.classList.toggle('active', p.dataset.profile === id));
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.classList.add('cp-lock');
    overlay.setAttribute('aria-hidden', 'false');
    const activeProfile = overlay.querySelector('.cp-profile.active');
    if (activeProfile) {
      const firstTab = activeProfile.querySelector('.cp-tab');
      if (firstTab) selectTab(activeProfile, firstTab);
    }
    const closeBtn = overlay.querySelector('.cp-sheet-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeProfile() {
    overlay.classList.remove('open');
    document.body.classList.remove('cp-lock');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openProfile(card.dataset.company));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProfile(card.dataset.company); }
    });
  });

  overlay.querySelectorAll('.cp-sheet-close').forEach(btn => btn.addEventListener('click', closeProfile));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeProfile(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeProfile(); });

  // Sliding pill indicator: measure the active tab's own box and translate/
  // resize a single shared indicator element rather than animating each tab.
  function selectTab(profileEl, tabBtn) {
    const tabs = profileEl.querySelectorAll('.cp-tab');
    const panels = profileEl.querySelectorAll('.cp-panel');
    const indicator = profileEl.querySelector('.cp-tab-indicator');
    tabs.forEach(t => t.classList.toggle('active', t === tabBtn));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tabBtn.dataset.tab));
    if (indicator) {
      indicator.style.width = tabBtn.offsetWidth + 'px';
      indicator.style.transform = `translateX(${tabBtn.offsetLeft}px)`;
    }
  }

  profiles.forEach(profileEl => {
    profileEl.querySelectorAll('.cp-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => selectTab(profileEl, tabBtn));
    });
  });

  // Re-measure the indicator for the currently open profile on resize
  // (tab widths reflow between the mobile and desktop tab-bar layouts).
  window.addEventListener('resize', () => {
    const activeProfile = overlay.querySelector('.cp-profile.active');
    if (!activeProfile || !overlay.classList.contains('open')) return;
    const activeTab = activeProfile.querySelector('.cp-tab.active');
    if (activeTab) selectTab(activeProfile, activeTab);
  });
})();
