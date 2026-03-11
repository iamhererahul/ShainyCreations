/* cart.js – Cart logic */

const CART_KEY = 'sc_cart';

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === product.size && i.color === product.color);
  if (existing) existing.qty = (existing.qty || 1) + (product.qty || 1);
  else cart.push({ ...product, qty: product.qty || 1 });
  saveCart(cart);
  window.showToast && window.showToast('✓ Added to cart!');
}
window.addToCart = addToCart;

function removeFromCart(id, size, color) {
  let cart = getCart();
  cart = cart.filter(i => !(i.id === id && i.size === size && i.color === color));
  saveCart(cart);
  renderCart();
}

function updateQty(id, size, color, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size && i.color === color);
  if (item) {
    item.qty = Math.max(1, (item.qty || 1) + delta);
    saveCart(cart);
    renderCart();
  }
}

function renderCart() {
  const cart = getCart();
  const wrap = document.getElementById('cart-items-wrap');
  const emptyMsg = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  if (!wrap) return;

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  let html = '';
  let subtotal = 0;
  cart.forEach(item => {
    const lineTotal = item.price * (item.qty || 1);
    subtotal += lineTotal;
    html += `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-img">
          <div class="dress-ph ${item.color || 'dress-pink'}" style="width:36px;height:60px"></div>
        </div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Size: ${item.size || 'M'} · Age: ${item.age || '3–5 Yrs'}</div>
        </div>
      </div>
      <div class="cart-item-price" data-label="Price">₹${item.price.toLocaleString()}</div>
      <div class="cart-qty">
        <button class="cart-qty-btn" onclick="updateQty('${item.id}','${item.size}','${item.color}',-1)">−</button>
        <input class="cart-qty-val" value="${item.qty || 1}" readonly>
        <button class="cart-qty-btn" onclick="updateQty('${item.id}','${item.size}','${item.color}',1)">+</button>
      </div>
      <div class="cart-item-total" data-label="Total">₹${lineTotal.toLocaleString()}</div>
      <button class="remove-btn" onclick="removeFromCart('${item.id}','${item.size}','${item.color}')" title="Remove">×</button>
    </div>`;
  });
  wrap.innerHTML = html;

  const shipping = subtotal >= 1500 ? 0 : 99;
  document.getElementById('summary-subtotal').textContent = '₹' + subtotal.toLocaleString();
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
  document.getElementById('summary-total').textContent = '₹' + (subtotal + shipping).toLocaleString();
}

document.addEventListener('DOMContentLoaded', renderCart);
