/**
 * PIKIDROP - Booking Page Module
 * Book delivery with interactive map and price calculator
 */

import { ref, set } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

// Map and location variables
let map = null;
let pickupMarker = null;
let deliveryMarker = null;
let routeLine = null;
let locationMode = 'pickup';
let currentDistance = 0;

export function getPageHTML() {
    return `
        <div id="bookDeliveryPage" class="page">
            <h1 class="page-title">Book a Delivery</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Fill in the details below to book your delivery. We'll calculate the best price for you.
            </p>
            
            <div class="form-container" style="max-width: 800px;">
                <div id="bookingSuccess" class="success-message hidden">
                    Booking submitted successfully! Your tracking ID is: <strong><span id="trackingId"></span></strong>
                    <br><small>Save this ID to track your delivery.</small>
                </div>
                
                <!-- Map Section -->
                <div class="map-instructions">
                    📍 <strong>Select locations:</strong> Click "Set Pickup" or "Set Delivery" below, then click on the map or use "My Location" button.
                </div>
                
                <div class="location-selector">
                    <button type="button" class="location-btn active" id="pickupBtn">
                        📍 Set Pickup Location
                    </button>
                    <button type="button" class="location-btn" id="deliveryBtn">
                        🎯 Set Delivery Location
                    </button>
                    <button type="button" class="location-btn" id="currentLocationBtn">
                        📲 Use My Location
                    </button>
                </div>
                
                <div id="map"></div>
                
                <!-- Booking Form -->
                <form id="bookingForm">
                    <!-- Sender Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        👤 Sender Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" id="senderName" required placeholder="Enter your full name">
                    </div>
                    
                    <div class="form-group">
                        <label>Your Phone Number *</label>
                        <input type="tel" id="senderPhone" required placeholder="+256 700 000 000">
                    </div>
                    
                    <!-- Receiver Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        📞 Receiver Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Receiver Name *</label>
                        <input type="text" id="receiverName" required placeholder="Enter receiver's full name">
                    </div>
                    
                    <div class="form-group">
                        <label>Receiver Phone Number *</label>
                        <input type="tel" id="receiverPhone" required placeholder="+256 700 000 000">
                    </div>
                    
                    <!-- Delivery Details -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        🗺️ Delivery Details
                    </h3>
                    
                    <div class="form-group">
                        <label>Pickup Location *</label>
                        <input type="text" id="pickupLocation" required readonly placeholder="Click on map to select">
                    </div>
                    
                    <div class="form-group">
                        <label>Delivery Location *</label>
                        <input type="text" id="deliveryLocation" required readonly placeholder="Click on map to select">
                    </div>
                    
                    <div class="form-group">
                        <label>Distance</label>
                        <input type="text" id="distanceDisplay" readonly placeholder="Select both locations">
                    </div>
                    
                    <!-- Package Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        📦 Package Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Package Type *</label>
                        <select id="packageType" required>
                            <option value="">Select package type</option>
                            <option value="documents">Documents</option>
                            <option value="small">Small Package</option>
                            <option value="medium">Medium Package</option>
                            <option value="large">Large Package</option>
                            <option value="fragile">Fragile Items</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Package Size/Weight *</label>
                        <select id="packageSize" required>
                            <option value="">Select size/weight</option>
                            <option value="tiny">Tiny (0-2 kg)</option>
                            <option value="small">Small (2-5 kg)</option>
                            <option value="medium">Medium (5-10 kg)</option>
                            <option value="large">Large (10-20 kg)</option>
                            <option value="xlarge">Extra Large (20+ kg)</option>
                        </select>
                    </div>
                    
                    <!-- Delivery Preferences -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        🚗 Delivery Preferences
                    </h3>
                    
                    <div class="form-group">
                        <label>Preferred Vehicle Type *</label>
                        <select id="vehicleType" required>
                            <option value="">Select vehicle type</option>
                            <option value="bicycle">🚲 Bicycle (Eco-friendly, small items)</option>
                            <option value="motorcycle">🏍️ Motorcycle (Fast, medium items)</option>
                            <option value="car">🚗 Car (Comfortable, larger items)</option>
                            <option value="van">🚐 Van (Very large items)</option>
                            <option value="truck">🚚 Truck (Heavy/Bulk items)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Preferred Delivery Time *</label>
                        <select id="deliveryTime" required>
                            <option value="">Select delivery time</option>
                            <option value="immediate">⚡ Immediate (Within 2 hours)</option>
                            <option value="sameday">📅 Same Day</option>
                            <option value="scheduled">🕐 Schedule for Later</option>
                        </select>
                    </div>
                    
                    <div class="form-group hidden" id="scheduledTimeGroup">
                        <label>Select Date & Time</label>
                        <input type="datetime-local" id="scheduledDateTime">
                    </div>
                    
                    <div class="form-group">
                        <label>Payment Method *</label>
                        <select id="paymentMethod" required>
                            <option value="">Select payment method</option>
                            <option value="cash">💵 Cash on Delivery</option>
                            <option value="mobilemoney">📱 Mobile Money</option>
                            <option value="card">💳 Credit/Debit Card</option>
                            <option value="wallet">👛 Pikidrop Wallet</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Additional Notes</label>
                        <textarea id="notes" placeholder="Special instructions for the driver (e.g., gate code, landmarks)"></textarea>
                    </div>
                    
                    <!-- Price Calculator -->
                    <div class="price-calculator">
                        <h3>💰 Price Breakdown</h3>
                        <div class="price-row">
                            <span>Base Fare:</span>
                            <span id="baseFare">UGX 0</span>
                        </div>
                        <div class="price-row">
                            <span>Distance Charge:</span>
                            <span id="distanceCharge">UGX 0</span>
                        </div>
                        <div class="price-row">
                            <span>Vehicle Charge:</span>
                            <span id="vehicleCharge">UGX 0</span>
                        </div>
                        <div class="price-row">
                            <span>Package Charge:</span>
                            <span id="packageCharge">UGX 0</span>
                        </div>
                        <div class="price-row">
                            <span>Priority Charge:</span>
                            <span id="priorityCharge">UGX 0</span>
                        </div>
                        <div class="price-row total">
                            <span><strong>Total Estimated Cost:</strong></span>
                            <span id="totalPrice"><strong>UGX 0</strong></span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        ✓ Confirm & Book Delivery
                    </button>
                    <button type="button" class="btn-secondary" onclick="window.app.showHome()">
                        ← Back to Home
                    </button>
                </form>
            </div>
        </div>
    `;
}

