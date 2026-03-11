/* ============================================================
   products.js  –  Shainy Creation Admin Panel
   Products: list, filter, add/edit, hide/show, remove, import.
   ============================================================ */

let currentTab = 'all';
let prodImages = [];

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderProducts(){
  const q      = (document.getElementById('prod-search')?.value||'').toLowerCase();
  const cat    = document.getElementById('prod-cat')?.value||'';
  const sort   = document.getElementById('prod-sort')?.value||'Newest';
  const tab    = currentTab;

  let list = [...(SC_PRODUCTS||[])];
  if(tab!=='all') list = list.filter(p=>p.status===tab);
  if(q)           list = list.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q));
  if(cat)         list = list.filter(p=>p.category===cat);
  if(sort==='Price: Low-High')  list.sort((a,b)=>a.price-b.price);
  else if(sort==='Price: High-Low') list.sort((a,b)=>b.price-a.price);
  else if(sort==='Best Selling')    list.sort((a,b)=>b.sales-a.sales);

  /* Update tab counts */
  document.getElementById('tab-all-count').textContent    = (SC_PRODUCTS||[]).length;
  document.getElementById('tab-active-count').textContent = (SC_PRODUCTS||[]).filter(p=>p.status==='Active').length;
  document.getElementById('tab-hold-count').textContent   = (SC_PRODUCTS||[]).filter(p=>p.status==='On Hold').length;
  document.getElementById('tab-draft-count').textContent  = (SC_PRODUCTS||[]).filter(p=>p.status==='Draft').length;
  document.getElementById('prod-count').textContent       = `${list.length} product${list.length!==1?'s':''} total`;

  const tbody = document.getElementById('products-table-body');
  if(!tbody) return;
  if(!list.length){
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-soft)">No products found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(p=>`
    <tr data-id="${p.id}">
      <td><input type="checkbox" class="prod-cb" data-id="${p.id}" onchange="updateBulkProductActions()"></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="td-img"><div class="dress-ph ${p.dress}"></div></div>
          <div>
            <div style="font-weight:600;font-size:12px">${p.name}</div>
            <div style="font-size:10px;color:var(--text-soft)">${p.category} · ${p.age}</div>
            ${p.featured?'<span style="font-size:9px;background:var(--blush);color:var(--rose);padding:1px 6px;letter-spacing:.06em">FEATURED</span>':''}
          </div>
        </div>
      </td>
      <td><span style="font-family:monospace;font-size:11px">${p.sku}</span></td>
      <td>
        <div style="font-weight:700">₹${p.price.toLocaleString('en-IN')}</div>
        ${p.compare?`<div style="font-size:10px;color:var(--text-soft);text-decoration:line-through">₹${p.compare.toLocaleString('en-IN')}</div>`:''}
      </td>
      <td>
        <span style="font-weight:600;color:${p.stock===0?'var(--badge-red)':p.stock<10?'var(--orange)':'var(--green)'}">${p.stock}</span>
        ${p.stock===0?'<span class="badge badge-danger" style="font-size:9px;margin-left:4px">Out</span>':p.stock<10?'<span class="badge badge-warning" style="font-size:9px;margin-left:4px">Low</span>':''}
      </td>
      <td>${statusBadge(p.status)}</td>
      <td style="font-size:12px">${p.sales.toLocaleString('en-IN')}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-icon" onclick="openEditProduct('${p.id}')" title="Edit">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-outline btn-icon" onclick="toggleProductVisibility('${p.id}')" title="${p.status==='Active'?'Hide':'Show'}">
            <svg viewBox="0 0 24 24">${p.status==='Active'?'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
            :'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'}</svg>
          </button>
          <button class="btn btn-danger btn-icon" onclick="removeProduct('${p.id}')" title="Remove">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

/* ── FILTER / TAB ────────────────────────────────────────── */
function filterProducts(){ renderProducts(); }

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      currentTab = this.dataset.tab;
      renderProducts();
    });
  });
});

/* ── BULK SELECT ─────────────────────────────────────────── */
function selectAllProducts(cb){
  document.querySelectorAll('.prod-cb').forEach(c=>c.checked=cb.checked);
  updateBulkProductActions();
}
function updateBulkProductActions(){
  const any = [...document.querySelectorAll('.prod-cb')].some(c=>c.checked);
  const ba  = document.getElementById('bulk-actions');
  if(ba) ba.style.display = any?'flex':'none';
}

/* ── BULK ACTIONS ────────────────────────────────────────── */
function bulkAction(action){
  const checked = [...document.querySelectorAll('.prod-cb:checked')].map(c=>c.dataset.id);
  if(!checked.length){ showToast('⚠ No products selected'); return; }
  checked.forEach(id=>{
    const p = (SC_PRODUCTS||[]).find(x=>x.id===id);
    if(!p) return;
    if(action==='hide')   p.status='On Hold';
    if(action==='show')   p.status='Active';
    if(action==='remove') { const i=SC_PRODUCTS.indexOf(p); if(i>-1) SC_PRODUCTS.splice(i,1); }
  });
  showToast(action==='remove'?`🗑 ${checked.length} product(s) removed`:`✓ ${checked.length} product(s) updated`);
  renderProducts();
}

