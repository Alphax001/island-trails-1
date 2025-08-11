// Simple App Core - Island Trails Elegant Frontend
let currentUser = null;
let allPackages = [];
let userBookings = [];

// Simple initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌴 Island Trails - Simple & Elegant Frontend Starting...');
    
    // Initialize app
    initializeApp();
});

function initializeApp() {
    try {
        // Check authentication
        const token = localStorage.getItem('token');
        if (token) {
            currentUser = JSON.parse(localStorage.getItem('user'));
            updateUserInterface();
        }
        
        // Load packages
        loadPackages();
        
        // Setup page navigation
        setupPageNavigation();
        
        // Setup form handlers
        setupFormHandlers();
        
        console.log('✨ App initialized successfully');
        
    } catch (error) {
        console.error('❌ App initialization error:', error);
        if (window.simpleToast) {
            window.simpleToast.error('Failed to initialize app');
        }
    }
}

function updateUserInterface() {
    if (currentUser) {
        // Update user display
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>${currentUser.first_name || currentUser.username}</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
        
        // Show logout option
        const dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <a href="#" onclick="navigateTo('bookings-page')" class="dropdown-item">
                    <i class="fas fa-calendar"></i> My Bookings
                </a>
                <a href="#" onclick="logout()" class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
        }
    } else {
        // Show login option
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Login</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
        
        const dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <a href="#" onclick="openModal('login-modal')" class="dropdown-item">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="#" onclick="openModal('register-modal')" class="dropdown-item">
                    <i class="fas fa-user-plus"></i> Register
                </a>
            `;
        }
    }
}

function setupPageNavigation() {
    // Set home page as default
    const homePage = document.getElementById('home-page');
    if (homePage) {
        homePage.classList.add('active');
    }
    
    // Update nav active state
    const homeNavLink = document.querySelector('.nav-link[data-page="home-page"]');
    if (homeNavLink) {
        homeNavLink.classList.add('active');
    }
}

function setupFormHandlers() {
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
    
    // Booking forms
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('booking-form')) {
            e.preventDefault();
            handleBooking(e.target);
        }
    });
}

// Modal functions
function openModal(modalId) {
    if (window.simpleModal) {
        window.simpleModal.open(modalId);
    }
}

function closeModal(modalId) {
    if (window.simpleModal) {
        window.simpleModal.close(modalId);
    }
}

// Simple logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateUserInterface();
    
    if (window.simpleToast) {
        window.simpleToast.success('Logged out successfully');
    }
    
    // Navigate to home
    if (window.navigateTo) {
        window.navigateTo('home-page');
    }
}

// Error handling
function handleError(error, customMessage = 'An error occurred') {
    console.error('Error:', error);
    
    if (window.simpleToast) {
        window.simpleToast.error(customMessage);
    }
    
    if (window.simpleLoading) {
        window.simpleLoading.hide();
    }
}

// Success handling
function handleSuccess(message) {
    if (window.simpleToast) {
        window.simpleToast.success(message);
    }
}

// Global functions for compatibility
window.openModal = openModal;
window.closeModal = closeModal;
window.logout = logout;
window.handleError = handleError;
window.handleSuccess = handleSuccess;

// Global state
let currentUser = null;
let currentPage = 'home';
let allPackages = [];
let userBookings = [];

// API Configuration
const API_BASE_URL = '/WAD/island-trails/api';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const guestMenu = document.getElementById('guest-menu');
const userMenu = document.getElementById('user-menu');
const userName = document.getElementById('user-name');
const customerMenu = document.getElementById('customer-menu');
const adminMenu = document.getElementById('admin-menu');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
async function initializeApp() {
    setupEventListeners();
    await checkAuthStatus();
    showPage('home');
    loadFeaturedPackages();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });
    
    // Dropdown menu links
    document.querySelectorAll('.dropdown-menu a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Search form
    document.getElementById('search-form').addEventListener('submit', handleSearch);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Show page
function showPage(pageId) {
    // Update navigation
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
    
    // Update pages
    pages.forEach(page => {
        page.classList.toggle('active', page.id === `${pageId}-page`);
    });
    
    currentPage = pageId;
    
    // Load page content
    loadPageContent(pageId);
}

// Load page content
async function loadPageContent(pageId) {
    showLoading();
    
    try {
        switch (pageId) {
            case 'packages':
                await loadPackages();
                break;
            case 'my-bookings':
                if (requireAuth()) {
                    await loadUserBookings();
                }
                break;
            case 'past-bookings':
                if (requireAuth()) {
                    await loadPastBookings();
                }
                break;
            case 'admin-dashboard':
                if (requireAuth('admin')) {
                    await loadAdminDashboard();
                }
                break;
            case 'admin-packages':
                if (requireAuth('admin')) {
                    await loadAdminPackages();
                }
                break;
            default:
                // Home or other pages don't need async loading
                break;
        }
    } catch (error) {
        console.error('Error loading page content:', error);
        showToast('Failed to load page content', 'error');
    } finally {
        hideLoading();
    }
}

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        updateAuthUI(null);
        return;
    }
    
    try {
        const response = await apiRequest('/auth/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 'success') {
            currentUser = response.data;
            updateAuthUI(currentUser);
        } else {
            localStorage.removeItem('authToken');
            updateAuthUI(null);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        updateAuthUI(null);
    }
}

// Update authentication UI
function updateAuthUI(user) {
    if (user) {
        guestMenu.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userName.textContent = user.name || user.email;
        
        // Update avatar
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=003580&color=fff`;
        }
        
        // Show/hide admin menu
        if (user.role === 'admin') {
            adminMenu.classList.remove('hidden');
            customerMenu.classList.add('hidden');
        } else {
            adminMenu.classList.add('hidden');
            customerMenu.classList.remove('hidden');
        }
    } else {
        guestMenu.classList.remove('hidden');
        userMenu.classList.add('hidden');
        adminMenu.classList.add('hidden');
        customerMenu.classList.remove('hidden');
    }
}

