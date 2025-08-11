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

// Load packages from API
async function loadPackages() {
    try {
        if (window.simpleLoading) {
            window.simpleLoading.show('Loading packages...');
        }
        
        const response = await fetch('src/api/packages/packageApi.php');
        const data = await response.json();
        
        if (data.success) {
            allPackages = data.packages;
            displayPackages(allPackages);
            
            if (window.simpleToast) {
                window.simpleToast.success('Packages loaded successfully');
            }
        } else {
            throw new Error(data.message || 'Failed to load packages');
        }
        
    } catch (error) {
        console.error('Error loading packages:', error);
        if (window.simpleToast) {
            window.simpleToast.error('Failed to load packages');
        }
    } finally {
        if (window.simpleLoading) {
            window.simpleLoading.hide();
        }
    }
}

// Display packages
function displayPackages(packages) {
    const packagesContainer = document.getElementById('packages-container');
    if (!packagesContainer) return;
    
    if (!packages || packages.length === 0) {
        packagesContainer.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-map-marked-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No packages available at the moment.</p>
            </div>
        `;
        return;
    }
    
    packagesContainer.innerHTML = packages.map(package => `
        <div class="package-card">
            <div class="package-image">
                <img src="${package.image_url || 'frontend-new/images/default-package.jpg'}" 
                     alt="${package.name}" 
                     loading="lazy">
                <div class="package-price">$${package.price}</div>
            </div>
            <div class="package-content">
                <h3 class="package-title">${package.name}</h3>
                <p class="package-description">${package.description}</p>
                <div class="package-details">
                    <div class="package-duration">
                        <i class="fas fa-clock"></i>
                        ${package.duration} days
                    </div>
                    <div class="package-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${package.location || 'Island Location'}
                    </div>
                </div>
                <button onclick="bookPackage(${package.id})" class="btn btn-primary w-full">
                    <i class="fas fa-calendar-plus"></i>
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

// Book package
function bookPackage(packageId) {
    if (!currentUser) {
        if (window.simpleToast) {
            window.simpleToast.warning('Please login to book a package');
        }
        openModal('login-modal');
        return;
    }
    
    const packageData = allPackages.find(p => p.id === packageId);
    if (!packageData) {
        if (window.simpleToast) {
            window.simpleToast.error('Package not found');
        }
        return;
    }
    
    // Fill booking modal with package data
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.querySelector('#booking-package-name').textContent = packageData.name;
        modal.querySelector('#booking-package-price').textContent = `$${packageData.price}`;
        modal.querySelector('#booking-package-id').value = packageId;
        
        openModal('booking-modal');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        if (window.simpleLoading) {
            window.simpleLoading.show('Logging in...');
        }
        
        const response = await fetch('src/api/auth/userApi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'login', ...loginData })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            
            updateUserInterface();
            closeModal('login-modal');
            
            if (window.simpleToast) {
                window.simpleToast.success('Login successful!');
            }
            
            // Reset form
            e.target.reset();
            
        } else {
            throw new Error(data.message || 'Login failed');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        if (window.simpleToast) {
            window.simpleToast.error(error.message || 'Login failed');
        }
    } finally {
        if (window.simpleLoading) {
            window.simpleLoading.hide();
        }
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const registerData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name')
    };
    
    // Validate password confirmation
    const confirmPassword = formData.get('confirm_password');
    if (registerData.password !== confirmPassword) {
        if (window.simpleToast) {
            window.simpleToast.error('Passwords do not match');
        }
        return;
    }
    
    try {
        if (window.simpleLoading) {
            window.simpleLoading.show('Creating account...');
        }
        
        const response = await fetch('src/api/auth/userApi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'register', ...registerData })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (window.simpleToast) {
                window.simpleToast.success('Registration successful! Please login.');
            }
            
            closeModal('register-modal');
            openModal('login-modal');
            
            // Reset form
            e.target.reset();
            
        } else {
            throw new Error(data.message || 'Registration failed');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        if (window.simpleToast) {
            window.simpleToast.error(error.message || 'Registration failed');
        }
    } finally {
        if (window.simpleLoading) {
            window.simpleLoading.hide();
        }
    }
}

// Handle booking
async function handleBooking(form) {
    if (!currentUser) {
        if (window.simpleToast) {
            window.simpleToast.warning('Please login to make a booking');
        }
        return;
    }
    
    const formData = new FormData(form);
    const bookingData = {
        package_id: formData.get('package_id'),
        booking_date: formData.get('booking_date'),
        number_of_people: formData.get('number_of_people'),
        special_requests: formData.get('special_requests') || ''
    };
    
    try {
        if (window.simpleLoading) {
            window.simpleLoading.show('Processing booking...');
        }
        
        const response = await fetch('src/api/bookings/bookingApi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ action: 'create', ...bookingData })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (window.simpleToast) {
                window.simpleToast.success('Booking successful!');
            }
            
            closeModal('booking-modal');
            form.reset();
            
            // Refresh bookings if on bookings page
            if (document.getElementById('bookings-page').classList.contains('active')) {
                loadUserBookings();
            }
            
        } else {
            throw new Error(data.message || 'Booking failed');
        }
        
    } catch (error) {
        console.error('Booking error:', error);
        if (window.simpleToast) {
            window.simpleToast.error(error.message || 'Booking failed');
        }
    } finally {
        if (window.simpleLoading) {
            window.simpleLoading.hide();
        }
    }
}

// Load user bookings
async function loadUserBookings() {
    if (!currentUser) {
        if (window.simpleToast) {
            window.simpleToast.warning('Please login to view bookings');
        }
        return;
    }
    
    try {
        if (window.simpleLoading) {
            window.simpleLoading.show('Loading bookings...');
        }
        
        const response = await fetch('src/api/bookings/bookingApi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ action: 'get_user_bookings' })
        });
        
        const data = await response.json();
        
        if (data.success) {
            userBookings = data.bookings;
            displayUserBookings(userBookings);
        } else {
            throw new Error(data.message || 'Failed to load bookings');
        }
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        if (window.simpleToast) {
            window.simpleToast.error('Failed to load bookings');
        }
    } finally {
        if (window.simpleLoading) {
            window.simpleLoading.hide();
        }
    }
}

