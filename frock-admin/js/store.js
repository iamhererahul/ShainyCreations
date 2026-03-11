/* ============================================================
   store.js  –  Shainy Creation Admin Panel
   Store locations: cards, add/edit, store login management.
   ============================================================ */

let editingLocId = null;

/* ── RENDER CARDS ────────────────────────────────────────── */
function renderLocations(){
  const q      = (document.getElementById('loc-search')?.value||'').toLowerCase();
  const status = document.getElementById('loc-status-filter')?.value||'';

  let list = [...(SC_LOCATIONS||[])];
  if(q)      list = list.filter(l=>l.name.toLowerCase().includes(q)||l.city.toLowerCase().includes(q)||l.manager.toLowerCase().includes(q));
  if(status) list = list.filter(l=>l.status===status);

  /* Update stats */
  document.getElementById('loc-total').textContent  = SC_LOCATIONS.length;
  document.getElementById('loc-active').textContent = SC_LOCATIONS.filter(l=>l.status==='Active').length;
  document.getElementById('loc-staff').textContent  = SC_LOCATIONS.reduce((a,b)=>a+(b.staff||0),0);

  const grid = document.getElementById('location-cards');
  if(!grid) return;
  if(!list.length){ grid.innerHTML='<p style="padding:40px;color:var(--text-soft)">No locations found.</p>'; return; }

  grid.innerHTML = list.map(l=>`
    <div class="location-card" style="position:relative">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div class="location-icon">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        ${statusBadge(l.status)}
      </div>
      <div class="location-name">${l.name}</div>
      <div class="location-address">${l.address}</div>
      <div class="location-address">${l.city}, ${l.state} – ${l.pin}</div>
      ${l.phone?`<div style="font-size:11px;color:var(--text-soft);margin-top:6px">📞 ${l.phone}</div>`:''}
      ${l.hours?`<div style="font-size:11px;color:var(--text-soft)">🕐 ${l.hours}</div>`:''}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
        <div style="text-align:center">
          <div style="font-size:16px;font-weight:700;color:var(--rose)">${fmtCurrency(l.revenue)}</div>
          <div style="font-size:9px;color:var(--text-soft);letter-spacing:.08em;text-transform:uppercase">Revenue</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:16px;font-weight:700">${l.orders}</div>
          <div style="font-size:9px;color:var(--text-soft);letter-spacing:.08em;text-transform:uppercase">Orders</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:16px;font-weight:700">${l.staff}</div>
          <div style="font-size:9px;color:var(--text-soft);letter-spacing:.08em;text-transform:uppercase">Staff</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:14px">
        <button class="btn btn-outline btn-sm" style="flex:1" onclick="editLocation('${l.id}')">Edit</button>
        ${l.status==='Active'?`<button class="btn btn-danger btn-sm" onclick="toggleLocStatus('${l.id}')">Close</button>`:'<button class="btn btn-outline btn-sm" onclick="toggleLocStatus(\''+l.id+'\')">Open</button>'}
      </div>
    </div>`).join('');

  renderStoreLoginTable();
}

/* ── ADD / EDIT LOCATION ─────────────────────────────────── */
function editLocation(id){
  editingLocId = id;
  const l = (SC_LOCATIONS||[]).find(x=>x.id===id);
  if(!l) return;
  document.getElementById('location-modal-title').textContent = 'Edit Store Location';
  document.getElementById('edit-loc-id').value    = l.id;
  document.getElementById('loc-name').value       = l.name;
  document.getElementById('loc-manager').value    = l.manager||'';
  document.getElementById('loc-address').value    = l.address;
  document.getElementById('loc-city').value       = l.city;
  document.getElementById('loc-state').value      = l.state;
  document.getElementById('loc-pin').value        = l.pin||'';
  document.getElementById('loc-phone').value      = l.phone||'';
  document.getElementById('loc-status').value     = l.status;
  document.getElementById('loc-email').value      = l.email||'';
  document.getElementById('loc-hours').value      = l.hours||'';
  openModal('addLocationModal');
}

