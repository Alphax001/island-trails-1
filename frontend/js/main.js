// Island Trails - Main JavaScript

// Global variables
let currentUser = null;
let currentSection = 'home';

// API configuration
const API_BASE_URL = '/WAD/island-trails/api';

// DOM elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navAuth = document.getElementById('nav-auth');
const navUser = document.getElementById('nav-user');
const userBtn = document.getElementById('user-btn');
const userName = document.getElementById('user-name');
const dropdownMenu = document.getElementById('dropdown-menu');
const logoutBtn = document.getElementById('logout-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthToken();
});

// Initialize application
function initializeApp() {
    // Set initial section based on hash or default to home
    const hash = window.location.hash.substring(1);
    const section = hash || 'home';
    showSection(section);
    
    // Update active nav link
    updateActiveNavLink(section);
}

// Setup event listeners
function setupEventListeners() {
    // Navigation toggle
    navToggle?.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            closeMobileMenu();
        });
    });
    
    // User dropdown
    userBtn?.addEventListener('click', toggleUserDropdown);
    
    // Logout
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            closeUserDropdown();
        }
    });
    
    // Window events
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            closeMobileMenu();
        }
    });
}

// Check for existing auth token
function checkAuthToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token and get user info
        verifyToken(token);
    }
}

// Verify auth token
async function verifyToken(token) {
    try {
        // For now, we'll assume the token is valid if it exists
        // You can uncomment the API call below when the profile endpoint is working
        /*
        const response = await fetch(`${API_BASE_URL}/auth/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.user) {
            currentUser = data.user;
            updateAuthUI(true);
        } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
            updateAuthUI(false);
        }
        */
        
        // Temporary solution: assume token is valid and create a basic user object
        if (token && token.length > 0) {
            // Decode the JWT payload to get user info (basic decoding, not cryptographically verified)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                currentUser = {
                    id: payload.uid,
                    role: payload.role || 'customer',
                    name: 'User', // Default name since we don't have it in the token
                    email: 'user@example.com' // Default email
                };
                updateAuthUI(true);
            } catch(e) {
                localStorage.removeItem('authToken');
                updateAuthUI(false);
            }
        } else {
            localStorage.removeItem('authToken');
            updateAuthUI(false);
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('authToken');
        updateAuthUI(false);
    }
}

// Update authentication UI
function updateAuthUI(isAuthenticated) {
    if (isAuthenticated && currentUser) {
        navAuth.classList.add('hidden');
        navUser.classList.remove('hidden');
        userName.textContent = currentUser.name || currentUser.email;
        
        // Show user-specific sections in navigation
        document.querySelectorAll('.nav-link[data-section="bookings"]').forEach(link => {
            link.style.display = 'block';
        });
    } else {
        navAuth.classList.remove('hidden');
        navUser.classList.add('hidden');
        currentUser = null;
        
        // Hide user-specific sections
        document.querySelectorAll('.nav-link[data-section="bookings"]').forEach(link => {
            link.style.display = 'none';
        });
        
        // Redirect to home if on protected section
        if (['bookings', 'profile', 'settings'].includes(currentSection)) {
            showSection('home');
        }
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update URL hash
        window.location.hash = sectionId;
        
        // Update active nav link
        updateActiveNavLink(sectionId);
        
        // Load section-specific content
        loadSectionContent(sectionId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section link
    document.querySelectorAll(`.nav-link[data-section="${sectionId}"]`).forEach(link => {
        link.classList.add('active');
    });
}

// Load section-specific content
function loadSectionContent(sectionId) {
    switch (sectionId) {
        case 'packages':
            if (typeof loadPackages === 'function') {
                loadPackages();
            }
            break;
        case 'bookings':
            const token = localStorage.getItem('authToken');
            if (currentUser && typeof loadBookings === 'function') {
                loadBookings();
            } else if (token && typeof loadBookings === 'function') {
                // User has a token but currentUser might not be loaded yet
                // Wait a bit for token verification to complete
                setTimeout(() => {
                    if (currentUser) {
                        loadBookings();
                    } else {
                        // Token verification failed, redirect to login
                        showToast('Please log in to view your bookings', 'warning');
                        showSection('login');
                    }
                }, 500);
            } else if (!token) {
                showToast('Please log in to view your bookings', 'warning');
                showSection('login');
            }
            break;
    }
}

// Handle hash change
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentSection) {
        showSection(hash);
    }
}

// Handle scroll
function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Add navbar background on scroll
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Handle resize
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
        closeUserDropdown();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Close mobile menu
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = userBtn.closest('.user-dropdown');
    dropdown.classList.toggle('active');
}

// Close user dropdown
function closeUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI(false);
    showSection('home');
    showToast('Logged out successfully', 'success');
    closeUserDropdown();
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show toast notification
function showToast(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const titles = {
        success: title || 'Success',
        error: title || 'Error',
        warning: title || 'Warning',
        info: title || 'Info'
    };
    
    toast.innerHTML = `
        <i class="toast-icon ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this)">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

// Remove toast
function removeToast(closeBtn) {
    const toast = closeBtn.closest('.toast');
    if (toast) {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// API Helper functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password
function isValidPassword(password) {
    // At least 8 characters
    return password.length >= 8;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Global functions for template use
window.showSection = showSection;
window.showToast = showToast;
window.removeToast = removeToast;
window.apiRequest = apiRequest;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
