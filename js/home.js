import { auth, supabase } from './config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function init() {
    // Theme Toggle and Navbar Scroll Logic handled by main.js


    // Check Auth State for Navbar
    onAuthStateChanged(auth, async (user) => {
        const authLink = document.getElementById('auth-link');
        // For now, this file just handles home page logic

        // Load Dynamic Content
        loadLatestBlogs();
    });

    // Handle Contact Form
    setupContactForm();
}

function setupContactForm() {
    const contactForm = document.getElementById('homeContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin inline-block mr-2"></i> Sending...';
            if (window.lucide) window.lucide.createIcons();
            submitBtn.disabled = true;

            const inputs = form.querySelectorAll('input, select, textarea');
            const data = {
                name: inputs[0].value,
                email: inputs[1].value,
                subject: inputs[2].value, // Service Type mapped to subject
                message: inputs[3].value
            };

            try {
                const { error } = await supabase
                    .from('messages')
                    .insert([data]);

                if (error) throw error;

                alert('Message sent successfully! We will contact you shortly.');
                form.reset();
            } catch (err) {
                console.error("Error sending message: ", err);
                alert('Failed to send message. Please try again later. ' + err.message);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

async function loadLatestBlogs() {
    const container = document.getElementById('latest-blog-container');
    if (!container) return;

    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        if (blogs.length > 0) {
            container.innerHTML = '';
            blogs.forEach(blog => {
                const date = new Date(blog.created_at).toLocaleDateString();

                // Plain text excerpt
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = blog.content;
                const plainText = tempDiv.textContent || tempDiv.innerText || "";
                const excerpt = plainText.substring(0, 100) + "...";

                const html = `
                    <article class="group">
                        <div class="block overflow-hidden rounded-2xl aspect-[16/10] mb-6">
                            <img src="${blog.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${blog.title}">
                        </div>
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
        console.error("Failed to load latest blogs:", err);
    }
}

// Initial Call
init();
window.toggleMobileMenu = () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}
