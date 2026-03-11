/* ============================================================
   orders.js  –  Shainy Creation Admin Panel
   Orders page: list, filter, sort, print labels, order detail modal.
   ============================================================ */

let currentOrderId = null;
let selectedOrders = new Set();
let currentPage    = 1;
const PER_PAGE     = 15;

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderOrders(list){
  const tbody = document.getElementById('orders-table-body');
  if(!tbody) return;
  if(!list.length){
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-soft)">No orders found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(o=>`
    <tr data-id="${o.id}">
      <td><input type="checkbox" class="order-cb" data-id="${o.id}" ${selectedOrders.has(o.id)?'checked':''}
          onchange="toggleOrderSelect('${o.id}',this.checked)"></td>
      <td><span style="font-family:monospace;font-size:11px">${o.id}</span></td>
      <td>
        <div style="font-weight:600;font-size:12px">${o.customer}</div>
        <div style="font-size:10px;color:var(--text-soft)">${o.phone}</div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="td-img"><div class="dress-ph ${o.dress}"></div></div>
          <div>
            <div style="font-size:12px;font-weight:500">${o.product}</div>
            <div style="font-size:10px;color:var(--text-soft)">Qty: ${o.qty}</div>
          </div>
        </div>
      </td>
      <td style="font-weight:600">${fmtCurrency(o.amount)}</td>
      <td><span style="font-size:11px">${o.payment}</span></td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(o.date)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-icon" onclick="viewOrder('${o.id}')" title="View">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn btn-outline btn-icon" onclick="printLabel('${o.id}')" title="Print Label">
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

/* ── FILTER ──────────────────────────────────────────────── */
function filterOrders(){
  currentPage = 1;
  applyFilters();
}

function applyFilters(){
  const q       = (document.getElementById('order-search')?.value||'').toLowerCase();
  const status  = document.getElementById('order-status-filter')?.value||'';
  const sort    = document.getElementById('order-sort')?.value||'Newest First';
  const payment = document.getElementById('order-payment')?.value||'';

  let list = [...(SC_ORDERS||[])];
  if(q)       list = list.filter(o=>o.id.toLowerCase().includes(q)||o.customer.toLowerCase().includes(q)||o.product.toLowerCase().includes(q));
  if(status)  list = list.filter(o=>o.status===status);
  if(payment) list = list.filter(o=>o.payment===payment);
  if(sort==='Oldest First')    list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='Highest Amount') list.sort((a,b)=>b.amount-a.amount);
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  const total  = list.length;
  const start  = (currentPage-1)*PER_PAGE;
  const paged  = list.slice(start, start+PER_PAGE);

  renderOrders(paged);
  updatePagination(total, list);
  document.getElementById('orders-showing').textContent = total ? `${start+1}–${Math.min(start+PER_PAGE,total)}`:'0';
  document.getElementById('orders-total').textContent   = total;
}