/* ── TOGGLE VISIBILITY ───────────────────────────────────── */
function toggleProductVisibility(id){
  const p = (SC_PRODUCTS||[]).find(x=>x.id===id);
  if(!p) return;
  p.status = p.status==='Active' ? 'On Hold' : 'Active';
  showToast(`✓ Product ${p.status==='Active'?'shown':'hidden'}`);
  renderProducts();
}

/* ── REMOVE PRODUCT ──────────────────────────────────────── */
function removeProduct(id){
  if(!confirm('Remove this product? This cannot be undone.')) return;
  const i = (SC_PRODUCTS||[]).findIndex(x=>x.id===id);
  if(i>-1) SC_PRODUCTS.splice(i,1);
  showToast('🗑 Product removed');
  renderProducts();
}

/* ── ADD PRODUCT MODAL ───────────────────────────────────── */
function openAddProduct(){
  clearProductForm();
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('edit-prod-id').value = '';
  openModal('addProductModal');
}

function openEditProduct(id){
  const p = (SC_PRODUCTS||[]).find(x=>x.id===id);
  if(!p) return;
  clearProductForm();
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  document.getElementById('edit-prod-id').value    = p.id;
  document.getElementById('new-prod-name').value   = p.name;
  document.getElementById('new-prod-sku').value    = p.sku;
  document.getElementById('new-prod-price').value  = p.price;
  document.getElementById('new-prod-compare').value= p.compare||'';
  document.getElementById('new-prod-cat').value    = p.category;
  document.getElementById('new-prod-age').value    = p.age;
  document.getElementById('new-prod-stock').value  = p.stock;
  document.getElementById('new-prod-status').value = p.status;
  document.getElementById('new-prod-featured').checked = p.featured;
  openModal('addProductModal');
}

function clearProductForm(){
  ['new-prod-name','new-prod-sku','new-prod-price','new-prod-compare',
   'new-prod-stock','new-prod-desc','new-prod-tags'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('new-prod-featured').checked=false;
  document.getElementById('prod-image-preview').innerHTML='';
  prodImages=[];
}

/* ── SAVE PRODUCT ────────────────────────────────────────── */
function saveProduct(){
  const name  = document.getElementById('new-prod-name')?.value.trim();
  const price = document.getElementById('new-prod-price')?.value;
  if(!name||!price){ showToast('⚠ Name and price are required'); return; }

  const editId = document.getElementById('edit-prod-id')?.value;
  if(editId){
    const p = (SC_PRODUCTS||[]).find(x=>x.id===editId);
    if(p){
      p.name     = name;
      p.sku      = document.getElementById('new-prod-sku')?.value||p.sku;
      p.price    = +price;
      p.compare  = +(document.getElementById('new-prod-compare')?.value)||0;
      p.category = document.getElementById('new-prod-cat')?.value||p.category;
      p.age      = document.getElementById('new-prod-age')?.value||p.age;
      p.stock    = +(document.getElementById('new-prod-stock')?.value)||p.stock;
      p.status   = document.getElementById('new-prod-status')?.value||p.status;
      p.featured = document.getElementById('new-prod-featured')?.checked;
    }
  } else {
    const newProd = {
      id:'p'+Date.now(),
      name, price:+price,
      compare:+(document.getElementById('new-prod-compare')?.value)||0,
      sku:document.getElementById('new-prod-sku')?.value||'SC-NEW-'+Date.now(),
      category:document.getElementById('new-prod-cat')?.value||'Frocks',
      age:document.getElementById('new-prod-age')?.value||'3–6 Yrs',
      stock:+(document.getElementById('new-prod-stock')?.value)||0,
      status:document.getElementById('new-prod-status')?.value||'Active',
      featured:document.getElementById('new-prod-featured')?.checked||false,
      sales:0,
      dress:'dress-pink',
    };
    SC_PRODUCTS.unshift(newProd);
  }
  closeModal('addProductModal');
  showToast('✓ Product saved!');
  renderProducts();
}

/* ── IMAGE UPLOAD PREVIEW ────────────────────────────────── */
function handleProductImages(input){
  const preview = document.getElementById('prod-image-preview');
  if(!preview) return;
  [...input.files].forEach(file=>{
    const reader = new FileReader();
    reader.onload = e=>{
      prodImages.push(e.target.result);
      preview.innerHTML += `
        <div style="position:relative;width:80px;height:80px;flex-shrink:0">
          <img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border:1px solid var(--border)">
          <button onclick="removeProductImage(this)" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,.5);color:#fff;border:none;width:18px;height:18px;font-size:12px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center">×</button>
        </div>`;
    };
    reader.readAsDataURL(file);
  });
}
function removeProductImage(btn){ btn.parentElement.remove(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderProducts();
  document.querySelectorAll('.modal-overlay').forEach(el=>{
    el.addEventListener('click', e=>{ if(e.target===el) el.classList.remove('open'); });
  });
});
