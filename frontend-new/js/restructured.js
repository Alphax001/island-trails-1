// Island Trails - Clean & Professional JavaScript

class IslandTrails {
    constructor() {
        this.currentUser = null;
        this.allPackages = [];
        this.userBookings = [];
        this.init();
    }

    init() {
        console.log('🏝️ Island Trails - Initializing...');
        
        // Check authentication
        this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadPackages();
        
        // Update UI
        this.updateUI();
        
        console.log('✅ Island Trails - Ready!');
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                this.currentUser = JSON.parse(user);
                console.log('👤 User authenticated:', this.currentUser);
                console.log('👤 User role:', this.currentUser.role);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }

    updateUI() {
        const guestActions = document.getElementById('guest-actions');
        const userMenu = document.getElementById('user-menu');
        const bookingsNav = document.getElementById('bookings-nav');
        const userName = document.getElementById('user-name');
        const adminSidebar = document.getElementById('admin-sidebar');
        const mainContent = document.querySelector('.main');

        console.log('🔍 updateUI called');
        console.log('🔍 Current user:', this.currentUser);
        console.log('🔍 User role:', this.currentUser?.role);
        console.log('🔍 Admin sidebar element:', adminSidebar);

        if (this.currentUser) {
            // Show user menu, hide guest actions
            if (guestActions) guestActions.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name || this.currentUser.first_name || this.currentUser.username;
            
            // Check if user is admin
            if (this.currentUser.role === 'admin') {
                console.log('🔧 Setting up ADMIN interface');
                console.log('🔧 Showing admin sidebar...');
                // Show admin sidebar
                if (adminSidebar) {
                    adminSidebar.style.setProperty('display', 'block', 'important');
                    console.log('✅ Admin sidebar display set to block with !important');
                } else {
                    console.error('❌ Admin sidebar element not found!');
                }
                if (mainContent) {
                    mainContent.classList.add('with-sidebar');
                    console.log('✅ Added with-sidebar class to main content');
                }
                // Hide regular bookings nav for admin
                if (bookingsNav) bookingsNav.style.display = 'none';
                
                console.log('👨‍💼 Admin user logged in');
            } else {
                console.log('🧳 Setting up CUSTOMER interface');
                // Show customer bookings nav
                if (bookingsNav) bookingsNav.style.display = 'flex';
                // Hide admin sidebar
                if (adminSidebar) adminSidebar.style.display = 'none';
                if (mainContent) mainContent.classList.remove('with-sidebar');
            }
        } else {
            // Show guest actions, hide user menu
            if (guestActions) guestActions.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (bookingsNav) bookingsNav.style.display = 'none';
            
            // Hide admin sidebar
            if (adminSidebar) adminSidebar.style.display = 'none';
            if (mainContent) mainContent.classList.remove('with-sidebar');
        }
    }

