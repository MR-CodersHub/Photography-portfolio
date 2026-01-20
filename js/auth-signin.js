// login.js

if (window.lucide) {
    window.lucide.createIcons();
}

const signInForm = document.getElementById('signInForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Toggle password
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        const icon = togglePasswordBtn.querySelector('i');
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
    });
}

// Handle login
if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = signInForm.querySelector('button[type="submit"]');
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value.trim();
        const errorDiv = document.getElementById('errorMessage');

        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        if (!email || !password) {
            errorDiv.textContent = 'Email and password are required.';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Loading
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';
        btn.classList.add('opacity-70', 'cursor-not-allowed');
        if (window.lucide) window.lucide.createIcons();

        // Fake auth
        setTimeout(() => {
            // Hardcoded Admin Check
            if (email === 'admin@gmail.com' && password === 'admin123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', 'System Admin');

                // Allow proceeding to success block
            } else if (password.length < 6) {
                // ... existing error logic ...
                errorDiv.textContent = 'Invalid email or password.';
                errorDiv.classList.remove('hidden');

                btn.innerHTML = 'Log In';
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
                return;
            }

            // If not admin (since if block handles admin setting), we still need to set session for normal users
            if (email !== 'admin@gmail.com') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
            }

            // Success
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                if (email === 'admin@gmail.com') {
                    window.location.assign('admin/dashboard.html');
                } else {
                    window.location.assign('index.html');
                }
            }, 300);
        }, 700);
    });
}
// auth-ui.js

const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

const profileDropdown = document.getElementById('profileDropdown');
const dashboardLink = document.getElementById('dashboardLink');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');

if (isLoggedIn) {
    dashboardLink?.classList.remove('hidden');
    logoutBtn?.classList.remove('hidden');
    loginLink?.classList.add('hidden');
} else {
    dashboardLink?.classList.add('hidden');
    logoutBtn?.classList.add('hidden');
    loginLink?.classList.remove('hidden');
}

// Logout
logoutBtn?.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace('/login.html');
});
