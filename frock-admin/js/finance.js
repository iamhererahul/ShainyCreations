/* ============================================================
   finance.js  –  Shainy Creation Admin Panel
   Finance: bank accounts, payment gateways, transactions.
   ============================================================ */

const PAYMENT_GATEWAYS = [
  { id:'razorpay', name:'Razorpay',   desc:'India\'s leading payment gateway',  active:true,  logo:'R' },
  { id:'upi',      name:'UPI Direct', desc:'Direct bank transfers via UPI',     active:true,  logo:'U' },
  { id:'paytm',    name:'Paytm',      desc:'Wallet & UPI payments',             active:true,  logo:'P' },
  { id:'cod',      name:'Cash on Delivery', desc:'Pay on delivery option',      active:true,  logo:'C' },
  { id:'stripe',   name:'Stripe',     desc:'International card payments',       active:false, logo:'S' },
];

/* ── RENDER BANK ACCOUNTS ────────────────────────────────── */
function renderBankAccounts(){
  const grid = document.getElementById('bank-accounts-grid');
  if(!grid) return;
  grid.innerHTML = SC_BANKS.map(b=>`
    <div class="bank-card" style="border:${b.primary?'2px solid var(--rose)':'1px solid var(--border)'};padding:20px;background:${b.primary?'var(--blush)':'var(--white)'};position:relative;transition:box-shadow .2s">
      ${b.primary?'<div style="position:absolute;top:12px;right:12px;background:var(--rose);color:#fff;font-size:9px;padding:2px 8px;letter-spacing:.1em;font-weight:700">PRIMARY</div>':''}
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:44px;height:44px;background:var(--text);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;flex-shrink:0">${b.bank[0]}</div>
        <div>
          <div style="font-weight:700;font-size:13px">${b.bank}</div>
          <div style="font-size:11px;color:var(--text-soft)">${b.type} Account</div>
        </div>
      </div>
      <div style="font-size:13px;margin-bottom:4px"><strong>${b.holder}</strong></div>
      <div style="font-size:13px;letter-spacing:.14em;font-family:monospace;color:var(--text-soft)">•••• •••• •••• ${b.last4}</div>
      <div style="font-size:11px;color:var(--text-soft);margin-top:4px">IFSC: ${b.ifsc}</div>
      <div style="display:flex;gap:8px;margin-top:14px">
        ${!b.primary?`<button class="btn btn-outline btn-sm" onclick="setPrimaryBank('${b.id}')">Set as Primary</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="removeBank('${b.id}')">Remove</button>
      </div>
    </div>`).join('');
}

/* ── SET PRIMARY ─────────────────────────────────────────── */
function setPrimaryBank(id){
  SC_BANKS.forEach(b=>b.primary=b.id===id);
  showToast('✓ Primary account updated');
  renderBankAccounts();
}

/* ── REMOVE BANK ─────────────────────────────────────────── */
function removeBank(id){
  const b = SC_BANKS.find(x=>x.id===id);
  if(b?.primary){ showToast('⚠ Cannot remove primary account'); return; }
  if(!confirm('Remove this bank account?')) return;
  const i = SC_BANKS.findIndex(x=>x.id===id);
  if(i>-1) SC_BANKS.splice(i,1);
  showToast('Bank account removed');
  renderBankAccounts();
}

/* ── ADD BANK ────────────────────────────────────────────── */
function addBankAccount(){
  const holder = document.getElementById('bank-holder')?.value.trim();
  const bank   = document.getElementById('bank-name')?.value;
  const acc    = document.getElementById('bank-acc')?.value.trim();
  const acc2   = document.getElementById('bank-acc-confirm')?.value.trim();
  const ifsc   = document.getElementById('bank-ifsc')?.value.trim().toUpperCase();
  const type   = document.getElementById('bank-type')?.value;
  const prim   = document.getElementById('bank-primary')?.checked;

  if(!holder||!acc||!ifsc){ showToast('⚠ Please fill all required fields'); return; }
  if(acc!==acc2){ showToast('⚠ Account numbers do not match'); return; }

  if(prim) SC_BANKS.forEach(b=>b.primary=false);
  SC_BANKS.push({ id:'bank'+Date.now(), holder, bank, last4:acc.slice(-4), ifsc, type, primary:prim||SC_BANKS.length===0 });
  closeModal('addBankModal');
  showToast('✓ Bank account added!');
  renderBankAccounts();
}

/* ── PAYMENT GATEWAYS ────────────────────────────────────── */
function renderGateways(){
  const grid = document.getElementById('payment-gateways');
  if(!grid) return;
  grid.innerHTML = PAYMENT_GATEWAYS.map(g=>`
    <div class="payment-card ${g.active?'active':''}" onclick="toggleGateway('${g.id}')">
      <div class="payment-logo">${g.logo}</div>
      <div class="payment-name">${g.name}</div>
      <div class="payment-desc">${g.desc}</div>
      <div style="margin-top:12px">
        <label class="toggle" onclick="event.stopPropagation()">
          <input type="checkbox" ${g.active?'checked':''} onchange="toggleGateway('${g.id}')">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>`).join('');
}

function toggleGateway(id){
  const g = PAYMENT_GATEWAYS.find(x=>x.id===id);
  if(!g) return;
  g.active=!g.active;
  showToast(g.active?`✓ ${g.name} enabled`:`${g.name} disabled`);
  renderGateways();
}

/* ── TRANSACTIONS ────────────────────────────────────────── */
function renderTransactions(){
  const q       = (document.getElementById('txn-search')?.value||'').toLowerCase();
  const gateway = document.getElementById('txn-gateway')?.value||'';

  let list = [...(SC_TRANSACTIONS||[])];
  if(q)       list = list.filter(t=>t.id.toLowerCase().includes(q)||t.order.toLowerCase().includes(q)||t.customer.toLowerCase().includes(q));
  if(gateway) list = list.filter(t=>t.gateway===gateway);

  const tbody = document.getElementById('txn-table');
  if(!tbody) return;
  tbody.innerHTML = list.map(t=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px">${t.id}</span></td>
      <td><span style="font-family:monospace;font-size:11px;color:var(--rose)">${t.order}</span></td>
      <td>${t.customer}</td>
      <td>${t.gateway}</td>
      <td style="font-weight:700">${fmtCurrency(t.amount)}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(t.date)}</td>
      <td>${statusBadge(t.status)}</td>
    </tr>`).join('');
}

function filterTransactions(){ renderTransactions(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderBankAccounts();
  renderGateways();
  renderTransactions();
  document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
});
