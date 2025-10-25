/**
 * PIKIDROP - Transporter Page Module
 * Become a transporter application page
 */

import { ref, push } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

export function getPageHTML() {
    return `
        <div id="becomeTransporterPage" class="page">
            <h1 class="page-title">Become a Transporter</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Join our growing network of professional drivers and start earning money on your own schedule. Flexible hours, great earnings!
            </p>
            
            <!-- Why Join Section -->
            <div class="why-join-section">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 40px; font-size: 28px;">
                    Why Join Pikidrop?
                </h2>
                
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">💰</div>
                        <h4>Great Earnings</h4>
                        <p>Earn competitive rates for every delivery. Average UGX 500,000 - 1,500,000 per month</p>
                    </div>
                    
                    <div class="benefit-card">
                        <div class="benefit-icon">🕐</div>
                        <h4>Flexible Schedule</h4>
                        <p>Work when you want. Choose your own hours and be your own boss</p>
                    </div>
                    
                    <div class="benefit-card">
                        <div class="benefit-icon">📱</div>
                        <h4>Easy to Use App</h4>
                        <p>Simple driver app to accept deliveries, navigate, and track earnings</p>
                    </div>
                    
                    <div class="benefit-card">
                        <div class="benefit-icon">🎓</div>
                        <h4>Free Training</h4>
                        <p>Comprehensive training on customer service, safety, and app usage</p>
                    </div>
                    
                    <div class="benefit-card">
                        <div class="benefit-icon">🛡️</div>
                        <h4>Insurance Coverage</h4>
                        <p>We provide insurance coverage for all drivers while on duty</p>
                    </div>
                    
                    <div class="benefit-card">
                        <div class="benefit-icon">💳</div>
                        <h4>Weekly Payments</h4>
                        <p>Get paid weekly via mobile money or bank transfer</p>
                    </div>
                </div>
            </div>
            
            <!-- Requirements Section -->
            <div class="requirements-section">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 30px; font-size: 28px;">
                    Requirements to Join
                </h2>
                
                <div class="requirements-container">
                    <div class="requirement-column">
                        <h4>✓ Basic Requirements</h4>
                        <ul>
                            <li>Be at least 21 years old</li>
                            <li>Valid driving license</li>
                            <li>Own or have access to a vehicle</li>
                            <li>Clean driving record</li>
                            <li>Smartphone with internet</li>
                        </ul>
                    </div>
                    
                    <div class="requirement-column">
                        <h4>✓ Documents Needed</h4>
                        <ul>
                            <li>National ID or Passport</li>
                            <li>Valid driving license</li>
                            <li>Vehicle registration</li>
                            <li>Vehicle insurance</li>
                            <li>Police clearance certificate</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Earnings Calculator -->
            <div class="earnings-calculator">
                <h2 style="text-align: center; color: white; margin-bottom: 30px; font-size: 28px;">
                    Earnings Calculator
                </h2>
                <p style="text-align: center; color: rgba(255,255,255,0.9); margin-bottom: 30px;">
                    See how much you could earn with Pikidrop
                </p>
                
                <div class="calculator-controls">
                    <div class="calculator-input">
                        <label>Deliveries per day:</label>
                        <input type="range" id="deliveriesPerDay" min="5" max="30" value="15" oninput="calculateEarnings()">
                        <span id="deliveriesValue">15</span>
                    </div>
                    
                    <div class="calculator-input">
                        <label>Days per week:</label>
                        <input type="range" id="daysPerWeek" min="1" max="7" value="5" oninput="calculateEarnings()">
                        <span id="daysValue">5</span>
                    </div>
                </div>
                
                <div class="earnings-result">
                    <div class="earnings-item">
                        <span>Daily Earnings:</span>
                        <strong id="dailyEarnings">UGX 75,000</strong>
                    </div>
                    <div class="earnings-item">
                        <span>Weekly Earnings:</span>
                        <strong id="weeklyEarnings">UGX 375,000</strong>
                    </div>
                    <div class="earnings-item highlight">
                        <span>Monthly Earnings:</span>
                        <strong id="monthlyEarnings">UGX 1,500,000</strong>
                    </div>
                </div>
                
                <p style="text-align: center; color: rgba(255,255,255,0.8); margin-top: 20px; font-size: 14px;">
                    * Earnings are estimates based on average delivery fees. Actual earnings may vary.
                </p>
            </div>
            
            <!-- Application Form -->
            <div class="form-container" style="margin-top: 60px;">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 30px;">
                    Apply to Become a Transporter
                </h2>
                
                <div id="transporterSuccess" class="success-message hidden">
                    Application submitted successfully! We'll review your application and contact you within 2-3 business days. 
                    Please check your email/phone for next steps.
                </div>
                
                <form id="transporterForm">
                    <!-- Personal Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 20px;">
                        👤 Personal Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" id="transporterName" required placeholder="Enter your full legal name">
                    </div>
                    
                    <div class="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" id="transporterPhone" required placeholder="+256 700 000 000">
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address *</label>
                        <input type="email" id="transporterEmail" required placeholder="your.email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label>Date of Birth *</label>
                        <input type="date" id="dateOfBirth" required>
                    </div>
                    
                    <div class="form-group">
                        <label>National ID Number *</label>
                        <input type="text" id="nationalId" required placeholder="Enter your national ID number">
                    </div>
                    
                    <div class="form-group">
                        <label>Current Address *</label>
                        <textarea id="address" required placeholder="Enter your complete residential address"></textarea>
                    </div>
                    
                    <!-- Vehicle Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        🚗 Vehicle Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Vehicle Type *</label>
                        <select id="vehicleType" required>
                            <option value="">Select vehicle type</option>
                            <option value="bicycle">🚲 Bicycle</option>
                            <option value="motorcycle">🏍️ Motorcycle/Boda Boda</option>
                            <option value="car">🚗 Car</option>
                            <option value="van">🚐 Van/Minibus</option>
                            <option value="truck">🚚 Truck</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Vehicle Registration Number *</label>
                        <input type="text" id="vehicleRegistration" required placeholder="e.g., UAG 123A">
                    </div>
                    
                    <div class="form-group">
                        <label>Vehicle Make & Model</label>
                        <input type="text" id="vehicleModel" placeholder="e.g., Toyota Corolla, Honda CG125">
                    </div>
                    
                    <div class="form-group">
                        <label>Year of Manufacture</label>
                        <input type="number" id="vehicleYear" min="1990" max="2025" placeholder="e.g., 2020">
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="vehicleOwnership" required>
                            I own this vehicle or have legal authorization to use it for commercial purposes *
                        </label>
                    </div>
                    
                    <!-- Driving Experience -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        🎯 Driving Experience
                    </h3>
                    
                    <div class="form-group">
                        <label>Years of Driving Experience *</label>
                        <select id="experience" required>
                            <option value="">Select experience</option>
                            <option value="0-1">Less than 1 year</option>
                            <option value="1-2">1-2 years</option>
                            <option value="2-5">2-5 years</option>
                            <option value="5-10">5-10 years</option>
                            <option value="10+">10+ years</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Driving License Number *</label>
                        <input type="text" id="licenseNumber" required placeholder="Enter your license number">
                    </div>
                    
                    <div class="form-group">
                        <label>License Expiry Date *</label>
                        <input type="date" id="licenseExpiry" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Have you ever been involved in a major traffic accident?</label>
                        <div style="display: flex; gap: 20px; margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="accident" value="yes" id="accidentYes">
                                Yes
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="accident" value="no" id="accidentNo" checked>
                                No
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group hidden" id="accidentDetailsGroup">
                        <label>Please provide details:</label>
                        <textarea id="accidentDetails" placeholder="Describe the accident and when it occurred"></textarea>
                    </div>
                    
                    <!-- Work Preferences -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        ⏰ Work Preferences
                    </h3>
                    
                    <div class="form-group">
                        <label>Preferred City/Area of Operation *</label>
                        <input type="text" id="operationArea" required placeholder="e.g., Kampala, Entebbe, Wakiso">
                    </div>
                    
                    <div class="form-group">
                        <label>Availability *</label>
                        <select id="availability" required>
                            <option value="">Select availability</option>
                            <option value="full-time">Full-time (5+ days per week)</option>
                            <option value="part-time">Part-time (2-4 days per week)</option>
                            <option value="weekends">Weekends only</option>
                            <option value="flexible">Flexible/As needed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Preferred Working Hours</label>
                        <div style="display: grid; gap: 10px; margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="checkbox" name="workHours" value="morning">
                                Morning (6 AM - 12 PM)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="checkbox" name="workHours" value="afternoon">
                                Afternoon (12 PM - 6 PM)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="checkbox" name="workHours" value="evening">
                                Evening (6 PM - 12 AM)
                            </label>
                        </div>
                    </div>
                    
                    <!-- Motivation -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        💬 About You
                    </h3>
                    
                    <div class="form-group">
                        <label>Why do you want to join Pikidrop? *</label>
                        <textarea id="motivation" required placeholder="Tell us why you'd be a great fit for our team..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Do you have previous delivery experience?</label>
                        <div style="display: flex; gap: 20px; margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="deliveryExp" value="yes" id="expYes">
                                Yes
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="deliveryExp" value="no" id="expNo" checked>
                                No
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group hidden" id="deliveryExpGroup">
                        <label>Tell us about your delivery experience:</label>
                        <textarea id="deliveryExpDetails" placeholder="Which companies? How long? What did you deliver?"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Anything else you'd like us to know?"></textarea>
                    </div>
                    
                    <!-- Agreement -->
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="termsAgreement" required>
                            I agree to background checks and verify that all information provided is accurate *
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        ✓ Submit Application
                    </button>
                    
                    <button type="button" class="btn-secondary" onclick="window.app.showHome()">
                        ← Back to Home
                    </button>
                </form>
                
                <div class="link-text" style="margin-top: 30px;">
                    Already a transporter? 
                    <a href="#" onclick="window.app.openAuthModal('login', 'driver'); return false;">
                        Login here
                    </a>
                </div>
            </div>
        </div>
    `;
}

