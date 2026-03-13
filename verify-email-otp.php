<?php

session_start();

$user_otp = $_POST['otp'];

if(isset($_SESSION['email_otp']) && $user_otp == $_SESSION['email_otp']){

echo "VERIFIED";

}else{

echo "INVALID";

}

?>