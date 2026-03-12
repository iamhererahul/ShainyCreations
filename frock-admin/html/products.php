<?php

include("../config.php");

/* ------------------------------
   FILTER CONDITIONS
--------------------------------*/

$where = [];
$order = "ORDER BY id DESC";

/* Status filter (Tabs) */

if(isset($_GET['status']) && $_GET['status'] != "all"){

$status = mysqli_real_escape_string($conn,$_GET['status']);
if(in_array($status, ['Active','Draft','On Hold'])){
$where[] = "status='$status'";
}

}

/* Search filter */

if(isset($_GET['search']) && $_GET['search'] != ""){

$search = mysqli_real_escape_string($conn,$_GET['search']);
$where[] = "product_name LIKE '%$search%'";

}

/* Category filter */

if(isset($_GET['category']) && $_GET['category'] != ""){

$category = mysqli_real_escape_string($conn,$_GET['category']);
$where[] = "category='$category'";

}

/* Sorting */

if(isset($_GET['sort'])){

if($_GET['sort'] == "low"){
$order = "ORDER BY price ASC";
}

if($_GET['sort'] == "high"){
$order = "ORDER BY price DESC";
}

}

/* Combine WHERE */

$where_sql = "";

if(count($where) > 0){
$where_sql = "WHERE ".implode(" AND ",$where);
}


/* ------------------------------
   MAIN PRODUCT QUERY
--------------------------------*/

$sql = "SELECT * FROM products $where_sql $order";
$result = mysqli_query($conn,$sql);


/* ------------------------------
   PRODUCT COUNTS
--------------------------------*/

$total_products = mysqli_num_rows(mysqli_query($conn,"SELECT id FROM products"));

$active_products = mysqli_num_rows(mysqli_query($conn,"SELECT id FROM products WHERE status='Active'"));

$hold_products = mysqli_num_rows(mysqli_query($conn,"SELECT id FROM products WHERE status='On Hold'"));

$draft_products = mysqli_num_rows(mysqli_query($conn,"SELECT id FROM products WHERE status='Draft'"));

?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Shainy Creation – Products</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="stylesheet" href="../css/products.css" />
  </head>
  <body>
    <div id="sidebar-container"></div>
    <div class="main">
      <div id="topbar-container"></div>
      <div class="page-content">
        <div class="page-header">
          <h1 class="page-heading">Products</h1>
          <div style="display: flex; gap: 8px">
            <!-- <button
              class="btn btn-outline btn-sm"
              onclick="openModal('importModal')"
            >
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" /></svg
              >Import
            </button> -->
            <button class="btn btn-primary" onclick="openModal('addProductModal')">
  <svg viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
  Add Product
</button>
          </div>
        </div>

       <div class="tab-nav">

<a href="products.php?status=all">
<button class="tab-btn">All 
<span class="tab-count"><?php echo $total_products; ?></span>
</button>
</a>

<a href="products.php?status=Active">
<button class="tab-btn">Active 
<span class="tab-count"><?php echo $active_products; ?></span>
</button>
</a>

<a href="products.php?status=On Hold">
<button class="tab-btn">On Hold 
<span class="tab-count"><?php echo $hold_products; ?></span>
</button>
</a>

<a href="products.php?status=Draft">
<button class="tab-btn">Draft 
<span class="tab-count"><?php echo $draft_products; ?></span>
</button>
</a>

</div>

       <form method="GET" class="filter-row">

<input
class="filter-input"
type="text"
name="search"
placeholder="Search products..."
value="<?php echo isset($_GET['search']) ? $_GET['search'] : ''; ?>"
>

<select class="filter-select" name="category">

<option value="">All Categories</option>

<option value="Frocks" <?php if(isset($_GET['category']) && $_GET['category']=="Frocks") echo "selected"; ?>>Frocks</option>

<option value="Gowns" <?php if(isset($_GET['category']) && $_GET['category']=="Gowns") echo "selected"; ?>>Gowns</option>

<option value="Tutus" <?php if(isset($_GET['category']) && $_GET['category']=="Tutus") echo "selected"; ?>>Tutus</option>

</select>


<select class="filter-select" name="sort">

<option value="">Newest</option>

<option value="low" <?php if(isset($_GET['sort']) && $_GET['sort']=="low") echo "selected"; ?>>Price: Low-High</option>

