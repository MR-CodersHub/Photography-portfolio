<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Admin Panel</title>
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'includes/header.php'; ?>
        
        <div class="stats-grid">
            <div class="stat-card glass">
                <div class="stat-label">Total Bookings</div>
                <div class="stat-value" id="total_bookings">-</div>
                <i class="fas fa-calendar-check" style="position: absolute; right: 20px; bottom: 20px; font-size: 2.5rem; opacity: 0.1; color: var(--primary-color);"></i>
            </div>
            <div class="stat-card glass">
                <div class="stat-label">Pending Bookings</div>
                <div class="stat-value" id="pending_bookings">-</div>
                <i class="fas fa-clock" style="position: absolute; right: 20px; bottom: 20px; font-size: 2.5rem; opacity: 0.1; color: #ff9800;"></i>
            </div>
            <div class="stat-card glass">
                <div class="stat-label">Messages</div>
                <div class="stat-value" id="total_messages">-</div>
                <i class="fas fa-comments" style="position: absolute; right: 20px; bottom: 20px; font-size: 2.5rem; opacity: 0.1; color: #4a90e2;"></i>
            </div>
             <div class="stat-card glass">
                <div class="stat-label">Blog Posts</div>
                <div class="stat-value" id="total_blogs">-</div>
                <i class="fas fa-pen-nib" style="position: absolute; right: 20px; bottom: 20px; font-size: 2.5rem; opacity: 0.1; color: var(--primary-color);"></i>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; margin-top: 40px;">
            <h3>Recent Bookings</h3>
            <a href="orders.php" class="btn" style="padding: 8px 16px; font-size: 0.8rem; background: rgba(245, 158, 11, 0.1); color: var(--primary-color);">View All</a>
        </div>
        <div class="table-container glass">
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="recent_bookings_table">
                    <tr><td colspan="4">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'Overview';

        async function loadStats() {
            try {
                const response = await fetch('../backend/stats.php');
                const data = await response.json();
                
                document.getElementById('total_bookings').innerText = data.total_bookings;
                document.getElementById('pending_bookings').innerText = data.pending_bookings;
                document.getElementById('total_messages').innerText = data.total_messages;
                document.getElementById('total_blogs').innerText = data.total_blogs;

                const tbody = document.getElementById('recent_bookings_table');
                tbody.innerHTML = '';
                if (data.recent_bookings.length > 0) {
                    data.recent_bookings.forEach(booking => {
                        const tr = document.createElement('tr');
                        const statusColor = booking.status === 'confirmed' ? 'rgba(76, 175, 80, 0.2)' : (booking.status === 'pending' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)');
                        const textColor = booking.status === 'confirmed' ? '#4caf50' : (booking.status === 'pending' ? '#ff9800' : '#f44336');
                        
                        tr.innerHTML = `
                            <td style="font-weight: 600;">${booking.customer_name}</td>
                            <td>${booking.service_type}</td>
                            <td style="color: var(--text-muted);">${booking.booking_date}</td>
                            <td>
                                <span class="badge" style="background: ${statusColor}; color: ${textColor};">
                                    ${booking.status.toUpperCase()}
                                </span>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-muted);">No recent bookings found.</td></tr>';
                }
            } catch (err) {
                console.error(err);
                document.getElementById('recent_bookings_table').innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ff4d4d;">Failed to load data.</td></tr>';
            }
        }

        loadStats();
    </script>
</body>
</html>
