import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

async function loadGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    try {
        const { data: images, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(9); // Limit to recent 9 uploads

        if (error) throw error;

        if (images.length > 0) {
            container.innerHTML = '';
            images.forEach(img => {
                const html = `
                    <div class="relative group overflow-hidden rounded-xl">
                        <img src="${img.image_path}" class="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" alt="${img.title}">
                        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                            <h3 class="text-xl font-bold text-amber-500 mb-2">${img.title}</h3>
                            <span class="text-sm tracking-widest uppercase text-white">${img.category}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
            
            // Re-initialize icons if any new ones were added (though none in this HTML)
            if (window.lucide) window.lucide.createIcons();

        } else {
            container.innerHTML = '<p class="text-zinc-500 text-center col-span-full">No images found.</p>';
        }
    } catch (err) {
        console.error('Failed to load gallery from Supabase', err);
        container.innerHTML = '<p class="text-red-500 text-center col-span-full">Failed to load gallery.</p>';
    }
}

// Load gallery on start
loadGallery();
