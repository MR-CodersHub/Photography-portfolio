<?php
require_once 'backend/db_connect.php';

echo "=== Creating New Admin User ===\n\n";

$email = 'admin1@gmail.com';
$name = 'Admin';
$password = 'admin123';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    // Update existing user
    echo "User already exists. Updating password...\n";
    $stmt = $conn->prepare("UPDATE users SET password = ?, name = ? WHERE email = ?");
    if ($stmt->execute([$hashed_password, $name, $email])) {
        echo "✓ Password updated successfully!\n";
    }
} else {
    // Create new user
    echo "Creating new admin user...\n";
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashed_password])) {
        echo "✓ New admin user created successfully!\n";
    }
}

echo "\n=== Login Credentials ===\n";
echo "Email: $email\n";
echo "Password: $password\n";
echo "\nYou can now log in at: http://localhost/Photography%20Portfolio/admin/index.php\n";
?>
