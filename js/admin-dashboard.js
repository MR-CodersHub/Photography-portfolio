import { supabase } from './config.js';

// Check Admin Auth
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const email = localStorage.getItem('userEmail');

if (!isLoggedIn) {
    window.location.href = '../signin.html';
} else {
    // Verify admin role via Supabase (local mock)
    supabase.from('users').select('role').eq('email', email).single().then(({ data: userData }) => {
        if (!userData || userData.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }
        document.getElementById('user-name').innerText = localStorage.getItem('userName') || email;
        loadStats();
    });
}

// Logout
window.logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '../index.html';
}

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const body = document.body;

    if (themeToggle && moonIcon && sunIcon) {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            if (isLight) {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline-block';
            } else {
                moonIcon.style.display = 'inline-block';
                sunIcon.style.display = 'none';
            }
        });
    }
});

async function loadStats() {
    try {
        // Supabase Counts
        const { count: bookingCount, error: bookingError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        const { count: pendingCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        const { count: messageCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });

        const { count: blogCount } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true });

        // Update UI
        document.getElementById('total-bookings').innerText = bookingCount || 0;
        document.getElementById('pending-bookings').innerText = pendingCount || 0;
        document.getElementById('total-messages').innerText = messageCount || 0;
        document.getElementById('total-blogs').innerText = blogCount || 0;

        // Load Recent Bookings (Supabase)
        const { data: recentBookings } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        const tbody = document.getElementById('recent-bookings-table');
        tbody.innerHTML = '';
        if (recentBookings) {
            recentBookings.forEach(booking => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${booking.customer_name}</td>
                    <td>${new Date(booking.booking_date).toLocaleDateString()}</td>
                    <td><span class="badge ${booking.status}">${booking.status}</span></td>
                 `;
                tbody.appendChild(tr);
            });
        }

    } catch (err) {
        console.error("Error loading stats:", err);
    }
}
