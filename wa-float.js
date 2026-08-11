// Site-wide floating WhatsApp button. Self-contained, no dependencies —
// safe to include on any page alongside its own scripts.
(function(){
  const WA_NUMBER = '916293148696';
  const WA_MESSAGE = "Hi, I'd like to know more about Shakambhari Group's products.";
  const a = document.createElement('a');
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MESSAGE);
  a.className = 'wa-float';
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with us on WhatsApp');
  a.innerHTML =
    '<span class="wa-float-pulse" aria-hidden="true"></span>' +
    '<svg viewBox="0 0 32 32" fill="#fff" aria-hidden="true"><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.25.62 4.36 1.7 6.16L4 29l7.99-1.66a12 12 0 0 0 4.03.7h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3Zm7.03 17.13c-.3.85-1.72 1.63-2.38 1.73-.62.1-1.38.14-2.22-.14-.51-.16-1.17-.38-2.02-.75-3.55-1.53-5.87-5.1-6.05-5.34-.18-.24-1.44-1.92-1.44-3.66s.9-2.6 1.23-2.96c.3-.32.65-.4.87-.4.22 0 .43 0 .62.01.2.01.47-.08.73.56l.9 2.16c.08.18.13.38.03.6-.1.24-.15.38-.3.58-.15.2-.32.45-.46.6-.15.16-.31.34-.14.66.18.32.78 1.28 1.67 2.07 1.15 1.03 2.12 1.35 2.44 1.5.33.16.52.14.71-.08.2-.21.83-.94 1.04-1.27.21-.32.42-.27.71-.16.3.1 1.88.88 2.2 1.04.33.16.54.24.62.38.08.14.08.79-.22 1.62Z"/></svg>';
  document.body.appendChild(a);
})();
