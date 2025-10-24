/**
 * PIKIDROP - Tracking Page Module
 * Track delivery status and view delivery details
 */

import { ref, get } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

export function getPageHTML() {
    return `
        <div id="trackDeliveryPage" class="page">
            <h1 class="page-title">Track Your Delivery</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Enter your tracking ID to monitor your delivery in real-time. You can also login to view all your deliveries.
            </p>
            
            <div class="form-container">
                <!-- Tracking Form -->
                <form id="trackingForm">
                    <div class="form-group">
                        <label>Enter Tracking ID</label>
                        <input type="text" id="trackingIdInput" required placeholder="e.g., PKD123456" style="text-transform: uppercase;">
                        <small style="color: #718096; margin-top: 5px; display: block;">
                            Your tracking ID was provided when you booked the delivery
                        </small>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        🔍 Track Package
                    </button>
                    
                    <button type="button" class="btn-secondary" onclick="window.app.showHome()">
                        ← Back to Home
                    </button>
                </form>
                
                <!-- Tracking Result -->
                <div id="trackingResult" class="tracking-result hidden">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                        <h3 style="color: #667eea; margin: 0;">Tracking Information</h3>
                        <span id="trackingIdDisplay" style="background: #edf2f7; padding: 8px 16px; border-radius: 8px; font-weight: 600;"></span>
                    </div>
                    
                    <!-- Status Timeline -->
                    <div id="statusTimeline" class="status-timeline"></div>
                    
                    <!-- Delivery Details -->
                    <div class="tracking-details">
                        <h4 style="color: #2d3748; margin-bottom: 20px; font-size: 20px;">📦 Delivery Details</h4>
                        
                        <div class="tracking-info-grid">
                            <div class="tracking-info-item">
                                <div class="info-label">Status</div>
                                <div class="info-value" id="deliveryStatus">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">Estimated Cost</div>
                                <div class="info-value" id="estimatedCost">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">📍 Pickup Location</div>
                                <div class="info-value" id="pickupLocation">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">🎯 Delivery Location</div>
                                <div class="info-value" id="deliveryLocation">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">📏 Distance</div>
                                <div class="info-value" id="deliveryDistance">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">🚗 Vehicle Type</div>
                                <div class="info-value" id="vehicleType">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">📦 Package Type</div>
                                <div class="info-value" id="packageInfo">-</div>
                            </div>
                            
                            <div class="tracking-info-item">
                                <div class="info-label">⏰ Booking Time</div>
                                <div class="info-value" id="bookingTime">-</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div class="contact-info" id="contactInfo">
                        <h4 style="color: #2d3748; margin-bottom: 15px; font-size: 20px;">👥 Contact Information</h4>
                        
                        <div style="display: grid; gap: 15px;">
                            <div class="contact-card">
                                <strong>Sender:</strong>
                                <div id="senderInfo" style="margin-top: 5px;"></div>
                            </div>
                            
                            <div class="contact-card">
                                <strong>Receiver:</strong>
                                <div id="receiverInfo" style="margin-top: 5px;"></div>
                            </div>
                            
                            <div class="contact-card" id="driverInfoCard" style="display: none;">
                                <strong>Driver:</strong>
                                <div id="driverInfo" style="margin-top: 5px;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Additional Notes -->
                    <div id="notesSection" class="notes-section hidden">
                        <h4 style="color: #2d3748; margin-bottom: 10px;">📝 Additional Notes</h4>
                        <p id="deliveryNotes" style="color: #4a5568; line-height: 1.6;"></p>
                    </div>
                </div>
                
                <!-- Login Prompt for My Deliveries -->
                <div class="link-text" style="margin-top: 30px;">
                    Want to view all your deliveries? 
                    <a href="#" onclick="window.app.requireAuth(() => window.app.loadPage('myDeliveries')); return false;">
                        Login here
                    </a>
                </div>
            </div>
        </div>
    `;
}

export function initPage(app) {
    // Setup form submission
    document.getElementById('trackingForm').addEventListener('submit', (e) => handleTrackingSubmit(e, app));
    
    // Auto-focus on tracking input
    document.getElementById('trackingIdInput').focus();
    
    console.log('Tracking page initialized');
}

async function handleTrackingSubmit(e, app) {
    e.preventDefault();
    
    const trackingId = document.getElementById('trackingIdInput').value.trim().toUpperCase();
    
    if (!trackingId) {
        app.showError('Please enter a tracking ID');
        return;
    }
    
    try {
        const bookingRef = ref(window.database, 'bookings/' + trackingId);
        const snapshot = await get(bookingRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            displayTrackingInfo(data, app);
        } else {
            app.showError('Tracking ID not found. Please check and try again.');
            document.getElementById('trackingResult').classList.add('hidden');
        }
    } catch (error) {
        console.error('Tracking error:', error);
        app.showError('Error tracking package. Please try again.');
    }
}

