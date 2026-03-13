/* floating-cart.js
 * Shows a floating "Proceed to Cart" bar at bottom-right whenever
 * the cart has items. Inject this script into index.html, shop.html,
 * product.html, best-sellers.html — any page that has Add to Cart buttons.
 *
 * HOW TO ADD TO A PAGE:
 *   <script src="js/floating-cart.js"></script>
 *   (Place just before </body>, after cart.js and main.js)
 */

(function initFloatingCart() {
  // Create the bar element
  const bar = document.createElement('div');
  bar.id = 'floating-cart-bar';
  bar.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;display:none;
    animation:fcSlideIn .3s ease;
  `;

  bar.innerHTML = `
    <style>
      @keyframes fcSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      #floating-cart-bar .fc-inner{
        background:var(--text,#2a1f1a);color:#fff;
        display:flex;align-items:center;gap:16px;
        padding:14px 22px;
        box-shadow:0 8px 32px rgba(42,31,26,.30);
        cursor:pointer;
        transition:background .2s,transform .18s;
        font-family:'Jost',sans-serif;
      }
      #floating-cart-bar .fc-inner:hover{
        background:var(--rose-dark,#a85a4c);
        transform:translateY(-2px);
      }
      #floating-cart-bar .fc-icon svg{
        width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.8;display:block;
      }
      #floating-cart-bar .fc-badge{
        position:absolute;top:-6px;right:-6px;
        width:20px;height:20px;background:var(--rose,#c8796a);
        border-radius:50%;font-size:10px;font-weight:700;
        display:flex;align-items:center;justify-content:center;
        border:2px solid #fff;
      }
      #floating-cart-bar .fc-icon-wrap{position:relative;}
      #floating-cart-bar .fc-label{
        font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;
      }
      #floating-cart-bar .fc-amount{
        font-family:'Cormorant Garamond',Georgia,serif;
        font-size:20px;font-weight:600;letter-spacing:.02em;
        border-left:1px solid rgba(255,255,255,.25);
        padding-left:16px;
      }
    </style>
    <div class="fc-inner" onclick="window.location.href='cart.html'">
      <div class="fc-icon-wrap">
        <div class="fc-icon">
          <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <span class="fc-badge" id="fc-qty">0</span>
      </div>
      <div class="fc-label">Proceed to Cart</div>
      <div class="fc-amount" id="fc-amount">₹0</div>
    </div>
  `;

  document.body.appendChild(bar);

  function refreshBar() {
    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const totalQty = cart.reduce((s, i) => s + (i.qty || 1), 0);
    const totalAmt = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

    document.getElementById('fc-qty').textContent = totalQty;
    document.getElementById('fc-amount').textContent = '₹' + totalAmt.toLocaleString();

    if (totalQty > 0) {
      bar.style.display = 'block';
    } else {
      bar.style.display = 'none';
    }
  }

  // Run on load
  refreshBar();

  // React whenever addToCart is called (patch it)
  const originalAddToCart = window.addToCart;
  window.addToCart = function(product) {
    if (originalAddToCart) originalAddToCart(product);
    refreshBar();
  };

  // Also listen to localStorage changes (cross-tab)
  window.addEventListener('storage', e => {
    if (e.key === 'sc_cart') refreshBar();
  });

  // Expose refresh globally so cart.js can call it
  window.refreshFloatingCart = refreshBar;
})();
