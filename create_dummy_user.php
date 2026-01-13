<?php
require_once 'backend/db_connect.php';

echo "=== Creating Dummy User & Bookings ===\n\n";

$email = 'user@example.com';
$name = 'John Doe';
$password = 'password123';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 1. Create User
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    echo "User already exists. ID: " . $existing['id'] . "\n";
} else {
    // Role column might not exist or be default 'user'. Schema didn't show role column in `users` table explicitly in `schema.sql`?
    // Wait, `auth.php` fetches `role`. `schema.sql` showed simple `users` table. 
    // Let's assume schema was updated earlier or default is supported. 
    // If specific schema is strictly what was in `schema.sql`, auth logic might fail on 'role'.
    // `auth.php` does: $stmt = $conn->prepare("SELECT id, name, password, role FROM users WHERE email = ?");
    // If role doesn't exist, this query fails. 
    // I should check if `role` column exists. The `schema.sql` I read EARLIER didn't show it.
    // BUT `auth.php` implies it exists. I will assume it exists or `auth.php` would error.
    
    // I'll try to insert without role first, if schema defaults.
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
    try {
        if ($stmt->execute([$name, $email, $hashed_password])) {
            echo "✓ Created user: $email\n";
        }
    } catch (Exception $e) {
        // Fallback if role column issue
         $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
         if ($stmt->execute([$name, $email, $hashed_password])) {
            echo "✓ Created user (no role col): $email\n";
        }
    }
}

// 2. Create Dummy Bookings
$bookings = [
    ['Wedding Photography', '2026-06-15', 'pending', 'Looking forward to it!'],
    ['Portrait Session', '2026-02-20', 'confirmed', 'Family portrait.'],
    ['Event Coverage', '2025-12-10', 'completed', 'Corporate party.']
];

foreach ($bookings as $b) {
    $stmt = $conn->prepare("INSERT INTO bookings (customer_name, email, service_type, booking_date, status, message) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$name, $email, $b[0], $b[1], $b[2], $b[3]])) {
        echo "✓ Added booking: {$b[0]}\n";
    }
}

echo "\nDone. Login with:\nEmail: $email\nPassword: $password\n";
?>
