<div class="sidebar">
    <div class="brand">
        <i class="fas fa-camera" style="margin-right: 8px;"></i>Lumina User
    </div>
    <ul class="nav-links">
        <li><a href="dashboard.php" id="nav-dashboard"><i class="fas fa-th-large"></i> Dashboard</a></li>
        <li><a href="../index.html"><i class="fas fa-home"></i> Back to Home</a></li>
        <li><a href="#" onclick="logout()" style="margin-top: 20px; color: var(--text-muted);"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    </ul>
</div>

<script>
    // Highlight active link query
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const navId = 'nav-' + (page.replace('.php', '') || 'dashboard');
    const el = document.getElementById(navId);
    if(el) el.classList.add('active');

    async function logout() {
        await fetch('../backend/auth.php?action=logout');
        window.location.href = '../index.html';
    }
</script>
