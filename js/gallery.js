import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

window.filterGallery = (category) => {
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === category.toLowerCase()) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.gallery-item').forEach(item => {
        if (category === 'all' || item.classList.contains(category.toLowerCase())) {
            item.classList.remove('hidden-filter');
        } else {
            item.classList.add('hidden-filter');
        }
    });
}

window.closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
});

async function loadGallery() {
    try {
        const { data: galleryItems, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        if (galleryItems.length > 0) {
            grid.innerHTML = '';
            galleryItems.forEach((img) => {
                const categoryClass = img.category ? img.category.toLowerCase() : 'other';

                const div = document.createElement('div');
                div.className = `gallery-item ${categoryClass} group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-6`;
                div.innerHTML = `
                    <img src="${img.image_path}"
                        class="w-full hover:scale-105 transition-transform duration-700" alt="${img.title}">
                    <div
                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i data-lucide="maximize-2" class="text-amber-500 w-10 h-10"></i>
                    </div>
                `;

                div.addEventListener('click', () => {
                    const lightboxImg = document.getElementById('lightboxImg');
                    const lightbox = document.getElementById('lightbox');
                    if (lightboxImg && lightbox) {
                        lightboxImg.src = img.image_path;
                        lightbox.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                });

                grid.appendChild(div);
            });
            if (window.lucide) window.lucide.createIcons();
        }
    } catch (err) {
        console.error('Failed to load gallery from Supabase', err);
    }
}

loadGallery();
