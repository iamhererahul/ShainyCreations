<?php

/* DATABASE CONNECTION */

/* Change these according to your server */

$host = "localhost";      // database host
$user = "root";           // database username
$password = "";           // database password
$database = "shainy_creations";   // database name


/* CONNECT DATABASE */

$conn = mysqli_connect($host,$user,$password,$database);


/* CHECK CONNECTION */

if(!$conn){

die("Database Connection Failed : " . mysqli_connect_error());

}


/* SET UTF8 */

mysqli_set_charset($conn,"utf8");

?>