<?php

include "config.php";

$name=$_POST['name'];
$phone=$_POST['phone'];
$email=$_POST['email'];
$address=$_POST['address'];
$city=$_POST['city'];
$pincode=$_POST['pincode'];
$payment=$_POST['payment'];

$query="INSERT INTO orders
(name,phone,email,address,city,pincode,payment_method)
VALUES
('$name','$phone','$email','$address','$city','$pincode','$payment')";

mysqli_query($conn,$query);

header("Location:order-success.php");

?>