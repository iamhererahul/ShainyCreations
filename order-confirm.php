<?php

include "config.php";

if(!isset($_GET['order_id'])){
header("Location:index.html");
exit();
}

$order_id = mysqli_real_escape_string($conn,$_GET['order_id']);

$query = "SELECT * FROM orders WHERE order_id='$order_id'";
$result = mysqli_query($conn,$query);

$order = mysqli_fetch_assoc($result);

if(!$order){
echo "Order not found";
exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>Order Confirmed – Shainy Creation</title>

<link rel="stylesheet" href="css/style.css"> <!-- jsPDF for invoice generation --> <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script> <style> .confirm-hero{text-align:center;padding:56px 24px 40px;border-bottom:1px solid var(--border)} .confirm-icon{width:72px;height:72px;background:#e8f5ee;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px} .confirm-icon svg{width:36px;height:36px;stroke:#2d8a55;fill:none;stroke-width:2} .confirm-hero h1{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:400;margin-bottom:8px} .confirm-hero p{font-size:13px;color:var(--text-soft);max-width:480px;margin:0 auto} .order-id-chip{display:inline-flex;align-items:center;gap:8px;background:var(--blush);padding:10px 20px;margin-top:20px;font-size:12px;font-weight:600;letter-spacing:.06em} .order-id-chip span{color:var(--rose)} .confirm-layout{display:grid;grid-template-columns:1fr 380px;gap:40px;max-width:1100px;margin:0 auto;padding:40px 48px} /* ── Cards ── */ .conf-card{background:var(--white);border:1px solid var(--border);margin-bottom:20px} .conf-card-head{padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between} .conf-card-head h3{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400} .conf-card-body{padding:24px} /* ── Order Items ── */ .confirm-item{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--border)} .confirm-item:last-child{border-bottom:none} .ci-img{width:64px;height:80px;background:linear-gradient(145deg,#fce8e0,#f5d5c8);flex-shrink:0;display:flex;align-items:center;justify-content:center} .ci-info{flex:1} .ci-name{font-size:13px;font-weight:500;margin-bottom:3px} .ci-meta{font-size:11px;color:var(--text-soft);line-height:1.7} .ci-price{font-size:14px;font-weight:600;white-space:nowrap} /* ── Summary Box ── */ .conf-summary{background:var(--off-white);border:1px solid var(--border);padding:24px;position:sticky;top:80px} .conf-summary-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)} .cs-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px;color:var(--text-soft)} .cs-row.total{font-size:16px;font-weight:700;color:var(--text);padding-top:12px;border-top:2px solid var(--border);margin-top:10px} .cs-row.total span:last-child{color:var(--rose)} /* ── Timeline ── */ .timeline{padding:0} .tl-item{display:flex;gap:16px;padding:12px 0} .tl-dot{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:2px} .tl-dot svg{width:14px;height:14px;stroke:#fff;fill:none;stroke-width:2.5} .tl-dot.done{background:#2d8a55} .tl-dot.pending{background:var(--border)} .tl-dot.active-step{background:var(--rose)} .tl-line{margin-left:15px;width:2px;height:20px;background:var(--border)} .tl-label{font-size:13px;font-weight:500;margin-bottom:2px} .tl-sub{font-size:11px;color:var(--text-soft)} /* ── Address Display ── */ .addr-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px} .addr-field label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--text-soft);display:block;margin-bottom:2px} .addr-field p{font-size:13px;color:var(--text)} /* ── Buttons ── */ .action-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px} .btn-invoice{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:var(--rose);color:#fff;border:none;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;cursor:pointer;transition:background .2s} .btn-invoice:hover{background:var(--rose-dark)} .btn-invoice svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2} .btn-shop-more{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:none;border:1.5px solid var(--text);color:var(--text);font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;cursor:pointer;transition:all .2s} .btn-shop-more:hover{background:var(--text);color:#fff} /* ── Email sent note ── */ .email-note{display:flex;align-items:center;gap:10px;background:var(--blush);padding:14px 18px;font-size:12px;margin-top:16px} .email-note svg{width:16px;height:16px;stroke:var(--rose);fill:none;stroke-width:2;flex-shrink:0} @media(max-width:900px){ .confirm-layout{grid-template-columns:1fr;padding:24px 16px} .conf-summary{position:static} .addr-grid{grid-template-columns:1fr} } </style> </head>


<body>


<!-- HERO -->
<div class="confirm-hero">

<h1>Order Confirmed</h1>

<p>Your order has been placed successfully.</p>

<div class="order-id-chip">

Order ID: <strong><?php echo $order['order_id']; ?></strong>

</div>

</div>



<div class="confirm-layout">


<!-- LEFT SIDE -->
<div>



<!-- DELIVERY ADDRESS -->
<div class="conf-card">

<div class="conf-card-head">

Delivery Address

</div>


<div class="conf-card-body">

<div class="addr-grid">


<div class="addr-field">

<label>Name</label>

<p><?php echo $order['first_name']." ".$order['last_name']; ?></p>

</div>


<div class="addr-field">

<label>Phone</label>

<p><?php echo $order['phone']; ?></p>

</div>


<div class="addr-field" style="grid-column:1/-1">

<label>Address</label>

<p>

<?php

echo $order['address1'];

if($order['address2'])
echo ", ".$order['address2'];

if($order['landmark'])
echo ", Near ".$order['landmark'];

?>

</p>

</div>


<div class="addr-field">

<label>City</label>

<p><?php echo $order['city']; ?></p>

</div>


<div class="addr-field">

<label>State</label>

<p><?php echo $order['state']." - ".$order['pincode']; ?></p>

</div>


</div>

</div>

</div>



<!-- ORDER STATUS -->
<div class="conf-card">

<div class="conf-card-head">

Order Status

</div>


<div class="conf-card-body">

<p><strong>Order Placed:</strong>
<?php echo date("d M Y h:i A", strtotime($order['created_at'])); ?>
</p>

<p>Processing within 24 hours</p>

<p>Shipped in 2-4 days</p>

<p>Delivered in 3-6 days</p>

</div>

</div>



<div style="margin-top:20px">

<button class="btn-invoice" onclick="downloadInvoice()">

Download Invoice

</button>


<button class="btn-shop-more" onclick="window.location='shop.html'">

Continue Shopping

</button>

</div>


</div>



<!-- RIGHT SIDE -->
<div class="conf-summary">

<h3>Payment Summary</h3>

<div class="cs-row">

<span>Subtotal</span>

<span>₹<?php echo number_format($order['subtotal']); ?></span>

</div>


<div class="cs-row">
<span>Shipping</span>
<span>
<?php echo ($order['shipping']==0 ? "FREE" : "₹".number_format($order['shipping'])); ?>
</span>
</div>

<?php

if($order['shipping']==0)
echo "FREE";
else
echo "₹".number_format($order['shipping']);

?>

</span>

</div>


<div class="cs-row total">

<span>Total Paid</span>

<span>₹<?php echo number_format($order['total']); ?></span>

</div>


<div style="margin-top:20px">

<strong>Payment Method</strong>

<p><?php echo strtoupper($order['payment_method']); ?></p>

</div>

</div>


</div>



<script>

const orderData = {

id : "<?php echo $order['order_id']; ?>",

subtotal : <?php echo $order['subtotal']; ?>,

shipping : <?php echo $order['shipping']; ?>,

total : <?php echo $order['total']; ?>,

payment : "<?php echo $order['payment_method']; ?>",

date : "<?php echo $order['created_at']; ?>",

customer : {

name : "<?php echo $order['first_name']." ".$order['last_name']; ?>",

phone : "<?php echo $order['phone']; ?>",

email : "<?php echo $order['email']; ?>",

address : "<?php echo $order['address1']; ?>",

city : "<?php echo $order['city']; ?>",

state : "<?php echo $order['state']; ?>",

pin : "<?php echo $order['pincode']; ?>"

}

};


function downloadInvoice(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Shainy Creation",20,20);

doc.setFontSize(12);

doc.text("Order ID: "+orderData.id,20,40);

doc.text("Date: "+orderData.date,20,50);

doc.text("Customer: "+orderData.customer.name,20,60);

doc.text("Phone: "+orderData.customer.phone,20,70);

doc.text("Email: "+orderData.customer.email,20,80);

doc.text("Address: "+orderData.customer.address,20,90);

doc.text("City: "+orderData.customer.city+", "+orderData.customer.state+" "+orderData.customer.pin,20,100);

doc.text("Payment Method: "+orderData.payment,20,120);

doc.text("Subtotal: ₹"+orderData.subtotal,20,140);

doc.text("Shipping: "+(orderData.shipping==0 ? "FREE" : "₹"+orderData.shipping),20,150);

doc.text("Total Paid: ₹"+orderData.total,20,170);

doc.save("Invoice-"+orderData.id+".pdf");

}

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);

doc.text("Shainy Creation",20,20);

doc.setFontSize(12);

doc.text("Order ID: "+orderData.id,20,40);

doc.text("Customer: "+orderData.customer.name,20,50);

doc.text("Phone: "+orderData.customer.phone,20,60);

doc.text("Email: "+orderData.customer.email,20,70);

doc.text("Total Paid: ₹"+orderData.total,20,90);

doc.save("Invoice-"+orderData.id+".pdf");

}

</script>


</body>
</html>