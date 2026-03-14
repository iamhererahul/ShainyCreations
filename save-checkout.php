<?php

include "config.php";
require __DIR__.'/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
  $fname = mysqli_real_escape_string($conn, $_POST['fname']);
  $lname = mysqli_real_escape_string($conn, $_POST['lname']);
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $phone = mysqli_real_escape_string($conn, $_POST['phone']);
  $addr1 = mysqli_real_escape_string($conn, $_POST['addr1']);
  $addr2 = mysqli_real_escape_string($conn, $_POST['addr2'] ?? '');
  $city = mysqli_real_escape_string($conn, $_POST['city']);
  $state = mysqli_real_escape_string($conn, $_POST['state']);
  $pin = mysqli_real_escape_string($conn, $_POST['pin']);
  $landmark = mysqli_real_escape_string($conn, $_POST['landmark'] ?? '');
  $payment = mysqli_real_escape_string($conn, $_POST['payment']);
  $cart_data = $_POST['cart_data'] ?? '[]';
  
  $cart = json_decode($cart_data, true);

/* CHECK IF CART EMPTY */
if(empty($cart)){
  exit("Cart is empty");
}

$subtotal = 0;
  $items_list = '';
  foreach ($cart as $item) {
    $line_total = $item['price'] * ($item['qty'] ?? 1);
    $subtotal += $line_total;
    $items_list .= $item['name'] . ' (Qty: ' . ($item['qty'] ?? 1) . ', Size: ' . ($item['size'] ?? 'M') . ') - ₹' . number_format($line_total) . '<br>';
  }
  $shipping = $subtotal >= 1500 ? 0 : 99;
  $total = $subtotal + $shipping;
  
  $order_id = "SC".time().rand(100,999);
  
  $query = "INSERT INTO orders (order_id,first_name,last_name,email,phone,address1,address2,city,state,pincode,landmark,payment_method,subtotal,shipping,total, items) VALUES ('$order_id','$fname','$lname','$email','$phone','$addr1','$addr2','$city','$state','$pin','$landmark','$payment','$subtotal','$shipping','$total', '$items_list')";
  $result = mysqli_query($conn, $query);
  
  if ($result) {
    // Send confirmation email
    
    $mail = new PHPMailer(true);
    try {
      $mail->isSMTP();
      $mail->Host = 'smtp.gmail.com';
      $mail->SMTPAuth = true;
      $mail->Username = 'jrsoni645@gmail.com'; // UPDATE THIS
      $mail->Password = 'tsoa jqre xyox eaqf'; // UPDATE THIS
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port = 587;
      
      $mail->setFrom('jrsoni645@gmail.com', 'Shainy Creation');
      $mail->addAddress($email);
      
      $mail->isHTML(true);
      $mail->Subject = 'Order Confirmation - #' . $order_id;
      
      $mail->Body = "
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>$order_id</strong></p>
      <p>Items:</p>
      <div style='background:#f9f9f9; padding:15px; border-radius:5px;'>$items_list</div>
      <p>Subtotal: ₹" . number_format($subtotal) . "<br>
      Shipping: " . ($shipping == 0 ? 'FREE' : '₹' . $shipping) . "<br>
      <strong>Total: ₹" . number_format($total) . "</strong></p>
      <p>Shipping to:<br>
      $fname $lname<br>
      $addr1" . ($addr2 ? ', ' . $addr2 : '') . "<br>
      $city, $state $pin<br>
      $landmark<br>
      $phone | $email</p>
      <p>Payment: $payment</p>
      <hr>
      <p>We'll notify you when your order ships!</p>
      ";
      
      $mail->send();
    } catch (Exception $e) {
      // Email failed but order saved
    }
    
    header("Location: order-confirmation.php?order_id=$order_id");
    exit();
  } else {
    echo "Error: " . mysqli_error($conn);
  }
}

?>