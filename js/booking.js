import { supabase } from './config.js';

// Initialize Lucide
if (window.lucide) {
    window.lucide.createIcons();
}

// Set minimum date to today
const bookingDateInput = document.getElementById('bookingDate');
if (bookingDateInput) {
    bookingDateInput.min = new Date().toISOString().split('T')[0];
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin inline-block mr-2"></i> Submitting...';
        if (window.lucide) window.lucide.createIcons();
        submitBtn.disabled = true;

        const inputs = form.querySelectorAll('input, select, textarea');
        // Order: First Name, Last Name, Email, Phone, Service, Date, Message
        const firstName = inputs[0].value;
        const lastName = inputs[1].value;
        const email = inputs[2].value;
        const phone = inputs[3].value;
        const service = inputs[4].value;
        const date = inputs[5].value;
        const message = inputs[6].value;

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([
                    {
                        customer_name: `${firstName} ${lastName}`,
                        email: email,
                        phone: phone,
                        service_type: service,
                        booking_date: date,
                        message: message,
                        status: 'pending',
                        total_price: 0 // Placeholder, logic could be added to estimate price based on service
                    }
                ]);

            if (error) throw error;

            alert('Booking request sent successfully!');
            form.reset();

        } catch (err) {
            console.error("Booking Error: ", err);
            alert('Failed to send booking request: ' + err.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
