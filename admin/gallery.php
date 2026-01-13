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
    <title>Gallery - Admin Panel</title>
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'includes/header.php'; ?>

        <!-- Upload Form -->
        <div class="glass" style="padding: 20px; margin-bottom: 30px;">
            <h3>Upload New Image</h3>
            <form id="uploadForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div>
                        <label>Category</label>
                        <select name="category">
                            <option value="Wedding">Wedding</option>
                            <option value="Portrait">Portrait</option>
                            <option value="Landscape">Landscape</option>
                            <option value="Event">Event</option>
                        </select>
                    </div>
                    <div>
                        <label>Image</label>
                        <input type="file" name="image" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Upload</button>
                </div>
            </form>
        </div>

        <!-- Gallery Grid -->
        <div class="glass" style="padding: 20px;">
            <h3>Current Gallery</h3>
            <div id="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                <!-- Images loaded here -->
            </div>
        </div>
    </div>

    <script>
        document.getElementById('page-title').innerText = 'Gallery Management';

        async function loadGallery() {
            const response = await fetch('../backend/gallery.php');
            const data = await response.json();
            const grid = document.getElementById('gallery-grid');
            grid.innerHTML = '';
            
            data.forEach(item => {
                const div = document.createElement('div');
                div.style.position = 'relative';
                div.innerHTML = `
                    <div style="position: relative; height: 150px; overflow: hidden; border-radius: 8px;">
                        <img src="../${item.image_path}" style="width: 100%; height: 100%; object-fit: cover;">
                        <button onclick="deleteImage(${item.id})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <p style="margin-top: 5px; font-weight: bold;">${item.title}</p>
                    <small style="color: #aaa;">${item.category}</small>
                `;
                grid.appendChild(div);
            });
        }

        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('../backend/gallery.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if(result.success) {
                    e.target.reset();
                    loadGallery();
                } else {
                    alert(result.error);
                }
            } catch(err) {
                alert('Upload failed');
            }
        });

        async function deleteImage(id) {
            if(!confirm('Delete this image?')) return;
            const response = await fetch('../backend/gallery.php?action=delete', {
                method: 'POST',
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if(result.success) loadGallery();
        }

        loadGallery();
    </script>
</body>
</html>
