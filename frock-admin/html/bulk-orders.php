<?php
include "../config.php";

/* ===============================
EXPORT CSV
================================ */

if(isset($_GET['export']) && $_GET['export']=="csv"){

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="bulk_orders.csv"');

$output = fopen("php://output","w");

fputcsv($output,[
"Order ID",
"Name",
"Organisation",
"Phone",
"Email",
"Products",
"Quantity",
"Required Date",
"Status"
]);

$q = mysqli_query($conn,"SELECT * FROM bulk_orders ORDER BY id DESC");

while($row=mysqli_fetch_assoc($q)){

fputcsv($output,[

$row['id'],
$row['name'],
$row['organisation'],
$row['phone'],
$row['email'],
$row['products'],
$row['quantity'],
$row['required_date'],
$row['status']

]);

}

fclose($output);
exit();
}


/* ===============================
UPDATE STATUS
================================ */

if(isset($_POST['update_status'])){

$order_id = $_POST['order_id'];
$new_status = $_POST['status'];

mysqli_query($conn,"UPDATE bulk_orders 
SET status='$new_status' 
WHERE id='$order_id'");

header("Location: bulk-orders.php");
exit();

}


/* ===============================
FETCH BULK ORDERS
================================ */

$query = "SELECT * FROM bulk_orders ORDER BY id DESC";
$result = mysqli_query($conn,$query);

$total_orders = mysqli_num_rows($result);


/* ===============================
STATS
================================ */

$pending = mysqli_query($conn,"SELECT COUNT(*) as total FROM bulk_orders WHERE status='Pending Approval'");
$pending_row = mysqli_fetch_assoc($pending);

$processing = mysqli_query($conn,"SELECT COUNT(*) as total FROM bulk_orders WHERE status='Processing'");
$processing_row = mysqli_fetch_assoc($processing);

$value = mysqli_query($conn,"SELECT SUM(quantity) as total FROM bulk_orders");
$value_row = mysqli_fetch_assoc($value);

?>
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>Shainy Creation – Bulk Orders</title>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond&family=Jost&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/bulk-orders.css">

</head>

<body>

<div id="sidebar-container"></div>

<div class="main">

<div id="topbar-container"></div>

<div class="page-content">

<div class="page-header">

<div>
<h1 class="page-heading">Bulk Orders</h1>
<p class="text-soft text-sm">Wholesale and large volume orders from website</p>
</div>

<div style="display:flex;gap:8px">

<button class="btn btn-outline btn-sm" onclick="exportBulkCSV()">Export CSV</button>

<button class="btn btn-primary btn-sm" onclick="printAllBulkLabels()">Print All Labels</button>

</div>

</div>


<!-- Stats -->

<div class="bulk-stats-grid">

<div class="mini-stat">
<div class="mini-stat-label">Total Bulk Orders</div>
<div class="mini-stat-val"><?php echo $total_orders; ?></div>
</div>

<div class="mini-stat orange">
<div class="mini-stat-label">Awaiting Approval</div>
<div class="mini-stat-val"><?php echo $pending_row['total']; ?></div>
</div>

<div class="mini-stat green">
<div class="mini-stat-label">Processing</div>
<div class="mini-stat-val"><?php echo $processing_row['total']; ?></div>
</div>

<div class="mini-stat" style="--accent:var(--rose)">
<div class="mini-stat-label">Total Quantity</div>
<div class="mini-stat-val"><?php echo $value_row['total']; ?></div>
</div>

</div>



<!-- Table -->

<div class="card" style="padding:0">

<div class="table-wrap">

<table>

<thead>

<tr>

<th>#</th>
<th>Order ID</th>
<th>Company / Contact</th>
<th>Products</th>
<th>Qty</th>
<th>Date</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

<?php
while($row = mysqli_fetch_assoc($result)){
?>

<tr>

<td><?php echo $row['id']; ?></td>

<td>#BO<?php echo $row['id']; ?></td>

<td>

<strong><?php echo $row['organisation']; ?></strong><br>

<span class="text-soft"><?php echo $row['name']; ?></span><br>

<span class="text-soft"><?php echo $row['phone']; ?></span>

</td>

<td><?php echo $row['products']; ?></td>

<td><?php echo $row['quantity']; ?></td>

<td><?php echo $row['required_date']; ?></td>

<td>

<span class="badge"><?php echo $row['status']; ?></span>

</td>

<td>

<form method="POST" style="display:flex;gap:5px">

<input type="hidden" name="order_id" value="<?php echo $row['id']; ?>">

<select name="status" class="filter-select">

<option value="Pending Approval">Pending</option>
<option value="Approved">Approved</option>
<option value="Processing">Processing</option>
<option value="Shipped">Shipped</option>
<option value="Delivered">Delivered</option>
<option value="Cancelled">Cancelled</option>

</select>

<button type="submit" name="update_status" class="btn btn-primary btn-sm">
Update
</button>

</form>

</td>

</tr>

<?php
}
?>

</tbody>

</table>

</div>

</div>

</div>

</div>

<script src="../js/components.js"></script>
<script>

function exportBulkCSV(){

window.location.href="bulk-orders.php?export=csv";

}

function printAllBulkLabels(){

var content = document.querySelector("table").outerHTML;

var printWindow = window.open('', '', 'width=900,height=600');

printWindow.document.write(`
<html>
<head>
<title>Bulk Orders</title>
<style>
body{font-family:Arial;padding:20px;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #ccc;padding:8px;text-align:left;}
</style>
</head>
<body>

<h2>Bulk Orders</h2>

${content}

</body>
</html>
`);

printWindow.document.close();
printWindow.print();

}

</script>

</body>

</html>