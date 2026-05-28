// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Sidebar Toggle
window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Auto-close sidebar on link click (for mobile)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                if (sidebar) sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
});

// Logout
window.logout = () => {
    localStorage.clear();
    window.location.replace('../signin.html');
}

function loadStats() {
    // Professional Mock Data for Admin Dashboard
    const mockStats = {
        bookingCount: 142,
        pendingCount: 8,
        messageCount: 15,
        blogCount: 24
    };

    const mockRecentBookings = [
        {
            customer_name: 'Isabella Rossi',
            email: 'isa.rossi@example.com',
            service_type: 'Luxury Wedding Coverage',
            booking_date: '2026-06-15',
            status: 'pending'
        },
        {
            customer_name: 'Chen Wei',
            email: 'chen.design@example.com',
            service_type: 'Corporate Rebranding',
            booking_date: '2026-04-20',
            status: 'confirmed'
        },
        {
            customer_name: 'Marcus Thorne',
            email: 'm.thorne@estate.com',
            service_type: 'Real Estate Drone',
            booking_date: '2026-04-05',
            status: 'confirmed'
        },
        {
            customer_name: 'Sarah Jenkins',
            email: 's.jenk@style.co',
            service_type: 'Fashion Campaign',
            booking_date: '2026-05-10',
            status: 'completed'
        },
        {
            customer_name: 'Elena & Lucas',
            email: 'e_l_weddings@example.com',
            service_type: 'Engagement Session',
            booking_date: '2026-03-30',
            status: 'pending'
        }
    ];

    // Update UI Stats
    if (document.getElementById('total_bookings')) document.getElementById('total_bookings').innerText = mockStats.bookingCount;
    if (document.getElementById('pending_bookings')) document.getElementById('pending_bookings').innerText = mockStats.pendingCount;
    if (document.getElementById('total_messages')) document.getElementById('total_messages').innerText = mockStats.messageCount;
    if (document.getElementById('total_blogs')) document.getElementById('total_blogs').innerText = mockStats.blogCount;

    // Fixed ID Match with HTML (bookings-list)
    const tbody = document.getElementById('bookings-list');
    if (!tbody) return;

    tbody.innerHTML = '';
    mockRecentBookings.forEach(booking => {
        const tr = document.createElement('tr');
        const date = new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        let statusClass = 'status-pending';
        if (booking.status === 'confirmed') statusClass = 'status-active';
        if (booking.status === 'completed') statusClass = 'status-active'; // Or status-completed if added
        if (booking.status === 'pending') statusClass = 'status-pending';

        let initial = booking.customer_name ? booking.customer_name.charAt(0).toUpperCase() : 'U';

        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">
                        ${initial}
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 700; color: var(--text-main);">${booking.customer_name || 'Anonymous'}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${booking.email || ''}</span>
                    </div>
                </div>
            </td>
            <td>${booking.service_type || 'Photography'}</td>
            <td style="font-family: monospace; color: var(--text-sec);">${date}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
         `;
        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}
