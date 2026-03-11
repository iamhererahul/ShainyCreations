/* ============================================================
   contact.js  –  Shainy Creation Admin Panel
   Contact submissions: inbox list + detail panel + reply.
   ============================================================ */

let currentContactId = null;

/* ── RENDER LIST ─────────────────────────────────────────── */
function renderContactList(){
  const q       = (document.getElementById('ct-search')?.value||'').toLowerCase();
  const status  = document.getElementById('ct-status')?.value||'';
  const subject = document.getElementById('ct-subject')?.value||'';
  const sort    = document.getElementById('ct-sort')?.value||'Newest First';

  let list = [...(SC_CONTACTS||[])];
  if(q)       list = list.filter(c=>c.name.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||c.message.toLowerCase().includes(q));
  if(status)  list = list.filter(c=>c.status===status);
  if(subject) list = list.filter(c=>c.subject===subject);
  if(sort==='Oldest First') list.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));

  /* Stats */
  document.getElementById('ct-total').textContent  = SC_CONTACTS.length;
  document.getElementById('ct-unread').textContent = SC_CONTACTS.filter(c=>c.status==='Unread').length;
  document.getElementById('ct-replied').textContent= SC_CONTACTS.filter(c=>c.status==='Replied').length;
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('ct-today').textContent  = SC_CONTACTS.filter(c=>c.date.startsWith(today)).length;

  const container = document.getElementById('contact-list');
  if(!container) return;
  if(!list.length){ container.innerHTML='<p style="padding:40px;color:var(--text-soft);text-align:center">No messages found.</p>'; return; }

  container.innerHTML = list.map(c=>`
    <div class="contact-list-item${c.id===currentContactId?' active':''}" data-id="${c.id}" onclick="viewContact('${c.id}')"
      style="padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;background:${c.id===currentContactId?'var(--blush)':'var(--white)'};transition:background .15s">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="display:flex;align-items:center;gap:8px">
          ${c.status==='Unread'?'<div style="width:8px;height:8px;background:var(--rose);border-radius:50%;flex-shrink:0"></div>':''}
          <span style="font-weight:${c.status==='Unread'?700:500};font-size:13px">${c.name}</span>
        </div>
        <span style="font-size:10px;color:var(--text-soft)">${c.date.slice(11,16)}</span>
      </div>
      <div style="font-size:11px;color:var(--rose);margin-bottom:3px;font-weight:500">${c.subject}</div>
      <div style="font-size:11px;color:var(--text-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.message}</div>
      <div style="margin-top:6px">${statusBadge(c.status)}</div>
    </div>`).join('');
}

/* ── VIEW DETAIL ─────────────────────────────────────────── */
function viewContact(id){
  currentContactId = id;
  const c = (SC_CONTACTS||[]).find(x=>x.id===id);
  if(!c) return;
  if(c.status==='Unread') c.status='Read';

  const detail = document.getElementById('contact-detail');
  if(!detail) return;
  detail.innerHTML = `
    <div style="border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;margin-bottom:4px">${c.name}</div>
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:2px">📧 <a href="mailto:${c.email}" style="color:var(--rose)">${c.email}</a></div>
          <div style="font-size:12px;color:var(--text-soft)">📞 ${c.phone}</div>
        </div>
        <div style="text-align:right">
          ${statusBadge(c.status)}
          <div style="font-size:10px;color:var(--text-soft);margin-top:6px">${c.date}</div>
        </div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-soft);margin-bottom:6px">Subject</div>
      <div style="font-size:14px;font-weight:600;color:var(--rose)">${c.subject}</div>
    </div>
    <div style="margin-bottom:24px">
      <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-soft);margin-bottom:8px">Message</div>
      <div style="font-size:13px;line-height:1.8;padding:16px;background:var(--off-white);border-left:3px solid var(--rose)">${c.message}</div>
    </div>
    <div style="margin-bottom:16px">
      <label class="form-label">Reply</label>
      <textarea class="form-textarea" id="reply-text" style="min-height:120px" placeholder="Type your reply…"></textarea>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-outline btn-sm" onclick="archiveContact('${c.id}')">Archive</button>
      <button class="btn btn-primary btn-sm" onclick="replyContact('${c.id}')">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Reply
      </button>
    </div>`;

  renderContactList();
}

/* ── REPLY ───────────────────────────────────────────────── */
function replyContact(id){
  const text = document.getElementById('reply-text')?.value.trim();
  if(!text){ showToast('⚠ Type a reply first'); return; }
  const c = (SC_CONTACTS||[]).find(x=>x.id===id);
  if(c) c.status='Replied';
  showToast('✉ Reply sent!');
  renderContactList();
  viewContact(id);
}

/* ── ARCHIVE ─────────────────────────────────────────────── */
function archiveContact(id){
  const c = (SC_CONTACTS||[]).find(x=>x.id===id);
  if(c) c.status='Archived';
  showToast('✓ Message archived');
  currentContactId=null;
  document.getElementById('contact-detail').innerHTML=`<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>Select a message to view details</p></div>`;
  renderContactList();
}

function exportContacts(){
  const headers=['ID','Name','Email','Phone','Subject','Message','Date','Status'];
  const rows=(SC_CONTACTS||[]).map(c=>[c.id,c.name,c.email,c.phone,c.subject,`"${c.message.replace(/"/g,"'")}`,c.date,c.status]);
  const csv=[headers,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='contacts.csv'; a.click();
  showToast('📥 Exported!');
}

function filterContacts(){ renderContactList(); }

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){
  renderContactList();
});
