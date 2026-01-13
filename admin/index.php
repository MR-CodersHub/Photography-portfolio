<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Photography Portfolio</title>
    <link rel="stylesheet" href="css/admin.css">
    <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; }
    </style>
</head>
<body class="login-body">
    <div class="login-card glass">
        <h2 style="text-align: center; margin-bottom: 20px;">Admin Login</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            <p id="errorMsg" style="color: #ff6b6b; margin-top: 15px; text-align: center; display: none;"></p>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            try {
                const response = await fetch('../backend/auth.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    window.location.href = 'dashboard.php';
                } else {
                    errorMsg.innerText = result.error || 'Login failed';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Network error occurred.';
                errorMsg.style.display = 'block';
            }
        });

        // Check if already logged in
        (async () => {
             const resp = await fetch('../backend/auth.php?action=check');
             const data = await resp.json();
             if(data.authenticated) window.location.href = 'dashboard.php';
        })();
    </script>
</body>
</html>