<option value="high" <?php if(isset($_GET['sort']) && $_GET['sort']=="high") echo "selected"; ?>>Price: High-Low</option>

</select>

<button type="submit" class="btn btn-primary">Filter</button>

</form>

        <div class="card" style="padding: 0">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="prod-select-all"
                      onchange="selectAllProducts(this)"
                    />
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                    <th>Age grp</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="products-table-body">

<?php

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_assoc($result)){

?>

<tr>

<td>
<input type="checkbox" class="product-checkbox" value="<?php echo $row['id']; ?>" onchange="toggleBulkActions()">
</td>

<td>
<div style="display:flex;align-items:center;gap:10px">

<img src="../images/products/<?php echo $row['image1'] ? $row['image1'] : 'no-image.png'; ?>" style="width:45px;height:45px;object-fit:cover;border-radius:6px;">

<div>

<strong><?php echo $row['product_name']; ?></strong>

<br>

<span class="text-soft text-sm">
<?php echo $row['category']; ?>
</span>

</div>

</div>
</td>

<td>
<?php echo $row['sku']; ?>
</td>

<td>
₹<?php echo $row['price']; ?>
</td>

<td>
<?php echo $row['stock_qty']; ?>
</td>

<td>

<?php

$status = $row['status'];

if($status == "Active"){
echo "<span class='badge badge-success'>Active</span>";
}

if($status == "Draft"){
echo "<span class='badge badge-warning'>Draft</span>";
}

if($status == "On Hold"){
echo "<span class='badge badge-danger'>On Hold</span>";
}

?>

</td>
<td>
<?php echo $row['age_group']; ?>
</td>
<td>
<?php echo $row['category']; ?>
</td>

<td>

<button class="btn btn-outline btn-sm" onclick="editProduct(<?php echo $row['id']; ?>)">Edit</button>

<button class="btn btn-danger btn-sm" onclick="deleteProduct(<?php echo $row['id']; ?>)">Delete</button>
</td>

</tr>

<?php

}

}else{

echo "<tr><td colspan='9'>No Products Found</td></tr>";

}

?>

</tbody>
            </table>
          </div>
        </div>

        <div class="table-footer">
          <div id="bulk-actions" class="bulk-actions" style="display: none">
            <button class="btn btn-outline btn-sm" onclick="bulkAction('hide')">
              Draft Selected
            </button>
            <button class="btn btn-outline btn-sm" onclick="bulkAction('show')">
              Active Selected
            </button>
            <button
              class="btn btn-danger btn-sm"
              onclick="bulkAction('remove')"
            >
              Delete Selected
            </button>
          </div>
          <span id="prod-count"><?php echo $total_products; ?> products total</span>
        </div>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div class="modal-overlay" id="addProductModal">
      <div class="modal modal-xl">
        <form
          action="../add_product.php"
          method="POST"
          enctype="multipart/form-data"
        >
          <div class="modal-header">
            <div class="modal-title" id="product-modal-title">
              Add New Product
            </div>
            <button
              class="modal-close"
              type="button"
              onclick="closeModal('addProductModal')"
            >
              ×
            </button>
          </div>

          <div class="modal-body">
            <input type="hidden" id="edit-prod-id" name="edit_prod_id" />

            <div class="form-2col">
              <div class="form-group">
                <label class="form-label">Product Name *</label>
                <input
                  class="form-input"
                  id="new-prod-name"
                  name="product_name"
                  placeholder="e.g. Rosabay Belle Frock"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">SKU</label>
                <input
                  class="form-input"
                  id="new-prod-sku"
                  name="sku"
                  placeholder="SC-RBF-001"
                  required
                />
              </div>
            </div>

            <div class="form-2col">
              <div class="form-group">
                <label class="form-label">Price (₹) *</label>
                <input
                  class="form-input"
                  id="new-prod-price"
                  name="price"
                  type="number"
                  placeholder="1680"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Compare At Price (₹)</label>
                <input
                  class="form-input"
                  id="new-prod-compare"
                  name="compare_price"
                  type="number"
                  placeholder="2100"
                />
              </div>
            </div>

            <div class="form-3col">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" id="new-prod-cat" name="category">
                  <option>Frocks</option>
                  <option>Gowns</option>
                  <option>Tutus</option>
                  <option>Sets</option>
                </select>
              
              </div>

              <div class="form-group">
                <label class="form-label">Age Group</label>
                <select class="form-select" id="new-prod-age" name="age_group" required>
                  <option>0–1 Yrs</option>
                  <option>1–3 Yrs</option>
                  <option>3–6 Yrs</option>
                  <option>6–10 Yrs</option>
                  <option>10–14 Yrs</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Stock Qty</label>
                <input
                  class="form-input"
                  id="new-prod-stock"
                  name="stock_qty"
                  type="number"
                  placeholder="50"
                  required

                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                class="form-textarea"
                id="new-prod-desc"
                name="description"
                required
                placeholder="Describe the product…"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Tags (comma-separated)</label>
              <input
                class="form-input"
                id="new-prod-tags"
                name="tags"
                placeholder="princess, birthday, pink, cotton"
                required

              />
            </div>

            <div class="form-2col">
              <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="new-prod-status" name="status" required>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Featured</label>

                <div class="toggle-wrap" style="margin-top: 10px">
                  <label class="toggle">
                    <input
                      type="checkbox"
                      id="new-prod-featured"
                      name="featured"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span style="font-size: 12px">Show as featured product</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label"
                >Product Images
                <span class="text-soft"
                  >(images managed via Content Library)</span
                ></label
              >

              <div
                class="upload-zone"
                id="prod-upload-zone"
                onclick="triggerUpload('prod-file-input')"
              >
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>

                <p>Drag & drop images here or <strong>browse files</strong></p>
                <p style="font-size: 10px; margin-top: 4px">
                  PNG, JPG up to 10MB
                </p>
              </div>

              <input
                type="file"
                name="images[]"
                id="prod-file-input"
                multiple
                accept="image/*"
                style="display: none"
                onchange="handleProductImages(this)"
              />

              <div id="prod-image-preview" class="image-preview-row"></div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-outline"
              type="button"
              onclick="closeModal('addProductModal')"
            >
              Cancel
            </button>
            <button class="btn btn-primary" type="submit">Save Product</button>
          </div>
        </form>
      </div>
    </div>

    <div class="toast" id="toast">
      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg
      ><span id="toast-msg">Done!</span>
    </div>

    <script src="../js/data.js"></script>
    <script src="../js/components.js"></script>
    <script src="../js/products.js"></script>
   <script>

