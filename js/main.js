/* main.js – Enhanced shared behaviour v2 */
'use strict';

// ── Performance: request animation frame helpers ──
const raf = requestAnimationFrame;

// ── Sticky nav ──
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      raf(() => {
        siteNav.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Mobile nav ──
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay   = document.querySelector('.mobile-nav-overlay');
  const closeBtn  = document.querySelector('.mobile-nav-close');
  if (!hamburger || !mobileNav) return;
  const open  = () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; };
  hamburger.addEventListener('click', open);
  if (overlay) overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
})();

// ── Profile dropdown (click on mobile, hover on desktop) ──
(function initProfileDropdown() {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (!wrap) return;
  wrap.addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });
  document.addEventListener('click', () => wrap.classList.remove('open'));
  // Handle hash links inside dropdown
  wrap.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const [page, hash] = a.getAttribute('href').split('#');
      if (window.location.pathname.endsWith(page) || page === 'account.html') {
        e.preventDefault();
        localStorage.setItem('sc_active_panel', hash);
        window.location.href = a.getAttribute('href');
      }
    });
  });
})();

// ── Search overlay ──
(function initSearch() {
  const overlay   = document.getElementById('searchOverlay');
  const input     = document.getElementById('searchInput');
  const closeBtn  = document.getElementById('searchClose');
  const results   = document.getElementById('searchResults');
  const triggers  = document.querySelectorAll('.search-trigger');
  if (!overlay) return;

  const open  = () => { overlay.classList.add('open'); input.focus(); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; input.value = ''; results.innerHTML = ''; };

  triggers.forEach(t => t.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  let debounceTimer;
  if (input) input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (!q || !window.PRODUCTS) { results.innerHTML = ''; return; }
      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.age.toLowerCase().includes(q)
      ).slice(0, 6);
      results.innerHTML = matches.length
        ? matches.map(p => `
          <div class="search-result-item" onclick="window.location='product.html?id=${p.id}'">
            <div class="search-result-thumb ${p.dress}"></div>
            <div>
              <div class="search-result-name">${p.name}</div>
              <div class="search-result-price">₹${p.price.toLocaleString()} · ${p.age}</div>
            </div>
          </div>`).join('')
        : '<div style="padding:20px;text-align:center;font-size:12px;color:var(--text-soft)">No results found</div>';
    }, 180);
  });
})();

// ── Toast ──
function showToast(msg, type='success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>${msg}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
window.showToast = showToast;

// ── Wishlist ──
const WISH_KEY = 'sc_wishlist';
function getWishlist() { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
function saveWishlist(w) {
  localStorage.setItem(WISH_KEY, JSON.stringify(w));
  updateWishlistBadge();
}
function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-badge').forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}
function syncWishlistButtons() {
  const w = getWishlist();
  document.querySelectorAll('.card-wishlist[data-id], .wishlist-full-btn[data-id]').forEach(btn => {
    btn.classList.toggle('active', w.includes(btn.dataset.id));
  });
  // Also sync by parent [data-id]
  document.querySelectorAll('.card-wishlist, .wishlist-full-btn').forEach(btn => {
    const id = btn.closest('[data-id]')?.dataset.id;
    if (id) btn.classList.toggle('active', w.includes(id));
  });
}
window.syncWishlistButtons = syncWishlistButtons;
window.getWishlist = getWishlist;

document.addEventListener('click', e => {
  const btn = e.target.closest('.card-wishlist, .wishlist-full-btn');
  if (!btn) return;
  e.stopPropagation();
  const id = btn.dataset.id || btn.closest('[data-id]')?.dataset.id;
  if (!id) return;
  const w = getWishlist();
  const idx = w.indexOf(id);
  if (idx === -1) { w.push(id); showToast('♥ Added to wishlist'); }
  else { w.splice(idx, 1); showToast('Removed from wishlist'); }
  saveWishlist(w);
  syncWishlistButtons();
});

// ── Cart badge ──
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}
window.updateCartBadge = updateCartBadge;
updateCartBadge();
updateWishlistBadge();

// ── Scroll reveal ──
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ── Newsletter ──
const subForm = document.querySelector('.email-form');
if (subForm) {
  const submit = () => {
    const input = subForm.querySelector('.email-input');
    if (input && input.value) { showToast("✓ You're on the Royal Circle list!"); input.value = ''; }
  };
  subForm.addEventListener('submit', e => { e.preventDefault(); submit(); });
  const btn = subForm.querySelector('.subscribe-btn');
  if (btn) btn.addEventListener('click', e => { e.preventDefault(); submit(); });
}

// ── Auto-scroll carousel ──
function initCarousel(wrapSel, trackSel, dotsSel, autoInterval=3500) {
  const wrap  = document.querySelector(wrapSel);
  const track = document.querySelector(trackSel);
  if (!wrap || !track) return;
  const cards = track.querySelectorAll('.product-card');
  const total = cards.length;
  if (total < 2) return;

  // How many visible at once?
  function visibleCount() {
    const w = wrap.offsetWidth;
    if (w < 500) return 1;
    if (w < 800) return 2;
    return 4;
  }

  let current = 0;
  let paused  = false;
  let timer;

  function goTo(idx) {
    const vis = visibleCount();
    const max = Math.max(0, total - vis);
    current = Math.min(Math.max(idx, 0), max);
    const cardW = cards[0].offsetWidth + 20; // gap=20
    track.style.transform = `translateX(-${current * cardW}px)`;
    // dots
    document.querySelectorAll(`${dotsSel} .carousel-dot`).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { const vis = visibleCount(); const max = total - vis; goTo(current >= max ? 0 : current + 1); }
  function prev() { const vis = visibleCount(); const max = total - vis; goTo(current <= 0 ? max : current - 1); }

  // Build dots
  const dotsEl = document.querySelector(dotsSel);
  if (dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsEl.appendChild(d);
    }
  }

  function startTimer() { timer = setInterval(next, autoInterval); }
  function resetTimer() { clearInterval(timer); if (!paused) startTimer(); }

  wrap.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  wrap.addEventListener('mouseleave', () => { paused = false; resetTimer(); });

  // Arrow buttons
  const prevBtn = wrap.parentElement?.querySelector('.bs-prev');
  const nextBtn = wrap.parentElement?.querySelector('.bs-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetTimer(); }
  }, { passive: true });

  goTo(0);
  startTimer();
}
window.initCarousel = initCarousel;
