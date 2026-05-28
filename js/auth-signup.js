import { supabase } from './config.js';

if (window.lucide) {
    window.lucide.createIcons();
}

const signUpForm = document.getElementById('signUpForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const toggleVerifyBtn = document.getElementById('toggleVerifyPassword');
const verifyInput = document.getElementById('verifyPassword');

// Toggle password visibility
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        togglePasswordBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i>`;
        if (window.lucide) window.lucide.createIcons();
    });
}

// Toggle verify password visibility
if (toggleVerifyBtn && verifyInput) {
    toggleVerifyBtn.addEventListener('click', () => {
        const isPassword = verifyInput.type === 'password';
        verifyInput.type = isPassword ? 'text' : 'password';

        toggleVerifyBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i>`;
        if (window.lucide) window.lucide.createIcons();
    });
}

// Handle sign up
if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = signUpForm.querySelector('button[type="submit"]');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value.trim();
        const errorDiv = document.getElementById('errorMessage');

        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        // Validation
        if (!name || !email || !password) {
            errorDiv.textContent = 'All fields are required.';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters.';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Loading
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';
        btn.classList.add('opacity-70', 'cursor-not-allowed');
        if (window.lucide) window.lucide.createIcons();

        try {
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (existingUser) {
                throw new Error('An account with this email already exists.');
            }

            // Save user to mock Supabase (localStorage)
            const newUser = {
                name,
                email,
                password, // In a real app, never store plain passwords
                role: 'user',
                created_at: new Date().toISOString()
            };

            const { error: insertError } = await supabase.from('users').insert(newUser);
            if (insertError) throw insertError;

            // Set session
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);

            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();

            // Success redirect
            setTimeout(() => {
                window.location.assign('index.html');
            }, 300);

        } catch (err) {
            errorDiv.textContent = err.message || 'Something went wrong. Please try again.';
            errorDiv.classList.remove('hidden');
            btn.innerHTML = 'Create Account';
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-not-allowed');
            if (window.lucide) window.lucide.createIcons();
        }
    });
}