/* ── PAGINATION ──────────────────────────────────────────── */
function updatePagination(total, fullList){
  const pages = Math.ceil(total/PER_PAGE);
  const container = document.getElementById('orders-pagination');
  if(!container) return;
  let html='';
  for(let i=1;i<=pages;i++){
    html+=`<button class="btn btn-outline btn-sm${i===currentPage?' btn-primary':''}" onclick="goToPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}
function goToPage(n){ currentPage=n; applyFilters(); }

/* ── SELECT ALL ──────────────────────────────────────────── */
function selectAllOrders(cb){
  const cbs = document.querySelectorAll('.order-cb');
  cbs.forEach(c=>{ c.checked=cb.checked; selectedOrders[cb.checked?'add':'delete'](c.dataset.id); });
  updateBulkActions();
}
function toggleOrderSelect(id, checked){ selectedOrders[checked?'add':'delete'](id); updateBulkActions(); }
function updateBulkActions(){
  const ba = document.getElementById('bulk-order-actions');
  if(ba) ba.style.display = selectedOrders.size>0?'flex':'none';
}

/* ── VIEW ORDER DETAIL ───────────────────────────────────── */
function viewOrder(id){
  currentOrderId = id;
  const o = (SC_ORDERS||[]).find(x=>x.id===id);
  if(!o) return;
  document.getElementById('order-modal-title').textContent = `Order ${o.id}`;
  document.getElementById('order-modal-body').innerHTML = `
    <div class="form-2col" style="margin-bottom:20px">
      <div>
        <div class="form-label" style="margin-bottom:8px">Customer Details</div>
        <p style="font-size:13px;font-weight:600;margin-bottom:2px">${o.customer}</p>
        <p style="font-size:12px;color:var(--text-soft)">${o.phone}</p>
        <p style="font-size:12px;color:var(--text-soft);line-height:1.6;margin-top:6px">${o.address}</p>
      </div>
      <div>
        <div class="form-label" style="margin-bottom:8px">Order Info</div>
        <table style="font-size:12px;width:100%">
          <tr><td style="color:var(--text-soft);padding:2px 0">Order ID</td><td style="font-family:monospace">${o.id}</td></tr>
          <tr><td style="color:var(--text-soft);padding:2px 0">Date</td><td>${fmtDate(o.date)}</td></tr>
          <tr><td style="color:var(--text-soft);padding:2px 0">Payment</td><td>${o.payment}</td></tr>
          <tr><td style="color:var(--text-soft);padding:2px 0">Amount</td><td style="font-weight:700">${fmtCurrency(o.amount)}</td></tr>
        </table>
      </div>
    </div>
    <div class="form-label" style="margin-bottom:8px">Items</div>
    <div style="border:1px solid var(--border);padding:14px;display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div class="td-img" style="width:56px;height:72px"><div class="dress-ph ${o.dress}" style="width:28px;height:48px;border-radius:50% 50% 30% 30%/30% 30% 10% 10%"></div></div>
      <div style="flex:1">
        <div style="font-weight:600">${o.product}</div>
        <div style="font-size:11px;color:var(--text-soft)">SKU: ${o.sku} &nbsp;|&nbsp; Qty: ${o.qty}</div>
      </div>
      <div style="font-weight:700;font-size:14px">${fmtCurrency(o.amount)}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Update Status</label>
      <select class="form-select" id="order-status-update">
        ${['Pending','Processing','Shipped','Delivered','Returned'].map(s=>`<option${s===o.status?' selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Tracking Number</label>
      <input class="form-input" id="order-tracking" placeholder="Enter tracking number" value="">
    </div>
    <div class="form-group">
      <label class="form-label">Internal Notes</label>
      <textarea class="form-textarea" id="order-notes" placeholder="Add a note…"></textarea>
    </div>`;
  openModal('orderDetailModal');
}

/* ── SAVE ORDER ──────────────────────────────────────────── */
function saveOrder(){
  const newStatus = document.getElementById('order-status-update')?.value;
  if(currentOrderId && newStatus){
    const o = (SC_ORDERS||[]).find(x=>x.id===currentOrderId);
    if(o) o.status = newStatus;
  }
  closeModal('orderDetailModal');
  showToast('✓ Order updated successfully!');
  applyFilters();
}

/* ── PRINT LABEL ─────────────────────────────────────────── */
function printLabel(id){
  const o = (SC_ORDERS||[]).find(x=>x.id===id);
  if(!o) return;
  document.getElementById('label-content').innerHTML = buildLabelHTML(o);
  openModal('labelPrintModal');
}

function buildLabelHTML(o){
  return `
    <div style="border:2px solid #2a1f1a;padding:24px;font-family:'Jost',sans-serif;max-width:380px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:2px solid #2a1f1a;padding-bottom:12px">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600">Shainy Creation</div>
          <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7a6458">Premium Kids Fashion</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;font-weight:700">${o.id}</div>
          <div style="font-size:9px;color:#7a6458">${fmtDate(o.date)}</div>
        </div>
      </div>
      <div style="margin-bottom:14px">
        <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7a6458;margin-bottom:4px">Ship To</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:2px">${o.customer}</div>
        <div style="font-size:12px;line-height:1.7">${o.address}</div>
        <div style="font-size:12px;margin-top:3px">${o.phone}</div>
      </div>
      <div style="border-top:1px dashed #ead9ce;padding-top:12px;margin-bottom:14px">
        <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7a6458;margin-bottom:6px">Items</div>
        <div style="display:flex;justify-content:space-between;font-size:12px">
          <span>${o.product} × ${o.qty}</span>
          <span style="font-weight:700">${fmtCurrency(o.amount)}</span>
        </div>
        <div style="font-size:10px;color:#7a6458;margin-top:2px">SKU: ${o.sku}</div>
      </div>
      <div style="background:#fdf8f5;padding:10px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11px;color:#7a6458">Payment: ${o.payment}</span>
        <span style="font-size:11px;font-weight:700;color:#c8796a">Total: ${fmtCurrency(o.amount)}</span>
      </div>
      <div style="text-align:center;margin-top:14px;font-size:9px;color:#7a6458;letter-spacing:.12em">
        THANK YOU FOR YOUR ORDER ✦ www.shainycreation.com
      </div>
    </div>`;
}

/* ── BULK ACTIONS ────────────────────────────────────────── */
function bulkPrintLabels(){
  if(!selectedOrders.size){ showToast('⚠ No orders selected'); return; }
  const labels = [...selectedOrders].map(id=>{
    const o = (SC_ORDERS||[]).find(x=>x.id===id);
    return o ? buildLabelHTML(o) : '';
  }).join('<div style="page-break-after:always;margin-bottom:32px"></div>');
  document.getElementById('label-content').innerHTML = labels;
  openModal('labelPrintModal');
}

function bulkUpdateStatus(){
  if(!selectedOrders.size){ showToast('⚠ No orders selected'); return; }
  showToast(`✓ ${selectedOrders.size} orders status updated`);
  selectedOrders.clear();
  updateBulkActions();
  applyFilters();
}

function printAllLabels(){
  const list = SC_ORDERS||[];
  const labels = list.map(o=>buildLabelHTML(o)).join('<div style="page-break-after:always;margin-bottom:32px"></div>');
  document.getElementById('label-content').innerHTML = labels;
  openModal('labelPrintModal');
}

function exportCSV(){
  const headers = ['Order ID','Customer','Phone','Product','SKU','Qty','Amount','Payment','Date','Status'];
  const rows = (SC_ORDERS||[]).map(o=>[o.id,o.customer,o.phone,o.product,o.sku,o.qty,o.amount,o.payment,o.date,o.status]);
  const csv  = [headers,...rows].map(r=>r.join(',')).join('\n');
  const a    = document.createElement('a');
  a.href     = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download = 'orders.csv';
  a.click();
  showToast('📥 CSV exported!');
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  applyFilters();

  /* Close modals on overlay click */
  document.querySelectorAll('.modal-overlay').forEach(el=>{
    el.addEventListener('click', e=>{ if(e.target===el) el.classList.remove('open'); });
  });
});
