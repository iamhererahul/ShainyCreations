<?php
include("../config.php");

$id = $_GET['id'];

$sql = "SELECT * FROM products WHERE id='$id'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Edit Product</title>

<style>

body{
font-family:Arial;
background:#f5f6fa;
padding:40px;
}

.container{
max-width:900px;
margin:auto;
background:white;
padding:30px;
border-radius:8px;
box-shadow:0 4px 10px rgba(0,0,0,0.1);
}

h2{
margin-bottom:20px;
}

.form-row{
display:flex;
gap:20px;
margin-bottom:15px;
}

.form-group{
flex:1;
display:flex;
flex-direction:column;
}

label{
font-weight:600;
margin-bottom:5px;
}

input, select, textarea{
padding:10px;
border:1px solid #ccc;
border-radius:5px;
font-size:14px;
}

textarea{
resize:none;
height:80px;
}

button{
background:#0075ff;
color:white;
border:none;
padding:12px 20px;
border-radius:5px;
cursor:pointer;
}

button:hover{
background:#005ed6;
}

.preview{
display:flex;
gap:10px;
margin-top:10px;
}

.preview img{
width:80px;
border-radius:5px;
border:1px solid #ddd;
}

</style>
</head>

<body>

<div class="container">

<h2>Edit Product</h2>

<form action="update_product.php" method="POST" enctype="multipart/form-data">

<input type="hidden" name="id" value="<?php echo $row['id']; ?>">

<!-- Name + SKU -->
<div class="form-row">

<div class="form-group">
<label>Product Name</label>
<input type="text" name="product_name" value="<?php echo $row['product_name']; ?>" required>
</div>

<div class="form-group">
<label>SKU</label>
<input type="text" name="sku" value="<?php echo $row['sku']; ?>">
</div>

</div>

<!-- Price -->
<div class="form-row">

<div class="form-group">
<label>Price</label>
<input type="number" name="price" value="<?php echo $row['price']; ?>">
</div>

<div class="form-group">
<label>Compare Price</label>
<input type="number" name="compare_price" value="<?php echo $row['compare_price']; ?>">
</div>

</div>

<!-- Category -->
<div class="form-row">

<div class="form-group">
<label>Category</label>

<select name="category">

<option <?php if($row['category']=="Frocks") echo "selected"; ?>>Frocks</option>
<option <?php if($row['category']=="Gowns") echo "selected"; ?>>Gowns</option>
<option <?php if($row['category']=="Tutus") echo "selected"; ?>>Tutus</option>
<option <?php if($row['category']=="Sets") echo "selected"; ?>>Sets</option>

</select>

</div>

<div class="form-group">
<label>Age Group</label>

<select name="age_group">

<option <?php if($row['age_group']=="0–1 Yrs") echo "selected"; ?>>0–1 Yrs</option>
<option <?php if($row['age_group']=="1–3 Yrs") echo "selected"; ?>>1–3 Yrs</option>
<option <?php if($row['age_group']=="3–6 Yrs") echo "selected"; ?>>3–6 Yrs</option>
<option <?php if($row['age_group']=="6–10 Yrs") echo "selected"; ?>>6–10 Yrs</option>
<option <?php if($row['age_group']=="10–14 Yrs") echo "selected"; ?>>10–14 Yrs</option>

</select>

</div>

</div>

<!-- Stock + Status -->
<div class="form-row">

<div class="form-group">
<label>Stock Qty</label>
<input type="number" name="stock_qty" value="<?php echo $row['stock_qty']; ?>">
</div>

<div class="form-group">
<label>Status</label>

<select name="status">

<option <?php if($row['status']=="Active") echo "selected"; ?>>Active</option>
<option <?php if($row['status']=="Draft") echo "selected"; ?>>Draft</option>
<option <?php if($row['status']=="On Hold") echo "selected"; ?>>On Hold</option>

</select>

</div>

</div>

<!-- Description -->
<div class="form-group">

<label>Description</label>

<textarea name="description"><?php echo $row['description']; ?></textarea>

</div>

<!-- Current Images -->
<div class="form-group">

<label>Current Images</label>

<div class="preview">

<?php if($row['image1']){ ?>
<img src="../images/products/<?php echo $row['image1']; ?>">
<?php } ?>

<?php if($row['image2']){ ?>
<img src="../images/products/<?php echo $row['image2']; ?>">
<?php } ?>

<?php if($row['image3']){ ?>
<img src="../images/products/<?php echo $row['image3']; ?>">
<?php } ?>

<?php if($row['image4']){ ?>
<img src="../images/products/<?php echo $row['image4']; ?>">
<?php } ?>

</div>

</div>

<!-- Upload New Images -->
<div class="form-group">

<label>Upload New Images</label>

<input type="file" name="images[]" multiple>

</div>

<br>

<button type="submit">Update Product</button>

</form>

</div>

</body>
</html>