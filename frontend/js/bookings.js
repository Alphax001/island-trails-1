// Island Trails - Bookings JavaScript

// Global variables
let allBookings = [];
let filteredBookings = [];
let currentStatusFilter = 'all';

// DOM elements
const bookingsGrid = document.getElementById('bookings-grid');
const bookingFilters = document.querySelectorAll('.bookings-filters .filter-btn');

// Initialize bookings when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupBookingEventListeners();
});

// Setup booking event listeners
function setupBookingEventListeners() {
    // Status filter buttons
    bookingFilters.forEach(btn => {
        btn.addEventListener('click', handleStatusFilterClick);
    });
}

// Handle status filter button click
function handleStatusFilterClick(e) {
    const status = e.target.getAttribute('data-status');
    
    // Update active filter button
    bookingFilters.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Apply filter
    currentStatusFilter = status;
    filterBookingsByStatus(status);
}

// Load bookings from API
async function loadBookings() {
    if (!bookingsGrid) return;
    
    // Check authentication
    if (!requireAuth()) {
        return;
    }
    
    // Show loading state
    bookingsGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading your bookings...</p>
        </div>
    `;
    
    try {
        const response = await apiRequest('/bookings/booking/readUserBookings');
        
        if (response.status === 'success') {
            allBookings = response.data || [];
            filteredBookings = allBookings;
            renderBookings();
        } else {
            throw new Error(response.message || 'Failed to load bookings');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsGrid.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <h3>Failed to Load Bookings</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">We couldn't load your bookings. Please try again.</p>
                <button class="btn btn-primary" onclick="loadBookings()">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
        showToast('Failed to load bookings', 'error');
    }
}

// Filter bookings by status
function filterBookingsByStatus(status) {
    if (status === 'all') {
        filteredBookings = allBookings;
    } else {
        filteredBookings = allBookings.filter(booking => booking.status === status);
    }
    
    renderBookings();
}

// Render bookings
function renderBookings() {
    if (!bookingsGrid) return;
    
    if (filteredBookings.length === 0) {
        const message = currentStatusFilter === 'all' ? 
            'You haven\'t made any bookings yet.' :
            `No ${currentStatusFilter} bookings found.`;
            
        bookingsGrid.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-calendar-times" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem; color: #666;">${message}</h3>
                <p style="color: #999; margin-bottom: 2rem;">
                    ${currentStatusFilter === 'all' ? 
                        'Start exploring our amazing packages and create your first booking!' :
                        'Try adjusting your filter or check back later.'
                    }
                </p>
                ${currentStatusFilter === 'all' ? 
                    '<button class="btn btn-primary" onclick="showSection(\'packages\')"><i class="fas fa-search"></i> Browse Packages</button>' :
                    '<button class="btn btn-secondary" onclick="showAllBookings()">Show All Bookings</button>'
                }
            </div>
        `;
        return;
    }
    
    bookingsGrid.innerHTML = filteredBookings.map(booking => createBookingCard(booking)).join('');
}

