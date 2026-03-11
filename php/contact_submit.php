<?php

include "config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){

$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$sql = "INSERT INTO contact_messages
(first_name,last_name,email,phone,subject,message)
VALUES
('$first_name','$last_name','$email','$phone','$subject','$message')";

$result = mysqli_query($conn,$sql);

if($result){

echo "<script>
alert('Message sent successfully! Our team will contact you soon.');
window.location.href='../contact.html';
</script>";

}else{

echo "Error: " . mysqli_error($conn);

}

}

?>