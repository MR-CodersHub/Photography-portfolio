<?php
// backend/auth.php
session_start();
require_once 'db_connect.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $password = $data->password ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashed_password])) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents("php://input"));
    $email = $data->email ?? '';
    $password = $data->password ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and Password are required']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $email;
        $_SESSION['user_role'] = $user['role'] ?? 'user';
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful',
            'role' => $_SESSION['user_role']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    exit;
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'check') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'authenticated' => true, 
            'user' => $_SESSION['user_name'],
            'role' => $_SESSION['user_role'] ?? 'user'
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit;
}
?>
