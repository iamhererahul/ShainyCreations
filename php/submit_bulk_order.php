<?php

include "config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){

$name = $_POST['name'];
$organisation = $_POST['organisation'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$products = $_POST['products'];
$quantity = $_POST['quantity'];
$required_date = $_POST['required_date'];
$special_requirements = $_POST['special_requirements'];

$sql = "INSERT INTO bulk_orders
(name, organisation, phone, email, products, quantity, required_date, special_requirements)
VALUES
('$name','$organisation','$phone','$email','$products','$quantity','$required_date','$special_requirements')";

$result = mysqli_query($conn,$sql);

if($result){

echo "<script>
alert('Quote request sent successfully!');
window.location.href='../bulk-order.html';
</script>";

}else{

echo "Database Error: " . mysqli_error($conn);

}

}
?>