    // Debug function to manually show admin sidebar
    showAdminSidebar() {
        const adminSidebar = document.getElementById('admin-sidebar');
        const mainContent = document.querySelector('.main');
        
        console.log('🔧 Manually showing admin sidebar');
        if (adminSidebar) {
            adminSidebar.style.setProperty('display', 'block', 'important');
            console.log('✅ Sidebar shown');
        }
        if (mainContent) {
            mainContent.classList.add('with-sidebar');
            console.log('✅ Main content adjusted');
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // User dropdown
        this.setupUserDropdown();
        
        // Forms
        this.setupForms();
        
        // Modals
        this.setupModals();
        
        // Filters
        this.setupFilters();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Footer links
        document.querySelectorAll('.footer-links a[onclick*="navigateTo"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const onclick = link.getAttribute('onclick');
                const page = onclick.match(/navigateTo\('([^']+)'\)/)?.[1];
                if (page) this.navigateTo(page);
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navLinks = document.getElementById('nav-links');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                
                // Animate hamburger
                const spans = mobileToggle.querySelectorAll('span');
                if (navLinks.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = '';
                }
            });

            // Close mobile menu when clicking nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = '';
                });
            });
        }
    }

    setupUserDropdown() {
        const userBtn = document.getElementById('user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');

        if (userBtn && dropdownMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });
        }
    }

    setupForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Booking form
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
        }

        // Admin forms
        const addPackageForm = document.getElementById('add-package-form');
        if (addPackageForm) {
            addPackageForm.addEventListener('submit', (e) => this.handleAddPackage(e));
        }

        const editPackageForm = document.getElementById('edit-package-form');
        if (editPackageForm) {
            editPackageForm.addEventListener('submit', (e) => this.handleEditPackage(e));
        }
    }

    setupModals() {
        // Close modals when clicking backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = btn.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });
    }

    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterPackages(filter);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    navigateTo(page) {
        console.log('📍 Navigating to:', page);
        console.log('📍 Current user:', this.currentUser);
        console.log('📍 User role:', this.currentUser?.role);

        // Check auth for bookings
        if (page === 'bookings' && !this.currentUser) {
            this.showToast('Please login to view your bookings', 'warning');
            this.openModal('login-modal');
            return;
        }

        // Check admin access for admin pages
        if (page.startsWith('admin-') && (!this.currentUser || this.currentUser.role !== 'admin')) {
            console.log('❌ Admin access denied for page:', page);
            this.showToast('Admin access required', 'error');
            return;
        }

        console.log('✅ Access granted for page:', page);

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
                console.log('🔗 Activated nav link for:', page);
            }
        });

        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
                
                // Update the active link styling
                link.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(29, 78, 216, 0.1) 100%)';
                link.style.color = '#e2e8f0';
                link.style.borderLeftColor = '#2563eb';
                
                // Update the text color
                const span = link.querySelector('span');
                if (span) span.style.color = 'white';
                
                console.log('🔗 Activated sidebar link for:', page);
            } else {
                // Reset non-active links
                link.style.background = '';
                link.style.color = '#94a3b8';
                link.style.borderLeftColor = 'transparent';
                
                const span = link.querySelector('span');
                if (span) span.style.color = '';
            }
        });

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            console.log('🗂️ Hiding page:', p.id);
        });
        
        const targetPage = document.getElementById(page);
        console.log('🎯 Target page element:', targetPage);
        
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('✅ Showing page:', page);
            
            // Load page-specific data
            if (page === 'bookings' && this.currentUser) {
                this.loadUserBookings();
            } else if (page === 'admin-dashboard' && this.currentUser?.role === 'admin') {
                console.log('📊 Loading admin dashboard...');
                this.loadAdminDashboard();
            } else if (page === 'admin-bookings' && this.currentUser?.role === 'admin') {
                this.loadAdminBookings();
            } else if (page === 'admin-packages' && this.currentUser?.role === 'admin') {
                this.loadAdminPackages();
            }
        } else {
            console.error('❌ Page element not found:', page);
        }

        // Update URL
        window.history.pushState({page}, '', `#${page}`);
    }

    async loadPackages() {
        try {
            console.log('📦 Loading packages...');
            
            const response = await fetch('src/api/packages/packageApi.php');
            const data = await response.json();

            if (data.status === 'success') {
                this.allPackages = data.data;
                this.displayFeaturedPackages();
                this.displayAllPackages();
                console.log(`✅ Loaded ${this.allPackages.length} packages`);
            } else {
                throw new Error(data.message || 'Failed to load packages');
            }
        } catch (error) {
            console.error('❌ Error loading packages:', error);
            this.showToast('Failed to load packages', 'error');
        }
    }

    displayFeaturedPackages() {
        const container = document.getElementById('featured-packages');
        if (!container) return;

        const featured = this.allPackages.slice(0, 3); // Show first 3
        
        if (featured.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No packages available</h3>
                    <p>Check back soon for amazing travel packages!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = featured.map(pkg => this.createPackageCard(pkg)).join('');
    }

    displayAllPackages() {
        const container = document.getElementById('all-packages');
        if (!container) return;

        if (this.allPackages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No packages available</h3>
                    <p>Check back soon for amazing travel packages!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.allPackages.map(pkg => this.createPackageCard(pkg)).join('');
    }

    createPackageCard(pkg) {
        return `
            <div class="package-card" data-category="${pkg.category || 'other'}">
                <div class="package-image">
                    <img src="${pkg.image_url || 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=400&h=250&fit=crop'}" 
                         alt="${pkg.name}" loading="lazy">
                    <div class="package-price">$${pkg.price}</div>
                </div>
                <div class="package-content">
                    <h3 class="package-title">${pkg.name}</h3>
                    <p class="package-description">${pkg.description}</p>
                    <div class="package-details">
                        <div class="package-detail">
                            <i class="fas fa-clock"></i>
                            <span>${pkg.duration} days</span>
                        </div>
                        <div class="package-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${pkg.location || 'Sri Lanka'}</span>
                        </div>
                    </div>
                    <button class="btn-primary btn-full" onclick="app.bookPackage(${pkg.id})">
                        <i class="fas fa-calendar-plus"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `;
    }

    filterPackages(category) {
        console.log('🔍 Filtering packages by:', category);
        
        const cards = document.querySelectorAll('.package-card');
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    bookPackage(packageId) {
        console.log('📅 Booking package:', packageId);

        if (!this.currentUser) {
            this.showToast('Please login to book a package', 'warning');
            this.openModal('login-modal');
            return;
        }

        const pkg = this.allPackages.find(p => p.id === packageId);
        if (!pkg) {
            this.showToast('Package not found', 'error');
            return;
        }

        // Fill booking modal
        document.getElementById('booking-package-name').textContent = pkg.name;
        document.getElementById('booking-package-price').textContent = `$${pkg.price}`;
        document.getElementById('booking-package-id').value = packageId;

        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('booking-date').min = tomorrow.toISOString().split('T')[0];

        this.openModal('booking-modal');
    }

    async loadUserBookings() {
        if (!this.currentUser) return;

        try {
            console.log('📋 Loading user bookings...');
            
            const response = await fetch('src/api/bookings/bookingApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action: 'get_user_bookings' })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.userBookings = data.bookings || data.data || [];
                this.displayUserBookings();
                console.log(`✅ Loaded ${this.userBookings.length} bookings`);
            } else {
                throw new Error(data.message || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('❌ Error loading bookings:', error);
            this.showToast('Failed to load bookings', 'error');
        }
    }

    displayUserBookings() {
        const container = document.getElementById('user-bookings');
        if (!container) return;

        if (this.userBookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No bookings yet</h3>
                    <p>Start your adventure by booking a package</p>
                    <button class="btn-primary" onclick="app.navigateTo('packages')">
                        <i class="fas fa-plus"></i>
                        Book a Package
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userBookings.map(booking => `
            <div class="booking-card">
                <div class="booking-header">
                    <h3 class="booking-title">${booking.package_name}</h3>
                    <span class="booking-status booking-status-${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <div class="package-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Date: ${booking.booking_date}</span>
                    </div>
                    <div class="package-detail">
                        <i class="fas fa-users"></i>
                        <span>People: ${booking.number_of_people}</span>
                    </div>
                    <div class="package-detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Total: $${booking.total_price}</span>
                    </div>
                    ${booking.special_requests ? `
                        <div class="package-detail">
                            <i class="fas fa-comment"></i>
                            <span>Requests: ${booking.special_requests}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('username'), // API expects email
            password: formData.get('password')
        };

        try {
            console.log('🔐 Logging in...');
            
            const response = await fetch('src/api/auth/userApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'login', ...loginData })
            });

            const data = await response.json();

            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;

                this.updateUI();
                this.closeModal('login-modal');
                this.showToast('Login successful!', 'success');
                
                // Reset form
                e.target.reset();
                
                // Navigate admin to dashboard, customers to home
                if (data.user.role === 'admin') {
                    console.log('🔧 Admin logged in - navigating to admin dashboard');
                    this.navigateTo('admin-dashboard');
                } else {
                    console.log('🧳 Customer logged in - staying on current page');
                }
                
                console.log('✅ Login successful');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showToast(error.message || 'Login failed', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const registerData = {
            name: `${formData.get('first_name')} ${formData.get('last_name')}`.trim(),
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Validate password confirmation
        const confirmPassword = formData.get('confirm_password');
        if (registerData.password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        try {
            console.log('📝 Registration attempt started...');
            console.log('📤 Registration data:', registerData);
            
            const response = await fetch('src/api/auth/userApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'register', ...registerData })
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();
            console.log('📥 Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log('📥 Parsed response:', data);
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
            }

            if (data.status === 'success') {
                this.showToast('Registration successful! Please login.', 'success');
                this.closeModal('register-modal');
                this.openModal('login-modal');
                
                // Reset form
                e.target.reset();
                
                console.log('✅ Registration successful');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            this.showToast(error.message || 'Registration failed', 'error');
        }
    }

    async handleBooking(e) {
        e.preventDefault();
        
        if (!this.currentUser) {
            this.showToast('Please login to make a booking', 'warning');
            return;
        }

        const formData = new FormData(e.target);
        const bookingData = {
            package_id: formData.get('package_id'),
            booking_date: formData.get('booking_date'),
            number_of_people: formData.get('number_of_people'),
            special_requests: formData.get('special_requests') || ''
        };

        try {
            console.log('📅 Creating booking...');
            
            const response = await fetch('src/api/bookings/bookingApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action: 'create', ...bookingData })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.showToast('Booking successful!', 'success');
                this.closeModal('booking-modal');
                e.target.reset();
                
                // Refresh bookings if on bookings page
                if (document.getElementById('bookings').classList.contains('active')) {
                    this.loadUserBookings();
                }
                
                console.log('✅ Booking successful');
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('❌ Booking error:', error);
            this.showToast(error.message || 'Booking failed', 'error');
        }
    }

    logout() {
        console.log('👋 Logging out...');
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.userBookings = [];

        this.updateUI();
        this.navigateTo('home');
        this.showToast('Logged out successfully', 'success');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-left: 4px solid ${colors[type]};
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            color: #1e293b;
            min-width: 300px;
            margin-bottom: 1rem;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        toast.innerHTML = `
            <i class="${icons[type]}" style="color: ${colors[type]}"></i>
            <span style="flex: 1">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #64748b; font-size: 1.2rem;">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Admin Functions
    async loadAdminDashboard() {
        try {
            console.log('📊 Loading admin dashboard...');
            
            // Load statistics
            const [usersResp, bookingsResp, packagesResp] = await Promise.all([
                fetch('src/api/auth/userApi.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ action: 'get_all_users' })
                }),
                fetch('src/api/bookings/bookingApi.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ action: 'readAll' })
                }),
                fetch('src/api/packages/packageApi.php')
            ]);

            const [usersData, bookingsData, packagesData] = await Promise.all([
                usersResp.json(),
                bookingsResp.json(),
                packagesResp.json()
            ]);

            // Update dashboard stats
            document.getElementById('total-users').textContent = usersData.data?.length || 0;
            document.getElementById('total-bookings').textContent = bookingsData.data?.length || 0;
            document.getElementById('total-packages').textContent = packagesData.data?.length || 0;
            
            // Calculate total revenue
            const totalRevenue = bookingsData.data?.reduce((sum, booking) => {
                return sum + parseFloat(booking.package_price || 0);
            }, 0) || 0;
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;

        } catch (error) {
            console.error('❌ Error loading admin dashboard:', error);
            this.showToast('Failed to load dashboard', 'error');
        }
    }

    async loadAdminBookings() {
        try {
            console.log('📋 Loading all bookings for admin...');
            
            const response = await fetch('src/api/bookings/bookingApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action: 'readAll' })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.displayAdminBookings(data.data);
            } else {
                throw new Error(data.message || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('❌ Error loading admin bookings:', error);
            this.showToast('Failed to load bookings', 'error');
        }
    }

    displayAdminBookings(bookings) {
        const container = document.getElementById('admin-all-bookings');
        if (!container) return;

        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No bookings yet</h3>
                    <p>No customer bookings have been made</p>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.map(booking => `
            <div class="admin-booking-card">
                <div class="booking-header">
                    <div class="booking-id">#${booking.id}</div>
                    <div class="booking-status status-${booking.status}">${booking.status}</div>
                </div>
                <div class="booking-details">
                    <div class="customer-info">
                        <strong>${booking.user_name}</strong>
                        <span>${booking.user_email}</span>
                    </div>
                    <div class="package-info">
                        <strong>${booking.package_title}</strong>
                        <span>$${booking.package_price}</span>
                    </div>
                    <div class="booking-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                </div>
                <div class="booking-actions">
                    <select onchange="app.updateBookingStatus(${booking.id}, this.value)" class="status-select">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </div>
        `).join('');
    }

    async loadAdminPackages() {
        try {
            console.log('📦 Loading packages for admin...');
            
            const response = await fetch('src/api/packages/packageApi.php');
            const data = await response.json();

            if (data.status === 'success') {
                this.displayAdminPackages(data.data);
            } else {
                throw new Error(data.message || 'Failed to load packages');
            }
        } catch (error) {
            console.error('❌ Error loading admin packages:', error);
            this.showToast('Failed to load packages', 'error');
        }
    }

    displayAdminPackages(packages) {
        const container = document.getElementById('admin-all-packages');
        if (!container) return;

        container.innerHTML = packages.map(pkg => `
            <div class="admin-package-card">
                <div class="package-image">
                    <img src="${pkg.image_url || 'https://via.placeholder.com/300x200'}" alt="${pkg.title}">
                </div>
                <div class="package-content">
                    <h3>${pkg.title}</h3>
                    <p>${pkg.description}</p>
                    <div class="package-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                        <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
                        <span class="price">$${pkg.price}</span>
                    </div>
                </div>
                <div class="package-actions">
                    <button class="btn-outline" onclick="app.editPackage(${pkg.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="app.deletePackage(${pkg.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    async updateBookingStatus(bookingId, newStatus) {
        try {
            const response = await fetch('src/api/bookings/bookingApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    action: 'updateStatus',
                    id: bookingId,
                    status: newStatus
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.showToast('Booking status updated', 'success');
                this.loadAdminBookings(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to update booking status');
            }
        } catch (error) {
            console.error('❌ Error updating booking status:', error);
            this.showToast('Failed to update booking status', 'error');
        }
    }

    editPackage(packageId) {
        // Load package data and open edit modal
        const pkg = this.allPackages.find(p => p.id == packageId);
        if (pkg) {
            document.getElementById('edit-package-id').value = pkg.id;
            document.getElementById('edit-package-title').value = pkg.title;
            document.getElementById('edit-package-description').value = pkg.description;
            document.getElementById('edit-package-location').value = pkg.location;
            document.getElementById('edit-package-price').value = pkg.price;
            document.getElementById('edit-package-duration').value = pkg.duration;
            document.getElementById('edit-package-image').value = pkg.image_url || '';
            
            this.openModal('edit-package-modal');
        }
    }

    async deletePackage(packageId) {
        if (confirm('Are you sure you want to delete this package?')) {
            try {
                const response = await fetch('src/api/packages/packageApi.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ 
                        action: 'delete',
                        id: packageId
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    this.showToast('Package deleted successfully', 'success');
                    this.loadAdminPackages(); // Refresh the list
                    this.loadPackages(); // Refresh main packages too
                } else {
                    throw new Error(data.message || 'Failed to delete package');
                }
            } catch (error) {
                console.error('❌ Error deleting package:', error);
                this.showToast('Failed to delete package', 'error');
            }
        }
    }

    async handleAddPackage(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const packageData = {
            action: 'create',
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            price: formData.get('price'),
            duration: formData.get('duration'),
            image_url: formData.get('image_url')
        };

        try {
            const response = await fetch('src/api/packages/packageApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(packageData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.showToast('Package added successfully!', 'success');
                this.closeModal('add-package-modal');
                e.target.reset();
                this.loadAdminPackages();
                this.loadPackages(); // Refresh main packages too
            } else {
                throw new Error(data.message || 'Failed to add package');
            }
        } catch (error) {
            console.error('❌ Add package error:', error);
            this.showToast(error.message || 'Failed to add package', 'error');
        }
    }

    async handleEditPackage(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const packageData = {
            action: 'update',
            id: formData.get('id'),
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            price: formData.get('price'),
            duration: formData.get('duration'),
            image_url: formData.get('image_url')
        };

        try {
            const response = await fetch('src/api/packages/packageApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(packageData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.showToast('Package updated successfully!', 'success');
                this.closeModal('edit-package-modal');
                this.loadAdminPackages();
                this.loadPackages(); // Refresh main packages too
            } else {
                throw new Error(data.message || 'Failed to update package');
            }
        } catch (error) {
            console.error('❌ Edit package error:', error);
            this.showToast(error.message || 'Failed to update package', 'error');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new IslandTrails();
});

// Global functions for onclick handlers
window.openModal = (modalId) => window.app?.openModal(modalId);
window.closeModal = (modalId) => window.app?.closeModal(modalId);
window.navigateTo = (page) => window.app?.navigateTo(page);
window.scrollToSection = (sectionId) => window.app?.scrollToSection(sectionId);
window.logout = () => window.app?.logout();
