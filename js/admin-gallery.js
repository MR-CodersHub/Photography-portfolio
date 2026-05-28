// Initialize Admin Gallery Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').innerText = 'System Admin';
    }
    loadGallery();
});

// Logout
window.logout = () => {
    localStorage.clear();
    window.location.href = '../index.html';
}

function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    // Professional Mock Data for Gallery
    const mockGalleryItems = [
        {
            id: 'gal_1',
            title: 'Downtown Corporate Suite',
            category: 'commercial',
            image_path: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-03-01T10:00:00Z'
        },
        {
            id: 'gal_2',
            title: 'Sunset Engagement Session',
            category: 'weddings',
            image_path: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-02-28T14:30:00Z'
        },
        {
            id: 'gal_3',
            title: 'Modern Architecture',
            category: 'architecture',
            image_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-02-20T09:15:00Z'
        },
        {
            id: 'gal_4',
            title: 'Summer Fashion Campaign',
            category: 'commercial',
            image_path: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
            created_at: '2026-02-15T11:20:00Z'
        }
    ];

    grid.innerHTML = '';

    if (mockGalleryItems.length === 0) {
        grid.innerHTML = '<p>No images found.</p>';
        return;
    }

    mockGalleryItems.forEach((item) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.className = "bg-zinc-800 p-2 rounded-lg";
        div.innerHTML = `
            <div style="position: relative; height: 150px; overflow: hidden; border-radius: 8px;">
                <img src="${item.image_path}" style="width: 100%; height: 100%; object-fit: cover;">
                <button onclick="deleteImage('${item.id}')" style="position: absolute; top: 5px; right: 5px; background: rgba(244, 67, 54, 0.9); color: white; border: none; padding: 6px 8px; cursor: pointer; border-radius: 4px; transition: background 0.3s;" onmouseover="this.style.background='rgba(244, 67, 54, 1)'" onmouseout="this.style.background='rgba(244, 67, 54, 0.9)'">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="mt-2" style="padding: 4px;">
                <p style="font-weight: bold; font-size: 0.95rem; line-height: 1.2; margin-bottom: 2px;">${item.title}</p>
                <small style="color: #aaa; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">${item.category}</small>
            </div>
        `;
        grid.appendChild(div);
    });
}

const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerText = 'Uploading...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Mock Action: Image uploaded successfully!');
            e.target.reset();
            loadGallery();
            submitBtn.innerText = 'Upload';
            submitBtn.disabled = false;
        }, 1000);
    });
}

window.deleteImage = (id) => {
    if (confirm('Delete this image? (Mock action)')) {
        alert('Image ' + id + ' mock deleted successfully.');
    }
}

