<div class="header">
    <div class="page-title" id="page-title">My Dashboard</div>
    <div class="user-profile">
        <i class="fas fa-user-circle" style="font-size: 1.2rem; color: var(--primary-color);"></i>
        <span id="user-name">Loading...</span>
    </div>
</div>

<script>
    (async () => {
        const resp = await fetch('../backend/auth.php?action=check');
        const data = await resp.json();
        if(data.authenticated) {
            document.getElementById('user-name').innerText = data.user;
        } else {
             window.location.href = '../signin.html';
        }
    })();
</script>
