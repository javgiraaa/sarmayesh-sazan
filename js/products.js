const state = { all: [], cat: 'all', q: '', sort: 'newest' };

function cardHTML(p) {
  return `
  <article class="card">
    <div class="card__media">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
      <span class="card__brand">${p.brand}</span>
      ${p.inStock ? '<span class="card__stock">موجود</span>' : ''}
    </div>
    <div class="card__body">
      <span class="card__cat">${p.categoryLabel}</span>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="card__foot">
        <span class="card__price">تماس بگیرید</span>
        <a class="card__link" href="tel:+989152611543">اطلاعات بیشتر …</a>
      </div>
    </div>
  </article>`;
}

function applyFilters() {
  let list = state.all.filter((p) => state.cat === 'all' || p.category === state.cat);
  if (state.q) {
    const q = state.q.trim();
    list = list.filter((p) => (p.name + ' ' + p.brand + ' ' + p.categoryLabel + ' ' + p.description).includes(q));
  }
  const by = {
    newest: (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
    popular: (a, b) => (b.popularity || 0) - (a.popularity || 0),
  };
  list = [...list].sort(by[state.sort] || by.newest);
  return list;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = applyFilters();
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultCount');
  if (count) count.textContent = list.length ? `${list.length.toLocaleString('fa-IR')} محصول یافت شد` : '';
  if (!list.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  grid.innerHTML = list.map(cardHTML).join('');
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const feat = state.all.filter((p) => p.featured).slice(0, 4);
  const list = feat.length ? feat : state.all.slice(0, 4);
  grid.innerHTML = list.map(cardHTML).join('');
}

async function load() {
  const hasGrid = document.getElementById('productsGrid') || document.getElementById('featuredGrid');
  if (!hasGrid) return;
  try {
    const res = await fetch('./data/products.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    state.all = await res.json();
  } catch (e) {
    const grid = document.getElementById('productsGrid') || document.getElementById('featuredGrid');
    if (grid) grid.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem">خطا در بارگذاری محصولات. لطفاً اتصال اینترنت را بررسی و صفحه را تازه‌سازی کنید.</p>';
    return;
  }
  renderFeatured();
  renderProducts();
}

export function initProducts() {
  try {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) state.cat = cat;
  } catch (e) {}

  const tabs = document.getElementById('catTabs');
  if (tabs) {
    tabs.querySelectorAll('.cat-tab').forEach((b) => {
      if (b.dataset.cat === state.cat) {
        tabs.querySelectorAll('.cat-tab').forEach((x) => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
      }
      b.addEventListener('click', () => {
        tabs.querySelectorAll('.cat-tab').forEach((x) => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
        state.cat = b.dataset.cat;
        renderProducts();
      });
    });
  }

  const search = document.getElementById('searchInput');
  if (search) {
    let t;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = search.value; renderProducts(); }, 180);
    });
  }

  const sort = document.getElementById('sortSelect');
  if (sort) sort.addEventListener('change', () => { state.sort = sort.value; renderProducts(); });

  load();
}
