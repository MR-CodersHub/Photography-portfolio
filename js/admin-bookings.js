import { auth, supabase } from '../js/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check Admin Auth
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const email = localStorage.getItem('userEmail');

if (isLoggedIn) {
    supabase.from('users').select('role').eq('email', email).single().then(({ data: userData }) => {
        if (!userData || userData.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }

        document.getElementById('user-name').innerText = localStorage.getItem('userName') || email;
        loadBookings();
    });
} else {
    window.location.href = '../signin.html';
}

window.logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = '../index.html';
}

async function loadBookings() {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('booking_date', { ascending: false });

        if (error) throw error;
        renderTable(data);
    } catch (err) {
        console.error("Error loading bookings:", err);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('bookings_table');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center p-4">No bookings found.</td></tr>';
        return;
    }

    data.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.booking_date}</td>
            <td>${booking.customer_name}</td>
            <td>${booking.service_type}</td>
            <td>${booking.email}<br>${booking.phone}</td>
             <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${booking.message}">${booking.message}</div></td>
            <td>
                <span style="font-weight: bold; color: ${getColor(booking.status)}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td>
                <select onchange="updateBookingStatus(${booking.id}, this.value)" style="padding: 5px; border-radius: 4px; background: #333; color: white;">
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
    if (status === 'pending') return '#ff9800';
    if (status === 'cancelled') return '#f44336';
    return '#2196f3';
}

// Make globally available for inline onclick handlers
window.updateBookingStatus = async (id, newStatus) => {
    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;

        // Reload to show update
        loadBookings();
    } catch (err) {
        alert('Failed to update status: ' + err.message);
    }
}
