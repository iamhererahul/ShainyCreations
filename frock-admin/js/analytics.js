/* ============================================================
   analytics.js  –  Shainy Creation Admin Panel
   Analytics: multiple Chart.js charts + trending products.
   ============================================================ */

const chartInstances = {};

function destroyChart(id){ if(chartInstances[id]){ chartInstances[id].destroy(); delete chartInstances[id]; } }

/* ── REVENUE LINE ────────────────────────────────────────── */
function initRevenueLine(){
  destroyChart('revenueLineChart');
  const range = document.getElementById('analytics-range')?.value||'Last 30 Days';
  const map={
    'Last 7 Days':  { l:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],            d:[18200,24600,19800,28400,32100,22700,38900] },
    'Last 30 Days': { l:Array.from({length:30},(_,i)=>`D${i+1}`),              d:Array.from({length:30},()=>Math.floor(12000+Math.random()*28000)) },
    'Last 90 Days': { l:['Jan W1','Jan W2','Jan W3','Jan W4','Feb W1','Feb W2','Feb W3','Feb W4','Mar W1','Mar W2','Mar W3','Mar W4'], d:[142000,168000,155000,181000,175000,192000,168000,198000,185000,210000,196000,225000] },
    'This Year':    { l:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], d:[618000,712000,741200,825000,760000,890000,945000,880000,962000,1040000,985000,1120000] },
  };
  const {l,d}=map[range]||map['Last 30 Days'];
  const ctx = document.getElementById('revenueLineChart');
  if(!ctx) return;
  chartInstances['revenueLineChart'] = new Chart(ctx,{
    type:'line',
    data:{
      labels:l,
      datasets:[{ label:'Revenue (₹)', data:d, borderColor:'#c8796a', backgroundColor:'rgba(200,121,106,.08)', tension:.4, pointRadius:3, pointBackgroundColor:'#c8796a', borderWidth:2, fill:true }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:10},color:'#7a6458',callback:v=>'₹'+(v/1000).toFixed(0)+'K'}},
        x:{grid:{display:false},ticks:{font:{size:10},color:'#7a6458',maxTicksLimit:8}},
      }
    }
  });
}

/* ── CATEGORY PIE ────────────────────────────────────────── */
function initCategoryChart(){
  destroyChart('categoryChart');
  const ctx = document.getElementById('categoryChart');
  if(!ctx) return;
  chartInstances['categoryChart'] = new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Frocks','Gowns','Tutus','Sets'],
      datasets:[{ data:[38,28,26,8], backgroundColor:['#c8796a','#c9a96e','#7a6458','#4a6ab0'], borderWidth:0, hoverOffset:6 }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,cutout:'64%',
      plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10,padding:12,color:'#7a6458'}}}
    }
  });
}

/* ── TRAFFIC SOURCES ─────────────────────────────────────── */
function initTrafficChart(){
  destroyChart('trafficChart');
  const ctx = document.getElementById('trafficChart');
  if(!ctx) return;
  chartInstances['trafficChart'] = new Chart(ctx,{
    type:'bar',
    data:{
      labels:['Instagram','Google','Direct','Facebook','WhatsApp','Others'],
      datasets:[{ label:'Sessions', data:[8420,6140,4280,2860,1940,1040], backgroundColor:['rgba(200,121,106,.7)','rgba(201,169,110,.7)','rgba(122,100,88,.7)','rgba(74,106,176,.7)','rgba(61,158,110,.7)','rgba(180,180,180,.6)'], borderWidth:0 }]
    },
    options:{
      indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{x:{grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:9},color:'#7a6458'}}, y:{grid:{display:false},ticks:{font:{size:9},color:'#7a6458'}}}
    }
  });
}

/* ── AGE GROUP ───────────────────────────────────────────── */
function initAgeChart(){
  destroyChart('ageChart');
  const ctx = document.getElementById('ageChart');
  if(!ctx) return;
  chartInstances['ageChart'] = new Chart(ctx,{
    type:'pie',
    data:{
      labels:['0–1 Yrs','1–3 Yrs','3–6 Yrs','6–10 Yrs','10–14 Yrs'],
      datasets:[{ data:[8,22,38,24,8], backgroundColor:['#c8796a','#c9a96e','#7a9e8e','#4a6ab0','#a0748c'], borderWidth:0, hoverOffset:6 }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{font:{size:9},boxWidth:10,padding:10,color:'#7a6458'}}}
    }
  });
}

/* ── ORDERS BY DAY ───────────────────────────────────────── */
function initDayChart(){
  destroyChart('dayChart');
  const ctx = document.getElementById('dayChart');
  if(!ctx) return;
  chartInstances['dayChart'] = new Chart(ctx,{
    type:'bar',
    data:{
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[{ label:'Orders', data:[28,42,35,48,56,72,64], backgroundColor:'rgba(200,121,106,.65)', borderWidth:0, borderRadius:3 }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#7a6458'}}, y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:9},color:'#7a6458'}}}
    }
  });
}

/* ── TRENDING PRODUCTS ───────────────────────────────────── */
function renderTrending(){
  const el = document.getElementById('trending-products');
  if(!el) return;
  const trending = (SC_PRODUCTS||[]).slice().sort((a,b)=>b.sales-a.sales).slice(0,5);
  el.innerHTML = trending.map((p,i)=>`
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="width:24px;height:24px;background:${i===0?'var(--rose)':i===1?'var(--gold)':'var(--blush)'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${i<2?'#fff':'var(--text)'};flex-shrink:0">${i+1}</div>
      <div class="td-img" style="width:40px;height:50px;flex-shrink:0"><div class="dress-ph ${p.dress}" style="width:20px;height:34px;border-radius:50% 50% 30% 30%/30% 30% 10% 10%"></div></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div>
        <div style="font-size:10px;color:var(--text-soft)">${p.category}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:12px;font-weight:700;color:var(--rose)">${p.sales}</div>
        <div style="font-size:9px;color:var(--text-soft)">sold</div>
      </div>
    </div>`).join('');
}

/* ── BEST SELLERS ────────────────────────────────────────── */
function renderBestSellers(){
  const el = document.getElementById('best-products-list');
  if(!el) return;
  const best = (SC_PRODUCTS||[]).slice().sort((a,b)=>b.sales-a.sales).slice(0,5);
  const maxSales = best[0]?.sales||1;
  el.innerHTML = best.map(p=>`
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px">
        <span style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%">${p.name}</span>
        <span style="font-weight:700;color:var(--text-soft);flex-shrink:0">${p.sales} sold</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(p.sales/maxSales*100).toFixed(0)}%"></div></div>
    </div>`).join('');
}

/* ── RELOAD ALL CHARTS ───────────────────────────────────── */
function reloadCharts(){
  if(typeof Chart==='undefined') return;
  initRevenueLine();
  initCategoryChart();
  initTrafficChart();
  initAgeChart();
  initDayChart();
  renderTrending();
  renderBestSellers();
}

function exportAnalytics(){
  showToast('📊 Analytics report exported!');
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  if(typeof Chart!=='undefined') reloadCharts();
  document.getElementById('analytics-range')?.addEventListener('change', reloadCharts);
});
