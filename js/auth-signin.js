import { supabase } from './config.js';

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

        // Update icon - lucide.createIcons() replaces the element, so we rebuild the core <i>
        togglePasswordBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i>`;
        if (window.lucide) window.lucide.createIcons();
    });
}

// Handle login
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
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

        try {
            // Find user in mock Supabase
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            // Simple password check (in real apps, use proper hashing)
            if (!user || user.password !== password) {
                throw new Error('Invalid email or password.');
            }

            // Success: Set Session
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name || 'User');
            localStorage.setItem('userRole', user.role || 'user');

            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();

            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.assign('admin/dashboard.html');
                } else {
                    window.location.assign('index.html');
                }
            }, 300);

        } catch (err) {
            errorDiv.textContent = err.message || 'Something went wrong.';
            errorDiv.classList.remove('hidden');
            btn.innerHTML = 'Log In';
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-not-allowed');
            if (window.lucide) window.lucide.createIcons();
        }
    });
}
