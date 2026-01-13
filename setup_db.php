<?php
// setup_db.php

$host = 'localhost';
$username = 'root';
$password = '';

try {
    // 1. Connect to MySQL Server (no DB selected)
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to MySQL server successfully.<br>";

    // 2. Create Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS photography_portfolio");
    echo "Database 'photography_portfolio' created or already exists.<br>";

    // 3. Connect to the Database
    $pdo->exec("USE photography_portfolio");

    // 4. Create Tables
    
    // Users Table
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_users);
    echo "Table 'users' created.<br>";

    // Bookings Table
    $sql_bookings = "CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        service_type VARCHAR(50),
        booking_date DATE,
        message TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_bookings);
    echo "Table 'bookings' created.<br>";

    // Messages Table
    $sql_messages = "CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(150),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_messages);
    echo "Table 'messages' created.<br>";

    // Blogs Table
    $sql_blogs = "CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        image VARCHAR(255),
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql_blogs);
    echo "Table 'blogs' created.<br>";

    // Gallery Table
    $sql_gallery = "CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150),
        category VARCHAR(50),
        image_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_gallery);
    echo "Table 'gallery' created.<br>";

    // Analytics Table
    $sql_analytics = "CREATE TABLE IF NOT EXISTS analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_url VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_analytics);
    echo "Table 'analytics' created.<br>";

    // 5. Insert Default Users
    // Admin
    $admin_email = 'admin1@gmail.com';
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$admin_email]);
    if ($stmt->fetchColumn() == 0) {
        $password = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')");
        $stmt->execute(['Admin', $admin_email, $password]);
        echo "Default Admin user created (admin1@gmail.com / admin123).<br>";
    }

    // Regular User (for testing)
    $user_email = 'user@example.com';
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$user_email]);
    if ($stmt->fetchColumn() == 0) {
        $password = password_hash('password123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->execute(['Test User', $user_email, $password]);
        echo "Default Test user created (user@example.com / password123).<br>";
    }
    
    // 6. Insert Dummy Bookings for Test User
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM bookings WHERE email = ?");
    $stmt->execute([$user_email]);
    if ($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO bookings (customer_name, email, service_type, booking_date, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Test User', $user_email, 'Portrait Session', date('Y-m-d', strtotime('+1 week')), 'confirmed']);
        $stmt->execute(['Test User', $user_email, 'Wedding Photography', date('Y-m-d', strtotime('+1 month')), 'pending']);
        echo "Dummy bookings created for test user.<br>";
    }

    echo "<h1>Database Setup Complete!</h1>";
    echo "<p>You can now go back to <a href='signin.html'>Sign In</a>.</p>";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
