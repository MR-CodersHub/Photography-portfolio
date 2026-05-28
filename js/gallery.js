// Gallery filter and lightbox functionality - uses static HTML content

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

window.filterGallery = (category) => {
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.innerText.toLowerCase();
        // Match 'all' exactly, or check if button text starts with the category
        if (category.toLowerCase() === 'all' && btnText === 'all') {
            btn.classList.add('active');
        } else if (btnText.startsWith(category.toLowerCase())) {
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

// Dynamic loading disabled - using static HTML content for reliable filtering
// async function loadGallery() { ... }

// Instead, add click handlers to static gallery items for lightbox
function initStaticGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                const lightboxImg = document.getElementById('lightboxImg');
                const lightbox = document.getElementById('lightbox');
                const catEl = document.getElementById('lightbox-cat');
                const titleEl = document.getElementById('lightbox-title');

                if (lightboxImg && lightbox) {
                    lightboxImg.src = img.src;
                    if (catEl) catEl.innerText = item.classList.contains('wedding') ? 'Wedding' :
                        item.classList.contains('portrait') ? 'Portrait' :
                            item.classList.contains('editorial') ? 'Editorial' :
                                item.classList.contains('nature') ? 'Nature' : 'Gallery';
                    if (titleEl) titleEl.innerText = img.alt || 'Lumina Masterpiece';

                    lightbox.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });
}

// Initialize static gallery on page load
initStaticGallery();
