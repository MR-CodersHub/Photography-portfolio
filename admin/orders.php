<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookings - Admin Panel</title>
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'includes/header.php'; ?>

        <div class="table-container glass">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Email/Phone</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="bookings_table">
                    <tr><td colspan="7">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'Bookings Management';

        async function loadBookings() {
            const response = await fetch('../backend/bookings.php');
            const data = await response.json();
            const tbody = document.getElementById('bookings_table');
            tbody.innerHTML = '';
            
            data.forEach(booking => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${booking.booking_date}</td>
                    <td>${booking.customer_name}</td>
                    <td>${booking.service_type}</td>
                    <td>${booking.email}<br>${booking.phone}</td>
                    <td>${booking.message}</td>
                    <td>
                        <span style="font-weight: bold; color: ${getColor(booking.status)}">
                            ${booking.status.toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <select onchange="updateStatus(${booking.id}, this.value)" style="padding: 5px; border-radius: 4px;">
                            <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirm</option>
                            <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Complete</option>
                            <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancel</option>
                        </select>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function getColor(status) {
            if(status === 'confirmed') return '#4caf50';
            if(status === 'pending') return '#ff9800';
            if(status === 'cancelled') return '#f44336';
            return '#2196f3';
        }

        async function updateStatus(id, newStatus) {
            const response = await fetch('../backend/bookings.php?action=update_status', {
                method: 'POST',
                body: JSON.stringify({ id: id, status: newStatus })
            });
            const result = await response.json();
            if(result.success) loadBookings();
            else alert('Failed to update status');
        }

        loadBookings();
    </script>
</body>
</html>
