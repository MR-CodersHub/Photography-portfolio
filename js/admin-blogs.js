import { supabase, storage } from '../js/config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
        loadBlogs();
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

async function loadBlogs() {
    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('blogs_table');
        tbody.innerHTML = '';

        blogs.forEach((blog) => {
            const date = new Date(blog.created_at).toLocaleString();
            const tr = document.createElement('tr');

            // Encode data for safe inline JS
            const blogSafe = encodeURIComponent(JSON.stringify(blog));

            tr.innerHTML = `
                <td>
                    <div class="flex items-center gap-3">
                         ${blog.image ? `<img src="${blog.image}" class="w-10 h-10 object-cover rounded">` : ''}
                         <span class="font-bold">${blog.title}</span>
                    </div>
                </td>
                <td>${date}</td>
                <td>
                    <button class="btn" style="background: #2196f3; padding: 6px 10px; border-radius: 4px; margin-right: 5px;" onclick="editBlog('${blogSafe}')">
                         <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" style="background: #f44336; padding: 6px 10px; border-radius: 4px;" onclick="deleteBlog('${blog.id}')">
                         <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading blogs from Supabase:", err);
    }
}

const form = document.getElementById('blogForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = 'Saving...';
    submitBtn.disabled = true;

    try {
        const id = document.getElementById('blogId').value;
        const title = document.getElementById('blogTitle').value;
        const content = document.getElementById('blogContent').value;
        const imageFile = document.getElementById('blogImage').files[0];
        const currentImage = document.getElementById('currentImage').value;

        let imageUrl = currentImage;

        if (imageFile) {
            const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const blogData = {
            title,
            content,
            image: imageUrl || 'https://via.placeholder.com/800x600'
        };

        if (id) {
            // Update
            const { error } = await supabase
                .from('blogs')
                .update(blogData)
                .eq('id', id);
            if (error) throw error;
            alert("Blog post updated!");
        } else {
            // Create
            const { error } = await supabase
                .from('blogs')
                .insert([blogData]);
            if (error) throw error;
            alert("Blog post created!");
        }

        resetForm();
        loadBlogs();

    } catch (err) {
        console.error("Error saving blog:", err);
        alert("Failed to save blog post. " + err.message);
    } finally {
        submitBtn.innerText = document.getElementById('blogId').value ? 'Update Post' : 'Save Post';
        submitBtn.disabled = false;
    }
});

// Global functions
window.deleteBlog = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
        loadBlogs();
    } catch (err) {
        alert("Failed to delete post.");
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
    window.scrollTo(0, 0);
}

window.resetForm = () => {
    form.reset();
    document.getElementById('form-title').innerText = 'Create New Blog Post';
    document.getElementById('blogId').value = '';
    document.getElementById('currentImage').value = '';
    document.getElementById('submitBtn').innerText = 'Save Post';
}
