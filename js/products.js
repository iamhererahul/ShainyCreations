/* products.js – Product data v2 */
const PRODUCTS = [
  { id:'p1', name:'Rosabay Belle Frock',   age:'3–5 Yrs', colors:8,  price:1680, originalPrice:2100, dress:'dress-pink',     badge:'limited', rating:4.8, reviews:124, bestseller:true  },
  { id:'p2', name:'Flora Lace Gown',       age:'5–8 Yrs', colors:6,  price:3000, originalPrice:null, dress:'dress-gold',     badge:'limited', rating:4.9, reviews:89,  bestseller:true  },
  { id:'p3', name:'Seraphina White Frock', age:'7–10 Yrs',colors:5,  price:3029, originalPrice:3600, dress:'dress-white-ph', badge:null,      rating:4.7, reviews:56,  bestseller:false },
  { id:'p4', name:'Amithy Sequin Dress',   age:'3–6 Yrs', colors:18, price:3985, originalPrice:4480, dress:'dress-red',      badge:'limited', rating:4.6, reviews:201, bestseller:true  },
  { id:'p5', name:'Lavender Dream Tutu',   age:'3–7 Yrs', colors:7,  price:1899, originalPrice:2400, dress:'dress-lavender', badge:null,      rating:4.8, reviews:77,  bestseller:true  },
  { id:'p6', name:'Coral Bow Frock',       age:'4–6 Yrs', colors:4,  price:1239, originalPrice:null, dress:'dress-coral',    badge:null,      rating:4.5, reviews:43,  bestseller:false },
  { id:'p7', name:'Sky Ballet Dress',      age:'6–9 Yrs', colors:5,  price:2199, originalPrice:2800, dress:'dress-blue',     badge:'new',     rating:4.7, reviews:18,  bestseller:false },
  { id:'p8', name:'Mint Fairy Frock',      age:'2–5 Yrs', colors:3,  price:1499, originalPrice:null, dress:'dress-mint',     badge:'new',     rating:4.9, reviews:12,  bestseller:false },
  { id:'p9', name:'Sunshine Princess',     age:'5–8 Yrs', colors:4,  price:2350, originalPrice:2800, dress:'dress-yellow',   badge:'sale',    rating:4.6, reviews:35,  bestseller:true  },
  { id:'p10',name:'Pearl Blossom Gown',    age:'8–12 Yrs',colors:4,  price:4200, originalPrice:5000, dress:'dress-white-ph', badge:'limited', rating:4.9, reviews:67,  bestseller:true  },
  { id:'p11',name:'Ruby Ruffle Frock',     age:'2–4 Yrs', colors:5,  price:1350, originalPrice:1600, dress:'dress-red',      badge:null,      rating:4.5, reviews:29,  bestseller:false },
  { id:'p12',name:'Ocean Breeze Dress',    age:'6–10 Yrs',colors:3,  price:2800, originalPrice:3200, dress:'dress-blue',     badge:'new',     rating:4.7, reviews:14,  bestseller:false },
];
window.PRODUCTS = PRODUCTS;

function isWishlisted(id) {
  return (JSON.parse(localStorage.getItem('sc_wishlist') || '[]')).includes(id);
}

function productCardHTML(p, imgHeight='product-img-h280') {
  const wishlisted = isWishlisted(p.id);
  const badgeHTML = p.badge
    ? `<span class="badge badge-${p.badge}">${p.badge==='limited'?'Limited Stock':p.badge.charAt(0).toUpperCase()+p.badge.slice(1)}</span>` : '';
  const priceHTML = p.originalPrice
    ? `<span class="original">₹${p.originalPrice.toLocaleString()}</span><span class="sale">₹${p.price.toLocaleString()}</span>`
    : `₹${p.price.toLocaleString()}`;
  const starsHTML = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5-Math.round(p.rating));
  return `
  <div class="product-card" data-id="${p.id}" onclick="window.location='product.html?id=${p.id}'">
    <div class="product-img ${imgHeight}">
      ${badgeHTML}
      <button class="card-wishlist ${wishlisted?'active':''}" onclick="event.stopPropagation()" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="dress-ph ${p.dress}"></div>
    </div>
    <div class="card-body">
      <div class="card-name">${p.name}</div>
      <div class="stars-row" style="margin-bottom:4px"><span class="stars" style="font-size:11px">${starsHTML}</span><span style="font-size:10px;color:var(--text-soft)">(${p.reviews})</span></div>
      <div class="card-meta">${p.age} · ${p.colors} colors</div>
      <div class="card-price">${priceHTML}</div>
    </div>
  </div>`;
}
window.productCardHTML = productCardHTML;
