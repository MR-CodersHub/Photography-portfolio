// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userName') || 'Sakthi';

    // Update all name fields with loaded name
    updateDisplayName(name);

    loadMyBookings();
    loadFullBookings();
    loadNotifications();

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Add event listeners to sidebar nav links
    document.querySelectorAll('.sidebar-nav .nav-link[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            switchView(viewId);
        });
    });

    // Header action clicks
    const headerNotifBtn = document.getElementById('headerNotificationsBtn');
    if (headerNotifBtn) {
        headerNotifBtn.addEventListener('click', () => {
            switchView('notifications');
        });
    }

    const headerProfBtn = document.getElementById('headerProfileBtn');
    if (headerProfBtn) {
        headerProfBtn.addEventListener('click', () => {
            switchView('profile');
        });
    }

    // Forms
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstName = document.getElementById('profileFirstName').value;
            const lastName = document.getElementById('profileLastName').value;
            const fullName = `${firstName} ${lastName}`.trim();
            localStorage.setItem('userName', fullName);
            
            updateDisplayName(fullName);
            alert('Profile updated successfully!');
        });
    }

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Password updated successfully!');
            passwordForm.reset();
        });
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

function updateDisplayName(name) {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = name;
    }
    if (document.getElementById('user-display-name')) {
        document.getElementById('user-display-name').innerText = name;
    }
    if (document.getElementById('profile-display-name')) {
        document.getElementById('profile-display-name').innerText = name;
    }
    const avatarEls = document.querySelectorAll('.user-avatar');
    if (avatarEls.length > 0) {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarEls.forEach(el => {
            el.innerText = initials || 'SU';
        });
    }
}

function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show selected view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update active nav link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        if (link.getAttribute('data-view') === viewId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update Page Header texts
    const titleEl = document.getElementById('dashboard-title');
    const subtitleEl = document.getElementById('dashboard-subtitle');

    if (titleEl && subtitleEl) {
        switch (viewId) {
            case 'overview':
                titleEl.innerText = 'Welcome back!';
                subtitleEl.innerText = "Here's what's happening with your studio sessions.";
                break;
            case 'profile':
                titleEl.innerText = 'My Profile';
                subtitleEl.innerText = 'Manage your personal information and contact details.';
                break;
            case 'activity':
                titleEl.innerText = 'My Activity';
                subtitleEl.innerText = 'A timeline of your interactions with Lumina Studio.';
                break;
            case 'bookings':
                titleEl.innerText = 'My Bookings';
                subtitleEl.innerText = 'View and manage your scheduled photography sessions.';
                break;
            case 'notifications':
                titleEl.innerText = 'Notifications';
                subtitleEl.innerText = 'Keep track of updates, discounts, and booking status.';
                break;
            case 'settings':
                titleEl.innerText = 'Account Settings';
                subtitleEl.innerText = 'Manage your security, preferences, and account setup.';
                break;
        }
    }
}

const mockBookings = [
    {
        id: 'BKG-2026-001',
        service_type: 'Editorial Portrait Session',
        booking_date: '2026-04-12',
        status: 'confirmed',
        total_price: '850'
    },
    {
        id: 'BKG-2026-002',
        service_type: 'Commercial Product Shoot',
        booking_date: '2026-05-05',
        status: 'pending',
        total_price: '1200'
    },
    {
        id: 'BKG-2025-089',
        service_type: 'Pre-Wedding Storybook',
        booking_date: '2025-11-20',
        status: 'completed',
        total_price: '2400'
    },
    {
        id: 'BKG-2025-045',
        service_type: 'Personal Branding',
        booking_date: '2025-08-15',
        status: 'completed',
        total_price: '600'
    }
];

function loadMyBookings() {
    const tbody = document.getElementById('bookings_table');
    if (!tbody) return;

    // Update Counts (Mocking stats)
    if (document.getElementById('my_bookings_count')) {
        document.getElementById('my_bookings_count').innerText = '12';
    }
    if (document.getElementById('pending_count')) {
        document.getElementById('pending_count').innerText = mockBookings.filter(b => b.status === 'pending').length;
    }

    tbody.innerHTML = '';
    mockBookings.forEach((booking) => {
        const tr = document.createElement('tr');
        const date = new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const total = booking.total_price ? `$${booking.total_price}` : '$0';

        let statusClass = 'status-pending';
        if (booking.status === 'confirmed' || booking.status === 'completed') statusClass = 'status-active';

        tr.innerHTML = `
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 700; color: var(--text-main);">${booking.service_type}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">ID: ${booking.id}</span>
                </div>
            </td>
            <td style="font-family: monospace; color: var(--text-sec);">${date}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td style="font-weight: 700; color: var(--text-main); font-size: 0.9375rem;">${total}</td>
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

function loadFullBookings() {
    const tbody = document.getElementById('full_bookings_table');
    if (!tbody) return;

    tbody.innerHTML = '';
    mockBookings.forEach((booking) => {
        const tr = document.createElement('tr');
        const date = new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const total = booking.total_price ? `$${booking.total_price}` : '$0';

        let statusClass = 'status-pending';
        if (booking.status === 'confirmed' || booking.status === 'completed') statusClass = 'status-active';

        tr.innerHTML = `
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 700; color: var(--text-main);">${booking.service_type}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">ID: ${booking.id}</span>
                </div>
            </td>
            <td style="font-family: monospace; color: var(--text-sec);">${date}</td>
            <td>
                <span class="badge ${statusClass}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td style="font-weight: 700; color: var(--text-main); font-size: 0.9375rem;">${total}</td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="icon-btn" style="width: 32px; height: 32px;" title="Download Invoice" onclick="alert('Downloading invoice for ${booking.id}...')">
                        <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button class="icon-btn" style="width: 32px; height: 32px;" title="Cancel Session" onclick="alert('Cancellation request submitted for ${booking.id}.')">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--danger);"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

function loadNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;

    const notificationsList = [
        { id: 1, title: 'New Discount Available!', text: 'Get 20% off on your next portrait session.', type: 'discount', date: 'May 28, 2026' },
        { id: 2, title: 'Booking Confirmed', text: 'Your wedding shoot for Dec 24 is confirmed.', type: 'booking', date: 'May 24, 2026' },
        { id: 3, title: 'Welcome to Lumina Studio!', text: 'Thank you for registering. Your profile is verified.', type: 'system', date: 'Sept 21, 2024' }
    ];

    container.innerHTML = '';
    notificationsList.forEach(n => {
        let borderClass = 'var(--primary)';
        if (n.type === 'booking') borderClass = 'var(--secondary)';
        if (n.type === 'system') borderClass = 'var(--accent)';

        const div = document.createElement('div');
        div.style.padding = '1.25rem';
        div.style.borderRadius = 'var(--radius-lg)';
        div.style.background = '#fafafa';
        div.style.borderLeft = `4px solid ${borderClass}`;
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'flex-start';
        div.style.gap = '1rem';

        div.innerHTML = `
            <div>
                <div style="font-weight: 700; font-size: 0.9375rem; margin-bottom: 0.25rem;">${n.title}</div>
                <div style="font-size: 0.85rem; color: var(--text-sec);">${n.text}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">${n.date}</div>
            </div>
            <button class="icon-btn" style="width: 28px; height: 28px; border-radius: 50%;" onclick="this.parentElement.remove();" title="Dismiss">
                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
            </button>
        `;
        container.appendChild(div);
    });

    if (window.lucide) window.lucide.createIcons();
}