function displayTrackingInfo(data, app) {
    // Show result section
    document.getElementById('trackingResult').classList.remove('hidden');
    
    // Display tracking ID
    document.getElementById('trackingIdDisplay').textContent = `ID: ${data.trackingId}`;
    
    // Display status timeline
    displayStatusTimeline(data);
    
    // Display delivery details
    document.getElementById('deliveryStatus').innerHTML = getStatusBadge(data.status);
    document.getElementById('estimatedCost').textContent = app.formatCurrency(parseFloat(data.estimatedCost || 0));
    document.getElementById('pickupLocation').textContent = data.pickupLocation || 'N/A';
    document.getElementById('deliveryLocation').textContent = data.deliveryLocation || 'N/A';
    document.getElementById('deliveryDistance').textContent = data.distance ? `${data.distance.toFixed(2)} km` : 'N/A';
    document.getElementById('vehicleType').textContent = formatVehicleType(data.vehicleType);
    document.getElementById('packageInfo').textContent = `${data.packageType || 'N/A'} - ${data.packageSize || 'N/A'}`;
    document.getElementById('bookingTime').textContent = app.formatDate(data.timestamp);
    
    // Display contact information
    document.getElementById('senderInfo').innerHTML = `
        ${data.senderName}<br>
        <small style="color: #718096;">📞 ${data.senderPhone}</small>
    `;
    
    document.getElementById('receiverInfo').innerHTML = `
        ${data.receiverName}<br>
        <small style="color: #718096;">📞 ${data.receiverPhone}</small>
    `;
    
    // Display driver info if assigned
    if (data.driverId && data.driverName) {
        document.getElementById('driverInfoCard').style.display = 'block';
        document.getElementById('driverInfo').innerHTML = `
            ${data.driverName}<br>
            <small style="color: #718096;">Assigned Driver</small>
        `;
    } else {
        document.getElementById('driverInfoCard').style.display = 'none';
    }
    
    // Display notes if available
    if (data.notes) {
        document.getElementById('notesSection').classList.remove('hidden');
        document.getElementById('deliveryNotes').textContent = data.notes;
    } else {
        document.getElementById('notesSection').classList.add('hidden');
    }
    
    // Scroll to result
    document.getElementById('trackingResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayStatusTimeline(data) {
    const timeline = document.getElementById('statusTimeline');
    const statuses = [
        { key: 'Pending Pickup', label: 'Booking Confirmed', icon: '✓', date: data.timestamp },
        { key: 'Accepted', label: 'Driver Assigned', icon: '👤', date: data.acceptedAt },
        { key: 'In Transit', label: 'In Transit', icon: '🚚', date: data.startedAt },
        { key: 'Delivered', label: 'Delivered', icon: '✓', date: data.completedAt }
    ];
    
    let currentIndex = statuses.findIndex(s => s.key === data.status);
    if (currentIndex === -1) currentIndex = 0;
    
    let timelineHTML = '<div class="timeline-container">';
    
    statuses.forEach((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const statusClass = isCompleted ? 'timeline-item-completed' : 'timeline-item-pending';
        const currentClass = isCurrent ? 'timeline-item-current' : '';
        
        timelineHTML += `
            <div class="timeline-item ${statusClass} ${currentClass}">
                <div class="timeline-icon">${status.icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${status.label}</div>
                    ${status.date && isCompleted ? `<div class="timeline-date">${new Date(status.date).toLocaleString()}</div>` : ''}
                </div>
            </div>
        `;
    });
    
    timelineHTML += '</div>';
    timeline.innerHTML = timelineHTML;
}

function getStatusBadge(status) {
    const badges = {
        'Pending Pickup': '<span class="status-badge status-pending">⏳ Pending Pickup</span>',
        'Accepted': '<span class="status-badge status-accepted">✓ Driver Assigned</span>',
        'In Transit': '<span class="status-badge status-intransit">🚚 In Transit</span>',
        'Delivered': '<span class="status-badge status-completed">✓ Delivered</span>'
    };
    return badges[status] || '<span class="status-badge">Unknown</span>';
}

function formatVehicleType(type) {
    const types = {
        bicycle: '🚲 Bicycle',
        motorcycle: '🏍️ Motorcycle',
        car: '🚗 Car',
        van: '🚐 Van',
        truck: '🚚 Truck'
    };
    return types[type] || type;
}

// Add custom styles for tracking page
const style = document.createElement('style');
style.textContent = `
    .status-timeline {
        margin-bottom: 40px;
    }

    .timeline-container {
        position: relative;
        padding: 20px 0;
    }

    .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 30px;
        position: relative;
        padding-left: 10px;
    }

    .timeline-item::before {
        content: '';
        position: absolute;
        left: 24px;
        top: 50px;
        width: 2px;
        height: calc(100% + 10px);
        background: #e2e8f0;
    }

    .timeline-item:last-child::before {
        display: none;
    }

    .timeline-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .timeline-item-completed .timeline-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .timeline-item-current .timeline-icon {
        animation: pulse-timeline 2s ease-in-out infinite;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    }

    @keyframes pulse-timeline {
        0%, 100% {
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }
        50% {
            box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.1);
        }
    }

    .timeline-content {
        flex: 1;
    }

    .timeline-title {
        font-weight: 600;
        color: #2d3748;
        font-size: 16px;
        margin-bottom: 5px;
    }

    .timeline-item-pending .timeline-title {
        color: #a0aec0;
    }

    .timeline-date {
        font-size: 13px;
        color: #718096;
    }

    .tracking-details {
        background: white;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        border: 1px solid #e2e8f0;
    }

    .tracking-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .tracking-info-item {
        padding: 15px;
        background: #f7fafc;
        border-radius: 10px;
    }

    .info-label {
        font-size: 13px;
        color: #718096;
        margin-bottom: 5px;
        font-weight: 600;
    }

    .info-value {
        font-size: 15px;
        color: #2d3748;
        font-weight: 500;
    }

    .status-badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
    }

    .contact-info {
        background: white;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        border: 1px solid #e2e8f0;
    }

    .contact-card {
        padding: 15px;
        background: #f7fafc;
        border-radius: 10px;
        color: #2d3748;
    }

    .notes-section {
        background: #fff9e6;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #ffd966;
    }

    @media (max-width: 768px) {
        .tracking-info-grid {
            grid-template-columns: 1fr;
        }

        .timeline-item {
            padding-left: 0;
        }
    }
`;

document.head.appendChild(style);
