/* ============================================================
   discounts.js  –  Shainy Creation Admin Panel
   Discounts: list, create, edit, delete discount coupons.
   ============================================================ */

let editingDiscCode = null;

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderDiscounts(){
  const q       = (document.getElementById('disc-search')?.value||'').toLowerCase();
  const type    = document.getElementById('disc-type-filter')?.value||'';
  const status  = document.getElementById('disc-status-filter')?.value||'';

  let list = [...(SC_DISCOUNTS||[])];
  const today = new Date();

  /* Compute effective status */
  list.forEach(d=>{
    d._effStatus = !d.active ? 'Inactive' : (d.end && new Date(d.end)<today) ? 'Expired' : 'Active';
  });

  if(q)      list = list.filter(d=>d.code.toLowerCase().includes(q));
  if(type)   list = list.filter(d=>d.type.startsWith(type.split(' ')[0]));
  if(status) list = list.filter(d=>d._effStatus===status);

  /* Stats */
  document.getElementById('disc-total').textContent       = SC_DISCOUNTS.length;
  document.getElementById('disc-active-count').textContent= SC_DISCOUNTS.filter(d=>d.active).length;
  document.getElementById('disc-expired').textContent     = SC_DISCOUNTS.filter(d=>d.end&&new Date(d.end)<today).length;
  document.getElementById('disc-uses').textContent        = SC_DISCOUNTS.reduce((a,b)=>a+b.uses,0).toLocaleString('en-IN');

  const tbody = document.getElementById('discounts-table');
  if(!tbody) return;
  if(!list.length){ tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-soft)">No discounts found.</td></tr>'; return; }

  tbody.innerHTML = list.map(d=>`
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="disc-code">${d.code}</span>
          <button onclick="copyCode('${d.code}')" title="Copy" style="background:none;border:none;cursor:pointer;color:var(--text-soft)">
            <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </td>
      <td style="font-size:11px">${d.type}</td>
      <td style="font-weight:700">${d.type.includes('Shipping')?'Free':d.type.includes('%')?d.value+'%':'₹'+d.value.toLocaleString('en-IN')}</td>
      <td style="font-size:12px">${d.uses.toLocaleString('en-IN')} / ${d.limit?d.limit.toLocaleString('en-IN'):'∞'}</td>
      <td style="font-size:12px">${d.min?fmtCurrency(d.min):'None'}</td>
      <td style="font-size:11px;white-space:nowrap">${d.end?fmtDate(d.end):'No Expiry'}</td>
      <td>${statusBadge(d._effStatus)}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-icon" onclick="editDiscount('${d.code}')" title="Edit">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-icon" onclick="deleteDiscount('${d.code}')" title="Delete">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

/* ── COPY CODE ───────────────────────────────────────────── */
function copyCode(code){
  navigator.clipboard.writeText(code).catch(()=>{});
  showToast(`✓ "${code}" copied!`);
}

/* ── OPEN ADD MODAL ──────────────────────────────────────── */
function openAddDiscount(){
  editingDiscCode = null;
  clearDiscountForm();
  document.getElementById('discount-modal-title').textContent = 'Create Discount';
  document.getElementById('edit-disc-code-original').value = '';
  openModal('addDiscountModal');
}

/* ── EDIT ────────────────────────────────────────────────── */
function editDiscount(code){
  const d = (SC_DISCOUNTS||[]).find(x=>x.code===code);
  if(!d) return;
  editingDiscCode = code;
  clearDiscountForm();
  document.getElementById('discount-modal-title').textContent = 'Edit Discount';
  document.getElementById('edit-disc-code-original').value   = code;
  document.getElementById('disc-code').value    = d.code;
  document.getElementById('disc-type').value    = d.type;
  document.getElementById('disc-value').value   = d.value||'';
  document.getElementById('disc-min').value     = d.min||'';
  document.getElementById('disc-limit').value   = d.limit||'';
  document.getElementById('disc-start').value   = d.start||'';
  document.getElementById('disc-end').value     = d.end||'';
  document.getElementById('disc-applies').value = d.applies||'All Products';
  document.getElementById('disc-active').checked= d.active;
  toggleDiscountValue();
  openModal('addDiscountModal');
}

/* ── SAVE DISCOUNT ───────────────────────────────────────── */
function saveDiscount(){
  const code = document.getElementById('disc-code')?.value.trim().toUpperCase();
  if(!code){ showToast('⚠ Discount code is required'); return; }

  const d = {
    code,
    type:    document.getElementById('disc-type')?.value||'Percentage (%)',
    value:   +(document.getElementById('disc-value')?.value)||0,
    min:     +(document.getElementById('disc-min')?.value)||0,
    limit:   document.getElementById('disc-limit')?.value ? +(document.getElementById('disc-limit').value) : null,
    uses:    0,
    start:   document.getElementById('disc-start')?.value||new Date().toISOString().slice(0,10),
    end:     document.getElementById('disc-end')?.value||'',
    applies: document.getElementById('disc-applies')?.value||'All Products',
    active:  document.getElementById('disc-active')?.checked??true,
  };

  if(editingDiscCode){
    const i = SC_DISCOUNTS.findIndex(x=>x.code===editingDiscCode);
    if(i>-1){ d.uses=SC_DISCOUNTS[i].uses; SC_DISCOUNTS[i]=d; }
  } else {
    if(SC_DISCOUNTS.find(x=>x.code===code)){ showToast('⚠ Code already exists'); return; }
    SC_DISCOUNTS.unshift(d);
  }
  closeModal('addDiscountModal');
  showToast('✓ Discount saved!');
  renderDiscounts();
}

/* ── DELETE ──────────────────────────────────────────────── */
function deleteDiscount(code){
  if(!confirm(`Delete discount "${code}"?`)) return;
  const i = SC_DISCOUNTS.findIndex(x=>x.code===code);
  if(i>-1) SC_DISCOUNTS.splice(i,1);
  showToast('🗑 Discount deleted');
  renderDiscounts();
}

/* ── TOGGLE VALUE FIELD ──────────────────────────────────── */
function toggleDiscountValue(){
  const type = document.getElementById('disc-type')?.value||'';
  const vg   = document.getElementById('disc-value-group');
  if(vg) vg.style.display = type.includes('Shipping') ? 'none' : '';
}

/* ── GENERATE CODE ───────────────────────────────────────── */
function genCode(){
  const prefixes = ['PRINCESS','ROYAL','FAIRY','FROCK','GOWN','SHINE','GLAM','GIFT'];
  const p = prefixes[Math.floor(Math.random()*prefixes.length)];
  const n = Math.floor(Math.random()*80+10);
  const code = document.getElementById('disc-code');
  if(code) code.value = p+n;
}

/* ── FILTER ──────────────────────────────────────────────── */
function filterDiscounts(){ renderDiscounts(); }

/* ── CLEAR FORM ──────────────────────────────────────────── */
function clearDiscountForm(){
  ['disc-code','disc-value','disc-min','disc-limit','disc-start','disc-end'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('disc-active').checked=true;
  toggleDiscountValue();
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderDiscounts();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
});
