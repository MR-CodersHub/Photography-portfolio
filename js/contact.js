import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

const contactForm = document.getElementById('contactForm');
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
