<?php

session_start();

require __DIR__.'/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if(!isset($_POST['email'])){
exit("No email received");
}

$email = $_POST['email'];

$otp = rand(100000,999999);

$_SESSION['email_otp'] = $otp;

$mail = new PHPMailer(true);

try{

$mail->isSMTP();

$mail->Host = 'smtp.gmail.com';

$mail->SMTPAuth = true;

$mail->Username = 'jrsoni645@gmail.com';

$mail->Password = 'tsoa jqre xyox eaqf';

$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

$mail->Port = 587;

$mail->setFrom('jrsoni645@gmail.com','Shainy Creation');

$mail->addAddress($email);

$mail->isHTML(true);

$mail->Subject = "Shainy Creation - Email Verification OTP";

$mail->Body = "
<h2>Email Verification</h2>
<p>Your OTP code is:</p>
<h1 style='letter-spacing:4px'>$otp</h1>
<p>This OTP will expire in 5 minutes.</p>
";

$mail->send();

echo "OTP_SENT";

}
catch(Exception $e){

echo "ERROR";

}