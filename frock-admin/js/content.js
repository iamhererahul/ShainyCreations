/* ============================================================
   content.js  –  Shainy Creation Admin Panel
   Content Library: media grid/list, upload, preview, delete.
   ============================================================ */

let mediaFilter    = 'all';
let selectedMedia  = new Set();
let currentMediaId = null;
let viewMode       = 'grid';

/* ── RENDER GRID ─────────────────────────────────────────── */
function renderMedia(){
  const q    = (document.getElementById('media-search')?.value||'').toLowerCase();
  const sort = document.getElementById('media-sort')?.value||'Newest First';

  let list = [...(SC_MEDIA||[])];
  if(mediaFilter!=='all') list = list.filter(m=>m.type===mediaFilter);
  if(q) list = list.filter(m=>m.name.toLowerCase().includes(q));
  if(sort==='Oldest First') list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='Name A-Z') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(sort==='Size: Largest') list.sort((a,b)=>parseMB(b.size)-parseMB(a.size));
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  /* Tab counts */
  document.getElementById('tab-all').textContent = (SC_MEDIA||[]).length;
  document.getElementById('tab-img').textContent = (SC_MEDIA||[]).filter(m=>m.type==='image').length;
  document.getElementById('tab-vid').textContent = (SC_MEDIA||[]).filter(m=>m.type==='video').length;
  document.getElementById('tab-doc').textContent = (SC_MEDIA||[]).filter(m=>m.type==='other').length;
  document.getElementById('media-count').textContent = `${list.length} file${list.length!==1?'s':''}`;

  if(viewMode==='grid') renderGrid(list);
  else renderList(list);
}

function parseMB(s){
  const n=parseFloat(s); return s.includes('GB')?n*1024:s.includes('MB')?n:n/1024;
}

