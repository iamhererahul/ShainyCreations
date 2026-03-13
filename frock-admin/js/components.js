/* ============================================================
   components.js  –  Shainy Creation Admin Panel
   Renders shared Sidebar + Topbar on every page.
   ============================================================ */

(function () {
  /* ── Detect current page ── */
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  const pageMap = {
    "index.html": "dashboard",
    "orders.html": "orders",
    "products.php": "products",
    "content.html": "content",
    "bulk-orders.php": "bulk-orders",
    "franchise.php": "franchise",
    "contact.php": "contact",
    "finance.html": "finance",
    "analytics.html": "analytics",
    "discounts.html": "discounts",
    "store.html": "store",
    "reports.html": "reports",
    "settings.html": "settings",
  };
  const currentPage = pageMap[file] || "dashboard";

  const NAV_ITEMS = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "index.html",
      badge: null,
      icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    },
    {
      key: "orders",
      label: "Orders",
      href: "orders.html",
      badge: 24,
      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    },
    {
      key: "products",
      label: "Products",
      href: "products.php",
      badge: null,
      icon: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    },
    {
      key: "content",
      label: "Content",
      href: "content.html",
      badge: null,
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    },
    {
      key: "bulk-orders",
      label: "Bulk Orders",
      href: "bulk-orders.php",
      badge: 6,
      icon: '<path d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-9 4h4"/>',
    },
    {
      key: "franchise",
      label: "Franchise Requests",
      href: "franchise.php",
      badge: 2,
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    },
    {
      key: "contact",
      label: "Contact",
      href: "contact.php",
      badge: null,
      icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    },
    {
      key: "finance",
      label: "Finance",
      href: "finance.html",
      badge: null,
      icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    },
    {
      key: "analytics",
      label: "Analytics",
      href: "analytics.html",
      badge: null,
      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    },
    {
      key: "discounts",
      label: "Discounts",
      href: "discounts.html",
      badge: null,
      icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    },
    {
      key: "store",
      label: "Store Locations",
      href: "store.html",
      badge: null,
      icon: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    },
    {
      key: "reports",
      label: "Reports",
      href: "reports.html",
      badge: null,
      icon: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',
    },
    {
      key: "settings",
      label: "Settings",
      href: "settings.html",
      badge: null,
      icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    },
  ];

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    content: "Content Library",
    "bulk-orders": "Bulk Orders",
    franchise: "Franchise Requests",
    contact: "Contact Submissions",
    finance: "Finance",
    analytics: "Analytics",
    discounts: "Discounts",
    store: "Store Locations",
    reports: "Reports",
    settings: "Settings",
  };

  /* ── BUILD SIDEBAR ── */
  function buildSidebar() {
    const items = NAV_ITEMS.map(
      (n) => `
      <a href="${n.href}" class="nav-item${n.key === currentPage ? " active" : ""}" title="${n.label}">
        <svg viewBox="0 0 24 24">${n.icon}</svg>
        ${n.label}
        ${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ""}
      </a>`,
    ).join("");

    return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2l3 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div class="sidebar-logo">Shainy Creation<span>Admin Panel</span></div>
      </div>
      <nav class="sidebar-nav" style="margin-top:10px">${items}</nav>
      <div class="sidebar-footer">
        <div class="avatar">S</div>
        <div>
          <div class="avatar-name">Shainy Mathew</div>
          <div class="avatar-role">Super Admin</div>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
  }

  /* ── BUILD TOPBAR ── */
  function buildTopbar() {
    const title = PAGE_TITLES[currentPage] || "Dashboard";
    return `
    <div class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle-btn" id="mobileMenuToggle">
          <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="page-title" style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500">${title}</div>
        <div class="topbar-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search orders, products, customers…" id="globalSearch" oninput="globalSearchHandler(this.value)">
        </div>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications" id="notifBtn">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="notif-dot"></span>
        </button>
        <button class="icon-btn" title="View Store" onclick="window.open('../index.html')">
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>
        <div style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <div class="avatar" style="width:32px;height:32px;font-size:13px">S</div>
          <span style="font-size:12px;font-weight:500">Shainy</span>
        </div>
      </div>
    </div>`;
  }

  /* ── INJECT ── */
  document.addEventListener("DOMContentLoaded", function () {
    const sc = document.getElementById("sidebar-container");
    const tc = document.getElementById("topbar-container");
    if (sc) sc.innerHTML = buildSidebar();
    if (tc) tc.innerHTML = buildTopbar();

    /* Mobile menu toggle */
    document.addEventListener("click", function (e) {
      const mmb = document.getElementById("mobileMenuToggle");
      const sb = document.getElementById("sidebar");
      const ov = document.getElementById("sidebarOverlay");
      if (!sb || !ov) return;
      if (e.target.closest("#mobileMenuToggle")) {
        sb.classList.toggle("open");
        ov.classList.toggle("open");
      } else if (e.target === ov) {
        sb.classList.remove("open");
        ov.classList.remove("open");
      }
    });

    /* Close overlay on nav click (mobile) */
    document.querySelectorAll(".nav-item").forEach((n) => {
      n.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.remove("open");
        document.getElementById("sidebarOverlay")?.classList.remove("open");
      });
    });
  });

  /* ── GLOBAL SEARCH (stub – override per page if needed) ── */
  window.globalSearchHandler = window.globalSearchHandler || function () {};
})();
