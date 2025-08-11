// Simple & Elegant JavaScript - Clean Functionality

class SimpleEffects {
    constructor() {
        this.initializeEffects();
        this.setupEventListeners();
    }

    initializeEffects() {
        // Simple scroll animations
        this.setupScrollAnimations();
        
        // Basic loading states
        this.setupLoadingStates();
    }

    setupScrollAnimations() {
        // Simple fade-in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        document.querySelectorAll('.animate-on-scroll, .package-card, .card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupLoadingStates() {
        // Simple loading overlay
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .loading-spinner {
                text-align: center;
                color: #2563eb;
            }
            
            .loading-spinner i {
                font-size: 2rem;
                margin-bottom: 1rem;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // User dropdown
        this.setupUserDropdown();
        
        // Navigation
        this.setupNavigation();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                
                // Animate hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                if (navMenu.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = '';
                }
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

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                
                // Check if user needs to be authenticated for bookings
                if (pageId === 'bookings-page' && !window.currentUser) {
                    if (window.simpleToast) {
                        window.simpleToast.warning('Please login to view your bookings');
                    }
                    this.navigateTo('home-page');
                    window.openModal('login-modal');
                    return;
                }
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Simple page navigation
                this.navigateTo(pageId);
                
                // Close mobile menu
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            });
        });

        // Footer links
        document.querySelectorAll('.footer-links a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.navigateTo(pageId);
                
                // Update nav link active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
                if (navLink) {
                    navLink.classList.add('active');
                }
            });
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Simple page navigation
    navigateTo(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Special handling for bookings page
            if (pageId === 'bookings-page' && window.loadUserBookings) {
                window.loadUserBookings();
            }
        }
        
        // Update URL without refresh
        window.history.pushState({page: pageId}, '', `#${pageId}`);
    }

    // Smooth scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Simple Toast Notification System
class SimpleToast {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };

        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-left: 4px solid ${colors[type] || colors.info};
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            color: #1e293b;
            min-width: 300px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}"></i>
            <span style="flex: 1">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #64748b; font-size: 1.2rem;">&times;</button>
        `;

        toast.classList.add = function(className) {
            if (className === 'show') {
                this.style.transform = 'translateX(0)';
            }
        };

        return toast;
    }

    remove(toast) {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Simple Loading Manager
class SimpleLoading {
    constructor() {
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <div style="margin-top: 1rem; font-size: 1rem;">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    show(message = 'Loading...') {
        this.overlay.querySelector('div').textContent = message;
        this.overlay.classList.add('active');
    }

    hide() {
        this.overlay.classList.remove('active');
    }
}

// Simple Modal Manager
class SimpleModal {
    constructor() {
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.close(e.target);
            }
        });

        // Close button listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.close(modal);
                }
            }
        });
    }

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    close(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
}

// Initialize simple effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize simple components
    window.simpleEffects = new SimpleEffects();
    window.simpleToast = new SimpleToast();
    window.simpleLoading = new SimpleLoading();
    window.simpleModal = new SimpleModal();
    
    console.log('✨ Simple & elegant effects initialized!');
});

// Global functions for compatibility
window.navigateTo = function(pageId) {
    if (window.simpleEffects) {
        window.simpleEffects.navigateTo(pageId);
    }
};

window.scrollToSection = function(sectionId) {
    if (window.simpleEffects) {
        window.simpleEffects.scrollToSection(sectionId);
    }
};

// Export for global use
window.SimpleEffects = SimpleEffects;
window.SimpleToast = SimpleToast;
window.SimpleLoading = SimpleLoading;
window.SimpleModal = SimpleModal;
