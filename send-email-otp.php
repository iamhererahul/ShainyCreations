<?php

session_start();

use ventor\PHPMailer\PHPMailer;
use vendor\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$email = $_POST['email'];

$otp = rand(100000,999999);

$_SESSION['email_otp'] = $otp;

$mail = new PHPMailer(true);

try{

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;

$mail->Username = 'yourgmail@gmail.com';
$mail->Password = 'YOUR_APP_PASSWORD';

$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('yourgmail@gmail.com','Shainy Creation');

$mail->addAddress($email);

$mail->isHTML(true);

$mail->Subject = "Email OTP Verification";

$mail->Body = "
<h2>Shainy Creation</h2>
<p>Your OTP Code is:</p>
<h1>$otp</h1>
<p>This OTP will expire in 5 minutes.</p>
";

$mail->send();

echo "OTP_SENT";

}catch(Exception $e){

echo "ERROR";

}

?>