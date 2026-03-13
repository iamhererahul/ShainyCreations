/* ============================================================
   contact.js  –  Shainy Creation Admin Panel
   Contact submissions: inbox list + detail panel + reply.
   ============================================================ */

/* ── STATUS BADGE FUNCTION ───────────────────────── */

function statusBadge(status) {
  if (status === "Unread") {
    return `<span style="background:#ffe5e5;color:#c0392b;padding:3px 8px;border-radius:6px;font-size:10px">Unread</span>`;
  }

  if (status === "Read") {
    return `<span style="background:#eef2ff;color:#4f46e5;padding:3px 8px;border-radius:6px;font-size:10px">Read</span>`;
  }

  if (status === "Replied") {
    return `<span style="background:#e8fff3;color:#16a34a;padding:3px 8px;border-radius:6px;font-size:10px">Replied</span>`;
  }

  if (status === "Archived") {
    return `<span style="background:#f1f1f1;color:#555;padding:3px 8px;border-radius:6px;font-size:10px">Archived</span>`;
  }

  return "";
}

let currentContactId = null;

/* ── UPDATE STATUS IN DATABASE ───────────────────── */

function updateStatus(id, status) {
  fetch("update_contact_status.php", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: "id=" + id + "&status=" + status,
  }).catch(() => console.log("status update failed"));
}

/* ── RENDER LIST ─────────────────────────────────── */

function renderContactList() {
  const q = (document.getElementById("ct-search")?.value || "").toLowerCase();
  const status = document.getElementById("ct-status")?.value || "";
  const subject = document.getElementById("ct-subject")?.value || "";
  const sort = document.getElementById("ct-sort")?.value || "Newest First";

  let list = [...(SC_CONTACTS || [])];

  if (q) {
    list = list.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.message || "").toLowerCase().includes(q),
    );
  }

  if (status) list = list.filter((c) => c.status === status);
  if (subject) list = list.filter((c) => c.subject === subject);

  if (sort === "Oldest First") {
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /* ── STATS ───────────────────────── */

  document.getElementById("ct-total").textContent = SC_CONTACTS.length;

  document.getElementById("ct-unread").textContent = SC_CONTACTS.filter(
    (c) => c.status === "Unread",
  ).length;

  document.getElementById("ct-replied").textContent = SC_CONTACTS.filter(
    (c) => c.status === "Replied",
  ).length;

  const today = new Date().toISOString().slice(0, 10);

  document.getElementById("ct-today").textContent = SC_CONTACTS.filter((c) =>
    (c.date || "").startsWith(today),
  ).length;

  /* ── LIST UI ─────────────────────── */

  const container = document.getElementById("contact-list");

  if (!container) return;

  if (!list.length) {
    container.innerHTML =
      '<p style="padding:40px;color:var(--text-soft);text-align:center">No messages found.</p>';

    return;
  }

  container.innerHTML = list
    .map((c) => {
      const time = (c.date || "").slice(11, 16);

      return `

<div class="contact-list-item ${c.id === currentContactId ? "active" : ""}"
data-id="${c.id}"
onclick="viewContact('${c.id}')"

style="padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;background:${c.id === currentContactId ? "var(--blush)" : "var(--white)"};transition:background .15s">

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">

<div style="display:flex;align-items:center;gap:8px">

${c.status === "Unread" ? '<div style="width:8px;height:8px;background:var(--rose);border-radius:50%"></div>' : ""}

<span style="font-weight:${c.status === "Unread" ? 700 : 500};font-size:13px">${c.name}</span>

</div>

<span style="font-size:10px;color:var(--text-soft)">${time}</span>

</div>

<div style="font-size:11px;color:var(--rose);margin-bottom:3px;font-weight:500">${c.subject}</div>

<div style="font-size:11px;color:var(--text-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.message}</div>

<div style="margin-top:6px">${statusBadge(c.status)}</div>

</div>

`;
    })
    .join("");
}

/* ── VIEW DETAIL ───────────────────────────────── */

function viewContact(id) {
  currentContactId = id;

  const c = (SC_CONTACTS || []).find((x) => x.id == id);

  if (!c) return;

  if (c.status === "Unread") {
    c.status = "Read";

    updateStatus(id, "Read");
  }

  const detail = document.getElementById("contact-detail");

  detail.innerHTML = `

<div style="border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:16px">

<div style="display:flex;justify-content:space-between">

<div>

<div style="font-family:'Cormorant Garamond',serif;font-size:20px">${c.name}</div>

<div style="font-size:12px">📧 <a href="mailto:${c.email}">${c.email}</a></div>

<div style="font-size:12px">📞 ${c.phone}</div>

</div>

<div>

${statusBadge(c.status)}

<div style="font-size:10px">${c.date}</div>

</div>

</div>

</div>

<div style="margin-bottom:16px">

<div style="font-size:10px;text-transform:uppercase">Subject</div>

<div style="font-size:14px;font-weight:600">${c.subject}</div>

</div>

<div style="margin-bottom:20px">

<div style="font-size:10px;text-transform:uppercase">Message</div>

<div style="padding:16px;background:var(--off-white);border-left:3px solid var(--rose)">${c.message}</div>

</div>

<textarea id="reply-text" class="form-textarea" placeholder="Type reply..."></textarea>

<div style="margin-top:10px;display:flex;gap:10px;justify-content:flex-end">

<button class="btn btn-outline btn-sm" onclick="archiveContact('${c.id}')">Archive</button>

<button class="btn btn-primary btn-sm" onclick="replyContact('${c.id}')">Send Reply</button>

</div>

`;

  renderContactList();
}

/* ── REPLY ───────────────────────── */

function replyContact(id) {
  const text = document.getElementById("reply-text")?.value.trim();

  if (!text) {
    showToast("⚠ Type reply first");

    return;
  }

  updateStatus(id, "Replied");

  const c = SC_CONTACTS.find((x) => x.id == id);

  if (c) c.status = "Replied";

  showToast("✉ Reply sent!");

  renderContactList();

  viewContact(id);
}

/* ── ARCHIVE ─────────────────────── */

function archiveContact(id) {
  updateStatus(id, "Archived");

  const c = SC_CONTACTS.find((x) => x.id == id);

  if (c) c.status = "Archived";

  showToast("✓ Message archived");

  currentContactId = null;

  document.getElementById("contact-detail").innerHTML =
    `<div class="empty-state"><p>Select a message to view details</p></div>`;

  renderContactList();
}

function exportContacts() {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Subject",
    "Message",
    "Date",
    "Status",
  ];

  const rows = (SC_CONTACTS || []).map((c) => [
    c.id,
    c.name,
    c.email,
    c.phone,
    c.subject,
    c.message.replace(/"/g, "'"),
    c.date,
    c.status,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "contact_messages.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  showToast("Contacts exported successfully");
}
/* ── FILTER ─────────────────────── */

function filterContacts() {
  renderContactList();
}

/* ── INIT ───────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
  renderContactList();
});
