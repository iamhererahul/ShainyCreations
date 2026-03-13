<?php
session_start();

$phone=$_POST['phone'];

$otp=rand(100000,999999);

$_SESSION['phone_otp']=$otp;

$message="Your OTP is ".$otp;

$apiKey="YOUR_FAST2SMS_API_KEY";

$url="https://www.fast2sms.com/dev/bulkV2?authorization=$apiKey&sender_id=FSTSMS&message=$message&language=english&route=q&numbers=$phone";

file_get_contents($url);

echo "sent";
?>