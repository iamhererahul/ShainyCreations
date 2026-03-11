/* ============================================================
   dashboard.js  –  Shainy Creation Admin Panel
   Dashboard: stat cards, charts, recent orders, live activity,
   new-order popup.
   ============================================================ */

/* ── STAT CARDS ─────────────────────────────────────────── */
function renderStatCards(){
  const range = document.getElementById('dash-range')?.value || 'Last 7 Days';
  const data = {
    'Today':         { rev:'₹24,800', ord:18,  aov:'₹1,378', ret:'1.8%', rDir:'down' },
    'Last 7 Days':   { rev:'₹1,84,720', ord:342, aov:'₹2,140', ret:'2.3%', rDir:'down' },
    'Last 30 Days':  { rev:'₹7,42,100', ord:1240, aov:'₹2,048', ret:'2.9%', rDir:'down' },
    'Last 90 Days':  { rev:'₹18,47,200', ord:3820, aov:'₹2,212', ret:'3.1%', rDir:'down' },
  };
  const d = data[range] || data['Last 7 Days'];
  const grid = document.getElementById('stat-grid');
  if(!grid) return;
  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Revenue</div>
      <div class="stat-value">${d.rev}</div>
      <div class="stat-change up">▲ 12.4% vs last period</div>
      <div class="stat-icon"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Orders</div>
      <div class="stat-value">${d.ord}</div>
      <div class="stat-change up">▲ 8.1% vs last period</div>
      <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Avg Order Value</div>
      <div class="stat-value">${d.aov}</div>
      <div class="stat-change up">▲ 3.5% vs last period</div>
      <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Return Rate</div>
      <div class="stat-value">${d.ret}</div>
      <div class="stat-change ${d.rDir}">▼ 0.4% vs last period</div>
      <div class="stat-icon"><svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg></div>
    </div>`;
}

/* ── CHARTS ──────────────────────────────────────────────── */
let revenueChartInst = null;
let statusChartInst  = null;

function initCharts(){
  const range = document.getElementById('dash-range')?.value || 'Last 7 Days';

  /* Revenue Trend */
  const labels7  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const labels30  = ['Week 1','Week 2','Week 3','Week 4'];
  const labels90  = ['Jan','Feb','Mar'];

  const rev7  = [18200,24600,19800,28400,32100,22700,38900];
  const rev30 = [184200,198400,210600,249300];
  const rev90 = [618000,712400,741200];
  const ord7  = [14,18,16,22,25,19,28];
  const ord30 = [142,156,178,208];
  const ord90 = [1180,1420,1840];

  let labels, revData, ordData;
  if(range==='Today')          { labels=labels7; revData=rev7;  ordData=ord7;  }
  else if(range==='Last 7 Days'){ labels=labels7; revData=rev7;  ordData=ord7;  }
  else if(range==='Last 30 Days'){labels=labels30;revData=rev30; ordData=ord30; }
  else                          { labels=labels90;revData=rev90; ordData=ord90; }

  const rCtx = document.getElementById('revenueChart');
  if(rCtx){
    if(revenueChartInst) revenueChartInst.destroy();
    revenueChartInst = new Chart(rCtx, {
      data:{
        labels,
        datasets:[
          { type:'line', label:'Revenue (₹)', data:revData, borderColor:'#c8796a', backgroundColor:'rgba(200,121,106,.08)', tension:.4, yAxisID:'y', pointRadius:4, pointBackgroundColor:'#c8796a', borderWidth:2 },
          { type:'bar',  label:'Orders',       data:ordData, backgroundColor:'rgba(201,169,110,.22)', borderColor:'rgba(201,169,110,.6)', borderWidth:1, yAxisID:'y1' },
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{mode:'index',intersect:false}},
        scales:{
          y:  {type:'linear',position:'left', grid:{color:'rgba(0,0,0,.04)'}, ticks:{font:{size:10},color:'#7a6458',callback:v=>'₹'+(v/1000).toFixed(0)+'K'}},
          y1: {type:'linear',position:'right',grid:{display:false},          ticks:{font:{size:10},color:'#7a6458'}},
          x:  {grid:{display:false},ticks:{font:{size:10},color:'#7a6458'}},
        }
      }
    });
  }

  /* Status Donut */
  const sCtx = document.getElementById('statusChart');
  if(sCtx){
    if(statusChartInst) statusChartInst.destroy();
    statusChartInst = new Chart(sCtx, {
      type:'doughnut',
      data:{
        labels:['Delivered','Processing','Shipped','Pending','Returned'],
        datasets:[{ data:[298,24,18,10,20], backgroundColor:['#3d9e6e','#4a6ab0','#c9a96e','#e07a2a','#c8404a'], borderWidth:0, hoverOffset:6 }]
      },
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'72%',
        plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10,padding:12,color:'#7a6458'}},tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.raw}`}}}
      }
    });
  }
}

/* ── RECENT ORDERS TABLE ─────────────────────────────────── */
function renderRecentOrders(){
  const tbody = document.getElementById('dash-orders');
  if(!tbody) return;
  const recent = (typeof SC_ORDERS!=='undefined' ? SC_ORDERS : []).slice(0,8);
  tbody.innerHTML = recent.map(o=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px">${o.id}</span></td>
      <td>${o.customer}</td>
      <td style="font-weight:600">${fmtCurrency(o.amount)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>`).join('');
}

/* ── ACTIVITY FEED ───────────────────────────────────────── */
function renderActivity(){
  const feed = document.getElementById('activity-feed');
  if(!feed) return;
  const items = typeof SC_ACTIVITY!=='undefined' ? SC_ACTIVITY : [];
  feed.innerHTML = items.map(a=>`
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div style="flex:1"><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div>
    </div>`).join('');
}

/* ── NEW ORDER POPUP ─────────────────────────────────────── */
function triggerNewOrderPopup(){
  const orders = typeof SC_ORDERS!=='undefined' ? SC_ORDERS : [];
  if(!orders.length) return;
  const o = orders[0];
  const sub = document.getElementById('popup-sub');
  if(sub) sub.textContent = `Order ${o.id} from ${o.customer} · ${fmtCurrency(o.amount)}`;
  const popup = document.getElementById('newOrderPopup');
  if(!popup) return;
  setTimeout(()=>{
    popup.classList.add('show');
    setTimeout(()=>popup.classList.remove('show'), 6000);
  }, 2200);
}

/* ── EXPORT ──────────────────────────────────────────────── */
function exportDashboard(){
  showToast('📊 Dashboard report exported!');
}

/* ── RANGE CHANGE ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  const sel = document.getElementById('dash-range');
  if(sel) sel.addEventListener('change', ()=>{ renderStatCards(); initCharts(); });
  renderStatCards();
  renderRecentOrders();
  renderActivity();
  if(typeof Chart!=='undefined') initCharts();
  triggerNewOrderPopup();
});
