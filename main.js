// Core UI functions must be global and available immediately
window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (!menu) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden', 'opacity-0');
        menu.classList.add('flex', 'opacity-100');
        document.body.style.overflow = 'hidden';
        if (iconOpen) iconOpen.classList.add('hidden');
        if (iconClose) iconClose.classList.remove('hidden');
    } else {
        menu.classList.add('hidden', 'opacity-0');
        menu.classList.remove('flex', 'opacity-100');
        document.body.style.overflow = '';
        if (iconOpen) iconOpen.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
};

let currentGallery = [];
let currentImageIndex = 0;

function init() {
    if (window.lucide) window.lucide.createIcons();

    // Programmatically ensure social icons are visible and interactive with high contrast
    const applySocialIconsFix = () => {
        document.querySelectorAll('footer .flex.space-x-3 a, .flex.space-x-4 a.rounded-full').forEach(a => {
            const icon = a.querySelector('i, svg');
            if (icon) {
                icon.style.setProperty('stroke', '#475569', 'important');
                icon.style.setProperty('fill', 'none', 'important');
                icon.style.setProperty('stroke-width', '2px', 'important');
                icon.style.setProperty('width', '16px', 'important');
                icon.style.setProperty('height', '16px', 'important');
                icon.style.setProperty('display', 'inline-block', 'important');
                icon.style.setProperty('opacity', '1', 'important');
                icon.style.setProperty('visibility', 'visible', 'important');
                
                // Hover listeners (avoid duplicate listeners by tagging)
                if (!a.dataset.hoverBound) {
                    a.dataset.hoverBound = 'true';
                    a.addEventListener('mouseenter', () => {
                        const activeIcon = a.querySelector('i, svg');
                        if (activeIcon) activeIcon.style.setProperty('stroke', '#ffffff', 'important');
                    });
                    a.addEventListener('mouseleave', () => {
                        const activeIcon = a.querySelector('i, svg');
                        if (activeIcon) activeIcon.style.setProperty('stroke', '#475569', 'important');
                    });
                }
            }
        });
    };
    applySocialIconsFix();
    setTimeout(applySocialIconsFix, 150);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Keyboard Support for Lightbox
    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('lightbox');
        if (lb && !lb.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightboxImage(-1);
            if (e.key === 'ArrowRight') changeLightboxImage(1);
        }
    });

    // Scroll Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    // Handle Active Navigation Link
    handleActiveNav();

    // Auto-collect images for gallery if needed
    collectGalleryImages();
}

function handleActiveNav() {
    const currentPath = window.location.pathname;
    const page = currentPath.split("/").pop() || "index.html";

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
            link.classList.remove('text-zinc-400');
        } else {
            link.classList.remove('active');
            if (!link.classList.contains('text-zinc-400') && href !== 'contact.html') {
                link.classList.add('text-zinc-400');
            }
        }
    });

    // Mobile Menu Active State
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) {
            link.classList.add('bg-zinc-900', 'text-amber-500');
            const icon = link.querySelector('i');
            if (icon) icon.classList.add('text-amber-500');
            const span = link.querySelector('span');
            if (span) {
                span.classList.remove('text-zinc-400');
                span.classList.add('text-white', 'font-bold');
            }
        }
    });
}

function collectGalleryImages() {
    const images = document.querySelectorAll('img[onclick*="openLightbox"], .cursor-pointer img');
    currentGallery = Array.from(images).map(img => ({
        url: img.src,
        cat: img.getAttribute('data-category') || 'Portfolio',
        title: img.getAttribute('alt') || 'Lumina Masterpiece'
    }));
}

function openLightbox(url, cat, title) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const img = document.getElementById('lightbox-img');
    const catEl = document.getElementById('lightbox-cat');
    const titleEl = document.getElementById('lightbox-title');

    if (img) img.src = url;
    if (catEl) catEl.innerText = cat || 'Gallery';
    if (titleEl) titleEl.innerText = title || 'Lumina Studio';

    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Find index in collected gallery
    currentImageIndex = currentGallery.findIndex(item => item.url === url);
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function changeLightboxImage(direction) {
    if (currentGallery.length === 0) collectGalleryImages();
    if (currentGallery.length === 0) return;

    currentImageIndex = (currentImageIndex + direction + currentGallery.length) % currentGallery.length;
    const nextImg = currentGallery[currentImageIndex];

    const img = document.getElementById('lightbox-img');
    const catEl = document.getElementById('lightbox-cat');
    const titleEl = document.getElementById('lightbox-title');

    if (img) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        setTimeout(() => {
            img.src = nextImg.url;
            if (catEl) catEl.innerText = nextImg.cat;
            if (titleEl) titleEl.innerText = nextImg.title;
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 250);
    }
}

// Global exposure
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;

// ─── Video Modal Controller ───────────────────────────────────────────────────
window.openVideoModal = function (videoUrl, title) {
    const modal  = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    const source = document.getElementById('videoModalSource');
    const titleEl = document.getElementById('videoModalTitle');

    if (!modal || !player || !source) return;

    // Set source and title
    source.src  = videoUrl;
    if (titleEl) titleEl.textContent = title || '';

    // Load and show modal
    player.load();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Attempt autoplay
    player.play().catch(() => {
        // Autoplay blocked — video controls still show; user can press play manually
    });
};

window.closeVideoModal = function () {
    const modal  = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    const source = document.getElementById('videoModalSource');

    if (!modal) return;

    // Pause and reset
    if (player) { player.pause(); player.currentTime = 0; }
    if (source) source.src = '';
    if (player) player.load();

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
};

// ESC key closes video modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('videoModal');
        if (modal && !modal.classList.contains('hidden')) {
            window.closeVideoModal();
        }
    }
});
// ─────────────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
