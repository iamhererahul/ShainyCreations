<?php

include "config.php";

if(isset($_POST['place_order'])){

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$phone = $_POST['phone'];

$addr1 = $_POST['addr1'];
$addr2 = $_POST['addr2'];

$city = $_POST['city'];
$state = $_POST['state'];
$pin = $_POST['pin'];

$landmark = $_POST['landmark'];

$payment = $_POST['payment'];

$subtotal = $_POST['subtotal'];
$shipping = $_POST['shipping'];
$total = $_POST['total'];

/* Generate Order ID */

$order_id = "SC".rand(10000000,99999999);

/* Insert Order */

$query = "INSERT INTO orders
(order_id,first_name,last_name,email,phone,address1,address2,city,state,pincode,landmark,payment_method,subtotal,shipping,total)

VALUES

('$order_id','$fname','$lname','$email','$phone','$addr1','$addr2','$city','$state','$pin','$landmark','$payment','$subtotal','$shipping','$total')";

mysqli_query($conn,$query);

/* Redirect */

header("Location: order-confirm.php?order_id=$order_id");
exit();

}

?>