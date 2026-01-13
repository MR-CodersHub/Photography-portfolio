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

    // Active Link Highlighting (URL based)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === 'index.html#home')) {
            link.classList.remove('text-gray-300');
            link.classList.add('text-amber-500');
        }
    });

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section[id]');

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

    // Load blog posts for homepage
    async function loadBlogPosts() {
        try {
            const response = await fetch('backend/blogs.php');
            const posts = await response.json();
            const container = document.getElementById('latest-blog-container');

            if (posts.length > 0) {
                container.innerHTML = '';
                // Limit to 3 posts for homepage
                posts.slice(0, 3).forEach(post => {
                    const html = `
                        <article class="group">
                            <div class="block overflow-hidden rounded-2xl aspect-[16/10] mb-6">
                                <img src="${post.image_path}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${post.title}">
                            </div>
                            <div class="flex items-center space-x-4 mb-4 text-xs font-mono uppercase text-zinc-500">
                                <span class="text-amber-500 font-bold">${post.category}</span>
                                <span>•</span>
                                <span>${post.date}</span>
                            </div>
                            <h3 class="text-2xl font-bold mb-3 group-hover:text-amber-500 transition-colors">${post.title}</h3>
                            <p class="text-zinc-400 leading-relaxed mb-4">${post.excerpt}</p>
                            <a href="blog-details.html?id=${post.id}" class="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Read More <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i></a>
                        </article>
                    `;
                    container.innerHTML += html;
                });
            }
        } catch (err) {
            console.error('Failed to load blog posts');
        }
    }

    async function loadGallery() {
        try {
            const response = await fetch('backend/gallery.php');
            // ... rest of loadGallery function ...
        } catch (err) {
            console.error('Failed to load gallery items');
        }
    }

    // Call functions to load dynamic content if elements exist
    if (document.getElementById('latest-blog-container')) {
        loadBlogPosts();
    }
    if (document.getElementById('gallery-container')) { // Assuming a gallery container exists
        loadGallery();
    }

    // Check Authentication Status
    checkAuth();
}


function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Auth Logic
async function checkAuth() {
    try {
        const response = await fetch('backend/auth.php?action=check');
        const data = await response.json();

        if (data.authenticated) {
            // Hide Sign In and Sign Up links
            const authLinksToHide = document.querySelectorAll('a[href="signin.html"], a[href="signup.html"]');
            authLinksToHide.forEach(el => {
                el.style.display = 'none';
            });

            // Show Auth Links (Dashboard / Logout)
            const authLinksContainer = document.getElementById('auth-links');
            if (authLinksContainer) {
                authLinksContainer.classList.remove('hidden');

                // Update Dashboard Link based on Role
                const dashLink = authLinksContainer.querySelector('a');
                if (dashLink) {
                    if (data.role === 'admin') {
                        dashLink.href = 'admin/dashboard.php';
                    } else {
                        dashLink.href = 'user/dashboard.php';
                    }
                }
            }
        }
    } catch (err) {
        console.log('Auth check failed', err);
    }
}

async function logout() {
    try {
        await fetch('backend/auth.php?action=logout');
    } catch (e) {
        console.error("Logout fetch failed", e);
    }
    window.location.href = 'index.html';
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

