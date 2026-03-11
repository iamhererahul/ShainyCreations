/* ============================================================
   reports.js  –  Shainy Creation Admin Panel
   Reports: list, filter, detail modal, status update.
   ============================================================ */

let currentReportId = null;

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderReports(){
  const q        = (document.getElementById('rp-search')?.value||'').toLowerCase();
  const type     = document.getElementById('rp-type')?.value||'';
  const status   = document.getElementById('rp-status')?.value||'';
  const priority = document.getElementById('rp-priority')?.value||'';
  const sort     = document.getElementById('rp-sort')?.value||'Newest First';

  let list = [...(SC_REPORTS||[])];
  if(q)        list = list.filter(r=>r.id.toLowerCase().includes(q)||r.customer.toLowerCase().includes(q)||r.order.toLowerCase().includes(q));
  if(type)     list = list.filter(r=>r.type===type);
  if(status)   list = list.filter(r=>r.status===status);
  if(priority) list = list.filter(r=>r.priority===priority);

  if(sort==='Oldest First')            list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='Priority: High First') list.sort((a,b)=>['High','Medium','Low'].indexOf(a.priority)-['High','Medium','Low'].indexOf(b.priority));
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  /* Stats */
  document.getElementById('rp-total').textContent    = SC_REPORTS.length;
  document.getElementById('rp-open').textContent     = SC_REPORTS.filter(r=>r.status==='Open').length;
  document.getElementById('rp-progress').textContent = SC_REPORTS.filter(r=>r.status==='In Progress').length;
  document.getElementById('rp-resolved').textContent = SC_REPORTS.filter(r=>r.status==='Resolved'||r.status==='Closed').length;

  const tbody = document.getElementById('reports-table');
  if(!tbody) return;
  if(!list.length){ tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-soft)">No reports found.</td></tr>'; return; }

  tbody.innerHTML = list.map(r=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px">${r.id}</span></td>
      <td>
        <div style="font-weight:600;font-size:12px">${r.customer}</div>
        <div style="font-size:10px;color:var(--text-soft)">${r.email}</div>
      </td>
      <td><span style="font-family:monospace;font-size:11px;color:var(--rose)">${r.order}</span></td>
      <td style="font-size:11px">${r.type}</td>
      <td>${statusBadge(r.priority)}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(r.date)}</td>
      <td>${statusBadge(r.status)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewReport('${r.id}')">View</button>
      </td>
    </tr>`).join('');
}

/* ── VIEW DETAIL ─────────────────────────────────────────── */
function viewReport(id){
  currentReportId = id;
  const r = (SC_REPORTS||[]).find(x=>x.id===id);
  if(!r) return;
  document.getElementById('rp-modal-title').textContent = `Report ${r.id}`;
  document.getElementById('rp-modal-body').innerHTML = `
    <div class="form-2col" style="margin-bottom:20px">
      <div>
        <div class="form-label" style="margin-bottom:8px">Customer</div>
        <p style="font-size:14px;font-weight:700;margin-bottom:2px">${r.customer}</p>
        <p style="font-size:12px"><a href="mailto:${r.email}" style="color:var(--rose)">${r.email}</a></p>
      </div>
      <div>
        <div class="form-label" style="margin-bottom:8px">Report Details</div>
        <table style="font-size:12px;width:100%">
          <tr><td style="color:var(--text-soft);padding:3px 0">Report ID</td><td style="font-family:monospace">${r.id}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Order</td><td style="color:var(--rose);font-family:monospace">${r.order}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Type</td><td>${r.type}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Priority</td><td>${statusBadge(r.priority)}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Date</td><td>${fmtDate(r.date)}</td></tr>
          <tr><td style="color:var(--text-soft);padding:3px 0">Status</td><td>${statusBadge(r.status)}</td></tr>
        </table>
      </div>
    </div>
    ${r.notes?`<div style="border:1px solid var(--border);padding:14px;margin-bottom:16px;background:var(--off-white);font-size:12px"><strong>Previous Notes:</strong> ${r.notes}</div>`:''}`;

  /* Prefill footer fields */
  const statusSel = document.getElementById('rp-new-status');
  if(statusSel){
    [...statusSel.options].forEach(o=>o.selected=o.value===r.status||o.text===r.status);
  }
  document.getElementById('rp-tracking').value = r.notes||'';
  openModal('reportDetailModal');
}

/* ── UPDATE REPORT ───────────────────────────────────────── */
function updateReport(){
  if(!currentReportId) return;
  const status = document.getElementById('rp-new-status')?.value;
  const notes  = document.getElementById('rp-tracking')?.value.trim();
  const r = (SC_REPORTS||[]).find(x=>x.id===currentReportId);
  if(r){ if(status) r.status=status; if(notes) r.notes=notes; }
  closeModal('reportDetailModal');
  showToast('✓ Report updated!');
  renderReports();
}

function filterReports(){ renderReports(); }

function exportReports(){
  const headers=['ID','Customer','Email','Order','Type','Priority','Date','Status','Notes'];
  const rows=(SC_REPORTS||[]).map(r=>[r.id,r.customer,r.email,r.order,r.type,r.priority,r.date,r.status,`"${(r.notes||'').replace(/"/g,"'")}"`]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='reports.csv'; a.click();
  showToast('📥 Exported!');
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderReports();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
});
