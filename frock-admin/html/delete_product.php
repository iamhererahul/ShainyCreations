<?php

include("../config.php");

$id = $_GET['id'];

$sql = "DELETE FROM products WHERE id='$id'";

if(mysqli_query($conn,$sql)){
    
    echo "<script>
    alert('Product Deleted Successfully');
    window.location.href='./products.php';
    </script>";

}else{

    echo "Error deleting product";

}

?>