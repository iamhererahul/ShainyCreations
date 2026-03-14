<?php

session_start();

if(!isset($_POST['otp'])){
echo "INVALID";
exit;
}

$user_otp = trim($_POST['otp']);

if(isset($_SESSION['email_otp']) && $user_otp == $_SESSION['email_otp']){

echo "VERIFIED";

}else{

echo "INVALID";

}

?>