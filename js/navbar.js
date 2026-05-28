import { supabase } from './config.js';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}

export function initNavbar() {
    console.log("Navbar initialized");

    // Profile Dropdown Toggle
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            console.log("Dropdown toggled:", profileDropdown.classList.contains('show'));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });

        // Close dropdown on scroll
        window.addEventListener('scroll', () => {
            if (profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        }, { passive: true });
    }

    // Make logout globally available if needed
    window.logout = () => {
        localStorage.clear();
        window.location.assign('signin.html');
    };
}


