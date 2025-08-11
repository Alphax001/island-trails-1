// UI Components Module

// Component utilities and reusable functions

// Initialize components
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

function initializeComponents() {
    initializeDatePickers();
    initializeDropdowns();
    initializeTooltips();
    initializeImageLazyLoading();
    initializeScrollToTop();
}

// Date picker initialization
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        // Add validation
        input.addEventListener('change', function() {
            if (this.value < today) {
                this.value = today;
                showToast('Please select a future date', 'warning');
            }
        });
    });
}

// Dropdown functionality
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Close other dropdowns
            closeAllDropdowns();
            
            // Toggle current dropdown
            menu.classList.toggle('active');
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
}

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        dropdown.querySelector('.dropdown-menu')?.classList.remove('active');
    });
}

// Tooltip initialization
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const element = e.target;
    const text = element.dataset.tooltip;
    
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
    tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
    
    element._tooltip = tooltip;
}

// Hide tooltip
function hideTooltip(e) {
    const element = e.target;
    if (element._tooltip) {
        element._tooltip.remove();
        delete element._tooltip;
    }
}

// Image lazy loading
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Scroll to top button
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Form field validation
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    let isValid = true;
    let message = '';
    
    // Required validation
    if (required && !validateRequired(value)) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Type-specific validation
    if (value && type === 'email' && !validateEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }
    
    if (value && type === 'tel' && !validatePhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
    }
    
    // Update field appearance
    field.classList.toggle('invalid', !isValid);
    field.classList.toggle('valid', isValid && value);
    
    // Show/hide error message
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!isValid && message) {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    } else if (errorElement) {
        errorElement.remove();
    }
    
    return isValid;
}

// Real-time form validation
function initializeFormValidation(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => validateField(field));
        
        // Clear validation on input
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
    
    // Validate entire form on submit
    form.addEventListener('submit', function(e) {
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            e.preventDefault();
            showToast('Please fix the errors in the form', 'error');
        }
    });
}

// Loading state for buttons
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || 'Submit';
        button.disabled = false;
        delete button.dataset.originalText;
    }
}

// Confirmation dialog
function showConfirmDialog(message, onConfirm, onCancel = null) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-overlay';
    
    dialog.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog-content">
                <div class="confirm-dialog-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="confirm-dialog-message">${message}</div>
                <div class="confirm-dialog-actions">
                    <button class="btn btn-secondary confirm-cancel">Cancel</button>
                    <button class="btn btn-primary confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Event listeners
    const cancelBtn = dialog.querySelector('.confirm-cancel');
    const okBtn = dialog.querySelector('.confirm-ok');
    
    cancelBtn.addEventListener('click', () => {
        dialog.remove();
        if (onCancel) onCancel();
    });
    
    okBtn.addEventListener('click', () => {
        dialog.remove();
        onConfirm();
    });
    
    // Close on overlay click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
            if (onCancel) onCancel();
        }
    });
    
    // Focus on confirm button
    okBtn.focus();
}

// Animate number counting
function animateNumber(element, targetNumber, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentNumber = Math.floor(start + (targetNumber - start) * progress);
        element.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Debounce function for search inputs
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

// Throttle function for scroll events
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

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard', 'success');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get relative time
function getRelativeTime(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
}

// Generate random ID
function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export utility functions
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateField = validateField;
window.initializeFormValidation = initializeFormValidation;
window.setButtonLoading = setButtonLoading;
window.showConfirmDialog = showConfirmDialog;
window.animateNumber = animateNumber;
window.debounce = debounce;
window.throttle = throttle;
window.copyToClipboard = copyToClipboard;
window.formatFileSize = formatFileSize;
window.getRelativeTime = getRelativeTime;
window.generateId = generateId;
window.scrollToElement = scrollToElement;
window.isInViewport = isInViewport;