export function initPage(app) {
    // Setup accident details toggle
    document.getElementById('accidentYes').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('accidentDetailsGroup').classList.remove('hidden');
            document.getElementById('accidentDetails').required = true;
        }
    });
    
    document.getElementById('accidentNo').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('accidentDetailsGroup').classList.add('hidden');
            document.getElementById('accidentDetails').required = false;
        }
    });
    
    // Setup delivery experience toggle
    document.getElementById('expYes').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('deliveryExpGroup').classList.remove('hidden');
        }
    });
    
    document.getElementById('expNo').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('deliveryExpGroup').classList.add('hidden');
        }
    });
    
    // Initialize earnings calculator
    calculateEarnings();
    
    // Setup form submission
    document.getElementById('transporterForm').addEventListener('submit', (e) => handleTransporterSubmit(e, app));
    
    console.log('Transporter page initialized');
}

function calculateEarnings() {
    const deliveriesPerDay = document.getElementById('deliveriesPerDay').value;
    const daysPerWeek = document.getElementById('daysPerWeek').value;
    
    // Update display values
    document.getElementById('deliveriesValue').textContent = deliveriesPerDay;
    document.getElementById('daysValue').textContent = daysPerWeek;
    
    // Average earning per delivery: UGX 5,000
    const avgPerDelivery = 5000;
    
    const daily = deliveriesPerDay * avgPerDelivery;
    const weekly = daily * daysPerWeek;
    const monthly = weekly * 4;
    
    document.getElementById('dailyEarnings').textContent = window.app.formatCurrency(daily);
    document.getElementById('weeklyEarnings').textContent = window.app.formatCurrency(weekly);
    document.getElementById('monthlyEarnings').textContent = window.app.formatCurrency(monthly);
}

