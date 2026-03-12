<?php

include("../config.php");

if(isset($_GET['action']) && isset($_GET['ids'])){

$action = $_GET['action'];
$ids = $_GET['ids'];

/* Convert ids into array */

$id_array = explode(",", $ids);

/* Make safe integer list */

$clean_ids = [];

foreach($id_array as $id){
$clean_ids[] = intval($id);
}

$id_list = implode(",", $clean_ids);

/* BULK HIDE */

if($action == "hide"){

mysqli_query($conn,"UPDATE products SET status='Draft' WHERE id IN ($id_list)");

}

/* BULK SHOW */

if($action == "show"){

mysqli_query($conn,"UPDATE products SET status='Active' WHERE id IN ($id_list)");

}

/* BULK DELETE */

if($action == "remove"){

mysqli_query($conn,"DELETE FROM products WHERE id IN ($id_list)");

}

}

/* Redirect back */

header("Location: products.php");
exit();

?>