<?php
// backend/messages.php
session_start();
require_once 'db_connect.php';

// Handle POST request (Contact Form - Public)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    $data = json_decode(file_get_contents("php://input"));
    
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $subject = $data->subject ?? '';
    $message = $data->message ?? '';

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, Email, and Message are required']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $email, $subject, $message])) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message']);
    }
    exit;
}

// Check Authentication for Admin actions
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Handle GET request (List Messages - Admin)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM messages ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}
?>
