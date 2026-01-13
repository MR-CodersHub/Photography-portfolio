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
    <title>Users - Admin Panel</title>
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'includes/header.php'; ?>

        <div class="table-container glass">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="users_table">
                    <tr><td colspan="5">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'User Management';

        async function loadUsers() {
            const response = await fetch('../backend/users.php');
            const users = await response.json();
            const tbody = document.getElementById('users_table');
            tbody.innerHTML = '';
            
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.created_at}</td>
                    <td>
                        <button class="btn" style="background: #f44336; color: white; padding: 5px 10px;" onclick="deleteUser(${user.id})">
                             <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        async function deleteUser(id) {
            if(!confirm('Are you sure you want to delete this user?')) return;
            
            const response = await fetch('../backend/users.php?action=delete', {
                method: 'POST',
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if(result.success) loadUsers();
            else alert(result.error);
        }

        loadUsers();
    </script>
</body>
</html>
