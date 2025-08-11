// Bookings Module

let currentBookings = [];
let pastBookings = [];

// Initialize bookings module
document.addEventListener('DOMContentLoaded', function() {
    setupBookingEventListeners();
});

function setupBookingEventListeners() {
    // Booking action buttons will be added dynamically
}

// Load user bookings
async function loadUserBookings() {
    if (!requireAuth()) return;
    
    try {
        const response = await apiRequest('/bookings/booking/user-bookings');
        if (response.status === 'success') {
            const allBookings = response.data;
            
            // Separate current and past bookings
            const now = new Date();
            currentBookings = allBookings.filter(booking => new Date(booking.booking_date) >= now);
            pastBookings = allBookings.filter(booking => new Date(booking.booking_date) < now);
            
            renderCurrentBookings(currentBookings);
        } else {
            showToast('Failed to load bookings', 'error');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showToast('Failed to load bookings', 'error');
    }
}

// Load past bookings
async function loadPastBookings() {
    if (!requireAuth()) return;
    
    try {
        const response = await apiRequest('/bookings/booking/user-bookings');
        if (response.status === 'success') {
            const allBookings = response.data;
            
            // Filter past bookings
            const now = new Date();
            pastBookings = allBookings.filter(booking => new Date(booking.booking_date) < now);
            
            renderPastBookings(pastBookings);
        } else {
            showToast('Failed to load past bookings', 'error');
        }
    } catch (error) {
        console.error('Error loading past bookings:', error);
        showToast('Failed to load past bookings', 'error');
    }
}

// Render current bookings
function renderCurrentBookings(bookings) {
    const container = document.getElementById('current-bookings-container');
    if (!container) return;
    
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No upcoming bookings</h3>
                <p>You don't have any upcoming trips planned.</p>
                <button class="btn btn-primary" onclick="showPage('packages')">
                    <i class="fas fa-search"></i> Browse Packages
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = bookings.map(booking => `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div class="booking-package">
                    <h3 class="package-title">${booking.package_title || 'Package'}</h3>
                    <div class="booking-meta">
                        <span class="booking-id">Booking #${booking.id}</span>
                        <span class="booking-status status-${booking.status}">${getStatusText(booking.status)}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <div class="dropdown">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" onclick="toggleDropdown(this)">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="#" onclick="viewBookingDetails(${booking.id})">
                                <i class="fas fa-eye"></i> View Details
                            </a>
                            ${booking.status === 'pending' ? `
                                <a href="#" onclick="cancelBooking(${booking.id})">
                                    <i class="fas fa-times"></i> Cancel Booking
                                </a>
                            ` : ''}
                            <a href="#" onclick="downloadBookingVoucher(${booking.id})">
                                <i class="fas fa-download"></i> Download Voucher
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <span class="label">Date</span>
                            <span class="value">${formatDate(booking.booking_date)}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <span class="label">Participants</span>
                            <span class="value">${booking.participants} ${booking.participants === 1 ? 'person' : 'people'}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <div>
                            <span class="label">Total Amount</span>
                            <span class="value">${formatCurrency(booking.total_amount)}</span>
                        </div>
                    </div>
                </div>
                
                ${booking.special_requests ? `
                    <div class="special-requests">
                        <h4>Special Requests</h4>
                        <p>${booking.special_requests}</p>
                    </div>
                ` : ''}
                
                <div class="booking-timeline">
                    <div class="timeline-item ${booking.status === 'pending' ? 'active' : 'completed'}">
                        <i class="fas fa-clock"></i>
                        <span>Booking Submitted</span>
                    </div>
                    <div class="timeline-item ${booking.status === 'confirmed' ? 'active' : booking.status === 'completed' ? 'completed' : ''}">
                        <i class="fas fa-check"></i>
                        <span>Confirmed</span>
                    </div>
                    <div class="timeline-item ${booking.status === 'completed' ? 'active' : ''}">
                        <i class="fas fa-flag"></i>
                        <span>Trip Completed</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render past bookings
function renderPastBookings(bookings) {
    const container = document.getElementById('past-bookings-container');
    if (!container) return;
    
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No past bookings</h3>
                <p>You haven't completed any trips yet.</p>
                <button class="btn btn-primary" onclick="showPage('packages')">
                    <i class="fas fa-search"></i> Book Your First Trip
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = bookings.map(booking => `
        <div class="booking-card past-booking" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div class="booking-package">
                    <h3 class="package-title">${booking.package_title || 'Package'}</h3>
                    <div class="booking-meta">
                        <span class="booking-id">Booking #${booking.id}</span>
                        <span class="booking-date">${formatDate(booking.booking_date)}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewBookingDetails(${booking.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${!booking.review_submitted ? `
                        <button class="btn btn-secondary btn-sm" onclick="writeReview(${booking.id})">
                            <i class="fas fa-star"></i> Write Review
                        </button>
                    ` : `
                        <span class="review-badge">
                            <i class="fas fa-star"></i> Reviewed
                        </span>
                    `}
                </div>
            </div>
            
            <div class="booking-summary">
                <div class="summary-item">
                    <i class="fas fa-users"></i>
                    <span>${booking.participants} participants</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${formatCurrency(booking.total_amount)}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-check-circle text-success"></i>
                    <span>Completed</span>
                </div>
            </div>
        </div>
    `).join('');
}

// View booking details
async function viewBookingDetails(bookingId) {
    try {
        const response = await apiRequest(`/bookings/booking/read?id=${bookingId}`);
        if (response.status === 'success') {
            const booking = response.data;
            showBookingDetailsModal(booking);
        } else {
            showToast('Failed to load booking details', 'error');
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        showToast('Failed to load booking details', 'error');
    }
}

// Show booking details modal
function showBookingDetailsModal(booking) {
    const modal = document.getElementById('booking-details-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        createBookingDetailsModal();
    }
    
    // Update modal content
    updateBookingDetailsModal(booking);
    showModal('booking-details-modal');
}

// Create booking details modal
function createBookingDetailsModal() {
    const modalHtml = `
        <div id="booking-details-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Booking Details</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="booking-details-content">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listener for close button
    const modal = document.getElementById('booking-details-modal');
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal('booking-details-modal'));
}

// Update booking details modal content
function updateBookingDetailsModal(booking) {
    const content = document.getElementById('booking-details-content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="booking-details-full">
            <div class="booking-header-full">
                <h3>${booking.package_title || 'Package'}</h3>
                <span class="booking-status status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            
            <div class="booking-info-grid">
                <div class="info-section">
                    <h4>Booking Information</h4>
                    <div class="info-item">
                        <label>Booking ID:</label>
                        <span>#${booking.id}</span>
                    </div>
                    <div class="info-item">
                        <label>Booking Date:</label>
                        <span>${formatDate(booking.booking_date)}</span>
                    </div>
                    <div class="info-item">
                        <label>Participants:</label>
                        <span>${booking.participants} ${booking.participants === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div class="info-item">
                        <label>Total Amount:</label>
                        <span>${formatCurrency(booking.total_amount)}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Package Details</h4>
                    <div class="info-item">
                        <label>Package:</label>
                        <span>${booking.package_title}</span>
                    </div>
                    <div class="info-item">
                        <label>Duration:</label>
                        <span>${booking.package_duration || 'TBD'}</span>
                    </div>
                    <div class="info-item">
                        <label>Location:</label>
                        <span>${booking.package_location || 'Sri Lanka'}</span>
                    </div>
                </div>
            </div>
            
            ${booking.special_requests ? `
                <div class="info-section">
                    <h4>Special Requests</h4>
                    <p>${booking.special_requests}</p>
                </div>
            ` : ''}
            
            <div class="booking-actions-full">
                <button class="btn btn-secondary" onclick="downloadBookingVoucher(${booking.id})">
                    <i class="fas fa-download"></i> Download Voucher
                </button>
                ${booking.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/bookings/booking/cancel`, {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId })
        });
        
        if (response.status === 'success') {
            showToast('Booking cancelled successfully', 'success');
            
            // Refresh bookings
            if (currentPage === 'my-bookings') {
                loadUserBookings();
            }
            
            // Close modal if open
            closeModal('booking-details-modal');
        } else {
            showToast(response.message || 'Failed to cancel booking', 'error');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showToast('Failed to cancel booking', 'error');
    }
}

// Download booking voucher
function downloadBookingVoucher(bookingId) {
    // Create a temporary link to download the voucher
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/bookings/booking/voucher?id=${bookingId}`;
    link.download = `booking-voucher-${bookingId}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Write review
function writeReview(bookingId) {
    // Show review modal
    showReviewModal(bookingId);
}

// Show review modal
function showReviewModal(bookingId) {
    const modal = document.getElementById('review-modal');
    if (!modal) {
        createReviewModal();
    }
    
    // Set booking ID
    const form = document.getElementById('review-form');
    if (form) {
        form.dataset.bookingId = bookingId;
    }
    
    showModal('review-modal');
}

// Create review modal
function createReviewModal() {
    const modalHtml = `
        <div id="review-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Write a Review</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="review-form">
                        <div class="form-group">
                            <label>Rating</label>
                            <div class="star-rating">
                                <input type="radio" name="rating" value="5" id="star5">
                                <label for="star5">★</label>
                                <input type="radio" name="rating" value="4" id="star4">
                                <label for="star4">★</label>
                                <input type="radio" name="rating" value="3" id="star3">
                                <label for="star3">★</label>
                                <input type="radio" name="rating" value="2" id="star2">
                                <label for="star2">★</label>
                                <input type="radio" name="rating" value="1" id="star1">
                                <label for="star1">★</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="review-title">Review Title</label>
                            <input type="text" id="review-title" name="title" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="review-comment">Your Review</label>
                            <textarea id="review-comment" name="comment" rows="4" required></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeModal('review-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listeners
    const modal = document.getElementById('review-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('review-form');
    
    closeBtn.addEventListener('click', () => closeModal('review-modal'));
    form.addEventListener('submit', handleReviewSubmit);
}

// Handle review submission
async function handleReviewSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const bookingId = form.dataset.bookingId;
    
    const reviewData = {
        booking_id: bookingId,
        rating: parseInt(formData.get('rating')),
        title: formData.get('title'),
        comment: formData.get('comment')
    };
    
    // Validation
    if (!reviewData.rating) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    try {
        const response = await apiRequest('/reviews/create', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
        
        if (response.status === 'success') {
            showToast('Review submitted successfully!', 'success');
            closeModal('review-modal');
            form.reset();
            
            // Refresh past bookings to update review status
            if (currentPage === 'past-bookings') {
                loadPastBookings();
            }
        } else {
            showToast(response.message || 'Failed to submit review', 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showToast('Failed to submit review', 'error');
    }
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    
    return statusMap[status] || status;
}

// Toggle dropdown
function toggleDropdown(button) {
    const dropdown = button.parentElement;
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
        menu.classList.remove('active');
    });
    
    menu.classList.toggle('active');
    
    // Close on click outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Export functions
window.loadUserBookings = loadUserBookings;
window.loadPastBookings = loadPastBookings;
window.viewBookingDetails = viewBookingDetails;
window.cancelBooking = cancelBooking;
window.downloadBookingVoucher = downloadBookingVoucher;
window.writeReview = writeReview;
window.toggleDropdown = toggleDropdown;
