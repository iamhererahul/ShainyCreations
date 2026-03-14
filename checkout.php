<?php
include "config.php";
include "send_invoice.php";
?>

<!DOCTYPE html>
<html>
<head>

<title>Checkout</title>

<style>

body{
font-family:Arial;
background:#fafafa;
padding:40px;
}

.checkout-box{
max-width:600px;
margin:auto;
background:white;
padding:30px;
border-radius:8px;
}

input,textarea{
width:100%;
padding:10px;
margin-bottom:15px;
border:1px solid #ddd;
}

button{
background:black;
color:white;
padding:12px;
border:none;
cursor:pointer;
width:100%;
}

</style>

</head>

<body>

<div class="checkout-box">

<h2>Shipping Address</h2>

<form action="place-order.php" method="POST">

<input type="text" name="name" placeholder="Full Name" required>

<input type="text" name="phone" placeholder="Phone Number" required>

<input type="email" name="email" placeholder="Email" required>

<textarea name="address" placeholder="Full Address" required></textarea>

<input type="text" name="city" placeholder="City" required>

<input type="text" name="pincode" placeholder="Pincode" required>

<select name="payment">
<option value="COD">Cash on Delivery</option>
<option value="Online">Online Payment</option>
</select>

<button type="submit">Place Order</button>

</form>

</div>

</body>
</html>