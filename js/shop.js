/* shop.js – Shop page dynamic rendering & filter */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.PRODUCTS) return;

  const grid = document.getElementById('shop-grid');
  const sortSelect = document.getElementById('sort-select');
  const resultCount = document.getElementById('result-count');
  const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
  const sidebar = document.querySelector('.shop-sidebar');
  const filterOverlay = document.getElementById('filter-overlay');

  function getFiltered() {
    let list = [...PRODUCTS];
    // age filter
    const ageChecked = [...document.querySelectorAll('input[name="age"]:checked')].map(i => i.value);
    if (ageChecked.length) list = list.filter(p => ageChecked.some(a => p.age.includes(a)));
    // budget filter
    const budgetChecked = [...document.querySelectorAll('input[name="budget"]:checked')].map(i => i.value);
    if (budgetChecked.length) list = list.filter(p => {
      return budgetChecked.some(b => {
        if (b === 'under1500') return p.price < 1500;
        if (b === '1500-3000') return p.price >= 1500 && p.price < 3000;
        if (b === '3000-5000') return p.price >= 3000 && p.price < 5000;
        if (b === 'over5000')  return p.price >= 5000;
        return true;
      });
    });
    // sort
    const sort = sortSelect ? sortSelect.value : 'featured';
    if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (sort === 'newest')     list.sort((a,b) => (a.badge==='new'?-1:1));
    if (sort === 'rating')     list.sort((a,b) => b.rating - a.rating);
    return list;
  }

  function renderGrid() {
    const list = getFiltered();
    if (resultCount) resultCount.textContent = `${list.length} products`;
    if (grid) grid.innerHTML = list.map(p => productCardHTML(p)).join('');
  }

  // events
  document.querySelectorAll('.filter-option input').forEach(i => i.addEventListener('change', renderGrid));
  if (sortSelect) sortSelect.addEventListener('change', renderGrid);

  // mobile filter
  if (mobileFilterBtn && sidebar) {
    mobileFilterBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  if (filterOverlay && sidebar) {
    filterOverlay.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  renderGrid();
});
