<?php
include("../config.php");

/* Fetch contacts */

$query = "SELECT * FROM contact_messages ORDER BY id DESC";
$result = mysqli_query($conn,$query);

$contacts = [];

if($result){
while($row = mysqli_fetch_assoc($result)){

$contacts[] = [
"id"=>$row['id'] ?? '',
"name"=>$row['first_name'] ?? '',
"email"=>$row['email'] ?? '',
"phone"=>$row['phone'] ?? '',
"subject"=>$row['subject'] ?? 'General Enquiry',
"message"=>$row['message'] ?? '',
"date"=>$row['created_at'] ?? date("Y-m-d H:i:s"),
"status"=>$row['status'] ?? 'Unread'
];

}
}

/* Stats */

$total_q = mysqli_query($conn,"SELECT COUNT(*) as total FROM contact_messages");
$total = mysqli_fetch_assoc($total_q)['total'];

$unread_q = mysqli_query($conn,"SELECT COUNT(*) as total FROM contact_messages WHERE status='Unread'");
$unread = mysqli_fetch_assoc($unread_q)['total'];

$replied_q = mysqli_query($conn,"SELECT COUNT(*) as total FROM contact_messages WHERE status='Replied'");
$replied = mysqli_fetch_assoc($replied_q)['total'];

$today_q = mysqli_query($conn,"SELECT COUNT(*) as total FROM contact_messages WHERE DATE(created_at)=CURDATE()");
$today = mysqli_fetch_assoc($today_q)['total'];
?>
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>Shainy Creation – Contact Submissions</title>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/contact.css">

</head>

<body>

<div id="sidebar-container"></div>

<div class="main">

<div id="topbar-container"></div>

<div class="page-content">

<div class="page-header">

<div>
<h1 class="page-heading">Contact Submissions</h1>
<p class="text-soft text-sm">Messages from your "Contact Us" form</p>
</div>

<button class="btn btn-outline btn-sm" onclick="exportContacts()">

<svg viewBox="0 0 24 24">
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
<polyline points="7 10 12 15 17 10"/>
<line x1="12" y1="15" x2="12" y2="3"/>
</svg>

Export

</button>

</div>


<!-- Stats -->

<div class="contact-stats-grid">

<div class="mini-stat">
<div class="mini-stat-label">Total Messages</div>
<div class="mini-stat-val" id="ct-total">0</div>
</div>

<div class="mini-stat orange">
<div class="mini-stat-label">Unread</div>
<div class="mini-stat-val" id="ct-unread">0</div>
</div>

<div class="mini-stat green">
<div class="mini-stat-label">Replied</div>
<div class="mini-stat-val" id="ct-replied">0</div>
</div>

<div class="mini-stat">
<div class="mini-stat-label">Today</div>
<div class="mini-stat-val" id="ct-today">0</div>
</div>

</div>


<div class="filter-row">

<input class="filter-input"
placeholder="Search by name, email, message…"
id="ct-search"
oninput="filterContacts()">

<select class="filter-select" id="ct-status" onchange="filterContacts()">
<option value="">All Messages</option>
<option>Unread</option>
<option>Read</option>
<option>Replied</option>
<option>Archived</option>
</select>

<select class="filter-select" id="ct-subject" onchange="filterContacts()">

<option value="">All Subjects</option>
<option>Return / Exchange</option>
<option>Feedback</option>
<option>Order Inquiry</option>
<option>Size Help</option>
<option>other</option>

</select>
<select class="filter-select" id="ct-sort" onchange="filterContacts()">
<option>Newest First</option>
<option>Oldest First</option>
</select>

</div>

<div class="contact-layout">

<div class="contact-list card" id="contact-list"></div>

<div class="contact-detail card" id="contact-detail">

<div class="empty-state">

<svg viewBox="0 0 24 24">
<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>

<p>Select a message to view details</p>

</div>

</div>

</div>

</div>

</div>


<div class="toast" id="toast">

<svg viewBox="0 0 24 24">
<polyline points="20 6 9 17 4 12"/>
</svg>

<span id="toast-msg">Done!</span>

</div>


<script src="../js/components.js"></script>

<script>
let SC_CONTACTS = <?php echo json_encode($contacts, JSON_UNESCAPED_UNICODE); ?>;
</script>

<script src="../js/contact.js"></script>



</body>
</html>