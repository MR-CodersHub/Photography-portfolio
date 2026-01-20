import { auth, supabase } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check User Auth
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const email = localStorage.getItem('userEmail');
const name = localStorage.getItem('userName'); // Assuming you save this on signup

if (isLoggedIn) {
    document.getElementById('user-name').innerText = name || email;
    loadMyBookings(email);
} else {
    window.location.href = '../signin.html';
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
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            if (isLight) {
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            } else {
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            }
        });
    }
});

async function loadMyBookings(email) {
    const tbody = document.getElementById('bookings-table');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4">Loading...</td></tr>';

    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false });

        if (error) throw error;

        tbody.innerHTML = '';
        if (bookings.length > 0) {
            bookings.forEach((booking) => {
                const tr = document.createElement('tr');
                const date = new Date(booking.booking_date).toLocaleDateString();
                const total = booking.total_price ? `$${booking.total_price}` : '-'; // Assuming total_price exists or calculate it

                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#${booking.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">${booking.service_type}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${booking.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">${total}</td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-gray-500">No bookings found.</td></tr>';
        }
    } catch (err) {
        console.error("Error loading bookings:", err);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-red-500">Error loading bookings.</td></tr>';
    }
}
