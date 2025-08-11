// Packages Module

let currentPackageData = [];
let filteredPackages = [];

// Initialize packages page
document.addEventListener('DOMContentLoaded', function() {
    setupPackageEventListeners();
});

function setupPackageEventListeners() {
    // Package details modal close
    const packageModal = document.getElementById('package-details-modal');
    if (packageModal) {
        const closeBtn = packageModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal('package-details-modal'));
        }
    }
    
    // Booking form in package details
    const bookingForm = document.getElementById('package-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handlePackageBooking);
    }
}

// Load all packages
async function loadPackages() {
    try {
        const response = await apiRequest('/packages/package/readAll');
        if (response.status === 'success') {
            allPackages = response.data;
            currentPackageData = allPackages;
            filteredPackages = allPackages;
            renderPackages(allPackages);
            updatePackageStats();
        } else {
            showToast('Failed to load packages', 'error');
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        showToast('Failed to load packages', 'error');
    }
}

// Render packages with beautiful styling
function renderPackages(packages) {
    const grid = document.getElementById('packages-grid');
    const featuredGrid = document.getElementById('featured-packages-grid');
    
    if (!grid && !featuredGrid) return;
    
    if (packages.length === 0) {
        const emptyHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No packages found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        if (grid) grid.innerHTML = emptyHTML;
        return;
    }
    
    const packagesHTML = packages.map((pkg, index) => `
        <div class="package-card stagger-child animate-on-scroll" data-package-id="${pkg.id}" style="animation-delay: ${index * 100}ms">
            <div class="package-image">
                <img src="${pkg.image_url || getDefaultImage(pkg.title)}" 
                     alt="${pkg.title}" loading="lazy">
                <div class="package-badge">Featured</div>
            </div>
            <div class="package-content">
                <div class="package-title">${pkg.title}</div>
                <div class="package-description">${truncateText(pkg.description, 120)}</div>
                
                <div class="package-features">
                    <div class="package-feature">
                        <i class="fas fa-map-marker-alt"></i>
                        ${pkg.location || 'Sri Lanka'}
                    </div>
                    <div class="package-feature">
                        <i class="fas fa-clock"></i>
                        ${pkg.duration || 'Duration TBD'}
                    </div>
                    <div class="package-feature">
                        <i class="fas fa-users"></i>
                        Max ${pkg.max_participants || 10}
                    </div>
                    <div class="package-feature">
                        <i class="fas fa-star"></i>
                        ${pkg.rating || 4.5} Rating
                    </div>
                </div>
                
                <div class="package-footer">
                    <div class="package-price">
                        ${formatCurrency(pkg.price)}
                        <span>per person</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="showPackageDetails(${pkg.id})">
                            <i class="fas fa-eye"></i>
                            Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="bookPackage(${pkg.id})">
                            <i class="fas fa-calendar-plus"></i>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if (grid) {
        grid.innerHTML = packagesHTML;
        grid.classList.add('stagger-parent');
    }
    
    if (featuredGrid) {
        // Show only first 6 packages for featured section
        const featuredPackages = packages.slice(0, 6);
        featuredGrid.innerHTML = featuredPackages.map((pkg, index) => `
            <div class="package-card stagger-child animate-on-scroll" data-package-id="${pkg.id}" style="animation-delay: ${index * 100}ms">
                <div class="package-image">
                    <img src="${pkg.image_url || getDefaultImage(pkg.title)}" 
                         alt="${pkg.title}" loading="lazy">
                    <div class="package-badge">Featured</div>
                </div>
                <div class="package-content">
                    <div class="package-title">${pkg.title}</div>
                    <div class="package-description">${truncateText(pkg.description, 80)}</div>
                    
                    <div class="package-features">
                        <div class="package-feature">
                            <i class="fas fa-map-marker-alt"></i>
                            ${pkg.location || 'Sri Lanka'}
                        </div>
                        <div class="package-feature">
                            <i class="fas fa-clock"></i>
                            ${pkg.duration || 'Duration TBD'}
                        </div>
                        <div class="package-feature">
                            <i class="fas fa-star"></i>
                            ${pkg.rating || 4.5}
                        </div>
                    </div>
                    
                    <div class="package-footer">
                        <div class="package-price">
                            ${formatCurrency(pkg.price)}
                            <span>per person</span>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="bookPackage(${pkg.id})">
                            <i class="fas fa-calendar-plus"></i>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        featuredGrid.classList.add('stagger-parent');
    }
    
    // Re-initialize beautiful effects for new elements
    if (window.beautifulEffects) {
        window.beautifulEffects.setupGlassMorphism();
    }
}

// Show package details modal
async function showPackageDetails(packageId) {
    try {
        const response = await apiRequest(`/packages/package/read?id=${packageId}`);
        if (response.status === 'success') {
            const pkg = response.data;
            renderPackageDetails(pkg);
            showModal('package-details-modal');
        } else {
            showToast('Failed to load package details', 'error');
        }
    } catch (error) {
        console.error('Error loading package details:', error);
        showToast('Failed to load package details', 'error');
    }
}

// Render package details in modal
function renderPackageDetails(pkg) {
    const modal = document.getElementById('package-details-modal');
    if (!modal) return;
    
    // Update modal content
    modal.querySelector('.package-title').textContent = pkg.title;
    modal.querySelector('.package-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${pkg.location || 'Sri Lanka'}`;
    modal.querySelector('.package-duration').innerHTML = `<i class="fas fa-clock"></i> ${pkg.duration || 'Duration TBD'}`;
    modal.querySelector('.package-rating').innerHTML = `
        ${renderStars(pkg.rating || 4.5)}
        <span class="rating-count">(${pkg.review_count || 12} reviews)</span>
    `;
    modal.querySelector('.package-price').textContent = formatCurrency(pkg.price);
    
    // Update image
    const img = modal.querySelector('.package-image img');
    if (img) {
        img.src = pkg.image_url || getDefaultImage(pkg.title);
        img.alt = pkg.title;
    }
    
    // Update description
    modal.querySelector('.package-description').textContent = pkg.description;
    
    // Update features
    const featuresContainer = modal.querySelector('.package-features');
    if (featuresContainer) {
        featuresContainer.innerHTML = renderDetailedFeatures(pkg.features);
    }
    
    // Update itinerary
    const itineraryContainer = modal.querySelector('.package-itinerary');
    if (itineraryContainer) {
        itineraryContainer.innerHTML = renderItinerary(pkg.itinerary);
    }
    
    // Update included/excluded
    const includedContainer = modal.querySelector('.package-included');
    const excludedContainer = modal.querySelector('.package-excluded');
    if (includedContainer) {
        includedContainer.innerHTML = renderIncluded(pkg.included);
    }
    if (excludedContainer) {
        excludedContainer.innerHTML = renderExcluded(pkg.excluded);
    }
    
    // Store package ID for booking
    modal.dataset.packageId = pkg.id;
}

// Book package
function bookPackage(packageId) {
    if (!requireAuth()) return;
    
    const pkg = allPackages.find(p => p.id == packageId);
    if (!pkg) {
        showToast('Package not found', 'error');
        return;
    }
    
    // Show booking form
    showBookingForm(pkg);
}

// Show booking form
function showBookingForm(pkg) {
    // Pre-fill package information
    const modal = document.getElementById('package-details-modal');
    const bookingForm = document.getElementById('package-booking-form');
    
    if (bookingForm) {
        // Set package ID
        bookingForm.querySelector('input[name="package_id"]').value = pkg.id;
        
        // Update price display
        updateBookingPrice(pkg.price);
        
        // Scroll to booking form
        bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle package booking
async function handlePackageBooking(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const bookingData = {
        package_id: parseInt(formData.get('package_id')),
        booking_date: formData.get('booking_date'),
        participants: parseInt(formData.get('participants')),
        special_requests: formData.get('special_requests') || ''
    };
    
    // Validation
    if (!bookingData.booking_date) {
        showToast('Please select a booking date', 'error');
        return;
    }
    
    if (bookingData.participants < 1) {
        showToast('Please select at least 1 participant', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        
        const response = await apiRequest('/bookings/booking/create', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        if (response.status === 'success') {
            showToast('Booking created successfully!', 'success');
            closeModal('package-details-modal');
            form.reset();
            
            // Redirect to bookings page
            showPage('my-bookings');
        } else {
            showToast(response.message || 'Failed to create booking', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showToast('Failed to create booking', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Update booking price based on participants
function updateBookingPrice(basePrice) {
    const participantsInput = document.querySelector('input[name="participants"]');
    const priceDisplay = document.querySelector('.booking-total-price');
    
    if (participantsInput && priceDisplay) {
        participantsInput.addEventListener('input', function() {
            const participants = parseInt(this.value) || 1;
            const totalPrice = basePrice * participants;
            priceDisplay.textContent = formatCurrency(totalPrice);
        });
        
        // Initial update
        const participants = parseInt(participantsInput.value) || 1;
        const totalPrice = basePrice * participants;
        priceDisplay.textContent = formatCurrency(totalPrice);
    }
}

// Update package statistics
function updatePackageStats() {
    const statsContainer = document.querySelector('.packages-stats');
    if (!statsContainer) return;
    
    const totalPackages = allPackages.length;
    const avgPrice = allPackages.reduce((sum, pkg) => sum + parseFloat(pkg.price), 0) / totalPackages;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${totalPackages}</span>
            <span class="stat-label">Total Packages</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${formatCurrency(avgPrice)}</span>
            <span class="stat-label">Average Price</span>
        </div>
    `;
}

// Render star rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return `<div class="stars">${starsHtml}</div>`;
}

// Render package features
function renderFeatures(features) {
    if (!features) return '';
    
    const featureList = typeof features === 'string' ? features.split(',') : features;
    return featureList.slice(0, 3).map(feature => 
        `<span class="feature-tag">${feature.trim()}</span>`
    ).join('');
}

// Render detailed features for modal
function renderDetailedFeatures(features) {
    if (!features) return '<p>No specific features listed</p>';
    
    const featureList = typeof features === 'string' ? features.split(',') : features;
    return `
        <ul class="feature-list">
            ${featureList.map(feature => `<li><i class="fas fa-check"></i> ${feature.trim()}</li>`).join('')}
        </ul>
    `;
}

// Render itinerary
function renderItinerary(itinerary) {
    if (!itinerary) return '<p>Detailed itinerary will be provided upon booking</p>';
    
    // If itinerary is a string, convert to basic format
    if (typeof itinerary === 'string') {
        return `<p>${itinerary}</p>`;
    }
    
    // If it's an array of days
    if (Array.isArray(itinerary)) {
        return `
            <div class="itinerary-days">
                ${itinerary.map((day, index) => `
                    <div class="itinerary-day">
                        <h4>Day ${index + 1}</h4>
                        <p>${day}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    return '<p>Detailed itinerary will be provided upon booking</p>';
}

// Render included items
function renderIncluded(included) {
    if (!included) return '<p>Details will be provided upon booking</p>';
    
    const includedList = typeof included === 'string' ? included.split(',') : included;
    return `
        <ul class="included-list">
            ${includedList.map(item => `<li><i class="fas fa-check text-success"></i> ${item.trim()}</li>`).join('')}
        </ul>
    `;
}

// Render excluded items
function renderExcluded(excluded) {
    if (!excluded) return '<p>No specific exclusions</p>';
    
    const excludedList = typeof excluded === 'string' ? excluded.split(',') : excluded;
    return `
        <ul class="excluded-list">
            ${excludedList.map(item => `<li><i class="fas fa-times text-danger"></i> ${item.trim()}</li>`).join('')}
        </ul>
    `;
}

// Get beautiful default images based on package title
function getDefaultImage(title) {
    const beautifulImages = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop&q=80', // Sigiriya Rock
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&q=80', // Tea plantations
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&h=400&fit=crop&q=80', // Beach paradise
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop&q=80', // Tropical beach
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=400&fit=crop&q=80', // Ocean waves
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=400&fit=crop&q=80', // Wildlife safari
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=400&fit=crop&q=80', // Mountain landscape
        'https://images.unsplash.com/photo-1518709268805-4e9042af2ac0?w=500&h=400&fit=crop&q=80', // Cultural temple
        'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500&h=400&fit=crop&q=80', // Tropical forest
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&q=80'  // Sunset coast
    ];
    
    // Use title hash to consistently return same image for same title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    const index = Math.abs(hash) % beautifulImages.length;
    return beautifulImages[index];
}

// Search packages
function searchPackages(query) {
    if (!query) {
        filteredPackages = allPackages;
        renderPackages(filteredPackages);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    filteredPackages = allPackages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm) ||
        pkg.description.toLowerCase().includes(searchTerm) ||
        (pkg.location && pkg.location.toLowerCase().includes(searchTerm))
    );
    
    renderPackages(filteredPackages);
}

// Filter packages by category
function filterPackagesByCategory(category) {
    if (category === 'all') {
        filteredPackages = allPackages;
    } else {
        filteredPackages = allPackages.filter(pkg => {
            const searchText = `${pkg.title} ${pkg.description}`.toLowerCase();
            return searchText.includes(category.toLowerCase());
        });
    }
    
    renderPackages(filteredPackages);
}

// Sort packages
function sortPackages(sortBy) {
    let sorted = [...filteredPackages];
    
    switch (sortBy) {
        case 'price-low':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
            break;
        case 'duration':
            sorted.sort((a, b) => (a.duration || '').localeCompare(b.duration || ''));
            break;
        default:
            // Keep current order for 'recommended'
            break;
    }
    
    renderPackages(sorted);
}

// Export functions
window.loadPackages = loadPackages;
window.showPackageDetails = showPackageDetails;
window.bookPackage = bookPackage;
window.searchPackages = searchPackages;
window.filterPackagesByCategory = filterPackagesByCategory;
window.sortPackages = sortPackages;
