// Island Trails - Authentication JavaScript

// DOM elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const contactForm = document.getElementById('contact-form');

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAuthEventListeners();
});

// Setup authentication event listeners
function setupAuthEventListeners() {
    // Login form
    loginForm?.addEventListener('submit', handleLogin);
    
    // Register form
    registerForm?.addEventListener('submit', handleRegister);
    
    // Contact form
    contactForm?.addEventListener('submit', handleContactForm);
    
    // Form field validation
    setupFieldValidation();
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await apiRequest('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (response.status === 'success') {
            // Store token
            localStorage.setItem('authToken', response.token);
            
            // Set user data
            currentUser = response.user;
            
            // Update UI
            updateAuthUI(true);
            
            // Show success message
            showToast(`Welcome back, ${response.user.name}!`, 'success');
            
            // Reset form
            loginForm.reset();
            
            // Redirect to appropriate section
            const targetSection = localStorage.getItem('redirectAfterLogin') || 'packages';
            localStorage.removeItem('redirectAfterLogin');
            showSection(targetSection);
            
        } else {
            showToast(response.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const agreeTerms = document.getElementById('terms-agree').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await apiRequest('/auth/user/register', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: 'customer'
            })
        });
        
        if (response.status === 'success') {
            showToast('Account created successfully! Please log in.', 'success');
            
            // Reset form
            registerForm.reset();
            
            // Auto-fill login form
            document.getElementById('login-email').value = email;
            
            // Switch to login
            showSection('login');
            
        } else {
            showToast(response.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    // Validate inputs
    if (!name || !email || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Simulate API call (you can implement actual contact API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('Contact form error:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Setup field validation
function setupFieldValidation() {
    // Email field validation
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', validateEmailField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Password field validation
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('blur', validatePasswordField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Confirm password validation
    const confirmPasswordField = document.getElementById('register-confirm');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('blur', validateConfirmPassword);
        confirmPasswordField.addEventListener('input', clearFieldError);
    }
    
    // Name field validation
    const nameFields = document.querySelectorAll('input[type="text"]');
    nameFields.forEach(field => {
        if (field.id.includes('name')) {
            field.addEventListener('blur', validateNameField);
            field.addEventListener('input', clearFieldError);
        }
    });
}

// Validate email field
function validateEmailField(e) {
    const field = e.target;
    const email = field.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(field, 'Please enter a valid email address');
    } else {
        clearFieldError(field);
    }
}

// Validate password field
function validatePasswordField(e) {
    const field = e.target;
    const password = field.value;
    
    if (password && !isValidPassword(password)) {
        showFieldError(field, 'Password must be at least 8 characters long');
    } else {
        clearFieldError(field);
    }
}

// Validate confirm password
function validateConfirmPassword(e) {
    const field = e.target;
    const confirmPassword = field.value;
    const password = document.getElementById('register-password').value;
    
    if (confirmPassword && confirmPassword !== password) {
        showFieldError(field, 'Passwords do not match');
    } else {
        clearFieldError(field);
    }
}

// Validate name field
function validateNameField(e) {
    const field = e.target;
    const name = field.value.trim();
    
    if (name && name.length < 2) {
        showFieldError(field, 'Name must be at least 2 characters long');
    } else {
        clearFieldError(field);
    }
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Check if user is authenticated
function requireAuth() {
    const token = localStorage.getItem('authToken');
    if (!currentUser && !token) {
        showToast('Please log in to continue', 'warning');
        localStorage.setItem('redirectAfterLogin', currentSection);
        showSection('login');
        return false;
    }
    
    // If we have a token but no currentUser, the token verification is in progress
    // Return true to allow the page to load
    return true;
}

// Auto-login with demo data (for testing)
function quickLogin(userType = 'customer') {
    const demoCredentials = {
        customer: {
            email: 'test@example.com',
            password: 'test123'
        },
        admin: {
            email: 'admin@example.com',
            password: 'admin123'
        }
    };
    
    const creds = demoCredentials[userType];
    if (creds) {
        document.getElementById('login-email').value = creds.email;
        document.getElementById('login-password').value = creds.password;
        showToast(`Demo credentials filled for ${userType}`, 'info');
    }
}

// Password strength indicator
function updatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Include numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Include special characters');
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
    
    return {
        level: levels[strength] || 'Very Weak',
        color: colors[strength] || '#dc3545',
        score: strength,
        feedback: feedback
    };
}

// Export functions for global use
window.requireAuth = requireAuth;
window.quickLogin = quickLogin;
window.updatePasswordStrength = updatePasswordStrength;
