// Island Trails - Packages JavaScript

// Global variables
let allPackages = [];
let filteredPackages = [];
let currentFilter = 'all';

// DOM elements
const packagesGrid = document.getElementById('packages-grid');
const packageFilters = document.querySelectorAll('.filter-btn');

// Initialize packages when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupPackageEventListeners();
});

// Setup package event listeners
function setupPackageEventListeners() {
    // Filter buttons
    packageFilters.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Handle filter button click
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Update active filter button
    packageFilters.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Apply filter
    currentFilter = filter;
    filterPackages(filter);
}

// Load packages from API
async function loadPackages() {
    if (!packagesGrid) return;
    
    // Show loading state
    packagesGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading packages...</p>
        </div>
    `;
    
    try {
        const response = await apiRequest('/packages/package/readAll');
        
        if (response.status === 'success' && response.data) {
            allPackages = response.data;
            filteredPackages = allPackages;
            renderPackages();
        } else {
            throw new Error(response.message || 'Failed to load packages');
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        packagesGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load packages. Please try again later.</p>
                <button class="btn btn-primary" onclick="loadPackages()">Retry</button>
            </div>
        `;
        showToast('Failed to load packages', 'error');
    }
}

// Filter packages
function filterPackages(filter) {
    if (filter === 'all') {
        filteredPackages = allPackages;
    } else {
        filteredPackages = allPackages.filter(pkg => {
            const title = pkg.title.toLowerCase();
            const description = pkg.description.toLowerCase();
            const location = pkg.location.toLowerCase();
            
            switch (filter) {
                case 'adventure':
                    return title.includes('adventure') || 
                           description.includes('adventure') || 
                           description.includes('trek') || 
                           description.includes('climb') ||
                           description.includes('safari');
                case 'cultural':
                    return title.includes('cultural') || 
                           description.includes('cultural') || 
                           description.includes('temple') || 
                           description.includes('heritage') ||
                           description.includes('ancient');
                case 'nature':
                    return title.includes('nature') || 
                           description.includes('nature') || 
                           description.includes('wildlife') || 
                           description.includes('forest') ||
                           description.includes('park');
                case 'luxury':
                    return title.includes('luxury') || 
                           description.includes('luxury') || 
                           parseFloat(pkg.price) > 500;
                default:
                    return true;
            }
        });
    }
    
    renderPackages();
}

