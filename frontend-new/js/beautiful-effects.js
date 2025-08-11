// Beautiful JavaScript with Stunning Animations and Glassmorphism Effects

class BeautifulEffects {
    constructor() {
        this.initializeEffects();
        this.setupEventListeners();
        this.createFloatingElements();
    }

    initializeEffects() {
        // Initialize AOS (Animate On Scroll) effects
        this.setupScrollAnimations();
        
        // Create particle effects
        this.createParticleSystem();
        
        // Setup glass morphism hover effects
        this.setupGlassMorphism();
        
        // Initialize loading animations
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animations for grid items
                    if (entry.target.classList.contains('stagger-parent')) {
                        this.staggerChildAnimations(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .package-card, .stat-card, .admin-action-card').forEach(el => {
            observer.observe(el);
        });
    }

    staggerChildAnimations(parent) {
        const children = parent.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-in');
            }, index * 100);
        });
    }

    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.6';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = Math.random() * 2 + 1;
                this.size = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    'rgba(102, 126, 234, 0.6)',
                    'rgba(118, 75, 162, 0.6)',
                    'rgba(240, 147, 251, 0.6)',
                    'rgba(79, 172, 254, 0.6)',
                    'rgba(0, 242, 254, 0.6)'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    setupGlassMorphism() {
        // Add beautiful hover effects to glass elements
        const glassElements = document.querySelectorAll('.card, .modal-content, .search-widget, .package-card, .admin-action-card');
        
        glassElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
                this.addGlassShine(element);
            });

            element.addEventListener('mouseleave', () => {
                this.removeGlassShine(element);
            });
        });
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        e.currentTarget.style.position = 'relative';
        e.currentTarget.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlassShine(element) {
        const shine = document.createElement('div');
        shine.className = 'glass-shine';
        shine.style.position = 'absolute';
        shine.style.top = '0';
        shine.style.left = '-100%';
        shine.style.width = '100%';
        shine.style.height = '100%';
        shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
        shine.style.animation = 'shine 1s ease-out';
        shine.style.pointerEvents = 'none';
        shine.style.zIndex = '10';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shine);
    }

    removeGlassShine(element) {
        const shine = element.querySelector('.glass-shine');
        if (shine) {
            shine.remove();
        }
    }

    setupLoadingAnimations() {
        // Beautiful loading states
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% { width: 0; height: 0; opacity: 1; }
                100% { width: 100px; height: 100px; opacity: 0; }
            }
            
            @keyframes shine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
                50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                0% {
                    opacity: 0;
                    transform: translateY(30px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .pulse { animation: pulse 2s ease-in-out infinite; }
            .float { animation: float 3s ease-in-out infinite; }
            .glow { animation: glow 2s ease-in-out infinite; }
        `;
        document.head.appendChild(style);
    }

    createFloatingElements() {
        // Create beautiful floating geometric shapes
        const shapes = ['circle', 'triangle', 'square', 'hexagon'];
        
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            
            const size = Math.random() * 50 + 20;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            
            shape.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: ${shape.classList.contains('circle') ? '50%' : '10px'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatAround ${duration}s ease-in-out infinite ${delay}s;
                pointer-events: none;
                z-index: 1;
                opacity: 0.6;
            `;
            
            document.body.appendChild(shape);
        }
        
        // Add floating animation
        const floatingStyle = document.createElement('style');
        floatingStyle.textContent = `
            @keyframes floatAround {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(100px, -100px) rotate(90deg);
                }
                50% {
                    transform: translate(-50px, -200px) rotate(180deg);
                }
                75% {
                    transform: translate(-150px, -50px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(floatingStyle);
    }

    setupEventListeners() {
        // Mouse trail effect
        this.setupMouseTrail();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Beautiful scroll effects
        this.setupScrollEffects();
        
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // User dropdown menu
        this.setupUserDropdown();
        
        // Navigation links
        this.setupNavigation();
    }

    setupMouseTrail() {
        const trail = [];
        const trailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
            
            this.updateMouseTrail(trail);
        });
    }

    updateMouseTrail(trail) {
        // Remove old trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            
            const opacity = (index + 1) / trail.length * 0.5;
            const size = (index + 1) / trail.length * 10;
            
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(102, 126, 234, ${opacity}), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                animation: fadeOut 1s ease-out forwards;
            `;
            
            document.body.appendChild(trailElement);
            
            setTimeout(() => {
                trailElement.remove();
            }, 1000);
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        document.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateScrollEffects() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const speed = scrollY * 0.5;
            heroSection.style.transform = `translateY(${speed}px)`;
        }
        
        // Update navigation opacity
        const navigation = document.querySelector('.glass-nav');
        if (navigation) {
            const opacity = Math.min(scrollY / 100, 1);
            navigation.style.background = `linear-gradient(135deg, 
                rgba(255,255,255,${0.1 + opacity * 0.1}) 0%, 
                rgba(255,255,255,${0.05 + opacity * 0.05}) 100%)`;
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    focusSearch() {
        const searchInput = document.querySelector('.search-field input[type="text"]');
        if (searchInput) {
            searchInput.focus();
        }
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

    // Navigate to page with beautiful transition
    navigateTo(pageId) {
        // Hide current page
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            currentPage.style.animation = 'slideOutLeft 0.3s ease-in-out';
            setTimeout(() => {
                currentPage.classList.remove('active');
                currentPage.style.animation = '';
            }, 300);
        }

        // Show target page
        setTimeout(() => {
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.animation = 'slideInRight 0.3s ease-in-out';
                setTimeout(() => {
                    targetPage.style.animation = '';
                }, 300);
            }
        }, 300);
    }

    // Setup mobile menu
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    // Setup user dropdown
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

    // Setup navigation
    setupNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Navigate to page
                this.navigateTo(pageId);
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const mobileToggle = document.getElementById('mobile-toggle');
                if (navMenu && mobileToggle) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
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
}

// Beautiful Toast Notification System
class ToastManager {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <div class="toast-content">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Close button functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        toast.style.animation = 'slideOutToast 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
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

// Beautiful Loading Manager
class LoadingManager {
    constructor() {
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <div style="margin-top: 1rem; font-size: 1.125rem;">Loading...</div>
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

// Beautiful Modal Manager
class ModalManager {
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
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
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
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input, textarea, select');
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
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAll() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            this.close(modal);
        });
    }
}

// Initialize beautiful effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all beautiful components
    window.beautifulEffects = new BeautifulEffects();
    window.toastManager = new ToastManager();
    window.loadingManager = new LoadingManager();
    window.modalManager = new ModalManager();
    
    // Add fadeOut animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes slideOutToast {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(400px); opacity: 0; }
        }
        
        .toast.show {
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 Beautiful effects initialized successfully!');
});

// Global navigation and scroll functions
window.navigateTo = function(pageId) {
    if (window.beautifulEffects) {
        window.beautifulEffects.navigateTo(pageId);
    } else {
        // Fallback
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
};

window.scrollToSection = function(sectionId) {
    if (window.beautifulEffects) {
        window.beautifulEffects.scrollToSection(sectionId);
    } else {
        // Fallback
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Export for global use
window.BeautifulEffects = BeautifulEffects;
window.ToastManager = ToastManager;
window.LoadingManager = LoadingManager;
window.ModalManager = ModalManager;