// Create booking card HTML
function createBookingCard(booking) {
    const statusClass = `status-${booking.status}`;
    const bookingDate = new Date(booking.booking_date);
    const createdDate = new Date(booking.created_at);
    const isUpcoming = bookingDate > new Date();
    
    return `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div class="booking-info">
                    <h3>${booking.package_title || 'Package #' + booking.package_id}</h3>
                    <p class="booking-id">Booking #${booking.id}</p>
                    <p class="booking-date">
                        <i class="fas fa-calendar"></i>
                        Booked on ${formatDate(createdDate.toISOString())}
                    </p>
                </div>
                <div class="booking-status ${statusClass}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
            </div>
            
            <div class="booking-details">
                <div class="booking-detail">
                    <label>Travel Date</label>
                    <span>
                        <i class="fas fa-calendar-day"></i>
                        ${formatDate(booking.booking_date)}
                        ${isUpcoming ? '<span style="color: #28a745; font-size: 0.8rem; margin-left: 0.5rem;">(Upcoming)</span>' : ''}
                    </span>
                </div>
                
                <div class="booking-detail">
                    <label>Package Price</label>
                    <span>
                        <i class="fas fa-dollar-sign"></i>
                        ${booking.package_price ? formatCurrency(parseFloat(booking.package_price)) : 'N/A'}
                    </span>
                </div>
                
                <div class="booking-detail">
                    <label>Duration</label>
                    <span>
                        <i class="fas fa-clock"></i>
                        ${booking.package_duration || 'N/A'}
                    </span>
                </div>
                
                ${booking.package_location ? `
                    <div class="booking-detail">
                        <label>Location</label>
                        <span>
                            <i class="fas fa-map-marker-alt"></i>
                            ${booking.package_location}
                        </span>
                    </div>
                ` : ''}
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-outline btn-sm" onclick="viewBookingDetails(${booking.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                
                ${booking.status === 'pending' && isUpcoming ? `
                    <button class="btn btn-outline btn-sm" onclick="editBooking(${booking.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                ` : ''}
                
                ${booking.status === 'pending' ? `
                    <button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
                
                ${booking.status === 'confirmed' ? `
                    <button class="btn btn-primary btn-sm" onclick="downloadTicket(${booking.id})">
                        <i class="fas fa-download"></i> Download
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Show all bookings (reset filter)
function showAllBookings() {
    currentStatusFilter = 'all';
    
    // Update active filter button
    bookingFilters.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-status="all"]').classList.add('active');
    
    filterBookingsByStatus('all');
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    if (!booking) {
        showToast('Booking not found', 'error');
        return;
    }
    
    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    
    const bookingDate = new Date(booking.booking_date);
    const createdDate = new Date(booking.created_at);
    const isUpcoming = bookingDate > new Date();
    const statusClass = `status-${booking.status}`;
    
    modalBody.innerHTML = `
        <div class="booking-details-modal">
            <div class="booking-header-modal" style="text-align: center; margin-bottom: 2rem;">
                <h2>${booking.package_title || 'Package #' + booking.package_id}</h2>
                <p style="color: #666;">Booking #${booking.id}</p>
                <div class="booking-status ${statusClass}" style="display: inline-block; margin-top: 0.5rem;">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
            </div>
            
            <div class="booking-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="info-card" style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">
                        <i class="fas fa-calendar-day"></i> Travel Date
                    </h4>
                    <p style="font-size: 1.1rem; margin: 0;">
                        ${formatDate(booking.booking_date)}
                        ${isUpcoming ? '<br><small style="color: #28a745;">Upcoming</small>' : '<br><small style="color: #666;">Past</small>'}
                    </p>
                </div>
                
                <div class="info-card" style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">
                        <i class="fas fa-dollar-sign"></i> Price
                    </h4>
                    <p style="font-size: 1.1rem; margin: 0;">
                        ${booking.package_price ? formatCurrency(parseFloat(booking.package_price)) : 'N/A'}
                    </p>
                </div>
                
                <div class="info-card" style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">
                        <i class="fas fa-clock"></i> Duration
                    </h4>
                    <p style="font-size: 1.1rem; margin: 0;">
                        ${booking.package_duration || 'N/A'}
                    </p>
                </div>
                
                ${booking.package_location ? `
                    <div class="info-card" style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                        <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">
                            <i class="fas fa-map-marker-alt"></i> Location
                        </h4>
                        <p style="font-size: 1.1rem; margin: 0;">
                            ${booking.package_location}
                        </p>
                    </div>
                ` : ''}
            </div>
            
            <div class="booking-timeline" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">
                    <i class="fas fa-history"></i> Booking Timeline
                </h4>
                <div class="timeline-item" style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <i class="fas fa-check-circle" style="color: #28a745; margin-right: 0.5rem;"></i>
                    <span>Booking created on ${formatDate(createdDate.toISOString())}</span>
                </div>
                <div class="timeline-item" style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    ${booking.status === 'confirmed' ? 
                        '<i class="fas fa-check-circle" style="color: #28a745; margin-right: 0.5rem;"></i>' :
                        '<i class="fas fa-circle" style="color: #ccc; margin-right: 0.5rem;"></i>'
                    }
                    <span>Booking ${booking.status === 'confirmed' ? 'confirmed' : 'pending confirmation'}</span>
                </div>
                <div class="timeline-item" style="display: flex; align-items: center;">
                    ${isUpcoming && booking.status === 'confirmed' ? 
                        '<i class="fas fa-plane" style="color: var(--primary-color); margin-right: 0.5rem;"></i>' :
                        '<i class="fas fa-circle" style="color: #ccc; margin-right: 0.5rem;"></i>'
                    }
                    <span>Travel date: ${formatDate(booking.booking_date)}</span>
                </div>
            </div>
            
            <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="closeBookingModal()">Close</button>
                
                ${booking.status === 'pending' && isUpcoming ? `
                    <button class="btn btn-outline" onclick="editBooking(${booking.id})">
                        <i class="fas fa-edit"></i> Edit Booking
                    </button>
                ` : ''}
                
                ${booking.status === 'confirmed' ? `
                    <button class="btn btn-primary" onclick="downloadTicket(${booking.id})">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                ` : ''}
                
                ${booking.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Edit booking
function editBooking(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    if (!booking) {
        showToast('Booking not found', 'error');
        return;
    }
    
    // Get tomorrow's date as minimum booking date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    // Get current booking date
    const currentDate = new Date(booking.booking_date).toISOString().split('T')[0];
    
    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    
    modalBody.innerHTML = `
        <div class="edit-booking-form">
            <div class="package-summary" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3>${booking.package_title || 'Package #' + booking.package_id}</h3>
                <p>Booking #${booking.id}</p>
                <p class="price" style="font-size: 1.25rem; font-weight: 700; color: var(--primary-color);">
                    ${booking.package_price ? formatCurrency(parseFloat(booking.package_price)) : 'N/A'}
                </p>
            </div>
            
            <form id="edit-booking-form">
                <div class="form-group">
                    <label for="edit-booking-date">Travel Date</label>
                    <input type="date" id="edit-booking-date" name="booking_date" required 
                           min="${minDate}" value="${currentDate}">
                </div>
                
                <div class="form-group">
                    <label for="edit-booking-notes">Special Requests (Optional)</label>
                    <textarea id="edit-booking-notes" name="notes" rows="3" 
                              placeholder="Any special requests or dietary requirements..."></textarea>
                </div>
                
                <div class="form-actions" style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Booking
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Handle form submission
    const editForm = document.getElementById('edit-booking-form');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingUpdate(bookingId);
    });
    
    modal.classList.add('active');
}

