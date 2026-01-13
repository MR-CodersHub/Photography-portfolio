<?php
// backend/users.php
require_once 'check_auth.php';
require_once 'db_connect.php';

// Handle GET request (List Users)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    // Prevent deleting self (simple check)
    if ($id == $_SESSION['user_id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Cannot delete yourself']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true]);
    } else {
         http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user']);
    }
    exit;
}
?>
