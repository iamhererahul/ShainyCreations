<?php
include "../config.php";

if(isset($_POST['id']) && isset($_POST['status'])){

$id = $_POST['id'];
$status = $_POST['status'];

$query = "UPDATE franchise_applications SET status='$status' WHERE id='$id'";
$result = mysqli_query($conn,$query);

if($result){
echo "success";
}else{
echo "error";
}

}
?>