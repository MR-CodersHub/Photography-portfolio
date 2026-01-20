// signup.js

if (window.lucide) {
    window.lucide.createIcons();
}

const signUpForm = document.getElementById('signUpForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Toggle password visibility
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        const icon = togglePasswordBtn.querySelector('i');
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
    });
}

// Handle sign up
if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
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

        // Fake async signup
        setTimeout(() => {
            // Save fake user
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);

            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();

            // Redirect to home
            setTimeout(() => {
                window.location.assign('/index.html');
            }, 300);
        }, 800);
    });
}