// Make calculateEarnings globally accessible
window.calculateEarnings = calculateEarnings;

async function handleTransporterSubmit(e, app) {
    e.preventDefault();
    
    // Get work hours
    const workHours = Array.from(document.querySelectorAll('input[name="workHours"]:checked'))
        .map(cb => cb.value);
    
    const transporterData = {
        // Personal info
        name: document.getElementById('transporterName').value,
        phone: document.getElementById('transporterPhone').value,
        email: document.getElementById('transporterEmail').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        nationalId: document.getElementById('nationalId').value,
        address: document.getElementById('address').value,
        
        // Vehicle info
        vehicleType: document.getElementById('vehicleType').value,
        vehicleRegistration: document.getElementById('vehicleRegistration').value,
        vehicleModel: document.getElementById('vehicleModel').value || null,
        vehicleYear: document.getElementById('vehicleYear').value || null,
        vehicleOwnership: document.getElementById('vehicleOwnership').checked,
        
        // Driving experience
        experience: document.getElementById('experience').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        licenseExpiry: document.getElementById('licenseExpiry').value,
        hadAccident: document.querySelector('input[name="accident"]:checked').value,
        accidentDetails: document.getElementById('accidentDetails').value || null,
        
        // Work preferences
        operationArea: document.getElementById('operationArea').value,
        availability: document.getElementById('availability').value,
        workHours: workHours,
        
        // About
        motivation: document.getElementById('motivation').value,
        hasDeliveryExp: document.querySelector('input[name="deliveryExp"]:checked').value,
        deliveryExpDetails: document.getElementById('deliveryExpDetails').value || null,
        additionalInfo: document.getElementById('additionalInfo').value || null,
        
        // Metadata
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    try {
        const transporterRef = ref(window.database, 'transporter_applications');
        await push(transporterRef, transporterData);
        
        // Show success message
        document.getElementById('transporterSuccess').classList.remove('hidden');
        document.getElementById('transporterForm').reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Suggest creating driver account
        setTimeout(() => {
            if (confirm('Would you like to create a driver account now to access your dashboard once approved?')) {
                window.app.openAuthModal('signup', 'driver');
            }
        }, 3000);
        
        setTimeout(() => {
            document.getElementById('transporterSuccess').classList.add('hidden');
        }, 10000);
        
    } catch (error) {
        console.error('Application error:', error);
        app.showError('Error submitting application. Please try again.');
    }
}

// Add custom styles for transporter page
const style = document.createElement('style');
style.textContent = `
    .why-join-section {
        background: white;
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }

    .benefit-card {
        background: #f7fafc;
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .benefit-card:hover {
        transform: translateY(-5px);
        border-color: #667eea;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .benefit-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }

    .benefit-card h4 {
        color: #2d3748;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .benefit-card p {
        color: #718096;
        font-size: 14px;
        line-height: 1.6;
    }

    .requirements-section {
        background: white;
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .requirements-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }

    .requirement-column {
        background: #f7fafc;
        padding: 25px;
        border-radius: 15px;
    }

    .requirement-column h4 {
        color: #667eea;
        font-size: 20px;
        margin-bottom: 15px;
    }

    .requirement-column ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .requirement-column li {
        padding: 10px 0;
        color: #4a5568;
        border-bottom: 1px solid #e2e8f0;
    }

    .requirement-column li:last-child {
        border-bottom: none;
    }

    .earnings-calculator {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
    }

    .calculator-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
    }

    .calculator-input {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
    }

    .calculator-input label {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
    }

    .calculator-input input[type="range"] {
        width: 100%;
        margin-bottom: 10px;
    }

    .calculator-input span {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: 600;
    }

    .earnings-result {
        background: rgba(255, 255, 255, 0.1);
        padding: 25px;
        border-radius: 15px;
    }

    .earnings-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .earnings-item:last-child {
        border-bottom: none;
    }

    .earnings-item.highlight {
        background: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        margin-top: 10px;
        font-size: 18px;
    }

    @media (max-width: 768px) {
        .benefits-grid {
            grid-template-columns: 1fr;
        }

        .requirements-container {
            grid-template-columns: 1fr;
        }

        .calculator-controls {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);