// ------------------------------
// DELETE PRODUCT
// ------------------------------
function deleteProduct(id){

if(confirm("Are you sure you want to delete this product?")){
window.location.href = "./delete_product.php?id=" + id;
}

}

// ------------------------------
// EDIT PRODUCT
// ------------------------------
function editProduct(id){

window.location.href = "edit_product.php?id=" + id;

}

// ------------------------------
// IMAGE PREVIEW BEFORE UPLOAD
// ------------------------------
function handleProductImages(input){

const preview = document.getElementById("prod-image-preview");
preview.innerHTML = "";

const files = input.files;

for(let i = 0; i < files.length; i++){

let reader = new FileReader();

reader.onload = function(e){

let div = document.createElement("div");

div.style.width = "80px";
div.style.height = "80px";
div.style.marginRight = "8px";
div.style.position = "relative";

div.innerHTML = `
<img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border:1px solid #ccc;border-radius:4px;">
`;

preview.appendChild(div);

};

reader.readAsDataURL(files[i]);

}

}

// ------------------------------
// SELECT ALL PRODUCTS
// ------------------------------
function selectAllProducts(source){

let checkboxes = document.querySelectorAll(".product-checkbox");

checkboxes.forEach(function(cb){

cb.checked = source.checked;

});

toggleBulkActions();

}

// ------------------------------
// SHOW / HIDE BULK ACTIONS
// ------------------------------
function toggleBulkActions(){

let checked = document.querySelectorAll(".product-checkbox:checked");
let bulk = document.getElementById("bulk-actions");

if(checked.length > 0){
bulk.style.display = "flex";
}else{
bulk.style.display = "none";
}

}

// ------------------------------
// BULK ACTION (HIDE / SHOW / DELETE)
// ------------------------------
function bulkAction(action){

let selected = [];

document.querySelectorAll(".product-checkbox:checked").forEach(function(cb){

selected.push(cb.value);

});

if(selected.length === 0){

alert("Please select products first.");
return;

}

if(!confirm("Are you sure you want to perform this action?")){
return;
}

window.location.href = "bulk_products.php?action=" + action + "&ids=" + selected.join(",");

}

</script>
  </body>
</html>
