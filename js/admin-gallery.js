import { auth, supabase, storage } from '../js/config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
        loadGallery();
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

async function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '<p>Loading...</p>';

    try {
        const { data: galleryItems, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        grid.innerHTML = '';
        if (galleryItems.length === 0) {
            grid.innerHTML = '<p>No images found.</p>';
            return;
        }

        galleryItems.forEach((item) => {
            const div = document.createElement('div');
            const storagePathSafe = item.storage_path || '';

            div.style.position = 'relative';
            div.className = "bg-zinc-800 p-2 rounded-lg";
            div.innerHTML = `
                <div style="position: relative; height: 150px; overflow: hidden; border-radius: 8px;">
                    <img src="${item.image_path}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button onclick="deleteImage('${item.id}', '${storagePathSafe}')" style="position: absolute; top: 5px; right: 5px; background: rgba(244, 67, 54, 0.9); color: white; border: none; padding: 5px; cursor: pointer; border-radius: 4px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="mt-2">
                    <p style="font-weight: bold; font-size: 0.9rem;">${item.title}</p>
                    <small style="color: #aaa; font-size: 0.8rem;">${item.category}</small>
                </div>
            `;
            grid.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading gallery from Supabase:", err);
    }
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Uploading...';
    submitBtn.disabled = true;

    try {
        const title = e.target.elements['title'].value;
        const category = e.target.elements['category'].value;
        const imageFile = e.target.elements['image'].files[0];

        if (!imageFile) throw new Error("Please select an image.");

        // Upload to Firebase Storage
        const storagePath = `gallery/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save to Supabase
        const { error } = await supabase
            .from('gallery')
            .insert([{
                title,
                category,
                image_path: imageUrl,
                storage_path: storagePath
            }]);

        if (error) throw error;

        alert("Image uploaded successfully!");
        e.target.reset();
        loadGallery();

    } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed: " + err.message);
    } finally {
        submitBtn.innerText = 'Upload';
        submitBtn.disabled = false;
    }
});

window.deleteImage = async (id, storagePath) => {
    if (!confirm('Delete this image?')) return;

    try {
        // Delete from Supabase
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;

        // Delete from Storage if path exists
        if (storagePath) {
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef).catch(e => console.warn("Storage file delete error:", e));
        }

        loadGallery();
    } catch (err) {
        console.error(err);
        alert("Failed to delete image.");
    }
}
