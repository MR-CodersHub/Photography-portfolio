import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

async function loadBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) return;

    try {
        const { data: blog, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (blog) {
            document.getElementById('blog-title').innerText = blog.title;
            const date = new Date(blog.created_at).toLocaleDateString('en-US', { dateStyle: 'long' });
            document.getElementById('blog-date').innerText = date;

            const img = document.getElementById('header-img');
            img.src = blog.image;
            img.onerror = () => { img.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200' };

            document.getElementById('blog-content').innerHTML = blog.content;
            document.getElementById('blog-category').innerText = blog.category || 'Blog';
            document.title = `${blog.title} | Lumina Studio`;

        } else {
            document.getElementById('blog-title').innerText = 'Article Not Found';
        }
    } catch (err) {
        console.error('Failed to load blog details from Supabase', err);
        document.getElementById('blog-title').innerText = 'Error loading article';
    }
}

loadBlogDetails();
