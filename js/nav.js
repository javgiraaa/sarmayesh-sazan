export function initNav() {
  initSafePageTransition();

  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && links) {
    const close = () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'باز کردن منو');
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        close();
      })
    );
    document.addEventListener('click', (e) => {
      if (!links.classList.contains('open')) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
      }
    });
  }

  const spyLinks = document.querySelectorAll('[data-spy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const map = { home: 'home', products: 'featured', about: 'about-snippet', contact: 'contact' };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.id;
          spyLinks.forEach((l) => l.classList.toggle('active', map[l.dataset.spy] === id));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    Object.values(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 108;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    });
  });



/* SAFE page transition — sessionStorage flag + CSS classes only.
   No View Transitions API (navigating inside startViewTransition froze the page).
   Navigation NEVER blocks: every step is try/catch, timeouts force completion,
   and without JS the default link behavior is untouched. */
const PAGE_FLAG = 'sarmayesh-page-enter';

function transitionsDisabled() {
  try {
    if (new URLSearchParams(location.search).get('noanim') === '1') return true;
  } catch (_) { /* ignore */ }
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch (_) { /* ignore */ }
  return false;
}

function initSafePageTransition() {
  // ENTER: new page load — read flag, play enter, always self-clean.
  try {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem(PAGE_FLAG) === '1';
      sessionStorage.removeItem(PAGE_FLAG);
    } catch (_) { flagged = false; }
    if (flagged && !transitionsDisabled()) {
      const el = document.documentElement;
      try { el.classList.add('page-enter'); } catch (_) { /* ignore */ }
      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        try { el.classList.remove('page-enter'); } catch (_) { /* ignore */ }
      };
      try { el.addEventListener('animationend', cleanup, { once: true }); } catch (_) { /* ignore */ }
      setTimeout(cleanup, 800); // safety net — never leave the class stuck
    }
  } catch (_) { /* never break page load */ }

  // EXIT: internal link click — fade 180ms, then navigate; 400ms forces it.
  try {
    document.addEventListener('click', (e) => {
      try {
        if (e.defaultPrevented) return;
        if (e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const link = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        if (/^(tel:|mailto:|javascript:)/i.test(href)) return;
        if (link.target === '_blank') return;
        if (transitionsDisabled()) return; // instant navigation
        let url;
        try {
          url = new URL(link.href, location.href);
        } catch (_) { return; }
        if (url.origin !== location.origin) return;

        e.preventDefault();
        const dest = url.href;
        let navigated = false;
        const go = () => {
          if (navigated) return;
          navigated = true;
          try { location.href = dest; } catch (_) { /* ignore */ }
        };
        try { document.body.classList.add('page-exit'); } catch (_) { /* ignore */ }
        try { sessionStorage.setItem(PAGE_FLAG, '1'); } catch (_) { /* ignore */ }
        setTimeout(go, 180);
        setTimeout(() => {
          try { document.body.classList.remove('page-exit'); } catch (_) { /* ignore */ }
          go(); // safety: never stay stuck on .page-exit
        }, 400);
      } catch (_) { /* fall through to default link behavior */ }
    });
  } catch (_) { /* never break clicks */ }
}

(function setupPageTransitions() {
  // Legacy no-op: safe transitions are wired via initSafePageTransition() above.
})();
}