export function initPage(app) {
    // Initialize map
    setTimeout(() => initMap(), 100);
    
    // Setup location buttons
    document.getElementById('pickupBtn').addEventListener('click', () => setLocationMode('pickup'));
    document.getElementById('deliveryBtn').addEventListener('click', () => setLocationMode('delivery'));
    document.getElementById('currentLocationBtn').addEventListener('click', useCurrentLocation);
    
    // Setup form change listeners for price calculation
    document.getElementById('packageSize').addEventListener('change', calculatePrice);
    document.getElementById('vehicleType').addEventListener('change', calculatePrice);
    document.getElementById('deliveryTime').addEventListener('change', handleDeliveryTimeChange);
    
    // Setup form submission
    document.getElementById('bookingForm').addEventListener('submit', (e) => handleBookingSubmit(e, app));
    
    console.log('Booking page initialized');
}

function initMap() {
    if (map) return;
    
    // Initialize Leaflet map centered on Kampala, Uganda
    map = L.map('map').setView([0.3476, 32.5825], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add click event to map
    map.on('click', onMapClick);
}

function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Get address from coordinates
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name;
            
            if (locationMode === 'pickup') {
                if (pickupMarker) map.removeLayer(pickupMarker);
                pickupMarker = L.marker([lat, lng]).addTo(map);
                pickupMarker.bindPopup('📍 Pickup: ' + address).openPopup();
                document.getElementById('pickupLocation').value = address;
            } else {
                if (deliveryMarker) map.removeLayer(deliveryMarker);
                deliveryMarker = L.marker([lat, lng]).addTo(map);
                deliveryMarker.bindPopup('🎯 Delivery: ' + address).openPopup();
                document.getElementById('deliveryLocation').value = address;
            }
            
            drawRoute();
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            alert('Could not get address for this location. Please try again.');
        });
}

function setLocationMode(mode) {
    locationMode = mode;
    document.getElementById('pickupBtn').classList.toggle('active', mode === 'pickup');
    document.getElementById('deliveryBtn').classList.toggle('active', mode === 'delivery');
    document.getElementById('currentLocationBtn').classList.remove('active');
}

function useCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    const btn = document.getElementById('currentLocationBtn');
    btn.textContent = '⏳ Getting location...';
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name;
                    
                    if (locationMode === 'pickup') {
                        if (pickupMarker) map.removeLayer(pickupMarker);
                        pickupMarker = L.marker([lat, lng]).addTo(map);
                        pickupMarker.bindPopup('📍 Pickup: ' + address).openPopup();
                        document.getElementById('pickupLocation').value = address;
                        map.setView([lat, lng], 15);
                    } else {
                        if (deliveryMarker) map.removeLayer(deliveryMarker);
                        deliveryMarker = L.marker([lat, lng]).addTo(map);
                        deliveryMarker.bindPopup('🎯 Delivery: ' + address).openPopup();
                        document.getElementById('deliveryLocation').value = address;
                        map.setView([lat, lng], 15);
                    }
                    
                    drawRoute();
                    btn.textContent = '📲 Use My Location';
                    btn.disabled = false;
                })
                .catch(error => {
                    console.error('Geocoding error:', error);
                    alert('Could not get address for your location');
                    btn.textContent = '📲 Use My Location';
                    btn.disabled = false;
                });
        },
        (error) => {
            alert('Unable to get your location. Please enable location services.');
            btn.textContent = '📲 Use My Location';
            btn.disabled = false;
        }
    );
}