// Render packages
function renderPackages() {
    if (!packagesGrid) return;
    
    if (filteredPackages.length === 0) {
        packagesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No packages found for the selected filter.</p>
                <button class="btn btn-secondary" onclick="showAllPackages()">Show All Packages</button>
            </div>
        `;
        return;
    }
    
    packagesGrid.innerHTML = filteredPackages.map(pkg => createPackageCard(pkg)).join('');
}

// Create package card HTML
function createPackageCard(pkg) {
    const imageUrl = pkg.image_url || null;
    const imageContent = imageUrl ? 
        `<img src="${imageUrl}" alt="${pkg.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
        `<i class="fas fa-mountain"></i>`;
    
    return `
        <div class="package-card" data-package-id="${pkg.id}">
            <div class="package-image">
                ${imageContent}
            </div>
            <div class="package-content">
                <h3 class="package-title">${pkg.title}</h3>
                <p class="package-description">${truncateText(pkg.description, 120)}</p>
                
                <div class="package-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                    <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
                </div>
                
                <div class="package-price">
                    ${formatCurrency(parseFloat(pkg.price))}
                </div>
                
                <div class="package-actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewPackageDetails(${pkg.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="bookPackage(${pkg.id})">
                        <i class="fas fa-calendar-plus"></i> Book Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Show all packages (reset filter)
function showAllPackages() {
    currentFilter = 'all';
    
    // Update active filter button
    packageFilters.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    filterPackages('all');
}

// View package details
function viewPackageDetails(packageId) {
    const pkg = allPackages.find(p => p.id == packageId);
    if (!pkg) {
        showToast('Package not found', 'error');
        return;
    }
    
    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    
    modalBody.innerHTML = `
        <div class="package-details-modal">
            <div class="package-hero">
                ${pkg.image_url ? 
                    `<img src="${pkg.image_url}" alt="${pkg.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;">` :
                    `<div style="background: linear-gradient(45deg, var(--primary-color), var(--accent-color)); height: 250px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;"><i class="fas fa-mountain"></i></div>`
                }
            </div>
            
            <div class="package-info" style="margin-top: 1.5rem;">
                <h2>${pkg.title}</h2>
                <p class="package-location" style="color: #666; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt"></i> ${pkg.location}
                </p>
                
                <div class="package-meta" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="meta-item">
                        <strong>Duration:</strong> ${pkg.duration}
                    </div>
                    <div class="meta-item">
                        <strong>Price:</strong> ${formatCurrency(parseFloat(pkg.price))}
                    </div>
                </div>
                
                <div class="package-description" style="margin-bottom: 1.5rem;">
                    <h3>Description</h3>
                    <p style="line-height: 1.6; color: #666;">${pkg.description}</p>
                </div>
                
                ${pkg.includes ? `
                    <div class="package-includes" style="margin-bottom: 1.5rem;">
                        <h3>What's Included</h3>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            ${pkg.includes}
                        </div>
                    </div>
                ` : ''}
                
                ${pkg.excludes ? `
                    <div class="package-excludes" style="margin-bottom: 1.5rem;">
                        <h3>What's Not Included</h3>
                        <div style="background: #fff3cd; padding: 1rem; border-radius: 8px;">
                            ${pkg.excludes}
                        </div>
                    </div>
                ` : ''}
                
                <div class="package-actions" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button class="btn btn-secondary" onclick="closePackageModal()">Close</button>
                    <button class="btn btn-primary" onclick="bookPackage(${pkg.id})">
                        <i class="fas fa-calendar-plus"></i> Book This Package
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close package details modal
function closePackageModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('active');
}

// Book package
function bookPackage(packageId) {
    // Check if user is authenticated
    if (!requireAuth()) {
        return;
    }
    
    const pkg = allPackages.find(p => p.id == packageId);
    if (!pkg) {
        showToast('Package not found', 'error');
        return;
    }
    
    // Show booking modal
    showBookingModal(pkg);
}

// Show booking modal
function showBookingModal(pkg) {
    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    
    // Get tomorrow's date as minimum booking date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    modalBody.innerHTML = `
        <div class="booking-form-container">
            <div class="package-summary" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3>${pkg.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${pkg.location}</p>
                <p><i class="fas fa-clock"></i> ${pkg.duration}</p>
                <p class="price" style="font-size: 1.25rem; font-weight: 700; color: var(--primary-color);">
                    ${formatCurrency(parseFloat(pkg.price))}
                </p>
            </div>
            
            <form id="booking-form" class="booking-form">
                <div class="form-group">
                    <label for="booking-date">Preferred Date</label>
                    <input type="date" id="booking-date" name="booking_date" required min="${minDate}">
                </div>
                
                <div class="form-group">
                    <label for="booking-guests">Number of Guests</label>
                    <select id="booking-guests" name="guests" required>
                        <option value="">Select number of guests</option>
                        ${Array.from({length: 10}, (_, i) => i + 1).map(num => 
                            `<option value="${num}">${num} ${num === 1 ? 'Guest' : 'Guests'}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="booking-notes">Special Requests (Optional)</label>
                    <textarea id="booking-notes" name="notes" rows="3" placeholder="Any special requests or dietary requirements..."></textarea>
                </div>
                
                <div class="booking-total" style="background: #e9f7ef; padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Total Amount:</span>
                        <span id="total-amount" style="font-size: 1.25rem; font-weight: 700; color: var(--primary-color);">
                            ${formatCurrency(parseFloat(pkg.price))}
                        </span>
                    </div>
                </div>
                
                <div class="form-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check"></i> Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Setup booking form event listeners
    const bookingForm = document.getElementById('booking-form');
    const guestsSelect = document.getElementById('booking-guests');
    const totalAmountEl = document.getElementById('total-amount');
    
    // Update total when guests change
    guestsSelect.addEventListener('change', function() {
        const guests = parseInt(this.value) || 1;
        const basePrice = parseFloat(pkg.price);
        const total = basePrice * guests;
        totalAmountEl.textContent = formatCurrency(total);
    });
    
    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingSubmission(pkg);
    });
    
    modal.classList.add('active');
}

// Handle booking form submission
async function handleBookingSubmission(pkg) {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    const bookingData = {
        package_id: pkg.id,
        booking_date: formData.get('booking_date'),
        guests: parseInt(formData.get('guests')),
        notes: formData.get('notes') || ''
    };
    
    // Validate data
    if (!bookingData.booking_date || !bookingData.guests) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await apiRequest('/bookings/booking/create', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        if (response.status === 'success') {
            showToast('Booking created successfully!', 'success');
            closeBookingModal();
            
            // Redirect to bookings page
            setTimeout(() => {
                showSection('bookings');
            }, 1500);
        } else {
            showToast(response.message || 'Booking failed', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showToast('Booking failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('active');
}

// Search packages
function searchPackages(query) {
    if (!query.trim()) {
        filteredPackages = allPackages;
    } else {
        const searchTerm = query.toLowerCase();
        filteredPackages = allPackages.filter(pkg => 
            pkg.title.toLowerCase().includes(searchTerm) ||
            pkg.description.toLowerCase().includes(searchTerm) ||
            pkg.location.toLowerCase().includes(searchTerm)
        );
    }
    
    renderPackages();
}

// Sort packages
function sortPackages(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredPackages.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            filteredPackages.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name':
            filteredPackages.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'newest':
            filteredPackages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        default:
            // Default order
            break;
    }
    
    renderPackages();
}

// Export functions for global use
window.loadPackages = loadPackages;
window.viewPackageDetails = viewPackageDetails;
window.bookPackage = bookPackage;
window.closeBookingModal = closeBookingModal;
window.closePackageModal = closePackageModal;
window.showAllPackages = showAllPackages;
window.searchPackages = searchPackages;
window.sortPackages = sortPackages;
