import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

async function loadBlogs() {
    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const container = document.getElementById('blog-posts-container');

        if (!container) return;

        if (blogs.length > 0) {
            container.innerHTML = '';
            blogs.forEach(blog => {
                const date = new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                // Plain text excerpt
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = blog.content;
                const plainText = tempDiv.textContent || tempDiv.innerText || "";
                const excerpt = plainText.substring(0, 100) + "...";

                const html = `
                    <article class="group">
                        <a href="blog-details.html?id=${blog.id}" class="block overflow-hidden rounded-2xl aspect-[16/10] mb-6">
                            <img src="${blog.image}"
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="${blog.title}" onerror="this.src='https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'">
                        </a>
                        <div class="flex items-center space-x-4 mb-4 text-xs font-mono uppercase text-zinc-500">
                            <span class="text-amber-500 font-bold">${blog.category || 'Blog'}</span>
                            <span>•</span>
                            <span>${date}</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 group-hover:text-amber-500 transition-colors">${blog.title}</h3>
                        <p class="text-zinc-400 leading-relaxed mb-4">${excerpt}</p>
                        <a href="blog-details.html?id=${blog.id}" class="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Read More <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i></a>
                    </article>
                `;
                container.innerHTML += html;
            });
            if (window.lucide) window.lucide.createIcons();
        }
    } catch (err) {
        console.error('Failed to load blogs from Supabase', err);
    }
}
loadBlogs();
