import { supabase } from '../js/config.js';

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
        loadMessages();
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

async function loadMessages() {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('messages_table');
        tbody.innerHTML = '';

        if (messages.length > 0) {
            messages.forEach((msg) => {
                const tr = document.createElement('tr');
                const date = msg.created_at ? new Date(msg.created_at).toLocaleString() : 'N/A';

                tr.innerHTML = `
                    <td>${date}</td>
                    <td>${msg.name}</td>
                    <td>${msg.email}</td>
                    <td>${msg.subject || '-'}</td>
                    <td><div style="max-width: 300px; white-space: pre-wrap;">${msg.message}</div></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No messages found.</td></tr>';
        }

    } catch (err) {
        console.error("Error loading messages from Supabase:", err);
    }
}
