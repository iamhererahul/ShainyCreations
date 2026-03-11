/* ============================================================
   settings.js  –  Shainy Creation Admin Panel
   Settings: tab navigation, save per-section, team management.
   ============================================================ */

let currentSettingsTab = 'general';

/* ── TAB NAVIGATION ──────────────────────────────────────── */
function initSettingsTabs(){
  const items   = document.querySelectorAll('.settings-nav-item');
  const panels  = document.querySelectorAll('.settings-tab');

  items.forEach(item=>{
    item.addEventListener('click', function(){
      const tab = this.dataset.tab;
      items.forEach(i=>i.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById('tab-'+tab);
      if(target) target.classList.add('active');
      currentSettingsTab = tab;
    });
  });
}

/* ── SAVE CURRENT TAB ────────────────────────────────────── */
function saveCurrentTab(){
  const labels = {
    general:'General settings','notifications':'Notification settings',
    shipping:'Shipping settings','taxes':'Tax settings',
    team:'Team settings','branding':'Branding settings','security':'Security settings',
  };
  showToast(`✓ ${labels[currentSettingsTab]||'Settings'} saved!`);
}

/* ── TEAM MANAGEMENT ─────────────────────────────────────── */
const TEAM_MEMBERS = [
  { id:'t1', name:'Shainy Mathew',  email:'shainy@shainycreation.com',  role:'Super Admin',  status:'Active',  lastLogin:'2024-01-15 09:12' },
  { id:'t2', name:'Preethi Reddy',  email:'preethi@shainycreation.com', role:'Store Manager',status:'Active',  lastLogin:'2024-01-15 08:40' },
  { id:'t3', name:'Rohit Nair',     email:'rohit@shainycreation.com',   role:'Support Staff',status:'Active',  lastLogin:'2024-01-14 17:22' },
  { id:'t4', name:'Divya Thomas',   email:'divya@shainycreation.com',   role:'Warehouse',    status:'Inactive',lastLogin:'2024-01-10 11:30' },
];

function renderTeam(){
  const tbody = document.getElementById('team-table');
  if(!tbody) return;
  tbody.innerHTML = TEAM_MEMBERS.map(m=>`
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar" style="width:32px;height:32px;font-size:13px;flex-shrink:0">${m.name[0]}</div>
          <div>
            <div style="font-weight:600;font-size:12px">${m.name}</div>
            <div style="font-size:10px;color:var(--text-soft)">${m.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-neutral" style="font-size:9px">${m.role}</span></td>
      <td style="font-size:11px;color:var(--text-soft)">${m.lastLogin}</td>
      <td>${statusBadge(m.status)}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-sm" onclick="toggleTeamStatus('${m.id}')">
            ${m.status==='Active'?'Deactivate':'Activate'}
          </button>
          ${m.role!=='Super Admin'?`<button class="btn btn-danger btn-sm" onclick="removeTeamMember('${m.id}')">Remove</button>`:''}
        </div>
      </td>
    </tr>`).join('');
}

function toggleTeamStatus(id){
  const m = TEAM_MEMBERS.find(x=>x.id===id);
  if(!m) return;
  m.status = m.status==='Active'?'Inactive':'Active';
  renderTeam();
  showToast(`✓ ${m.name} ${m.status.toLowerCase()}`);
}

function removeTeamMember(id){
  if(!confirm('Remove this team member?')) return;
  const i = TEAM_MEMBERS.findIndex(x=>x.id===id);
  if(i>-1) TEAM_MEMBERS.splice(i,1);
  renderTeam();
  showToast('Team member removed');
}

function inviteTeamMember(){
  const email = document.getElementById('invite-email')?.value.trim();
  const role  = document.getElementById('invite-role')?.value;
  if(!email){ showToast('⚠ Enter an email address'); return; }
  TEAM_MEMBERS.push({
    id:'t'+Date.now(), name:email.split('@')[0],
    email, role:role||'Support Staff', status:'Active', lastLogin:'Never',
  });
  if(document.getElementById('invite-email')) document.getElementById('invite-email').value='';
  renderTeam();
  showToast(`✉ Invite sent to ${email}`);
}

/* ── SHIPPING ZONES ──────────────────────────────────────── */
const SHIPPING_ZONES = [
  { name:'Bengaluru Local',    days:'1–2', price:40,  free:800  },
  { name:'Karnataka',          days:'2–3', price:60,  free:1000 },
  { name:'South India',        days:'3–5', price:80,  free:1200 },
  { name:'North India',        days:'4–7', price:100, free:1500 },
  { name:'Rest of India',      days:'5–8', price:120, free:2000 },
  { name:'J&K / NE States',    days:'7–10',price:160, free:2500 },
];

function renderShippingZones(){
  const tbody = document.getElementById('shipping-zones-table');
  if(!tbody) return;
  tbody.innerHTML = SHIPPING_ZONES.map((z,i)=>`
    <tr>
      <td style="font-weight:600;font-size:12px">${z.name}</td>
      <td style="font-size:12px">${z.days} days</td>
      <td><input class="inline-edit" value="₹${z.price}" onchange="SHIPPING_ZONES[${i}].price=parseInt(this.value.replace('₹',''))||z.price"></td>
      <td><input class="inline-edit" value="₹${z.free}" onchange="SHIPPING_ZONES[${i}].free=parseInt(this.value.replace('₹',''))||z.free"></td>
    </tr>`).join('');
}

/* ── GST RATES ───────────────────────────────────────────── */
function renderGST(){
  const tbody = document.getElementById('gst-table');
  if(!tbody) return;
  const rates = [
    { cat:'Kids Garments (below ₹1000)', hsn:'6209', gst:5 },
    { cat:'Kids Garments (above ₹1000)', hsn:'6209', gst:12 },
    { cat:'Accessories',                 hsn:'6117', gst:12 },
    { cat:'Footwear (below ₹500)',       hsn:'6401', gst:5  },
  ];
  tbody.innerHTML = rates.map(r=>`
    <tr>
      <td style="font-size:12px">${r.cat}</td>
      <td style="font-family:monospace;font-size:11px">${r.hsn}</td>
      <td style="font-weight:700">${r.gst}%</td>
      <td><button class="btn btn-outline btn-sm">Edit</button></td>
    </tr>`).join('');
}

/* ── LOGO UPLOAD ─────────────────────────────────────────── */
function handleLogoUpload(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    const preview = document.getElementById('logo-preview');
    if(preview){ preview.src=e.target.result; preview.style.display='block'; }
  };
  reader.readAsDataURL(file);
  showToast('✓ Logo uploaded!');
}

/* ── 2FA TOGGLE ──────────────────────────────────────────── */
function toggle2FA(){
  showToast('✓ 2FA settings updated');
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  initSettingsTabs();
  renderTeam();
  renderShippingZones();
  renderGST();
});
