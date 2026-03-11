/* ============================================================
   bulk-orders.js  –  Shainy Creation Admin Panel
   Bulk orders: list, filter, detail modal, approve, label print.
   ============================================================ */

let currentBulkId  = null;
let selectedBulks  = new Set();

/* ── RENDER ──────────────────────────────────────────────── */
function renderBulkOrders(){
  const q      = (document.getElementById('bulk-search')?.value||'').toLowerCase();
  const status = document.getElementById('bulk-status-filter')?.value||'';
  const sort   = document.getElementById('bulk-sort')?.value||'Newest First';

  let list = [...(SC_BULK_ORDERS||[])];
  if(q)      list = list.filter(o=>o.id.toLowerCase().includes(q)||o.company.toLowerCase().includes(q)||o.contact.toLowerCase().includes(q));
  if(status) list = list.filter(o=>o.status===status);
  if(sort==='Oldest First')  list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='Highest Value') list.sort((a,b)=>b.value-a.value);
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  document.getElementById('bulk-showing').textContent = `${list.length} of ${SC_BULK_ORDERS.length}`;

  const tbody = document.getElementById('bulk-orders-body');
  if(!tbody) return;
  if(!list.length){ tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-soft)">No bulk orders found.</td></tr>'; return; }

  tbody.innerHTML = list.map(o=>`
    <tr>
      <td><input type="checkbox" class="bulk-cb" data-id="${o.id}" onchange="toggleBulkSelect('${o.id}',this.checked)"></td>
      <td><span style="font-family:monospace;font-size:11px">${o.id}</span></td>
      <td>
        <div style="font-weight:600;font-size:12px">${o.company}</div>
        <div style="font-size:10px;color:var(--text-soft)">${o.contact} · ${o.phone}</div>
      </td>
      <td style="font-size:11px">${o.products.join(', ')}</td>
      <td style="font-weight:600">${o.qty.toLocaleString('en-IN')}</td>
      <td style="font-weight:700">${fmtCurrency(o.value)}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(o.date)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-icon" onclick="viewBulkOrder('${o.id}')" title="View">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn btn-outline btn-icon" onclick="printBulkLabel('${o.id}')" title="Print Label">
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

/* ── VIEW DETAIL ─────────────────────────────────────────── */
function viewBulkOrder(id){
  currentBulkId = id;
  const o = (SC_BULK_ORDERS||[]).find(x=>x.id===id);
  if(!o) return;
  document.getElementById('bulk-modal-title').textContent = `Bulk Order ${o.id}`;
  document.getElementById('bulk-modal-body').innerHTML = `
    <div class="form-2col" style="margin-bottom:20px">
      <div>
        <div class="form-label" style="margin-bottom:8px">Company / Contact</div>
        <p style="font-size:14px;font-weight:700;margin-bottom:2px">${o.company}</p>
        <p style="font-size:12px;color:var(--text-soft)">${o.contact}</p>
        <p style="font-size:12px;color:var(--text-soft)">${o.phone}</p>
        <p style="font-size:12px;color:var(--text-soft);line-height:1.6;margin-top:6px">${o.address}</p>
      </div>
      <div>
        <div class="form-label" style="margin-bottom:8px">Order Summary</div>
        <table style="font-size:12px;width:100%">
          <tr><td style="color:var(--text-soft);padding:3px 0">Order ID</td><td style="font-family:monospace">${o.id}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Date</td><td>${fmtDate(o.date)}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Total Qty</td><td style="font-weight:600">${o.qty}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Total Value</td><td style="font-weight:700;color:var(--rose)">${fmtCurrency(o.value)}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Status</td><td>${statusBadge(o.status)}</td></tr>
        </table>
      </div>
    </div>
    <div class="form-label" style="margin-bottom:8px">Products Ordered</div>
    ${o.products.map(p=>`<div style="border:1px solid var(--border);padding:12px 14px;margin-bottom:8px;font-size:12px;font-weight:500">${p}</div>`).join('')}
    <div class="form-group" style="margin-top:16px">
      <label class="form-label">Update Status</label>
      <select class="form-select" id="bulk-status-update">
        ${['Pending Approval','Approved','Processing','Shipped','Delivered','Cancelled'].map(s=>`<option${s===o.status?' selected':''}>${s}</option>`).join('')}
      </select>
    </div>`;
  openModal('bulkOrderModal');
}

/* ── APPROVE / CANCEL ────────────────────────────────────── */
function approveBulkOrder(){
  const sel = document.getElementById('bulk-status-update')?.value;
  if(currentBulkId && sel){
    const o = (SC_BULK_ORDERS||[]).find(x=>x.id===currentBulkId);
    if(o) o.status = sel;
  }
  closeModal('bulkOrderModal');
  showToast('✓ Bulk order updated!');
  renderBulkOrders();
}
function cancelBulkOrder(){
  if(!currentBulkId) return;
  if(!confirm('Cancel this bulk order?')) return;
  const o = (SC_BULK_ORDERS||[]).find(x=>x.id===currentBulkId);
  if(o) o.status='Cancelled';
  closeModal('bulkOrderModal');
  showToast('Order cancelled');
  renderBulkOrders();
}

/* ── PRINT LABEL ─────────────────────────────────────────── */
function printBulkLabel(id){
  const o = (SC_BULK_ORDERS||[]).find(x=>x.id===id);
  if(!o) return;
  document.getElementById('bulk-label-content').innerHTML = `
    <div style="border:2px solid #2a1f1a;padding:28px;font-family:'Jost',sans-serif;max-width:440px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #2a1f1a;padding-bottom:14px;margin-bottom:16px">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600">Shainy Creation</div>
          <div style="font-size:9px;letter-spacing:.18em;color:#7a6458;text-transform:uppercase">BULK ORDER</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px;font-weight:700">${o.id}</div>
          <div style="font-size:10px;color:#7a6458">${fmtDate(o.date)}</div>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7a6458;margin-bottom:4px">Ship To</div>
        <div style="font-size:15px;font-weight:700">${o.company}</div>
        <div style="font-size:12px;color:#7a6458">${o.contact} · ${o.phone}</div>
        <div style="font-size:12px;line-height:1.7;margin-top:4px">${o.address}</div>
      </div>
      <div style="border-top:1px dashed #ead9ce;padding-top:14px;margin-bottom:16px">
        <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7a6458;margin-bottom:8px">Items</div>
        ${o.products.map(p=>`<div style="font-size:12px;padding:3px 0">${p}</div>`).join('')}
        <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:13px">
          <span style="color:#7a6458">Total Qty: <strong style="color:#2a1f1a">${o.qty}</strong></span>
          <span style="font-weight:700;color:#c8796a">Total: ${fmtCurrency(o.value)}</span>
        </div>
      </div>
      <div style="text-align:center;font-size:9px;color:#7a6458;letter-spacing:.12em">BULK ORDER ✦ www.shainycreation.com</div>
    </div>`;
  openModal('bulkLabelModal');
}

function printAllBulkLabels(){
  if(!SC_BULK_ORDERS.length) return;
  document.getElementById('bulk-label-content').innerHTML =
    SC_BULK_ORDERS.map(o=>{ printBulkLabel(o.id); return document.getElementById('bulk-label-content').innerHTML; })
    .join('<div style="page-break-after:always;margin-bottom:32px"></div>');
  openModal('bulkLabelModal');
}

/* ── SELECT + BULK ───────────────────────────────────────── */
function selectAllBulk(cb){
  document.querySelectorAll('.bulk-cb').forEach(c=>{ c.checked=cb.checked; selectedBulks[cb.checked?'add':'delete'](c.dataset.id); });
  updateBulkBulkActions();
}
function toggleBulkSelect(id,checked){ selectedBulks[checked?'add':'delete'](id); updateBulkBulkActions(); }
function updateBulkBulkActions(){
  const ba = document.getElementById('bulk-bulk-actions');
  if(ba) ba.style.display = selectedBulks.size>0?'flex':'none';
}
function bulkLabelPrint(){ /* reuse single */ selectedBulks.forEach(id=>printBulkLabel(id)); }
function bulkApprove(){
  selectedBulks.forEach(id=>{ const o=(SC_BULK_ORDERS||[]).find(x=>x.id===id); if(o&&o.status==='Pending Approval') o.status='Approved'; });
  showToast(`✓ ${selectedBulks.size} bulk orders approved`);
  selectedBulks.clear(); updateBulkBulkActions(); renderBulkOrders();
}

function exportBulkCSV(){
  const headers=['Order ID','Company','Contact','Phone','Products','Qty','Value','Date','Status'];
  const rows=(SC_BULK_ORDERS||[]).map(o=>[o.id,o.company,o.contact,o.phone,o.products.join(';'),o.qty,o.value,o.date,o.status]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='bulk-orders.csv'; a.click();
  showToast('📥 Exported!');
}

function filterBulkOrders(){ renderBulkOrders(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderBulkOrders();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
});
