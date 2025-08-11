// Admin Dashboard Module

let adminStats = {};
let adminPackages = [];
let adminBookings = [];

// Initialize admin module
document.addEventListener('DOMContentLoaded', function() {
    setupAdminEventListeners();
});

function setupAdminEventListeners() {
    // Create package form
    const createPackageForm = document.getElementById('create-package-form');
    if (createPackageForm) {
        createPackageForm.addEventListener('submit', handleCreatePackage);
    }
    
    // Edit package form
    const editPackageForm = document.getElementById('edit-package-form');
    if (editPackageForm) {
        editPackageForm.addEventListener('submit', handleEditPackage);
    }
}

// Load admin dashboard
async function loadAdminDashboard() {
    if (!requireAuth('admin')) return;
    
    try {
        // Load dashboard stats
        await loadAdminStats();
        
        // Load recent bookings
        await loadRecentBookings();
        
        // Load package stats
        await loadPackageStats();
        
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

// Load admin statistics
async function loadAdminStats() {
    try {
        const response = await apiRequest('/admin/dashboard/stats');
        if (response.status === 'success') {
            adminStats = response.data;
            renderAdminStats(adminStats);
        }
    } catch (error) {
        console.error('Error loading admin stats:', error);
        // Use default stats if API fails
        const defaultStats = {
            total_bookings: 0,
            total_revenue: 0,
            total_packages: 0,
            total_users: 0,
            pending_bookings: 0,
            this_month_bookings: 0
        };
        renderAdminStats(defaultStats);
    }
}

// Render admin statistics
function renderAdminStats(stats) {
    // Update stat cards
    updateStatCard('total-bookings', stats.total_bookings || 0, 'Total Bookings');
    updateStatCard('total-revenue', formatCurrency(stats.total_revenue || 0), 'Total Revenue');
    updateStatCard('total-packages', stats.total_packages || 0, 'Active Packages');
    updateStatCard('total-users', stats.total_users || 0, 'Registered Users');
    updateStatCard('pending-bookings', stats.pending_bookings || 0, 'Pending Bookings');
    updateStatCard('monthly-bookings', stats.this_month_bookings || 0, 'This Month');
}

// Update individual stat card
function updateStatCard(cardId, value, label) {
    const card = document.getElementById(cardId);
    if (card) {
        const numberElement = card.querySelector('.stat-number');
        const labelElement = card.querySelector('.stat-label');
        
        if (numberElement) numberElement.textContent = value;
        if (labelElement) labelElement.textContent = label;
    }
}

// Load recent bookings for admin
async function loadRecentBookings() {
    try {
        const response = await apiRequest('/admin/bookings/recent');
        if (response.status === 'success') {
            const recentBookings = response.data;
            renderRecentBookingsTable(recentBookings);
        }
    } catch (error) {
        console.error('Error loading recent bookings:', error);
    }
}

// Render recent bookings table
function renderRecentBookingsTable(bookings) {
    const tbody = document.querySelector('#recent-bookings-table tbody');
    if (!tbody) return;
    
    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No recent bookings</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.user_name || booking.user_email}</td>
            <td>${booking.package_title}</td>
            <td>${formatDate(booking.booking_date)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="viewAdminBookingDetails(${booking.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${booking.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="confirmBooking(${booking.id})">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Load admin packages
async function loadAdminPackages() {
    if (!requireAuth('admin')) return;
    
    try {
        const response = await apiRequest('/packages/package/readAll');
        if (response.status === 'success') {
            adminPackages = response.data;
            renderAdminPackagesTable(adminPackages);
        } else {
            showToast('Failed to load packages', 'error');
        }
    } catch (error) {
        console.error('Error loading admin packages:', error);
        showToast('Failed to load packages', 'error');
    }
}

// Render admin packages table
function renderAdminPackagesTable(packages) {
    const tbody = document.querySelector('#admin-packages-table tbody');
    if (!tbody) return;
    
    if (packages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No packages available</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = packages.map(pkg => `
        <tr>
            <td>
                <div class="package-info">
                    <img src="${pkg.image_url || getDefaultImage(pkg.title)}" alt="${pkg.title}" class="package-thumb">
                    <div>
                        <div class="package-title">${pkg.title}</div>
                        <div class="package-location">${pkg.location || 'Sri Lanka'}</div>
                    </div>
                </div>
            </td>
            <td>${pkg.duration || 'TBD'}</td>
            <td>${formatCurrency(pkg.price)}</td>
            <td>${pkg.max_participants || 'N/A'}</td>
            <td><span class="status-badge status-active">Active</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editPackage(${pkg.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePackage(${pkg.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Show create package modal
function showCreatePackageModal() {
    const form = document.getElementById('create-package-form');
    if (form) {
        form.reset();
    }
    showModal('create-package-modal');
}

// Handle create package
async function handleCreatePackage(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const packageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        duration: formData.get('duration'),
        location: formData.get('location'),
        max_participants: parseInt(formData.get('max_participants')),
        features: formData.get('features'),
        image_url: formData.get('image_url') || ''
    };
    
    // Validation
    if (!packageData.title || !packageData.description || !packageData.price) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        
        const response = await apiRequest('/packages/package/create', {
            method: 'POST',
            body: JSON.stringify(packageData)
        });
        
        if (response.status === 'success') {
            showToast('Package created successfully!', 'success');
            closeModal('create-package-modal');
            form.reset();
            
            // Reload packages table
            loadAdminPackages();
        } else {
            showToast(response.message || 'Failed to create package', 'error');
        }
    } catch (error) {
        console.error('Error creating package:', error);
        showToast('Failed to create package', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Edit package
async function editPackage(packageId) {
    try {
        const response = await apiRequest(`/packages/package/read?id=${packageId}`);
        if (response.status === 'success') {
            const pkg = response.data;
            showEditPackageModal(pkg);
        } else {
            showToast('Failed to load package details', 'error');
        }
    } catch (error) {
        console.error('Error loading package:', error);
        showToast('Failed to load package details', 'error');
    }
}

// Show edit package modal
function showEditPackageModal(pkg) {
    const form = document.getElementById('edit-package-form');
    if (!form) return;
    
    // Populate form with package data
    form.querySelector('input[name="title"]').value = pkg.title || '';
    form.querySelector('textarea[name="description"]').value = pkg.description || '';
    form.querySelector('input[name="price"]').value = pkg.price || '';
    form.querySelector('input[name="duration"]').value = pkg.duration || '';
    form.querySelector('input[name="location"]').value = pkg.location || '';
    form.querySelector('input[name="max_participants"]').value = pkg.max_participants || '';
    form.querySelector('textarea[name="features"]').value = pkg.features || '';
    form.querySelector('input[name="image_url"]').value = pkg.image_url || '';
    
    // Store package ID
    form.dataset.packageId = pkg.id;
    
    showModal('edit-package-modal');
}

// Handle edit package
async function handleEditPackage(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const packageId = form.dataset.packageId;
    
    const packageData = {
        id: packageId,
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        duration: formData.get('duration'),
        location: formData.get('location'),
        max_participants: parseInt(formData.get('max_participants')),
        features: formData.get('features'),
        image_url: formData.get('image_url') || ''
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        
        const response = await apiRequest('/packages/package/update', {
            method: 'PUT',
            body: JSON.stringify(packageData)
        });
        
        if (response.status === 'success') {
            showToast('Package updated successfully!', 'success');
            closeModal('edit-package-modal');
            
            // Reload packages table
            loadAdminPackages();
        } else {
            showToast(response.message || 'Failed to update package', 'error');
        }
    } catch (error) {
        console.error('Error updating package:', error);
        showToast('Failed to update package', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Delete package
async function deletePackage(packageId) {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiRequest('/packages/package/delete', {
            method: 'DELETE',
            body: JSON.stringify({ id: packageId })
        });
        
        if (response.status === 'success') {
            showToast('Package deleted successfully', 'success');
            loadAdminPackages();
        } else {
            showToast(response.message || 'Failed to delete package', 'error');
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        showToast('Failed to delete package', 'error');
    }
}

// View admin booking details
async function viewAdminBookingDetails(bookingId) {
    try {
        const response = await apiRequest(`/bookings/booking/read?id=${bookingId}`);
        if (response.status === 'success') {
            const booking = response.data;
            showAdminBookingDetailsModal(booking);
        } else {
            showToast('Failed to load booking details', 'error');
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        showToast('Failed to load booking details', 'error');
    }
}

// Show admin booking details modal
function showAdminBookingDetailsModal(booking) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('admin-booking-details-modal');
    if (!modal) {
        createAdminBookingDetailsModal();
        modal = document.getElementById('admin-booking-details-modal');
    }
    
    // Update modal content
    const content = modal.querySelector('.modal-body');
    content.innerHTML = `
        <div class="admin-booking-details">
            <div class="booking-header">
                <h3>Booking #${booking.id}</h3>
                <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            
            <div class="details-grid">
                <div class="detail-section">
                    <h4>Customer Information</h4>
                    <div class="detail-item">
                        <label>Name:</label>
                        <span>${booking.user_name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email:</label>
                        <span>${booking.user_email}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Booking Details</h4>
                    <div class="detail-item">
                        <label>Package:</label>
                        <span>${booking.package_title}</span>
                    </div>
                    <div class="detail-item">
                        <label>Date:</label>
                        <span>${formatDate(booking.booking_date)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Participants:</label>
                        <span>${booking.participants}</span>
                    </div>
                    <div class="detail-item">
                        <label>Total Amount:</label>
                        <span>${formatCurrency(booking.total_amount)}</span>
                    </div>
                </div>
            </div>
            
            ${booking.special_requests ? `
                <div class="detail-section">
                    <h4>Special Requests</h4>
                    <p>${booking.special_requests}</p>
                </div>
            ` : ''}
            
            <div class="admin-actions">
                ${booking.status === 'pending' ? `
                    <button class="btn btn-success" onclick="confirmBooking(${booking.id})">
                        <i class="fas fa-check"></i> Confirm Booking
                    </button>
                    <button class="btn btn-danger" onclick="rejectBooking(${booking.id})">
                        <i class="fas fa-times"></i> Reject Booking
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="contactCustomer('${booking.user_email}')">
                    <i class="fas fa-envelope"></i> Contact Customer
                </button>
            </div>
        </div>
    `;
    
    showModal('admin-booking-details-modal');
}

// Create admin booking details modal
function createAdminBookingDetailsModal() {
    const modalHtml = `
        <div id="admin-booking-details-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Booking Details</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Content will be inserted here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listener
    const closeBtn = document.querySelector('#admin-booking-details-modal .modal-close');
    closeBtn.addEventListener('click', () => closeModal('admin-booking-details-modal'));
}

// Confirm booking
async function confirmBooking(bookingId) {
    try {
        const response = await apiRequest('/admin/bookings/confirm', {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId })
        });
        
        if (response.status === 'success') {
            showToast('Booking confirmed successfully', 'success');
            closeModal('admin-booking-details-modal');
            loadRecentBookings();
            loadAdminStats();
        } else {
            showToast(response.message || 'Failed to confirm booking', 'error');
        }
    } catch (error) {
        console.error('Error confirming booking:', error);
        showToast('Failed to confirm booking', 'error');
    }
}

// Reject booking
async function rejectBooking(bookingId) {
    if (!confirm('Are you sure you want to reject this booking?')) {
        return;
    }
    
    try {
        const response = await apiRequest('/admin/bookings/reject', {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId })
        });
        
        if (response.status === 'success') {
            showToast('Booking rejected', 'success');
            closeModal('admin-booking-details-modal');
            loadRecentBookings();
            loadAdminStats();
        } else {
            showToast(response.message || 'Failed to reject booking', 'error');
        }
    } catch (error) {
        console.error('Error rejecting booking:', error);
        showToast('Failed to reject booking', 'error');
    }
}

// Contact customer
function contactCustomer(email) {
    const subject = encodeURIComponent('Regarding your Island Trails booking');
    const body = encodeURIComponent('Dear Customer,\n\nThank you for booking with Island Trails.\n\nBest regards,\nIsland Trails Team');
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
}

// Load package statistics
async function loadPackageStats() {
    try {
        const response = await apiRequest('/admin/packages/stats');
        if (response.status === 'success') {
            const stats = response.data;
            renderPackageStats(stats);
        }
    } catch (error) {
        console.error('Error loading package stats:', error);
    }
}

// Render package statistics
function renderPackageStats(stats) {
    // This could include charts or detailed package analytics
    // For now, we'll just update the basic stats
    console.log('Package stats:', stats);
}

// Export functions
window.loadAdminDashboard = loadAdminDashboard;
window.loadAdminPackages = loadAdminPackages;
window.showCreatePackageModal = showCreatePackageModal;
window.editPackage = editPackage;
window.deletePackage = deletePackage;
window.viewAdminBookingDetails = viewAdminBookingDetails;
window.confirmBooking = confirmBooking;
window.rejectBooking = rejectBooking;
window.contactCustomer = contactCustomer;
