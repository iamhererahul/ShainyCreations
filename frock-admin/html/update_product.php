<?php

include("../config.php");

$id = $_POST['id'];
$name = $_POST['product_name'];
$sku = $_POST['sku'];
$price = $_POST['price'];
$compare = $_POST['compare_price'];
$category = $_POST['category'];
$age = $_POST['age_group'];
$stock = $_POST['stock_qty'];
$status = $_POST['status'];
$desc = $_POST['description'];

if($_FILES['image1']['name']!=""){

$image = $_FILES['image1']['name'];
$tmp = $_FILES['image1']['tmp_name'];

move_uploaded_file($tmp,"../images/products/".$image);

$sql="UPDATE products SET

product_name='$name',
sku='$sku',
price='$price',
compare_price='$compare',
category='$category',
age_group='$age',
stock_qty='$stock',
status='$status',
description='$desc',
image1='$image'

WHERE id='$id'";

}else{

$sql="UPDATE products SET

product_name='$name',
sku='$sku',
price='$price',
compare_price='$compare',
category='$category',
age_group='$age',
stock_qty='$stock',
status='$status',
description='$desc'

WHERE id='$id'";

}

mysqli_query($conn,$sql);

header("Location: products.php");

?>