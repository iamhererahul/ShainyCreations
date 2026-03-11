<?php

include "config.php";

if(isset($_POST['submit_franchise'])){

$full_name = $_POST['full_name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$city = $_POST['city'];
$space_available = $_POST['space_available'];
$business_background = $_POST['business_background'];

$sql = "INSERT INTO franchise_applications
(full_name,phone,email,city,space_available,business_background)
VALUES
('$full_name','$phone','$email','$city','$space_available','$business_background')";

$query = mysqli_query($conn,$sql);

if($query){

echo "<script>
alert('Application Submitted Successfully! Our team will contact you soon.');
window.location.href='../franchise.html';
</script>";

}else{

echo "Error: " . mysqli_error($conn);

}

}

?>