<?php
// backend/bookings.php
session_start();
require_once 'db_connect.php';

// Handle POST request (Create Booking - Public)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    $data = json_decode(file_get_contents("php://input"));
    
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $phone = $data->phone ?? '';
    $service = $data->service ?? '';
    $date = $data->date ?? '';
    $message = $data->message ?? '';

    if (empty($name) || empty($email) || empty($service)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, Email, and Service are required']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO bookings (customer_name, email, phone, service_type, booking_date, message) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$name, $email, $phone, $service, $date, $message])) {
        echo json_encode(['success' => true, 'message' => 'Booking request sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create booking']);
    }
    exit;
}

// Check Authentication for Admin actions
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Handle GET request (List Bookings - Admin)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM bookings ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// Handle PUT/POST Update Status (Admin)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_status') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? null;
    $status = $data->status ?? '';

    if (!$id || !$status) {
        http_response_code(400);
        echo json_encode(['error' => 'ID and Status are required']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    if ($stmt->execute([$status, $id])) {
        echo json_encode(['success' => true]);
    } else {
         http_response_code(500);
        echo json_encode(['error' => 'Failed to update status']);
    }
    exit;
}
?>
