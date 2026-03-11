/* ============================================================
   franchise.js  –  Shainy Creation Admin Panel
   Franchise requests: cards grid, detail modal, approve/reject.
   ============================================================ */

let currentFranchiseId = null;

/* ── RENDER CARDS ────────────────────────────────────────── */
function renderFranchise(){
  const q      = (document.getElementById('fr-search')?.value||'').toLowerCase();
  const status = document.getElementById('fr-status')?.value||'';
  const sort   = document.getElementById('fr-sort')?.value||'Newest First';

  let list = [...(SC_FRANCHISE||[])];
  if(q)      list = list.filter(f=>f.name.toLowerCase().includes(q)||f.city.toLowerCase().includes(q)||f.email.toLowerCase().includes(q));
  if(status) list = list.filter(f=>f.status===status);
  if(sort==='Oldest First') list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  /* Stats */
  document.getElementById('fr-total').textContent    = SC_FRANCHISE.length;
  document.getElementById('fr-new').textContent      = SC_FRANCHISE.filter(f=>f.status==='New').length;
  document.getElementById('fr-approved').textContent = SC_FRANCHISE.filter(f=>f.status==='Approved').length;
  document.getElementById('fr-rejected').textContent = SC_FRANCHISE.filter(f=>f.status==='Rejected').length;

  const container = document.getElementById('franchise-cards');
  if(!container) return;
  if(!list.length){ container.innerHTML='<p style="padding:40px;color:var(--text-soft);grid-column:1/-1">No franchise applications found.</p>'; return; }

  container.innerHTML = list.map(f=>`
    <div class="card" style="cursor:pointer;transition:box-shadow .2s" onclick="viewFranchise('${f.id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-weight:700;font-size:14px;margin-bottom:2px">${f.name}</div>
          <div style="font-size:11px;color:var(--text-soft)">${f.city}, ${f.state}</div>
        </div>
        ${statusBadge(f.status)}
      </div>
      <div style="font-size:11px;color:var(--text-soft);margin-bottom:10px;line-height:1.6">
        <span>📧 ${f.email}</span><br>
        <span>📞 ${f.phone}</span>
      </div>
      <div style="font-size:11px;border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between">
        <span style="color:var(--text-soft)">Budget: <strong style="color:var(--text)">${f.investBudget}</strong></span>
        <span style="color:var(--text-soft)">${fmtDate(f.date)}</span>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.message}</div>
    </div>`).join('');
}

/* ── VIEW DETAIL ─────────────────────────────────────────── */
function viewFranchise(id){
  currentFranchiseId = id;
  const f = (SC_FRANCHISE||[]).find(x=>x.id===id);
  if(!f) return;
  /* Mark as read */
  if(f.status==='New'){ f.status='Under Review'; renderFranchise(); }
  document.getElementById('fr-modal-title').textContent = `Franchise Application – ${f.id}`;
  document.getElementById('fr-modal-body').innerHTML = `
    <div class="form-2col" style="margin-bottom:20px">
      <div>
        <div class="form-label" style="margin-bottom:8px">Applicant Details</div>
        <p style="font-size:15px;font-weight:700;margin-bottom:4px">${f.name}</p>
        <p style="font-size:12px;margin-bottom:2px">📧 <a href="mailto:${f.email}" style="color:var(--rose)">${f.email}</a></p>
        <p style="font-size:12px">📞 ${f.phone}</p>
      </div>
      <div>
        <div class="form-label" style="margin-bottom:8px">Location</div>
        <p style="font-size:13px;font-weight:600">${f.city}, ${f.state}</p>
        <p style="font-size:11px;color:var(--text-soft);margin-top:4px">Applied: ${fmtDate(f.date)}</p>
        <p style="margin-top:8px">${statusBadge(f.status)}</p>
      </div>
    </div>
    <div class="form-2col" style="margin-bottom:20px">
      <div style="border:1px solid var(--border);padding:16px">
        <div class="form-label" style="margin-bottom:4px">Investment Budget</div>
        <div style="font-size:16px;font-weight:700;color:var(--rose)">${f.investBudget}</div>
      </div>
      <div style="border:1px solid var(--border);padding:16px">
        <div class="form-label" style="margin-bottom:4px">Prior Experience</div>
        <div style="font-size:13px;font-weight:600">${f.experience}</div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Message from Applicant</label>
      <div style="border:1px solid var(--border);padding:16px;font-size:12px;line-height:1.8;color:var(--text-soft);font-style:italic">"${f.message}"</div>
    </div>
    <div class="form-group">
      <label class="form-label">Update Status</label>
      <select class="form-select" id="fr-new-status">
        ${['New','Under Review','Approved','Rejected'].map(s=>`<option${s===f.status?' selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Internal Notes</label>
      <textarea class="form-textarea" id="fr-notes" placeholder="Add review notes…"></textarea>
    </div>`;
  openModal('franchiseModal');
}

/* ── APPROVE / REJECT ────────────────────────────────────── */
function approveFranchise(){
  if(!currentFranchiseId) return;
  const status = document.getElementById('fr-new-status')?.value || 'Approved';
  const f = (SC_FRANCHISE||[]).find(x=>x.id===currentFranchiseId);
  if(f) f.status = status;
  closeModal('franchiseModal');
  showToast(`✓ Application ${status}`);
  renderFranchise();
}
function rejectFranchise(){
  if(!currentFranchiseId) return;
  const f = (SC_FRANCHISE||[]).find(x=>x.id===currentFranchiseId);
  if(f) f.status='Rejected';
  closeModal('franchiseModal');
  showToast('Application rejected');
  renderFranchise();
}

function exportFranchise(){
  const headers=['ID','Name','Email','Phone','City','State','Budget','Experience','Date','Status'];
  const rows=(SC_FRANCHISE||[]).map(f=>[f.id,f.name,f.email,f.phone,f.city,f.state,f.investBudget,f.experience,f.date,f.status]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='franchise-requests.csv'; a.click();
  showToast('📥 Exported!');
}

function filterFranchise(){ renderFranchise(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderFranchise();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
});
