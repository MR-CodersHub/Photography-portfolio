// Initialize Admin Messages Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = 'System Admin';
    }
    loadMessages();
});

// Logout
window.logout = () => {
    localStorage.clear();
    window.location.href = '../index.html';
}

function loadMessages() {
    const tbody = document.getElementById('messages_table');
    if (!tbody) return;

    // Professional Mock Data for Messages
    const mockMessages = [
        {
            name: 'Emily Davis',
            email: 'emily.d@example.com',
            subject: 'Wedding Photography Inquiry',
            message: 'Hello, we are planning our wedding for next spring and love your portfolio. We are hoping to get pricing for full-day coverage plus an engagement session.',
            created_at: '2026-03-05T14:30:00Z'
        },
        {
            name: 'Michael Chang',
            email: 'm.chang@startup.io',
            subject: 'Corporate Headshots',
            message: 'We are a small startup with a team of 15. We would like to book a half-day session at our office for professional headshots.',
            created_at: '2026-03-04T09:15:00Z'
        },
        {
            name: 'Jessica Thorne',
            email: 'jess.thorne12@gmail.com',
            subject: 'Family Portraits',
            message: 'Looking to get some outdoor family portraits done before the holidays. Do you have any availability next weekend?',
            created_at: '2026-03-02T16:45:00Z'
        },
        {
            name: 'David Wilson',
            email: 'dwilson.realestate@example.com',
            subject: 'Property Listing Photos',
            message: 'Need high-quality photos for a luxury listing I recently acquired. Let me know your rates for real estate packages.',
            created_at: '2026-03-01T11:20:00Z'
        }
    ];

    tbody.innerHTML = '';

    if (mockMessages.length > 0) {
        mockMessages.forEach((msg) => {
            const tr = document.createElement('tr');
            const date = msg.created_at ? new Date(msg.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

            tr.innerHTML = `
                <td>${date}</td>
                <td><strong>${msg.name}</strong></td>
                <td><span style="color: #aaa;">${msg.email}</span></td>
                <td>${msg.subject || '-'}</td>
                <td><div style="max-width: 300px; white-space: normal; color: #ccc; font-size: 0.9em; line-height: 1.4;">${msg.message}</div></td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No messages found.</td></tr>';
    }
}

