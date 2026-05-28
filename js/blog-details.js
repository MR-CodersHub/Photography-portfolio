import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

async function loadBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        // Redirect to blog listing if no ID
        window.location.href = 'blog.html';
        return;
    }

    try {
        const { data: blog, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (blog) {
            // Update Title and Category with Hero Support
            const titleEl = document.getElementById('blog-title');
            if (titleEl) {
                // If the dynamic title is plain, we apply our hero formatting
                if (!blog.title.includes('<')) {
                    const words = blog.title.split(' ');
                    const lastWord = words.pop();
                    titleEl.innerHTML = `${words.join(' ')} <br> <span class="hero-accent italic">${lastWord}</span>`;
                } else {
                    titleEl.innerHTML = blog.title;
                }
            }

            const catEl = document.getElementById('blog-category');
            if (catEl) {
                catEl.innerText = blog.category || 'Blog';
            }

            const headerImg = document.getElementById('header-img');
            if (headerImg) {
                headerImg.src = blog.image;
                headerImg.onerror = () => {
                    headerImg.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200';
                };
            }

            // Update Metadata
            const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            const dateEl = document.getElementById('blog-date');
            if (dateEl) dateEl.innerText = date;

            const authorEl = document.getElementById('blog-author');
            if (authorEl) authorEl.innerText = blog.author || 'Elias Thorne';

            const readingTimeEl = document.getElementById('blog-reading-time');
            if (readingTimeEl) readingTimeEl.innerText = `Est. Reading: ${blog.reading_time || '8 min'}`;

            const contentEl = document.getElementById('blog-content');
            if (contentEl) {
                contentEl.innerHTML = blog.content;
                // Add some extra space for rich items
                contentEl.classList.add('space-y-12');
            }

            // Refresh Lucide Icons for dynamic content
            if (window.lucide) {
                window.lucide.createIcons();
            }

            document.title = `${blog.title.replace(/<[^>]*>/g, '')} | Lumina Studio`;

            // Load Recent Posts in Sidebar
            loadRecentPosts(id);

        } else {
            document.getElementById('blog-title').innerText = 'Article Not Found';
        }
    } catch (err) {
        console.error('Failed to load blog details from Supabase', err);
        const titleEl = document.getElementById('blog-title');
        if (titleEl) titleEl.innerText = 'Error loading article';
    }
}

async function loadRecentPosts(currentId) {
    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        const sidebarContainer = document.querySelector('aside .space-y-6');
        if (sidebarContainer && blogs) {
            sidebarContainer.innerHTML = '';
            blogs.filter(b => b.id !== currentId).slice(0, 2).forEach(post => {
                const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                sidebarContainer.innerHTML += `
                    <a href="blog-details.html?id=${post.id}" class="flex gap-4 group">
                        <img src="${post.image}"
                            class="w-20 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                            alt="Thumb" onerror="this.src='https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=150'">
                        <div>
                            <h5 class="font-bold text-sm leading-snug group-hover:text-amber-500 transition-colors">
                                ${post.title}</h5>
                            <span class="text-xs text-zinc-500 mt-2 block">${date}</span>
                        </div>
                    </a>
                `;
            });
        }
    } catch (err) {
        console.error('Failed to load recent posts', err);
    }
}

loadBlogDetails();

