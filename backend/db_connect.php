<?php
// backend/db_connect.php

$host = 'localhost';
$db_name = 'photography_portfolio';
$username = 'root'; // Update with your DB username
$password = ''; // Update with your DB password

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Set default fetch mode to associative array
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => "Connection failed: " . $e->getMessage()]);
    die();
}
?>
