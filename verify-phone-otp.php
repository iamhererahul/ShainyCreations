<?php
session_start();

$user_otp=$_POST['otp'];

if($user_otp==$_SESSION['phone_otp']){
echo "success";
}else{
echo "fail";
}
?>