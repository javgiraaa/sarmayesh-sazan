// Adds .scrolled to the floating pill navbar after 20px (progressive enhancement).
// Kept as a standalone module per spec; js/nav.js contains the same threshold
// so loading both is idempotent and harmless.
export function initNavbarScroll(threshold = 20) {
  const navbar = document.getElementById('navbar');
  if (!navbar) return () => {};
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > threshold);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

// Auto-init when loaded directly (non-module fallback safe).
if (typeof window !== 'undefined' && !window.__navbarScrollInit) {
  window.__navbarScrollInit = true;
  const boot = () => initNavbarScroll(20);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
