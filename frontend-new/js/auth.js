// Authentication Module

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Modal navigation
    const showRegisterBtn = document.getElementById('show-register');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
    }
    
    const showLoginBtn = document.getElementById('show-login');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('register-modal');
            showModal('login-modal');
        });
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Update button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        
        const response = await apiRequest('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (response.status === 'success' && response.data.token) {
            // Store token
            localStorage.setItem('authToken', response.data.token);
            
            // Update current user
            currentUser = response.data.user;
            
            // Update UI
            updateAuthUI(currentUser);
            
            // Close modal
            closeModal('login-modal');
            
            // Reset form
            form.reset();
            
            // Show success message
            showToast(`Welcome back, ${currentUser.name || currentUser.email}!`, 'success');
            
            // Redirect to appropriate page
            if (currentUser.role === 'admin') {
                showPage('admin-dashboard');
            } else {
                showPage('home');
            }
        } else {
            showToast(response.message || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Update button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        const response = await apiRequest('/auth/user/register', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: 'customer' // Default role
            })
        });
        
        if (response.status === 'success') {
            // Close modal
            closeModal('register-modal');
            
            // Reset form
            form.reset();
            
            // Show success message
            showToast('Account created successfully! Please sign in.', 'success');
            
            // Show login modal
            showModal('login-modal');
        } else {
            showToast(response.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('duplicate') || error.message.includes('exists')) {
            showToast('An account with this email already exists', 'error');
        } else {
            showToast('Registration failed. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Social login (placeholder for future implementation)
function handleGoogleLogin() {
    showToast('Google login coming soon!', 'info');
}

function handleFacebookLogin() {
    showToast('Facebook login coming soon!', 'info');
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('Use at least 8 characters');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include uppercase letters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include lowercase letters');
    }
    
    // Number check
    if (/\d/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include numbers');
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include special characters');
    }
    
    return {
        strength: strength,
        feedback: feedback,
        level: getStrengthLevel(strength)
    };
}

function getStrengthLevel(strength) {
    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    if (strength <= 4) return 'strong';
    return 'very-strong';
}

// Update password strength indicator
function updatePasswordStrength(password, indicatorId) {
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;
    
    const result = checkPasswordStrength(password);
    
    indicator.className = `password-strength ${result.level}`;
    indicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text">
            ${result.level.replace('-', ' ').toUpperCase()}
        </div>
    `;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('authToken') && currentUser;
}

// Check if user has specific role
function hasRole(role) {
    return currentUser && currentUser.role === role;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Auto-logout on token expiry
function setupTokenExpiration() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        // Decode JWT token to get expiration (if using JWT)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
            // Token expired
            logout();
            showToast('Your session has expired. Please sign in again.', 'warning');
        } else if (payload.exp) {
            // Set timeout for auto-logout
            const timeUntilExpiry = (payload.exp - now) * 1000;
            setTimeout(() => {
                logout();
                showToast('Your session has expired. Please sign in again.', 'warning');
            }, timeUntilExpiry);
        }
    } catch (error) {
        console.error('Error checking token expiration:', error);
    }
}

// Update user profile
async function updateProfile(profileData) {
    try {
        const response = await apiRequest('/auth/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        if (response.status === 'success') {
            currentUser = { ...currentUser, ...response.data };
            updateAuthUI(currentUser);
            showToast('Profile updated successfully', 'success');
            return true;
        } else {
            showToast(response.message || 'Failed to update profile', 'error');
            return false;
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showToast('Failed to update profile', 'error');
        return false;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const response = await apiRequest('/auth/user/change-password', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        
        if (response.status === 'success') {
            showToast('Password changed successfully', 'success');
            return true;
        } else {
            showToast(response.message || 'Failed to change password', 'error');
            return false;
        }
    } catch (error) {
        console.error('Password change error:', error);
        showToast('Failed to change password', 'error');
        return false;
    }
}

// Initialize token expiration check
document.addEventListener('DOMContentLoaded', function() {
    setupTokenExpiration();
});

// Export functions
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.togglePassword = togglePassword;
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.updatePasswordStrength = updatePasswordStrength;
window.isAuthenticated = isAuthenticated;
window.hasRole = hasRole;
window.getCurrentUser = getCurrentUser;
window.updateProfile = updateProfile;
window.changePassword = changePassword;
