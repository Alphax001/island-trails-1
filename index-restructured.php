<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Check if this is an API request
$requestUri = $_SERVER['REQUEST_URI'];
$isApiRequest = strpos($requestUri, '/api/') !== false;

if ($isApiRequest) {
    // Handle API requests
    require_once 'src/utils/imports.php';
    require_once 'src/utils/router.php';
    
    session_start();
    $router = new Router();
    $router->runScript();
} else {
    // Serve the frontend
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Island Trails - Discover Sri Lanka's Hidden Gems</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="frontend-new/css/elegant.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <!-- Brand -->
                <div class="nav-brand">
                    <i class="fas fa-mountain"></i>
                    <span>Island Trails</span>
                </div>
                
                <!-- Navigation Links -->
                <div class="nav-links" id="nav-links">
                    <a href="#" class="nav-link active" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="#" class="nav-link" data-page="packages">
                        <i class="fas fa-map"></i>
                        <span>Packages</span>
                    </a>
                    <a href="#" class="nav-link" data-page="bookings" id="bookings-nav" style="display: none;">
                        <i class="fas fa-calendar"></i>
                        <span>My Bookings</span>
                    </a>
                </div>
                
                <!-- User Actions -->
                <div class="nav-actions">
                    <!-- Guest Actions -->
                    <div class="guest-actions" id="guest-actions">
                        <button class="btn-outline" onclick="openModal('login-modal')">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                        <button class="btn-primary" onclick="openModal('register-modal')">
                            <i class="fas fa-user-plus"></i>
                            Register
                        </button>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="user-menu" id="user-menu" style="display: none;">
                        <div class="user-dropdown">
                            <button class="user-btn" id="user-btn">
                                <i class="fas fa-user-circle"></i>
                                <span id="user-name">User</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-menu">
                                <a href="#" class="dropdown-item" onclick="navigateTo('bookings')">
                                    <i class="fas fa-calendar"></i>
                                    My Bookings
                                </a>
                                <a href="#" class="dropdown-item" onclick="logout()">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Toggle -->
                <button class="mobile-toggle" id="mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
        <!-- Home Page -->
        <div id="home" class="page active">
            <!-- Hero Section -->
            <section class="hero">
                <div class="hero-background">
                    <img src="https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=1200&h=800&fit=crop" alt="Sri Lanka" loading="lazy">
                    <div class="hero-overlay"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">Discover Sri Lanka's Hidden Gems</h1>
                        <p class="hero-subtitle">Experience breathtaking landscapes, rich culture, and unforgettable adventures in the Pearl of the Indian Ocean</p>
                        <div class="hero-actions">
                            <button class="btn-hero-primary" onclick="navigateTo('packages')">
                                <i class="fas fa-search"></i>
                                Explore Packages
                            </button>
                            <button class="btn-hero-secondary" onclick="scrollToSection('about')">
                                <i class="fas fa-play"></i>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="about">
                <div class="container">
                    <div class="section-header">
                        <h2>Why Choose Island Trails?</h2>
                        <p>We create unforgettable experiences that connect you with the true essence of Sri Lanka</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-map-marked-alt"></i>
                            </div>
                            <h3>Expert Guides</h3>
                            <p>Local experts who know every hidden gem and cultural secret</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h3>Safe & Secure</h3>
                            <p>Your safety is our priority with comprehensive travel insurance</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <h3>Authentic Experiences</h3>
                            <p>Immerse yourself in genuine Sri Lankan culture and traditions</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Packages -->
            <section class="featured-packages">
                <div class="container">
                    <div class="section-header">
                        <h2>Featured Packages</h2>
                        <p>Handpicked adventures for your perfect Sri Lankan journey</p>
                    </div>
                    <div class="packages-preview" id="featured-packages">
                        <!-- Featured packages will be loaded here -->
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading amazing packages...</p>
                        </div>
                    </div>
                    <div class="section-footer">
                        <button class="btn-primary" onclick="navigateTo('packages')">
                            <i class="fas fa-th-large"></i>
                            View All Packages
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <!-- Packages Page -->
        <div id="packages" class="page">
            <div class="page-header">
                <div class="container">
                    <h1>Travel Packages</h1>
                    <p>Discover our complete collection of Sri Lankan adventures</p>
                </div>
            </div>
            <div class="container">
                <!-- Package Filters -->
                <div class="filters-section">
                    <div class="filters">
                        <button class="filter-btn active" data-filter="all">All Packages</button>
                        <button class="filter-btn" data-filter="adventure">Adventure</button>
                        <button class="filter-btn" data-filter="cultural">Cultural</button>
                        <button class="filter-btn" data-filter="beach">Beach</button>
                        <button class="filter-btn" data-filter="wildlife">Wildlife</button>
                    </div>
                </div>
                
                <!-- Packages Grid -->
                <div class="packages-section">
                    <div class="packages-grid" id="all-packages">
                        <!-- All packages will be loaded here -->
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading packages...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bookings Page -->
        <div id="bookings" class="page">
            <div class="page-header">
                <div class="container">
                    <h1>My Bookings</h1>
                    <p>View and manage your travel bookings</p>
                </div>
            </div>
            <div class="container">
                <div class="bookings-section">
                    <div class="bookings-grid" id="user-bookings">
                        <!-- User bookings will be loaded here -->
                        <div class="empty-state">
                            <i class="fas fa-calendar-times"></i>
                            <h3>No bookings yet</h3>
                            <p>Start your adventure by booking a package</p>
                            <button class="btn-primary" onclick="navigateTo('packages')">
                                <i class="fas fa-plus"></i>
                                Book a Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Brand Section -->
                <div class="footer-section">
                    <div class="footer-brand">
                        <i class="fas fa-mountain"></i>
                        <h3>Island Trails</h3>
                    </div>
                    <p>Your gateway to discovering the incredible beauty and rich heritage of Sri Lanka through expertly crafted travel experiences.</p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="#" onclick="navigateTo('home')">Home</a></li>
                        <li><a href="#" onclick="navigateTo('packages')">Packages</a></li>
                        <li><a href="#" onclick="scrollToSection('about')">About Us</a></li>
                        <li><a href="#" onclick="openModal('login-modal')">Sign In</a></li>
                    </ul>
                </div>

                <!-- Destinations -->
                <div class="footer-section">
                    <h4>Popular Destinations</h4>
                    <ul class="footer-links">
                        <li><a href="#">Kandy</a></li>
                        <li><a href="#">Galle</a></li>
                        <li><a href="#">Nuwara Eliya</a></li>
                        <li><a href="#">Sigiriya</a></li>
                        <li><a href="#">Mirissa</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>+94 11 234 5678</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>info@islandtrails.lk</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Colombo, Sri Lanka</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>&copy; 2025 Island Trails. All rights reserved. Made with <i class="fas fa-heart"></i> in Sri Lanka</p>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <!-- Login Modal -->
    <div id="login-modal" class="modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Welcome Back</h3>
                <button class="modal-close" onclick="closeModal('login-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-username">Username or Email</label>
                        <input type="text" id="login-username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary btn-full">
                        <i class="fas fa-sign-in-alt"></i>
                        Sign In
                    </button>
                </form>
                <div class="modal-footer">
                    <p>Don't have an account? <a href="#" onclick="closeModal('login-modal'); openModal('register-modal')">Register here</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div id="register-modal" class="modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create Account</h3>
                <button class="modal-close" onclick="closeModal('register-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="register-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="register-first-name">First Name</label>
                            <input type="text" id="register-first-name" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-last-name">Last Name</label>
                            <input type="text" id="register-last-name" name="last_name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="register-username">Username</label>
                        <input type="text" id="register-username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Password</label>
                        <input type="password" id="register-password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="register-confirm-password">Confirm Password</label>
                        <input type="password" id="register-confirm-password" name="confirm_password" required>
                    </div>
                    <button type="submit" class="btn-primary btn-full">
                        <i class="fas fa-user-plus"></i>
                        Create Account
                    </button>
                </form>
                <div class="modal-footer">
                    <p>Already have an account? <a href="#" onclick="closeModal('register-modal'); openModal('login-modal')">Sign in</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Booking Modal -->
    <div id="booking-modal" class="modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Book Package</h3>
                <button class="modal-close" onclick="closeModal('booking-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="booking-info">
                    <h4 id="booking-package-name">Package Name</h4>
                    <p class="booking-price" id="booking-package-price">$0</p>
                </div>
                <form id="booking-form" class="booking-form">
                    <input type="hidden" id="booking-package-id" name="package_id">
                    <div class="form-group">
                        <label for="booking-date">Preferred Date</label>
                        <input type="date" id="booking-date" name="booking_date" required>
                    </div>
                    <div class="form-group">
                        <label for="number-of-people">Number of People</label>
                        <input type="number" id="number-of-people" name="number_of_people" min="1" max="20" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="special-requests">Special Requests (Optional)</label>
                        <textarea id="special-requests" name="special_requests" rows="3" placeholder="Any special requirements..."></textarea>
                    </div>
                    <button type="submit" class="btn-primary btn-full">
                        <i class="fas fa-calendar-plus"></i>
                        Book Now
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- JavaScript -->
    <script src="frontend-new/js/simple.js"></script>
    <script src="frontend-new/js/app-simple.js"></script>
    <script src="frontend-new/js/auth.js"></script>
    <script src="frontend-new/js/packages.js"></script>
    <script src="frontend-new/js/bookings.js"></script>
</body>
</html>
<?php
}
?>
