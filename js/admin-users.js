import { auth, supabase } from '../js/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check Admin Auth
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const email = localStorage.getItem('userEmail');

if (isLoggedIn) {
    // Verify admin role via Supabase (local mock)
    // Since this is JS-only now, make sure config.js is using the mock.
    supabase.from('users').select('role').eq('email', email).single().then(({ data: userData }) => {
        if (!userData || userData.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }

        document.getElementById('user-name').innerText = localStorage.getItem('userName') || email;
        loadUsers();
    });
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

async function loadUsers() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        const tbody = document.getElementById('users_table');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id || '-'}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge" style="background: rgba(33, 150, 243, 0.2); color: #2196f3;">${user.role}</span></td>
                <td>${new Date(user.created_at).toLocaleString()}</td>
                <td>
                    ${user.role !== 'admin' ? `
                    <button class="btn" style="background: rgba(244, 67, 54, 0.2); color: #f44336; padding: 6px 10px; border-radius: 4px;" onclick="deleteUser('${user.email}')">
                         <i class="fas fa-trash"></i>
                    </button>
                    ` : '<span style="color: #666; font-size: 0.8rem;">Protected</span>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

// Global scope for onclick
window.deleteUser = async (email) => {
    if (!confirm('Are you sure you want to delete this user? This only removes them from the database, not Firebase Auth.')) return;

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('email', email);

        if (error) throw error;
        loadUsers();
    } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
    }
}