// Require authentication
function requireAuth(role = null) {
    if (!currentUser) {
        showToast('Please sign in to continue', 'warning');
        showLogin();
        return false;
    }
    
    if (role && currentUser.role !== role) {
        showToast('Access denied', 'error');
        showPage('home');
        return false;
    }
    
    return true;
}

// Load featured packages
async function loadFeaturedPackages() {
    try {
        const response = await apiRequest('/packages/package/readAll');
        if (response.status === 'success') {
            allPackages = response.data;
            renderFeaturedPackages(allPackages.slice(0, 3));
        }
    } catch (error) {
        console.error('Error loading featured packages:', error);
    }
}

// Render featured packages
function renderFeaturedPackages(packages) {
    const grid = document.getElementById('featured-packages-grid');
    if (!grid) return;
    
    grid.innerHTML = packages.map(pkg => `
        <div class="card" onclick="showPackageDetails(${pkg.id})">
            <div class="card-image">
                <img src="${pkg.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}" 
                     alt="${pkg.title}" loading="lazy">
            </div>
            <div class="card-content">
                <h3 class="card-title">${pkg.title}</h3>
                <div class="card-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${pkg.location || 'Sri Lanka'}</span>
                    <span><i class="fas fa-clock"></i> ${pkg.duration || 'Duration TBD'}</span>
                </div>
                <p class="card-description">${truncateText(pkg.description, 100)}</p>
                <div class="card-footer">
                    <div class="card-price">
                        ${formatCurrency(pkg.price)}
                        <span class="per">per person</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); bookPackage(${pkg.id})">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle search
async function handleSearch(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination-input').value;
    const checkinDate = document.getElementById('checkin-date').value;
    const guests = document.getElementById('guests-select').value;
    
    // Navigate to packages page with search parameters
    showPage('packages');
    
    // Apply search filters (you can implement this based on your needs)
    if (destination) {
        // Filter packages by destination
        const filtered = allPackages.filter(pkg => 
            pkg.title.toLowerCase().includes(destination.toLowerCase()) ||
            pkg.location.toLowerCase().includes(destination.toLowerCase()) ||
            pkg.description.toLowerCase().includes(destination.toLowerCase())
        );
        renderPackages(filtered);
    }
}

// Handle filter
function handleFilter(e) {
    const filterBtn = e.target;
    const filter = filterBtn.dataset.filter;
    
    // Update active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    filterBtn.classList.add('active');
    
    // Apply filter
    let filtered = allPackages;
    
    if (filter !== 'all') {
        filtered = allPackages.filter(pkg => {
            const searchText = `${pkg.title} ${pkg.description} ${pkg.location}`.toLowerCase();
            return searchText.includes(filter.toLowerCase());
        });
    }
    
    renderPackages(filtered);
}

// Handle sort
function handleSort(e) {
    const sortBy = e.target.value;
    let sorted = [...allPackages];
    
    switch (sortBy) {
        case 'price-low':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'rating':
            // Implement rating sort if you have ratings
            break;
        default:
            // Keep original order for 'recommended'
            break;
    }
    
    renderPackages(sorted);
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI(null);
    showPage('home');
    showToast('Signed out successfully', 'success');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// Loading state
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Toast notifications
function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(element) {
    const toast = element.closest ? element.closest('.toast') : element;
    if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showLogin() {
    showModal('login-modal');
}

function showRegister() {
    closeModal('login-modal');
    showModal('register-modal');
}

// Export functions for global use
window.showPage = showPage;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showModal = showModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.removeToast = removeToast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.apiRequest = apiRequest;
window.requireAuth = requireAuth;
