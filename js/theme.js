const KEY = 'sarmayesh-theme';

export function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const apply = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
  };

  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    apply(cur === 'dark' ? 'light' : 'dark');
  });
}
