// Initialize Admin Users Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = 'System Admin';
    }
    loadUsers();
});

// Logout
window.logout = () => {
    localStorage.clear();
    window.location.href = '../index.html';
}

function loadUsers() {
    const tbody = document.getElementById('users_table');
    if (!tbody) return;

    // Professional Mock Data for Users
    const mockUsers = [
        { id: 'usr_98212', name: 'John Doe', email: 'john.doe@example.com', role: 'user', created_at: '2026-03-01T10:00:00Z' },
        { id: 'usr_84732', name: 'System Admin', email: 'admin@luminastudio.com', role: 'admin', created_at: '2025-01-15T08:30:00Z' },
        { id: 'usr_76432', name: 'Sarah Jenkins', email: 's.jenk@style.co', role: 'user', created_at: '2026-02-14T14:45:00Z' },
        { id: 'usr_65893', name: 'Marcus Thorne', email: 'm.thorne@estate.com', role: 'user', created_at: '2026-02-10T09:15:00Z' },
        { id: 'usr_54921', name: 'Chen Wei', email: 'chen.design@example.com', role: 'user', created_at: '2026-01-22T11:20:00Z' }
    ];

    tbody.innerHTML = '';
    mockUsers.forEach(user => {
        const tr = document.createElement('tr');
        const roleBadgeColor = user.role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(33, 150, 243, 0.2)';
        const roleTextColor = user.role === 'admin' ? '#f59e0b' : '#2196f3';

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge" style="background: ${roleBadgeColor}; color: ${roleTextColor}; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 0.75rem;">${user.role}</span></td>
            <td>${new Date(user.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            <td>
                ${user.role !== 'admin' ? `
                <button class="btn" style="background: rgba(244, 67, 54, 0.1); color: #f44336; padding: 6px 10px; border-radius: 4px; border: 1px solid rgba(244, 67, 54, 0.2); cursor: pointer;" onclick="deleteUser('${user.id}')">
                     <i class="fas fa-trash"></i> Delete
                </button>
                ` : '<span style="color: #666; font-size: 0.8rem; font-weight: bold;">Protected</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Global scope for onclick
window.deleteUser = (id) => {
    if (confirm('Are you sure you want to delete user ' + id + '? (Mock action)')) {
        alert('User ' + id + ' mock deleted successfully.');
    }
}

