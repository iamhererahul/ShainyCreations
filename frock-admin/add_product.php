<?php

include "./config.php";

/* =========================
   GET FORM DATA
========================= */

$product_name = $_POST['product_name'] ?? '';
$sku = $_POST['sku'] ?? '';
$price = $_POST['price'] ?? 0;
$compare_price = $_POST['compare_price'] ?? 0;
$category = $_POST['category'] ?? '';
$age_group = $_POST['age_group'] ?? '';
$stock_qty = $_POST['stock_qty'] ?? 0;
$description = $_POST['description'] ?? '';
$tags = $_POST['tags'] ?? '';
$status = $_POST['status'] ?? 'Active';

$featured = isset($_POST['featured']) ? 1 : 0;

/* =========================
   IMAGE UPLOAD
========================= */

$upload_dir = "../images/products/";

$image1 = "";
$image2 = "";
$image3 = "";
$image4 = "";

if(isset($_FILES['images']) && !empty($_FILES['images']['name'][0])){

    $total = count($_FILES['images']['name']);

    for($i=0; $i < $total; $i++){

        if($_FILES['images']['name'][$i] != ""){

            $filename = time().'_'.$i.'_'.basename($_FILES['images']['name'][$i]);
            $tmp = $_FILES['images']['tmp_name'][$i];

            move_uploaded_file($tmp, $upload_dir.$filename);

            if($i == 0) $image1 = $filename;
            if($i == 1) $image2 = $filename;
            if($i == 2) $image3 = $filename;
            if($i == 3) $image4 = $filename;

        }

    }

}

/* =========================
   INSERT PRODUCT
========================= */

$sql = "INSERT INTO products 
(
product_name,
sku,
price,
compare_price,
category,
age_group,
stock_qty,
description,
tags,
status,
featured,
image1,
image2,
image3,
image4
)

VALUES
(
'$product_name',
'$sku',
'$price',
'$compare_price',
'$category',
'$age_group',
'$stock_qty',
'$description',
'$tags',
'$status',
'$featured',
'$image1',
'$image2',
'$image3',
'$image4'
)";

mysqli_query($conn,$sql);

/* =========================
   REDIRECT
========================= */

header("Location: ./html/products.php");
exit();

?>