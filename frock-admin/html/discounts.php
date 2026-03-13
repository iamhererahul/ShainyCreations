<?php
include "../config.php";

/* SAVE DISCOUNT */

if(isset($_POST['save_discount'])){

$code = mysqli_real_escape_string($conn,strtoupper($_POST['code']));
$type = mysqli_real_escape_string($conn,$_POST['type']);
$value = mysqli_real_escape_string($conn,$_POST['value']);
$min = mysqli_real_escape_string($conn,$_POST['min']);
$limit = mysqli_real_escape_string($conn,$_POST['limit']);
$start = mysqli_real_escape_string($conn,$_POST['start']);
$end = mysqli_real_escape_string($conn,$_POST['end']);
$applies = mysqli_real_escape_string($conn,$_POST['applies']);
$status = isset($_POST['active']) ? "Active" : "Inactive";

$query = "INSERT INTO discounts
(code,type,value,min_order,usage_limit,start_date,end_date,applies_to,status)
VALUES
('$code','$type','$value','$min','$limit','$start','$end','$applies','$status')";

mysqli_query($conn,$query);

header("Location: discounts.php");
exit();
}


/* DELETE DISCOUNT */

if(isset($_GET['delete'])){

$code = mysqli_real_escape_string($conn,$_GET['delete']);

mysqli_query($conn,"DELETE FROM discounts WHERE code='$code'");

header("Location: discounts.php");
exit();
}


/* TOGGLE STATUS */

if(isset($_GET['toggle'])){

$code = mysqli_real_escape_string($conn,$_GET['toggle']);

$q = mysqli_query($conn,"SELECT status FROM discounts WHERE code='$code'");
$row = mysqli_fetch_assoc($q);

$new_status = $row['status']=="Active" ? "Inactive" : "Active";

mysqli_query($conn,"UPDATE discounts SET status='$new_status' WHERE code='$code'");

header("Location: discounts.php");
exit();
}


/* FETCH DISCOUNTS */

$discounts = [];

$q = mysqli_query($conn,"SELECT * FROM discounts ORDER BY id DESC");

while($row = mysqli_fetch_assoc($q)){

$discounts[] = [
"id" => $row['id'],
"code" => $row['code'],
"type" => $row['type'],
"value" => (int)$row['value'],
"min" => (int)$row['min_order'],
"limit" => (int)$row['usage_limit'],
"uses" => (int)$row['used_count'],
"start" => $row['start_date'],
"end" => $row['end_date'],
"applies" => $row['applies_to'],
"active" => $row['status']=="Active" ? true : false
];

}


/* STATS */

$total = mysqli_fetch_assoc(
mysqli_query($conn,"SELECT COUNT(*) as t FROM discounts")
)['t'] ?? 0;

$active = mysqli_fetch_assoc(
mysqli_query($conn,"SELECT COUNT(*) as t FROM discounts WHERE LOWER(status)='active'")
)['t'] ?? 0;

$inactive = mysqli_fetch_assoc(
mysqli_query($conn,"SELECT COUNT(*) as t FROM discounts WHERE LOWER(status)='inactive'")
)['t'] ?? 0;

$uses = mysqli_fetch_assoc(
mysqli_query($conn,"SELECT IFNULL(SUM(used_count),0) as t FROM discounts")
)['t'] ?? 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Shainy Creation – Discounts</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/discounts.css">

</head>

<body>

<div id="sidebar-container"></div>

<div class="main">

<div id="topbar-container"></div>

<div class="page-content">

<div class="page-header">
<h1 class="page-heading">Discounts & Coupons</h1>

<button class="btn btn-primary" onclick="openAddDiscount()">
<svg viewBox="0 0 24 24">
<line x1="12" y1="5" x2="12" y2="19"/>
<line x1="5" y1="12" x2="19" y2="12"/>
</svg>
Create Discount
</button>
</div>


<!-- STATS -->

<div class="discount-stats-grid">

<div class="mini-stat">
<div class="mini-stat-label">Total Coupons</div>
<div class="mini-stat-val" id="disc-total"><?php echo $total; ?></div>
</div>

<div class="mini-stat green">
<div class="mini-stat-label">Active</div>
<div class="mini-stat-val" id="disc-active-count"><?php echo $active; ?></div>
</div>

