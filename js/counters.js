function toFa(n) {
  try { return Number(n).toLocaleString('fa-IR'); } catch (e) { return String(n); }
}

export function initCounters() {
  const els = document.querySelectorAll('.counter');
  if (!els.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    if (!target || reduced) { el.textContent = toFa(target || 0); return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = toFa(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    els.forEach(animate);
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { animate(en.target); obs.unobserve(en.target); }
    }),
    { threshold: 0.4 }
  );
  els.forEach((el) => obs.observe(el));
}
