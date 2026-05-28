// Initialize Admin Blogs Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = 'System Admin';
    }
    loadBlogs();
});

// Logout
window.logout = () => {
    localStorage.clear();
    window.location.href = '../index.html';
}

function loadBlogs() {
    const tbody = document.getElementById('blogs_table');
    if (!tbody) return;

    // Professional Mock Data for Blogs
    const mockBlogs = [
        {
            id: 'blg_1',
            title: 'Mastering Golden Hour Photography',
            content: 'The golden hour provides the most flattering natural light for portraits...',
            image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-03-01T10:00:00Z'
        },
        {
            id: 'blg_2',
            title: 'Top 5 Mirrorless Cameras for 2026',
            content: 'A detailed review of the leading mirrorless camera bodies currently on the market...',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-02-15T14:30:00Z'
        },
        {
            id: 'blg_3',
            title: 'Essential Portrait Composition Rules',
            content: 'Learn how to frame your subjects perfectly using the rule of thirds and leading lines...',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-01-28T09:15:00Z'
        }
    ];

    tbody.innerHTML = '';

    mockBlogs.forEach((blog) => {
        const date = new Date(blog.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const tr = document.createElement('tr');

        // Encode data for safe inline JS
        const blogSafe = encodeURIComponent(JSON.stringify(blog));

        tr.innerHTML = `
            <td>
                <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 12px;">
                     ${blog.image ? `<img src="${blog.image}" class="w-10 h-10 object-cover rounded" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : ''}
                     <span class="font-bold">${blog.title}</span>
                </div>
            </td>
            <td>${date}</td>
            <td>
                <button class="btn" style="background: #2196f3; padding: 6px 10px; border-radius: 4px; border: none; color: white; margin-right: 5px; cursor: pointer;" onclick="editBlog('${blogSafe}')">
                     <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn" style="background: #f44336; padding: 6px 10px; border-radius: 4px; border: none; color: white; cursor: pointer;" onclick="deleteBlog('${blog.id}')">
                     <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const form = document.getElementById('blogForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerText = 'Saving...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Mock Action: Blog post saved successfully!');
            resetForm();
            loadBlogs();
            submitBtn.innerText = 'Save Post';
            submitBtn.disabled = false;
        }, 800);
    });
}

// Global functions
window.deleteBlog = (id) => {
    if (confirm('Delete this post? (Mock action)')) {
        alert('Blog ' + id + ' mock deleted successfully.');
    }
}

window.editBlog = (encodedBlog) => {
    const blog = JSON.parse(decodeURIComponent(encodedBlog));

    document.getElementById('form-title').innerText = 'Edit Blog Post';
    document.getElementById('blogId').value = blog.id;
    document.getElementById('currentImage').value = blog.image;
    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogContent').value = blog.content;
    document.getElementById('submitBtn').innerText = 'Update Post';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.resetForm = () => {
    if (form) form.reset();
    document.getElementById('form-title').innerText = 'Create New Blog Post';
    document.getElementById('blogId').value = '';
    document.getElementById('currentImage').value = '';
    document.getElementById('submitBtn').innerText = 'Save Post';
}