function saveLocation(){
  const name = document.getElementById('loc-name')?.value.trim();
  const city = document.getElementById('loc-city')?.value.trim();
  if(!name||!city){ showToast('⚠ Name and city are required'); return; }

  const id = document.getElementById('edit-loc-id')?.value;
  if(id){
    const l = (SC_LOCATIONS||[]).find(x=>x.id===id);
    if(l){
      l.name    = name;
      l.manager = document.getElementById('loc-manager')?.value.trim()||'';
      l.address = document.getElementById('loc-address')?.value.trim()||'';
      l.city    = city;
      l.state   = document.getElementById('loc-state')?.value.trim()||'';
      l.pin     = document.getElementById('loc-pin')?.value.trim()||'';
      l.phone   = document.getElementById('loc-phone')?.value.trim()||'';
      l.status  = document.getElementById('loc-status')?.value||'Active';
      l.email   = document.getElementById('loc-email')?.value.trim()||'';
      l.hours   = document.getElementById('loc-hours')?.value.trim()||'';
    }
  } else {
    SC_LOCATIONS.push({
      id:'loc'+Date.now(),
      name, city,
      manager: document.getElementById('loc-manager')?.value.trim()||'',
      address: document.getElementById('loc-address')?.value.trim()||'',
      state:   document.getElementById('loc-state')?.value.trim()||'',
      pin:     document.getElementById('loc-pin')?.value.trim()||'',
      phone:   document.getElementById('loc-phone')?.value.trim()||'',
      status:  document.getElementById('loc-status')?.value||'Active',
      email:   document.getElementById('loc-email')?.value.trim()||'',
      hours:   document.getElementById('loc-hours')?.value.trim()||'',
      revenue:0, orders:0, staff:0, lastActive:'–',
    });
  }
  closeModal('addLocationModal');
  showToast('✓ Location saved!');
  renderLocations();
}

/* ── TOGGLE STATUS ───────────────────────────────────────── */
function toggleLocStatus(id){
  const l = (SC_LOCATIONS||[]).find(x=>x.id===id);
  if(!l) return;
  l.status = l.status==='Active' ? 'Temporarily Closed' : 'Active';
  showToast(`✓ Store ${l.status==='Active'?'opened':'closed'}`);
  renderLocations();
}

/* ── STORE LOGIN TABLE ───────────────────────────────────── */
function renderStoreLoginTable(){
  const tbody = document.getElementById('store-logins-table');
  if(!tbody) return;
  tbody.innerHTML = (SC_LOCATIONS||[]).map(l=>`
    <tr>
      <td style="font-weight:600">${l.name}</td>
      <td><a href="mailto:${l.email}" style="color:var(--rose);font-size:12px">${l.email||'–'}</a></td>
      <td style="font-size:11px;color:var(--text-soft)">${l.lastActive}</td>
      <td>${statusBadge(l.status)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openStoreLogin('${l.id}')">Manage</button>
      </td>
    </tr>`).join('');
}

/* ── STORE LOGIN MODAL ───────────────────────────────────── */
function openStoreLogin(id){
  const sel = document.getElementById('login-store-select');
  if(!sel) return;
  sel.innerHTML = (SC_LOCATIONS||[]).map(l=>`<option value="${l.id}"${l.id===id?' selected':''}>${l.name}</option>`).join('');
  const loc = (SC_LOCATIONS||[]).find(x=>x.id===id);
  if(loc && document.getElementById('login-email')) document.getElementById('login-email').value = loc.email||'';
  openModal('storeLoginModal');
}

function saveStoreLogin(){
  const selId = document.getElementById('login-store-select')?.value;
  const email = document.getElementById('login-email')?.value.trim();
  if(selId && email){
    const l = (SC_LOCATIONS||[]).find(x=>x.id===selId);
    if(l) l.email = email;
  }
  closeModal('storeLoginModal');
  showToast('✓ Store login updated!');
  renderLocations();
}

function filterLocations(){ renderLocations(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderLocations();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
  /* Clear form on open */
  document.getElementById('addLocationModal')?.addEventListener('click', ()=>{});
});
