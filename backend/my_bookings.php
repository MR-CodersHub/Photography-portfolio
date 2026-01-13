<?php
// backend/my_bookings.php
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$email = $_SESSION['user_email'];

try {
    $stmt = $conn->prepare("SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC");
    $stmt->execute([$email]);
    $bookings = $stmt->fetchAll();

    echo json_encode($bookings);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch bookings']);
}
?>
