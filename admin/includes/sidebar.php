<div class="sidebar">
    <div class="brand">
        <i class="fas fa-camera" style="margin-right: 8px;"></i>Lumina Studio
    </div>
    <ul class="nav-links">
        <li><a href="dashboard.php" id="nav-dashboard"><i class="fas fa-th-large"></i> Dashboard</a></li>
        <li><a href="users.php" id="nav-users"><i class="fas fa-users"></i> Users</a></li>
        <li><a href="orders.php" id="nav-orders"><i class="fas fa-calendar-alt"></i> Bookings</a></li>
        <li><a href="messages.php" id="nav-messages"><i class="fas fa-envelope"></i> Messages</a></li>
        <li><a href="blogs.php" id="nav-blogs"><i class="fas fa-blog"></i> Blogs</a></li>
        <li><a href="gallery.php" id="nav-gallery"><i class="fas fa-images"></i> Gallery</a></li>
        <li><a href="#" onclick="handleLogout(event)" style="margin-top: 20px; color: var(--text-muted);"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    </ul>
</div>

<script>
    // Highlight active link query
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const navId = 'nav-' + (page.replace('.php', '') || 'dashboard');
    const el = document.getElementById(navId);
    if(el) el.classList.add('active');

    async function handleLogout(e) {
        if(e) e.preventDefault();
        try {
            await fetch('../backend/auth.php?action=logout');
            window.location.href = '../index.html';
        } catch (err) {
            console.error('Logout failed:', err);
            // Force redirect even if fetch fails
            window.location.href = '../index.html';
        }
    }
</script>