// Handle booking update
async function handleBookingUpdate(bookingId) {
    const form = document.getElementById('edit-booking-form');
    const formData = new FormData(form);
    
    const updateData = {
        id: bookingId,
        booking_date: formData.get('booking_date'),
        notes: formData.get('notes') || ''
    };
    
    showLoading();
    
    try {
        const response = await apiRequest('/bookings/booking/update', {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
        
        if (response.status === 'success') {
            showToast('Booking updated successfully!', 'success');
            closeBookingModal();
            
            // Reload bookings
            loadBookings();
        } else {
            showToast(response.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showToast('Update failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    if (!booking) {
        showToast('Booking not found', 'error');
        return;
    }
    
    // Confirm cancellation
    if (!confirm(`Are you sure you want to cancel your booking for "${booking.package_title || 'Package #' + booking.package_id}"?`)) {
        return;
    }
    
    showLoading();
    
    try {
        const response = await apiRequest('/bookings/booking/update', {
            method: 'PUT',
            body: JSON.stringify({
                id: bookingId,
                status: 'cancelled'
            })
        });
        
        if (response.status === 'success') {
            showToast('Booking cancelled successfully', 'success');
            closeBookingModal();
            
            // Reload bookings
            loadBookings();
        } else {
            showToast(response.message || 'Cancellation failed', 'error');
        }
    } catch (error) {
        console.error('Cancellation error:', error);
        showToast('Cancellation failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Download ticket (placeholder)
function downloadTicket(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    if (!booking) {
        showToast('Booking not found', 'error');
        return;
    }
    
    // For now, just show a message
    showToast('Ticket download feature coming soon!', 'info');
    
    // TODO: Implement actual ticket generation and download
    console.log('Download ticket for booking:', bookingId);
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('active');
}

// Export functions for global use
window.loadBookings = loadBookings;
window.viewBookingDetails = viewBookingDetails;
window.editBooking = editBooking;
window.cancelBooking = cancelBooking;
window.downloadTicket = downloadTicket;
window.closeBookingModal = closeBookingModal;
window.showAllBookings = showAllBookings;