<div class="mini-stat red">
<div class="mini-stat-label">Inactive</div>
<div class="mini-stat-val" id="disc-expired"><?php echo $inactive; ?></div>
</div>

<div class="mini-stat" style="--accent:var(--gold)">
<div class="mini-stat-label">Total Uses</div>
<div class="mini-stat-val" id="disc-uses"><?php echo $uses; ?></div>
</div>

</div>


<div class="card" style="padding:0">

<div class="filter-row" style="padding:14px 16px">
<input id="disc-search" class="filter-input" placeholder="Search discount codes…" onkeyup="filterDiscounts()">

<select id="disc-type-filter" class="filter-select" onchange="filterDiscounts()">
<option value="">All Types</option>
<option>Percentage</option>
<option>Fixed Amount</option>
<option>Free Shipping</option>
</select>

<select id="disc-status-filter" class="filter-select" onchange="filterDiscounts()">
<option value="">All Statuses</option>
<option>Active</option>
<option>Inactive</option>
<option>Expired</option>
</select>
</div>


<div class="table-wrap">

<table>

<thead>

<tr>
<th>Code</th>
<th>Type</th>
<th>Value</th>
<th>Uses / Limit</th>
<th>Min Order</th>
<th>Valid Until</th>
<th>Status</th>
<th>Actions</th>
</tr>

</thead>


<tbody id="discounts-table">



</tbody>

</table>

</div>

</div>

</div>

</div>


<!-- ADD DISCOUNT MODAL -->

<div class="modal-overlay" id="addDiscountModal">

<div class="modal">

<form method="POST">

<input type="hidden" id="edit-disc-code-original">


<div class="modal-header">

<div class="modal-title" id="discount-modal-title">Create Discount</div>

<button class="modal-close" type="button" onclick="closeModal('addDiscountModal')">×</button>

</div>


<div class="modal-body">

<div class="form-group">

<label class="form-label">Discount Code *</label>

<input class="form-input" id="disc-code" name="code" placeholder="PRINCESS20" required style="text-transform:uppercase">

</div>


<div class="form-2col">

<div class="form-group">

<label class="form-label">Discount Type</label>

<select class="form-select" id="disc-type" name="type">
<option value="Percentage">Percentage (%)</option>
<option value="Fixed Amount">Fixed Amount (₹)</option>
<option value="Free Shipping">Free Shipping</option>
</select>

</div>


<div class="form-group">

<label class="form-label">Value</label>
<input class="form-input" id="disc-value" name="value" type="number">

</div>

</div>


<div class="form-2col">

<div class="form-group">

<label class="form-label">Minimum Order Value</label>

<input class="form-input" id="disc-min" name="min" type="number">

</div>

<div class="form-group">

<label class="form-label">Usage Limit</label>

<input class="form-input" id="disc-limit" name="limit" type="number">

</div>

</div>


<div class="form-2col">

<div class="form-group">

<label class="form-label">Start Date</label>

<input class="form-input" id="disc-start" name="start" type="date">

</div>

<div class="form-group">

<label class="form-label">End Date</label>

<input class="form-input" id="disc-end" name="end" type="date">

</div>

</div>


<div class="form-group">

<label class="form-label">Applies To</label>

<select class="form-select" id="disc-applies" name="applies">
<option>All Products</option>
<option>Frocks Only</option>
<option>Gowns Only</option>
<option>First Order Only</option>
</select>

</div>


<div class="form-group">

<label class="toggle-wrap">

<input type="checkbox" id="disc-active" name="active" checked>

Activate immediately

</label>

</div>

</div>


<div class="modal-footer">

<button class="btn btn-outline" type="button" onclick="closeModal('addDiscountModal')">Cancel</button>

<button class="btn btn-primary" type="submit" name="save_discount">

Save Discount

</button>

</div>

</form>

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
function openModal(id){
const modal = document.getElementById(id);
if(modal){
modal.classList.add("open");
modal.style.display = "flex";
}
}

function closeModal(id){
const modal = document.getElementById(id);
if(modal){
modal.classList.remove("open");
modal.style.display = "none";
}
}

/* PASS PHP DATA TO JS */

const SC_DISCOUNTS = <?php echo json_encode($discounts); ?>;

</script>

<script src="../js/discounts.js"></script>

</body>
</html>
</body>
</html>