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
        <link rel="stylesheet" href="frontend/css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <!-- Navigation -->
        <nav class="navbar" id="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <h2><i class="fas fa-mountain"></i> Island Trails</h2>
                </div>
                <div class="nav-menu" id="nav-menu">
                    <a href="#home" class="nav-link active" data-section="home">Home</a>
                    <a href="#packages" class="nav-link" data-section="packages">Packages</a>
                    <a href="#about" class="nav-link" data-section="about">About</a>
                    <a href="#contact" class="nav-link" data-section="contact">Contact</a>
                    <div class="nav-auth" id="nav-auth">
                        <a href="#login" class="nav-link login-btn" data-section="login">Login</a>
                        <a href="#register" class="nav-link register-btn" data-section="register">Register</a>
                    </div>
                    <div class="nav-user hidden" id="nav-user">
                        <a href="#bookings" class="nav-link" data-section="bookings">My Bookings</a>
                        <div class="user-dropdown">
                            <button class="user-btn" id="user-btn">
                                <i class="fas fa-user"></i>
                                <span id="user-name">User</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-menu">
                                <a href="#profile" data-section="profile"><i class="fas fa-user"></i> Profile</a>
                                <a href="#settings" data-section="settings"><i class="fas fa-cog"></i> Settings</a>
                                <a href="#logout" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-toggle" id="nav-toggle">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Home Section -->
            <section id="home" class="section active">
                <div class="hero">
                    <div class="hero-content">
                        <h1 class="hero-title">Discover Sri Lanka's Hidden Gems</h1>
                        <p class="hero-subtitle">Experience the beauty, culture, and adventure of the pearl of the Indian Ocean with our expertly crafted travel packages.</p>
                        <div class="hero-buttons">
                            <button class="btn btn-primary" onclick="showSection('packages')">Explore Packages</button>
                            <button class="btn btn-secondary" onclick="showSection('about')">Learn More</button>
                        </div>
                    </div>
                    <div class="hero-image">
                        <div class="hero-placeholder">
                            <i class="fas fa-mountain fa-5x"></i>
                            <p>Beautiful Sri Lankan Landscape</p>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="features">
                    <div class="container">
                        <h2 class="section-title">Why Choose Island Trails?</h2>
                        <div class="features-grid">
                            <div class="feature-card">
                                <i class="fas fa-map-marked-alt"></i>
                                <h3>Expert Guides</h3>
                                <p>Local guides with deep knowledge of Sri Lankan culture and hidden treasures.</p>
                            </div>
                            <div class="feature-card">
                                <i class="fas fa-shield-alt"></i>
                                <h3>Safe Travel</h3>
                                <p>Your safety is our priority with comprehensive travel insurance and support.</p>
                            </div>
                            <div class="feature-card">
                                <i class="fas fa-heart"></i>
                                <h3>Authentic Experiences</h3>
                                <p>Immerse yourself in local traditions and authentic Sri Lankan experiences.</p>
                            </div>
                            <div class="feature-card">
                                <i class="fas fa-leaf"></i>
                                <h3>Eco-Friendly</h3>
                                <p>Sustainable tourism that respects nature and local communities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Packages Section -->
            <section id="packages" class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Travel Packages</h2>
                        <p class="section-subtitle">Choose from our carefully curated travel experiences</p>
                    </div>

                    <!-- Package Filters -->
                    <div class="package-filters">
                        <button class="filter-btn active" data-filter="all">All Packages</button>
                        <button class="filter-btn" data-filter="adventure">Adventure</button>
                        <button class="filter-btn" data-filter="cultural">Cultural</button>
                        <button class="filter-btn" data-filter="nature">Nature</button>
                        <button class="filter-btn" data-filter="luxury">Luxury</button>
                    </div>

                    <!-- Packages Grid -->
                    <div class="packages-grid" id="packages-grid">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading packages...</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="section">
                <div class="container">
                    <div class="about-content">
                        <div class="about-text">
                            <h2 class="section-title">About Island Trails</h2>
                            <p>Island Trails is Sri Lanka's premier travel company, dedicated to showcasing the incredible beauty and rich culture of this magical island nation. With over a decade of experience, we specialize in creating unforgettable journeys that connect travelers with authentic Sri Lankan experiences.</p>
                            
                            <div class="about-stats">
                                <div class="stat">
                                    <h3>10+</h3>
                                    <p>Years Experience</p>
                                </div>
                                <div class="stat">
                                    <h3>500+</h3>
                                    <p>Happy Travelers</p>
                                </div>
                                <div class="stat">
                                    <h3>50+</h3>
                                    <p>Destinations</p>
                                </div>
                                <div class="stat">
                                    <h3>24/7</h3>
                                    <p>Support</p>
                                </div>
                            </div>
                        </div>
                        <div class="about-image">
                            <div class="about-placeholder">
                                <i class="fas fa-users fa-4x"></i>
                                <p>Our Team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section id="contact" class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Get In Touch</h2>
                        <p class="section-subtitle">Ready to start your Sri Lankan adventure?</p>
                    </div>

                    <div class="contact-content">
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h3>Address</h3>
                                    <p>123 Galle Road, Colombo 03, Sri Lanka</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <h3>Phone</h3>
                                    <p>+94 11 123 4567</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h3>Email</h3>
                                    <p>info@islandtrails.lk</p>
                                </div>
                            </div>
                        </div>

                        <form class="contact-form" id="contact-form">
                            <div class="form-group">
                                <input type="text" id="contact-name" placeholder="Your Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" id="contact-email" placeholder="Your Email" required>
                            </div>
                            <div class="form-group">
                                <textarea id="contact-message" placeholder="Your Message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Login Section -->
            <section id="login" class="section auth-section">
                <div class="auth-container">
                    <div class="auth-card">
                        <h2 class="auth-title">Welcome Back</h2>
                        <p class="auth-subtitle">Sign in to your account</p>

                        <form class="auth-form" id="login-form">
                            <div class="form-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="login-email" placeholder="Email Address" required>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="login-password" placeholder="Password" required>
                            </div>
                            <div class="form-options">
                                <label class="checkbox">
                                    <input type="checkbox" id="remember-me">
                                    <span class="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="#forgot-password" class="forgot-link">Forgot Password?</a>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Sign In</button>
                        </form>

                        <div class="auth-switch">
                            <p>Don't have an account? <a href="#register" onclick="showSection('register')">Sign up</a></p>
                        </div>
                        
                        <!-- Demo buttons for testing -->
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e8ed;">
                            <p style="text-align: center; font-size: 0.875rem; color: #666; margin-bottom: 0.5rem;">Quick Demo Login:</p>
                            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                                <button type="button" class="btn btn-secondary btn-sm" onclick="quickLogin('customer')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Customer</button>
                                <button type="button" class="btn btn-secondary btn-sm" onclick="quickLogin('admin')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Admin</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Register Section -->
            <section id="register" class="section auth-section">
                <div class="auth-container">
                    <div class="auth-card">
                        <h2 class="auth-title">Join Island Trails</h2>
                        <p class="auth-subtitle">Create your account</p>

                        <form class="auth-form" id="register-form">
                            <div class="form-group">
                                <i class="fas fa-user"></i>
                                <input type="text" id="register-name" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="register-email" placeholder="Email Address" required>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="register-password" placeholder="Password" required>
                            </div>
                            <div class="form-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="register-confirm" placeholder="Confirm Password" required>
                            </div>
                            <div class="form-options">
                                <label class="checkbox">
                                    <input type="checkbox" id="terms-agree" required>
                                    <span class="checkmark"></span>
                                    I agree to the <a href="#terms">Terms & Conditions</a>
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Create Account</button>
                        </form>

                        <div class="auth-switch">
                            <p>Already have an account? <a href="#login" onclick="showSection('login')">Sign in</a></p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Bookings Section -->
            <section id="bookings" class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">My Bookings</h2>
                        <p class="section-subtitle">Manage your travel bookings</p>
                    </div>

                    <div class="bookings-content">
                        <div class="bookings-filters">
                            <button class="filter-btn active" data-status="all">All Bookings</button>
                            <button class="filter-btn" data-status="pending">Pending</button>
                            <button class="filter-btn" data-status="confirmed">Confirmed</button>
                            <button class="filter-btn" data-status="cancelled">Cancelled</button>
                        </div>

                        <div class="bookings-grid" id="bookings-grid">
                            <div class="loading-spinner">
                                <i class="fas fa-spinner fa-spin"></i>
                                <p>Loading your bookings...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3><i class="fas fa-mountain"></i> Island Trails</h3>
                        <p>Discover the beauty of Sri Lanka with our expertly crafted travel experiences.</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home" onclick="showSection('home')">Home</a></li>
                            <li><a href="#packages" onclick="showSection('packages')">Packages</a></li>
                            <li><a href="#about" onclick="showSection('about')">About</a></li>
                            <li><a href="#contact" onclick="showSection('contact')">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Adventure Tours</a></li>
                            <li><a href="#">Cultural Experiences</a></li>
                            <li><a href="#">Nature Walks</a></li>
                            <li><a href="#">Luxury Packages</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Contact Info</h4>
                        <ul>
                            <li><i class="fas fa-map-marker-alt"></i> Colombo, Sri Lanka</li>
                            <li><i class="fas fa-phone"></i> +94 11 123 4567</li>
                            <li><i class="fas fa-envelope"></i> info@islandtrails.lk</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Island Trails. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <!-- Booking Modal -->
        <div class="modal" id="booking-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Book This Package</h2>
                    <button class="modal-close" onclick="closeBookingModal()">&times;</button>
                </div>
                <div class="modal-body" id="booking-modal-body">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div class="loading-overlay" id="loading-overlay">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Processing...</p>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div class="toast-container" id="toast-container"></div>

        <!-- Scripts -->
        <script src="frontend/js/main.js"></script>
        <script src="frontend/js/auth.js"></script>
        <script src="frontend/js/packages.js"></script>
        <script src="frontend/js/bookings.js"></script>
    </body>
    </html>
    <?php
}
?>