/* ── GRID VIEW ───────────────────────────────────────────── */
function renderGrid(list){
  const grid = document.getElementById('media-grid');
  const lv   = document.getElementById('media-list');
  if(!grid) return;
  grid.style.display='';
  if(lv) lv.style.display='none';

  if(!list.length){ grid.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-soft)">No files found.</p>'; return; }

  grid.innerHTML = list.map(m=>{
    const icon = m.type==='video'?'<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'
                :m.type==='other'?'<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
                :'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    return `
      <div>
        <div class="media-item ${selectedMedia.has(m.id)?'selected':''}" data-id="${m.id}" onclick="previewMedia('${m.id}')" ondblclick="previewMedia('${m.id}')">
          ${m.url?`<img src="${m.url}" style="width:100%;height:100%;object-fit:cover" alt="${m.name}">`:`<div>${icon}</div>`}
          <div class="media-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="media-type-badge">${m.type.toUpperCase()}</div>
          <input type="checkbox" class="media-cb" data-id="${m.id}" ${selectedMedia.has(m.id)?'checked':''}
            onclick="e=>{e.stopPropagation();}" onchange="toggleMediaSelect('${m.id}',this.checked)"
            style="position:absolute;top:6px;left:6px;z-index:2">
        </div>
        <div class="media-label" title="${m.name}">${m.name}</div>
      </div>`;
  }).join('');
}

/* ── LIST VIEW ───────────────────────────────────────────── */
function renderList(list){
  const grid = document.getElementById('media-grid');
  const lv   = document.getElementById('media-list');
  if(!lv) return;
  if(grid) grid.style.display='none';
  lv.style.display='';

  const tbody = document.getElementById('media-list-body');
  if(!tbody) return;
  tbody.innerHTML = list.map(m=>`
    <tr>
      <td><input type="checkbox" class="media-cb" data-id="${m.id}" ${selectedMedia.has(m.id)?'checked':''}
          onchange="toggleMediaSelect('${m.id}',this.checked)"></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;background:var(--blush);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${m.type==='image'?'🖼':'m.type==="video"?🎬':'📄'}
          </div>
          <span style="font-size:12px;font-weight:500">${m.name}</span>
        </div>
      </td>
      <td><span class="badge badge-neutral" style="font-size:9px">${m.type.toUpperCase()}</span></td>
      <td style="font-size:11px;color:var(--text-soft)">${m.size}</td>
      <td style="font-size:11px;color:var(--text-soft)">${fmtDate(m.date)}</td>
      <td style="font-size:11px">${m.usedIn}</td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-outline btn-icon" onclick="previewMedia('${m.id}')" title="Preview">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn btn-danger btn-icon" onclick="deleteMedia('${m.id}')" title="Delete">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

/* ── SET VIEW MODE ───────────────────────────────────────── */
function setView(mode){
  viewMode=mode;
  document.getElementById('view-grid')?.classList.toggle('active', mode==='grid');
  document.getElementById('view-list')?.classList.toggle('active', mode==='list');
  renderMedia();
}

/* ── SELECT ──────────────────────────────────────────────── */
function selectAllMedia(cb){
  document.querySelectorAll('.media-cb').forEach(c=>{ c.checked=cb.checked; selectedMedia[cb.checked?'add':'delete'](c.dataset.id); });
  renderMedia();
}
function toggleMediaSelect(id,checked){ selectedMedia[checked?'add':'delete'](id); }

/* ── DELETE SELECTED ─────────────────────────────────────── */
function deleteSelected(){
  if(!selectedMedia.size){ showToast('⚠ No files selected'); return; }
  if(!confirm(`Delete ${selectedMedia.size} file(s)?`)) return;
  [...selectedMedia].forEach(id=>{ const i=SC_MEDIA.findIndex(m=>m.id===id); if(i>-1) SC_MEDIA.splice(i,1); });
  showToast(`🗑 ${selectedMedia.size} file(s) deleted`);
  selectedMedia.clear();
  renderMedia();
}

/* ── DELETE SINGLE ───────────────────────────────────────── */
function deleteMedia(id){
  if(!confirm('Delete this file?')) return;
  const i = SC_MEDIA.findIndex(m=>m.id===id);
  if(i>-1) SC_MEDIA.splice(i,1);
  showToast('🗑 File deleted');
  renderMedia();
}

/* ── PREVIEW ─────────────────────────────────────────────── */
function previewMedia(id){
  currentMediaId = id;
  const m = (SC_MEDIA||[]).find(x=>x.id===id);
  if(!m) return;
  document.getElementById('preview-title').textContent = m.name;
  const body = document.getElementById('preview-body');
  if(m.type==='image'){
    body.innerHTML = m.url
      ? `<img src="${m.url}" style="max-width:100%;max-height:60vh;object-fit:contain">`
      : `<div style="width:100%;height:260px;background:var(--blush);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:var(--rose);fill:none"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
  } else if(m.type==='video'){
    body.innerHTML = `<div style="width:100%;height:240px;background:#2a1f1a;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.4);font-size:12px">🎬 Video Preview — ${m.name}</div>`;
  } else {
    body.innerHTML = `<div style="padding:40px;text-align:center"><svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:var(--text-soft);fill:none;margin:0 auto 12px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p style="font-size:12px;color:var(--text-soft)">Document Preview not available</p></div>`;
  }
  document.getElementById('preview-meta').innerHTML = `<span>Size: ${m.size}</span> &nbsp;·&nbsp; <span>Uploaded: ${fmtDate(m.date)}</span> &nbsp;·&nbsp; <span>Used in: ${m.usedIn}</span>`;
  openModal('mediaPreviewModal');
}

function copyMediaUrl(){
  const m = (SC_MEDIA||[]).find(x=>x.id===currentMediaId);
  if(!m) return;
  const url = m.url || `https://cdn.shainycreation.com/media/${m.name}`;
  navigator.clipboard.writeText(url).catch(()=>{});
  showToast('✓ URL copied to clipboard!');
}

function deletePreviewFile(){
  if(!currentMediaId) return;
  closeModal('mediaPreviewModal');
  deleteMedia(currentMediaId);
}

function useInProduct(){
  showToast('✓ Media linked to product');
  closeModal('mediaPreviewModal');
}

/* ── UPLOAD ──────────────────────────────────────────────── */
function handleMediaUpload(input){
  const list  = document.getElementById('upload-progress-list');
  if(!list) return;
  [...input.files].forEach(file=>{
    const id   = 'm'+Date.now()+Math.random().toString(36).slice(2,6);
    const type = file.type.startsWith('image')?'image':file.type.startsWith('video')?'video':'other';
    const size = file.size>1024*1024 ? (file.size/1024/1024).toFixed(1)+' MB' : (file.size/1024).toFixed(0)+' KB';
    const div  = document.createElement('div');
    div.style = 'padding:10px 0;border-bottom:1px solid var(--border);font-size:12px';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-weight:500">${file.name}</span><span style="color:var(--text-soft)">${size}</span></div><div style="height:4px;background:var(--blush);border-radius:2px"><div id="pb-${id}" style="height:4px;background:linear-gradient(90deg,var(--rose),var(--gold));border-radius:2px;width:0;transition:width .4s"></div></div>`;
    list.appendChild(div);

    const reader = new FileReader();
    reader.onload = e=>{
      let w=0;
      const t=setInterval(()=>{
        w+=Math.random()*20;
        document.getElementById(`pb-${id}`).style.width=Math.min(w,100)+'%';
        if(w>=100){
          clearInterval(t);
          SC_MEDIA.unshift({ id, name:file.name, type, size, date:new Date().toISOString().slice(0,10), usedIn:'–', url:type==='image'?e.target.result:'' });
          renderMedia();
        }
      }, 120);
    };
    reader.readAsDataURL(file);
  });
}

/* ── DRAG & DROP ─────────────────────────────────────────── */
function setupDragDrop(){
  const zone = document.getElementById('media-upload-zone');
  if(!zone) return;
  zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', ()=>zone.classList.remove('drag'));
  zone.addEventListener('drop', e=>{
    e.preventDefault();
    zone.classList.remove('drag');
    const fi = document.getElementById('media-file-input');
    if(fi){ fi.files = e.dataTransfer.files; handleMediaUpload(fi); }
  });
}

/* ── FILTER TABS ─────────────────────────────────────────── */
function filterMedia(){ renderMedia(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      mediaFilter = this.dataset.filter;
      renderMedia();
    });
  });
  setupDragDrop();
  renderMedia();
  document.querySelectorAll('.modal-overlay').forEach(el=>{
    el.addEventListener('click', e=>{ if(e.target===el) el.classList.remove('open'); });
  });
});
