<?php
$host = "localhost";
$db = "a24polmolmun_projecte0";
$user = "a24polmolmun_projecte0";
$pass = "KBHE5?^us[=qP314";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