function drawRoute() {
    if (pickupMarker && deliveryMarker) {
        if (routeLine) map.removeLayer(routeLine);
        
        const pickupLatLng = pickupMarker.getLatLng();
        const deliveryLatLng = deliveryMarker.getLatLng();
        
        // Calculate distance
        currentDistance = window.app.calculateDistance(
            pickupLatLng.lat, pickupLatLng.lng,
            deliveryLatLng.lat, deliveryLatLng.lng
        );
        
        document.getElementById('distanceDisplay').value = `${currentDistance.toFixed(2)} km`;
        
        // Draw route line
        routeLine = L.polyline([
            [pickupLatLng.lat, pickupLatLng.lng],
            [deliveryLatLng.lat, deliveryLatLng.lng]
        ], {
            color: '#667eea',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(map);
        
        // Fit map to show both markers
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
        
        // Recalculate price
        calculatePrice();
    }
}

function calculatePrice() {
    if (!pickupMarker || !deliveryMarker) return;
    
    const packageSize = document.getElementById('packageSize').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    
    if (!packageSize || !vehicleType || !deliveryTime) return;
    
    const pricing = window.app.calculatePrice(currentDistance, vehicleType, packageSize, deliveryTime);
    
    document.getElementById('baseFare').textContent = window.app.formatCurrency(pricing.baseFare);
    document.getElementById('distanceCharge').textContent = window.app.formatCurrency(pricing.distanceCharge);
    document.getElementById('vehicleCharge').textContent = window.app.formatCurrency(pricing.vehicleCharge);
    document.getElementById('packageCharge').textContent = window.app.formatCurrency(pricing.packageCharge);
    document.getElementById('priorityCharge').textContent = window.app.formatCurrency(pricing.priorityCharge);
    document.getElementById('totalPrice').innerHTML = `<strong>${window.app.formatCurrency(pricing.total)}</strong>`;
}

function handleDeliveryTimeChange() {
    const deliveryTime = document.getElementById('deliveryTime').value;
    const scheduledGroup = document.getElementById('scheduledTimeGroup');
    
    if (deliveryTime === 'scheduled') {
        scheduledGroup.classList.remove('hidden');
        document.getElementById('scheduledDateTime').required = true;
    } else {
        scheduledGroup.classList.add('hidden');
        document.getElementById('scheduledDateTime').required = false;
    }
    
    calculatePrice();
}

async function handleBookingSubmit(e, app) {
    e.preventDefault();
    
    // Check authentication
    if (!app.requireAuth()) return;
    
    // Validate locations
    if (!pickupMarker || !deliveryMarker) {
        app.showError('Please select both pickup and delivery locations on the map');
        return;
    }
    
    const trackingId = app.generateTrackingId();
    
    const bookingData = {
        trackingId: trackingId,
        userId: app.currentUser.uid,
        senderName: document.getElementById('senderName').value,
        senderPhone: document.getElementById('senderPhone').value,
        receiverName: document.getElementById('receiverName').value,
        receiverPhone: document.getElementById('receiverPhone').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        deliveryLocation: document.getElementById('deliveryLocation').value,
        distance: currentDistance,
        packageType: document.getElementById('packageType').value,
        packageSize: document.getElementById('packageSize').value,
        vehicleType: document.getElementById('vehicleType').value,
        deliveryTime: document.getElementById('deliveryTime').value,
        scheduledDateTime: document.getElementById('scheduledDateTime').value || null,
        paymentMethod: document.getElementById('paymentMethod').value,
        notes: document.getElementById('notes').value,
        estimatedCost: document.getElementById('totalPrice').textContent.replace('UGX ', '').replace(/,/g, ''),
        status: 'Pending Pickup',
        timestamp: new Date().toISOString()
    };

    try {
        const bookingsRef = ref(window.database, 'bookings/' + trackingId);
        await set(bookingsRef, bookingData);
        
        // Show success message
        document.getElementById('trackingId').textContent = trackingId;
        document.getElementById('bookingSuccess').classList.remove('hidden');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Clear map
        if (pickupMarker) map.removeLayer(pickupMarker);
        if (deliveryMarker) map.removeLayer(deliveryMarker);
        if (routeLine) map.removeLayer(routeLine);
        pickupMarker = null;
        deliveryMarker = null;
        routeLine = null;
        currentDistance = 0;
        
        // Reset price display
        document.getElementById('baseFare').textContent = 'UGX 0';
        document.getElementById('distanceCharge').textContent = 'UGX 0';
        document.getElementById('vehicleCharge').textContent = 'UGX 0';
        document.getElementById('packageCharge').textContent = 'UGX 0';
        document.getElementById('priorityCharge').textContent = 'UGX 0';
        document.getElementById('totalPrice').innerHTML = '<strong>UGX 0</strong>';
        document.getElementById('distanceDisplay').value = '';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
            document.getElementById('bookingSuccess').classList.add('hidden');
        }, 10000);
        
    } catch (error) {
        console.error('Booking error:', error);
        app.showError('Error submitting booking. Please try again.');
    }
}