// Display user bookings
function displayUserBookings(bookings) {
    const bookingsContainer = document.getElementById('bookings-container');
    if (!bookingsContainer) return;
    
    if (!bookings || bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No bookings found.</p>
                <button onclick="navigateTo('packages-page')" class="btn btn-primary mt-4">
                    <i class="fas fa-plus"></i> Book a Package
                </button>
            </div>
        `;
        return;
    }
    
    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <h3 class="booking-title">${booking.package_name}</h3>
                <span class="booking-status booking-status-${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <i class="fas fa-calendar"></i>
                    <span>Date: ${booking.booking_date}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-users"></i>
                    <span>People: ${booking.number_of_people}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span>Total: $${booking.total_price}</span>
                </div>
                ${booking.special_requests ? `
                    <div class="booking-detail">
                        <i class="fas fa-comment"></i>
                        <span>Requests: ${booking.special_requests}</span>
                    </div>
                ` : ''}
            </div>
            <div class="booking-actions">
                <button onclick="viewBookingDetails(${booking.id})" class="btn btn-secondary">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${booking.status === 'pending' ? `
                    <button onclick="cancelBooking(${booking.id})" class="btn btn-danger">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
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

// Additional modal functions for compatibility
function showLogin() {
    openModal('login-modal');
}

function showRegister() {
    openModal('register-modal');
}

function showCreatePackageModal() {
    openModal('create-package-modal');
}

// Navigation helper
function navigateToBookings() {
    navigateTo('bookings-page');
    if (currentUser) {
        loadUserBookings();
    }
}

// Global functions for compatibility
window.openModal = openModal;
window.closeModal = closeModal;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showCreatePackageModal = showCreatePackageModal;
window.logout = logout;
window.handleError = handleError;
window.handleSuccess = handleSuccess;
window.bookPackage = bookPackage;
window.loadUserBookings = loadUserBookings;
window.navigateToBookings = navigateToBookings;
