let currentPage = 'general';

function init() {
    lucide.createIcons();

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        if (isLight) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-zinc-950/90', 'backdrop-blur-md', 'py-4', 'shadow-xl');
            nav.classList.remove('bg-transparent', 'py-6');
        } else {
            nav.classList.remove('bg-zinc-950/90', 'backdrop-blur-md', 'py-4', 'shadow-xl');
            nav.classList.add('bg-transparent', 'py-6');
        }
    });

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // More precise triggering
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${id}` || href === `index.html#${id}`;

                    if (isActive) {
                        link.classList.remove('text-gray-300');
                        link.classList.add('text-amber-500');
                    } else if (href.includes('#')) {
                        link.classList.remove('text-amber-500');
                        link.classList.add('text-gray-300');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Dynamic content loading is now handled by specific page scripts (home.js, gallery.js, blog.js)
}


function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Lightbox functions (kept for compatibility if needed mostly for service details pages)
function openLightbox(url, cat, title) {
    const lb = document.getElementById('lightbox');
    if (lb) {
        document.getElementById('lightbox-img').src = url;
        document.getElementById('lightbox-cat').innerText = cat;
        document.getElementById('lightbox-title').innerText = title;
        lb.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

window.onload = init;
