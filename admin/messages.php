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
    <title>Messages - Admin Panel</title>
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody id="messages_table">
                    <tr><td colspan="5">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'Messages / Enquiries';

        async function loadMessages() {
            const response = await fetch('../backend/messages.php');
            const data = await response.json();
            const tbody = document.getElementById('messages_table');
            tbody.innerHTML = '';
            
            data.forEach(msg => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${msg.created_at}</td>
                    <td>${msg.name}</td>
                    <td>${msg.email}</td>
                    <td>${msg.subject}</td>
                    <td>${msg.message}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        loadMessages();
    </script>
</body>
</html>
