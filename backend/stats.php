<?php
// backend/stats.php
require_once 'check_auth.php';
require_once 'db_connect.php';

try {
    // Total Bookings
    $stmt = $conn->query("SELECT COUNT(*) as count FROM bookings");
    $total_bookings = $stmt->fetch()['count'];

    // Pending Bookings
    $stmt = $conn->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    $pending_bookings = $stmt->fetch()['count'];

    // Total Messages
    $stmt = $conn->query("SELECT COUNT(*) as count FROM messages");
    $total_messages = $stmt->fetch()['count'];

    // Total Posts
    $stmt = $conn->query("SELECT COUNT(*) as count FROM blogs");
    $total_blogs = $stmt->fetch()['count'];
    
    // Recent Bookings (Last 5)
    $stmt = $conn->query("SELECT id, customer_name, service_type, booking_date, status FROM bookings ORDER BY created_at DESC LIMIT 5");
    $recent_bookings = $stmt->fetchAll();

    echo json_encode([
        'total_bookings' => $total_bookings,
        'pending_bookings' => $pending_bookings,
        'total_messages' => $total_messages,
        'total_blogs' => $total_blogs,
        'recent_bookings' => $recent_bookings
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
