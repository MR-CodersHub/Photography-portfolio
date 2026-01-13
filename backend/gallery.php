<?php
// backend/gallery.php
// backend/gallery.php
require_once 'db_connect.php';
session_start();

$uploadDir = '../uploads/';

// Handle GET request (List Gallery)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM gallery ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// Handle POST request (Upload Image)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    $title = $_POST['title'] ?? '';
    $category = $_POST['category'] ?? '';

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Image file is required']);
        exit;
    }

    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));
    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

    if (move_uploaded_file($fileTmpPath, $uploadDir . $newFileName)) {
        $imagePath = 'uploads/' . $newFileName;
        $stmt = $conn->prepare("INSERT INTO gallery (title, category, image_path) VALUES (?, ?, ?)");
        if ($stmt->execute([$title, $category, $imagePath])) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save to database']);
        }
    } else {
         http_response_code(500);
         echo json_encode(['error' => 'Failed to move uploaded file']);
    }
    exit;
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM gallery WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true]);
    } else {
         http_response_code(500);
        echo json_encode(['error' => 'Failed to delete image']);
    }
    exit;
}
?>
