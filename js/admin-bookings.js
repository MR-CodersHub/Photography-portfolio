// Initialize Admin Bookings Dashboard
// Check Admin Auth
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = 'System Admin';
    }
    loadBookings();
});

window.logout = () => {
    localStorage.clear();
    window.location.href = '../index.html';
}

function loadBookings() {
    const mockData = [
        {
            id: 1,
            booking_date: '2026-06-15',
            customer_name: 'Isabella Rossi',
            service_type: 'Luxury Wedding Coverage',
            email: 'isa.rossi@example.com',
            phone: '+1 (555) 123-4567',
            message: 'We want full-day coverage including drone shots.',
            status: 'pending'
        },
        {
            id: 2,
            booking_date: '2026-04-20',
            customer_name: 'Chen Wei',
            service_type: 'Corporate Rebranding',
            email: 'chen.design@example.com',
            phone: '+1 (555) 987-6543',
            message: 'Team headshots and office lifestyle photos.',
            status: 'confirmed'
        },
        {
            id: 3,
            booking_date: '2026-04-05',
            customer_name: 'Marcus Thorne',
            service_type: 'Real Estate Drone',
            email: 'm.thorne@estate.com',
            phone: '+1 (555) 456-7890',
            message: 'Aerial shots of the new downtown property.',
            status: 'confirmed'
        },
        {
            id: 4,
            booking_date: '2026-05-10',
            customer_name: 'Sarah Jenkins',
            service_type: 'Fashion Campaign',
            email: 's.jenk@style.co',
            phone: '+1 (555) 111-2222',
            message: 'Half-day studio session with 3 models.',
            status: 'completed'
        },
        {
            id: 5,
            booking_date: '2026-03-30',
            customer_name: 'Elena & Lucas',
            service_type: 'Engagement Session',
            email: 'e_l_weddings@example.com',
            phone: '+1 (555) 333-4444',
            message: 'Sunset beach photos if possible.',
            status: 'pending'
        }
    ];
    renderTable(mockData);
}

function renderTable(data) {
    const tbody = document.getElementById('bookings_table');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center p-4">No bookings found.</td></tr>';
        return;
    }

    data.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            <td><strong>${booking.customer_name}</strong></td>
            <td>${booking.service_type}</td>
            <td><span style="color: #aaa; font-size: 0.9em;">${booking.email}<br>${booking.phone}</span></td>
            <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.9em; color: #ccc;" title="${booking.message}">${booking.message}</div></td>
            <td>
                <span style="font-weight: bold; padding: 4px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); color: ${getColor(booking.status)}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td>
                <select onchange="updateBookingStatus(${booking.id}, this.value)" style="padding: 6px; border-radius: 4px; background: #222; color: white; border: 1px solid #444; cursor: pointer;">
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
    if (status === 'confirmed') return '#4caf50';
    if (status === 'pending') return '#f59e0b';
    if (status === 'cancelled') return '#f44336';
    if (status === 'completed') return '#2196f3';
    return '#2196f3';
}

// Make globally available for inline onclick handlers
window.updateBookingStatus = (id, newStatus) => {
    alert('Mock Status Updated: Booking ID ' + id + ' changed to ' + newStatus);
}
