import { auth, supabase } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function initNavbar() {
    console.log("Navbar initialized");

    // Check Auth State from LocalStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail');

    updateNavbarForUser(isLoggedIn, email);

    // Make logout globally available
    window.logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    };
}

function updateNavbarForUser(isLoggedIn, email) {
    const loginLink = document.querySelector('a[href="signin.html"]');
    const signupLink = document.querySelector('a[href="signup.html"]');
    const authLinksContainer = document.getElementById('auth-links');

    if (isLoggedIn) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none'; // Or classList.add('hidden')
        if (signupLink) signupLink.style.display = 'none';
        if (authLinksContainer) {
            authLinksContainer.classList.remove('hidden');
            checkUserRole(email);
        }
    } else {
        // User is logged out
        if (loginLink) loginLink.style.display = ''; // Reset
        if (signupLink) signupLink.style.display = '';
        if (authLinksContainer) authLinksContainer.classList.add('hidden');
    }
}

async function checkUserRole(email) {
    try {
        const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .single();

        if (userData && userData.role === 'admin') {
            const dashboardLink = document.querySelector('#auth-links a[href*="dashboard"]');
            if (dashboardLink) dashboardLink.href = 'admin/dashboard.html';
        } else {
            const dashboardLink = document.querySelector('#auth-links a[href*="dashboard"]');
            if (dashboardLink) dashboardLink.href = 'user/dashboard.html';
        }
    } catch (err) {
        console.error("Error checking role:", err);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
