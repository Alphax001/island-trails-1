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
    // Serve the new frontend
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Island Trails - Discover Sri Lanka's Hidden Gems</title>
        
        <!-- Elegant Frontend CSS - Clean & Professional -->
        <link rel="stylesheet" href="frontend-new/css/elegant.css">
        
        <!-- Fonts and Icons -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <!-- Navigation -->
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-brand">
                    <i class="fas fa-mountain"></i>
                    <span>Island Trails</span>
                </div>
                
                <!-- Navigation Menu -->
                <div class="nav-menu" id="nav-menu">
                    <a href="#" class="nav-link active" data-page="home-page">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="#" class="nav-link" data-page="packages-page">
                        <i class="fas fa-map"></i>
                        <span>Packages</span>
                    </a>
                    <a href="#" class="nav-link" data-page="bookings-page">
                        <i class="fas fa-calendar"></i>
                        <span>My Bookings</span>
                    </a>
                </div>
                
                <!-- User Menu -->
                <div class="nav-user">
                    <div class="user-dropdown">
                        <button class="user-btn" id="user-btn">
                            <i class="fas fa-user"></i>
                            <span>Login</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-menu">
                            <a href="#" onclick="openModal('login-modal')" class="dropdown-item">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </a>
                            <a href="#" onclick="openModal('register-modal')" class="dropdown-item">
                                <i class="fas fa-user-plus"></i> Register
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Menu Toggle -->
                <button class="mobile-toggle" id="mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Home Page -->
            <div id="home-page" class="page active">
                <!-- Hero Section -->
                <section class="hero">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1 class="hero-title">Discover Sri Lanka's Hidden Gems</h1>
                            <p class="hero-subtitle">Embark on unforgettable adventures through pristine beaches, ancient temples, and lush tea plantations</p>
                            <div class="hero-actions">
                                <button class="btn btn-primary" onclick="navigateTo('packages-page')">
                                    <i class="fas fa-search"></i> Explore Packages
                                </button>
                                <button class="btn btn-outline" onclick="scrollToSection('featured-packages')">
                                    <i class="fas fa-play"></i> Watch Video
                                </button>
                            </div>
                        </div>
                        <div class="hero-image">
                            <img src="https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop" alt="Sri Lanka" loading="lazy">
                        </div>
                    </div>
                </section>

                <!-- Featured Packages -->
                <section id="featured-packages" class="featured-packages">
                    <div class="container">
                        <div class="section-header">
                            <h2>Featured Packages</h2>
                            <p>Handpicked experiences for the perfect Sri Lankan adventure</p>
                        </div>
                        <div class="packages-grid" id="featured-packages-container">
                            <!-- Packages will be loaded here -->
                        </div>
                    </div>
                </section>
            </div>

            <!-- Packages Page -->
            <div id="packages-page" class="page">
                <div class="page-header">
                    <div class="container">
                        <h1>Travel Packages</h1>
                        <p>Choose from our carefully curated collection of Sri Lankan adventures</p>
                    </div>
                </div>
                <div class="container">
                    <div class="packages-filters">
                        <button class="filter-btn active" data-filter="all">All Packages</button>
                        <button class="filter-btn" data-filter="adventure">Adventure</button>
                        <button class="filter-btn" data-filter="cultural">Cultural</button>
                        <button class="filter-btn" data-filter="beach">Beach</button>
                        <button class="filter-btn" data-filter="wildlife">Wildlife</button>
                    </div>
                    <div class="packages-grid" id="packages-container">
                        <!-- Packages will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Bookings Page -->
            <div id="bookings-page" class="page">
                <div class="page-header">
                    <div class="container">
                        <h1>My Bookings</h1>
                        <p>View and manage your travel bookings</p>
                    </div>
                </div>
                <div class="container">
                    <div class="bookings-grid" id="bookings-container">
                        <!-- Bookings will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Admin Dashboard -->
            <div id="admin-dashboard" class="page">
                <div class="page-header">
                    <div class="container">
                        <h1>Admin Dashboard</h1>
                        <p>Manage packages and bookings</p>
                    </div>
                </div>
                <div class="container">
                    <div class="admin-stats">
                        <div class="stat-card">
                            <i class="fas fa-box"></i>
                            <h3 id="total-packages">0</h3>
                            <p>Total Packages</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-calendar"></i>
                            <h3 id="total-bookings">0</h3>
                            <p>Total Bookings</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-users"></i>
                            <h3 id="total-customers">0</h3>
                            <p>Total Customers</p>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-dollar-sign"></i>
                            <h3 id="total-revenue">$0</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button class="btn btn-primary" onclick="openModal('create-package-modal')">
                            <i class="fas fa-plus"></i> Add New Package
                        </button>
                        <button class="btn btn-outline" onclick="navigateTo('admin-packages')">
                            <i class="fas fa-list"></i> Manage Packages
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-sections">
                    <!-- Brand Section -->
                    <div class="footer-section">
                        <div class="footer-brand">
                            <i class="fas fa-mountain"></i>
                            <h3>Island Trails</h3>
                        </div>
                        <p>Discover the beauty of Sri Lanka with our expertly crafted travel experiences.</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#" data-page="home-page">Home</a></li>
                            <li><a href="#" data-page="packages-page">Travel Packages</a></li>
                            <li><a href="#" onclick="scrollToSection('featured-packages')">Featured Tours</a></li>
                            <li><a href="#" data-page="bookings-page">My Bookings</a></li>
                        </ul>
                    </div>

                    <!-- Destinations -->
                    <div class="footer-section">
                        <h3>Popular Destinations</h3>
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
                        <h3>Contact Us</h3>
                        <div class="footer-contact">
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
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Welcome Back</h2>
                    <button class="modal-close" onclick="closeModal('login-modal')">&times;</button>
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
                        <button type="submit" class="btn btn-primary btn-full">Sign In</button>
                    </form>
                    <div class="modal-footer">
                        <p>Don't have an account? <a href="#" onclick="closeModal('login-modal'); openModal('register-modal')">Register here</a></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Register Modal -->
        <div id="register-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create Account</h2>
                    <button class="modal-close" onclick="closeModal('register-modal')">&times;</button>
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
                        <button type="submit" class="btn btn-primary btn-full">Create Account</button>
                    </form>
                    <div class="modal-footer">
                        <p>Already have an account? <a href="#" onclick="closeModal('register-modal'); openModal('login-modal')">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking Modal -->
        <div id="booking-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Book Package</h2>
                    <button class="modal-close" onclick="closeModal('booking-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="booking-package-info">
                        <h3 id="booking-package-name">Package Name</h3>
                        <p id="booking-package-price">$0</p>
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
                            <textarea id="special-requests" name="special_requests" rows="3" placeholder="Any special requirements or requests..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Book Now</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Create Package Modal (Admin) -->
        <div id="create-package-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create New Package</h2>
                    <button class="modal-close" onclick="closeModal('create-package-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="create-package-form">
                        <div class="form-group">
                            <label for="package-name">Package Name</label>
                            <input type="text" id="package-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="package-description">Description</label>
                            <textarea id="package-description" name="description" rows="4" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="package-price">Price ($)</label>
                                <input type="number" id="package-price" name="price" min="0" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label for="package-duration">Duration (days)</label>
                                <input type="number" id="package-duration" name="duration" min="1" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="package-location">Location</label>
                            <input type="text" id="package-location" name="location" required>
                        </div>
                        <div class="form-group">
                            <label for="package-image">Image URL</label>
                            <input type="url" id="package-image" name="image_url" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label for="package-category">Category</label>
                            <select id="package-category" name="category" required>
                                <option value="">Select Category</option>
                                <option value="adventure">Adventure</option>
                                <option value="cultural">Cultural</option>
                                <option value="beach">Beach</option>
                                <option value="wildlife">Wildlife</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Create Package</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Toast Container -->
        <div id="toast-container" class="toast-container"></div>

        <!-- Simple & Elegant JavaScript -->
        <script src="frontend-new/js/simple.js"></script>
        <script src="frontend-new/js/app-simple.js"></script>
        <script src="frontend-new/js/auth.js"></script>
        <script src="frontend-new/js/packages.js"></script>
        <script src="frontend-new/js/bookings.js"></script>
        <script src="frontend-new/js/admin.js"></script>
    </body>
    </html>
    <?php
}
?>
