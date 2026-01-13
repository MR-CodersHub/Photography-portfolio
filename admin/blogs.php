<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blogs - Admin Panel</title>
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'includes/header.php'; ?>

        <!-- Blog Form -->
        <div class="glass" style="padding: 20px; margin-bottom: 30px;">
            <h3 id="form-title">Create New Blog Post</h3>
            <form id="blogForm">
                <input type="hidden" name="id" id="blogId">
                <input type="hidden" name="current_image" id="currentImage">
                
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="title" id="blogTitle" required>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea name="content" id="blogContent" rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label>Image</label>
                    <input type="file" name="image" id="blogImage" accept="image/*">
                </div>
                <button type="submit" class="btn btn-primary" id="submitBtn">Save Post</button>
                <button type="button" class="btn" onclick="resetForm()" style="background: transparent; border: 1px solid #555;">Cancel</button>
            </form>
        </div>

        <!-- Blogs List -->
        <div class="table-container glass">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="blogs_table">
                    <tr><td colspan="3">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'Blog Management';
        const form = document.getElementById('blogForm');

        async function loadBlogs() {
            const response = await fetch('../backend/blogs.php');
            const data = await response.json();
            const tbody = document.getElementById('blogs_table');
            tbody.innerHTML = '';
            
            data.forEach(blog => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${blog.title}</td>
                    <td>${blog.created_at}</td>
                    <td>
                        <button class="btn" style="background: #2196f3; padding: 5px 10px; margin-right: 5px;" onclick='editBlog(${JSON.stringify(blog).replace(/'/g, "&#39;")})'>
                             <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn" style="background: #f44336; padding: 5px 10px;" onclick="deleteBlog(${blog.id})">
                             <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('../backend/blogs.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if(result.success) {
                    resetForm();
                    loadBlogs();
                } else {
                    alert(result.error);
                }
            } catch(err) {
                alert('Operation failed');
            }
        });

        async function deleteBlog(id) {
            if(!confirm('Delete this post?')) return;
            const response = await fetch('../backend/blogs.php?action=delete', {
                method: 'POST',
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if(result.success) loadBlogs();
        }

        function editBlog(blog) {
            document.getElementById('form-title').innerText = 'Edit Blog Post';
            document.getElementById('blogId').value = blog.id;
            document.getElementById('currentImage').value = blog.image;
            document.getElementById('blogTitle').value = blog.title;
            document.getElementById('blogContent').value = blog.content;
            document.getElementById('submitBtn').innerText = 'Update Post';
            window.scrollTo(0,0);
        }

        function resetForm() {
            form.reset();
            document.getElementById('form-title').innerText = 'Create New Blog Post';
            document.getElementById('blogId').value = '';
            document.getElementById('currentImage').value = '';
            document.getElementById('submitBtn').innerText = 'Save Post';
        }

        loadBlogs();
    </script>
</body>
</html>
