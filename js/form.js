export function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.setAttribute('novalidate', 'true');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const err = f.closest('.field')?.querySelector('.field__error');
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      f.setAttribute('aria-invalid', String(bad));
      if (err) err.hidden = !bad;
      if (bad) ok = false;
    });
    if (!ok) {
      const first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    const done = document.getElementById('formDone');
    if (done) {
      done.hidden = false;
      done.focus();
    }
    form.reset();
  });
}
