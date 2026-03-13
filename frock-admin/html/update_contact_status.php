<?php

include("../config.php");

if(isset($_POST['id']) && isset($_POST['status'])){

$id = intval($_POST['id']);
$status = mysqli_real_escape_string($conn,$_POST['status']);

$sql = "UPDATE contact_messages SET status='$status' WHERE id='$id'";

if(mysqli_query($conn,$sql)){
echo "success";
}else{
echo "db_error";
}

}else{
echo "invalid";
}

?>