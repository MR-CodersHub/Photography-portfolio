<?php
require_once 'backend/db_connect.php';

echo "=== Adding Role System to Users Table ===\n\n";

// Add role column
try {
    $conn->exec("ALTER TABLE users ADD COLUMN role VARCHAR(10) DEFAULT 'user'");
    echo "✓ Role column added successfully\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "ℹ Role column already exists\n";
    } else {
        echo "✗ Error: " . $e->getMessage() . "\n";
    }
}

// Set admin role for admin1@gmail.com
echo "\n=== Setting Admin Role ===\n";
$stmt = $conn->prepare("UPDATE users SET role = 'admin' WHERE email = 'admin1@gmail.com'");
if ($stmt->execute()) {
    echo "✓ admin1@gmail.com set as admin\n";
}

// Show all users with roles
echo "\n=== Current Users ===\n";
$stmt = $conn->query("SELECT id, name, email, role FROM users");
$users = $stmt->fetchAll();
foreach ($users as $user) {
    echo "ID: {$user['id']} | {$user['name']} | {$user['email']} | Role: {$user['role']}\n";
}

echo "\n✓ Database setup complete!\n";
?>
