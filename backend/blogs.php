<?php
// backend/blogs.php
// backend/blogs.php
require_once 'db_connect.php';
session_start();

$uploadDir = '../uploads/';

// Handle GET request (List Blogs or Single Blog)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM blogs WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch());
    } else {
        $stmt = $conn->query("SELECT * FROM blogs ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
    }
    exit;
}

// Handle POST request (Create/Update Blog)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $id = $_POST['id'] ?? null;
    $currImage = $_POST['current_image'] ?? '';

    if (empty($title) || empty($content)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and Content are required']);
        exit;
    }

    $imagePath = $currImage;

    // Handle File Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

        if (move_uploaded_file($fileTmpPath, $uploadDir . $newFileName)) {
            $imagePath = 'uploads/' . $newFileName;
        } else {
             http_response_code(500);
             echo json_encode(['error' => 'Failed to move uploaded file']);
             exit;
        }
    }

    if ($id) {
        // Update
        $stmt = $conn->prepare("UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?");
        if ($stmt->execute([$title, $content, $imagePath, $id])) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update blog']);
        }
    } else {
        // Create
        // Generate simple slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));

        $stmt = $conn->prepare("INSERT INTO blogs (title, slug, content, image, author_id) VALUES (?, ?, ?, ?, ?)");
        if ($stmt->execute([$title, $slug, $content, $imagePath, $_SESSION['user_id']])) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create blog']);
        }
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

    $stmt = $conn->prepare("DELETE FROM blogs WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => true]);
    } else {
         http_response_code(500);
        echo json_encode(['error' => 'Failed to delete blog']);
    }
    exit;
}
?>
