/**
 * PIKIDROP - Storage Page Module
 * Store goods with secure storage solutions
 */

import { ref, push } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

export function getPageHTML() {
    return `
        <div id="storeGoodsPage" class="page">
            <h1 class="page-title">Store Your Goods</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Need secure storage for your items? We offer flexible storage solutions with 24/7 security and climate control.
            </p>
            
            <!-- Storage Features -->
            <div class="storage-features">
                <div class="storage-feature-card">
                    <div class="feature-icon">🔒</div>
                    <h4>Secure Storage</h4>
                    <p>24/7 security with CCTV monitoring and access control</p>
                </div>
                
                <div class="storage-feature-card">
                    <div class="feature-icon">🌡️</div>
                    <h4>Climate Controlled</h4>
                    <p>Temperature and humidity controlled environment</p>
                </div>
                
                <div class="storage-feature-card">
                    <div class="feature-icon">📦</div>
                    <h4>Flexible Sizes</h4>
                    <p>From small lockers to large warehouse spaces</p>
                </div>
                
                <div class="storage-feature-card">
                    <div class="feature-icon">⏰</div>
                    <h4>24/7 Access</h4>
                    <p>Access your items anytime, day or night</p>
                </div>
            </div>
            
            <!-- Pricing Information -->
            <div class="pricing-section">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 30px;">Storage Pricing</h2>
                
                <div class="pricing-grid">
                    <div class="pricing-card">
                        <div class="size-icon">📦</div>
                        <h3>Small</h3>
                        <div class="size-dimension">2 x 2 ft</div>
                        <div class="price">UGX 50,000<span>/month</span></div>
                        <ul class="features-list">
                            <li>✓ Perfect for documents</li>
                            <li>✓ Small electronics</li>
                            <li>✓ Personal items</li>
                        </ul>
                    </div>
                    
                    <div class="pricing-card popular">
                        <div class="popular-badge">Most Popular</div>
                        <div class="size-icon">📦📦</div>
                        <h3>Medium</h3>
                        <div class="size-dimension">4 x 4 ft</div>
                        <div class="price">UGX 120,000<span>/month</span></div>
                        <ul class="features-list">
                            <li>✓ Furniture storage</li>
                            <li>✓ Seasonal items</li>
                            <li>✓ Business inventory</li>
                        </ul>
                    </div>
                    
                    <div class="pricing-card">
                        <div class="size-icon">📦📦📦</div>
                        <h3>Large</h3>
                        <div class="size-dimension">6 x 6 ft</div>
                        <div class="price">UGX 200,000<span>/month</span></div>
                        <ul class="features-list">
                            <li>✓ Large furniture</li>
                            <li>✓ Appliances</li>
                            <li>✓ Multiple boxes</li>
                        </ul>
                    </div>
                    
                    <div class="pricing-card">
                        <div class="size-icon">🏢</div>
                        <h3>Extra Large</h3>
                        <div class="size-dimension">8 x 8 ft</div>
                        <div class="price">UGX 350,000<span>/month</span></div>
                        <ul class="features-list">
                            <li>✓ Vehicle storage</li>
                            <li>✓ Business equipment</li>
                            <li>✓ Bulk inventory</li>
                        </ul>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <small style="color: #718096;">
                        💡 Discounts available for 3+ months: 10% off | 6+ months: 20% off
                    </small>
                </div>
            </div>
            
            <!-- Storage Request Form -->
            <div class="form-container" style="margin-top: 60px;">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 30px;">
                    Request Storage Space
                </h2>
                
                <div id="storageSuccess" class="success-message hidden">
                    Storage request submitted successfully! We'll contact you within 24 hours to confirm your booking.
                </div>
                
                <form id="storageForm">
                    <!-- Personal Information -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 20px;">
                        👤 Your Information
                    </h3>
                    
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" id="storageName" required placeholder="Enter your full name">
                    </div>
                    
                    <div class="form-group">
                        <label>Contact Number *</label>
                        <input type="tel" id="storagePhone" required placeholder="+256 700 000 000">
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="storageEmail" placeholder="your.email@example.com">
                    </div>
                    
                    <!-- Storage Details -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        📦 Storage Details
                    </h3>
                    
                    <div class="form-group">
                        <label>Item Description *</label>
                        <textarea id="itemDescription" required placeholder="Describe what you want to store (e.g., furniture, documents, equipment)"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Storage Size Needed *</label>
                        <select id="storageSize" required>
                            <option value="">Select storage size</option>
                            <option value="small">Small (2x2 ft) - UGX 50,000/month</option>
                            <option value="medium">Medium (4x4 ft) - UGX 120,000/month</option>
                            <option value="large">Large (6x6 ft) - UGX 200,000/month</option>
                            <option value="xlarge">Extra Large (8x8 ft) - UGX 350,000/month</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Storage Duration *</label>
                        <select id="storageDuration" required>
                            <option value="">Select duration</option>
                            <option value="1week">1 Week - Short term</option>
                            <option value="1month">1 Month</option>
                            <option value="3months">3 Months (10% discount)</option>
                            <option value="6months">6 Months (20% discount)</option>
                            <option value="12months">12 Months (25% discount)</option>
                            <option value="custom">Custom Duration</option>
                        </select>
                    </div>
                    
                    <div class="form-group hidden" id="customDurationGroup">
                        <label>Specify Duration</label>
                        <input type="text" id="customDuration" placeholder="e.g., 2 months, 4 weeks">
                    </div>
                    
                    <!-- Special Requirements -->
                    <h3 style="color: #667eea; margin-bottom: 20px; margin-top: 30px;">
                        ⚙️ Special Requirements
                    </h3>
                    
                    <div class="form-group">
                        <label>Climate Control Needed?</label>
                        <div style="display: flex; gap: 20px; margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="climateControl" value="yes" id="climateYes">
                                Yes
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                                <input type="radio" name="climateControl" value="no" id="climateNo" checked>
                                No
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="insuranceRequired">
                            I want insurance coverage (+UGX 10,000/month)
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>Preferred Start Date</label>
                        <input type="date" id="startDate">
                    </div>
                    
                    <div class="form-group">
                        <label>Additional Notes</label>
                        <textarea id="storageNotes" placeholder="Any special requirements or instructions"></textarea>
                    </div>
                    
                    <!-- Cost Estimate -->
                    <div class="cost-estimate" id="costEstimate">
                        <h4>💰 Estimated Monthly Cost</h4>
                        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                            <span>Base Storage Fee:</span>
                            <span id="baseFee">UGX 0</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <span>Insurance (Optional):</span>
                            <span id="insuranceFee">UGX 0</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 2px solid white;">
                            <strong>Total Monthly:</strong>
                            <strong id="totalMonthly">UGX 0</strong>
                        </div>
                        <div id="discountInfo" class="hidden" style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 8px; text-align: center;">
                            <small>🎉 <span id="discountText"></span></small>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        ✓ Submit Storage Request
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
    // Setup form listeners
    document.getElementById('storageSize').addEventListener('change', calculateStorageCost);
    document.getElementById('storageDuration').addEventListener('change', handleDurationChange);
    document.getElementById('insuranceRequired').addEventListener('change', calculateStorageCost);
    
    // Setup form submission
    document.getElementById('storageForm').addEventListener('submit', (e) => handleStorageSubmit(e, app));
    
    console.log('Storage page initialized');
}

function handleDurationChange() {
    const duration = document.getElementById('storageDuration').value;
    const customGroup = document.getElementById('customDurationGroup');
    
    if (duration === 'custom') {
        customGroup.classList.remove('hidden');
        document.getElementById('customDuration').required = true;
    } else {
        customGroup.classList.add('hidden');
        document.getElementById('customDuration').required = false;
    }
    
    calculateStorageCost();
}

function calculateStorageCost() {
    const size = document.getElementById('storageSize').value;
    const duration = document.getElementById('storageDuration').value;
    const insurance = document.getElementById('insuranceRequired').checked;
    
    if (!size) {
        document.getElementById('costEstimate').style.display = 'none';
        return;
    }
    
    document.getElementById('costEstimate').style.display = 'block';
    
    // Base prices
    const prices = {
        small: 50000,
        medium: 120000,
        large: 200000,
        xlarge: 350000
    };
    
    const baseFee = prices[size] || 0;
    const insuranceFee = insurance ? 10000 : 0;
    const totalMonthly = baseFee + insuranceFee;
    
    // Calculate discount
    let discount = 0;
    let discountText = '';
    
    if (duration === '3months') {
        discount = 0.10;
        discountText = 'You save 10% with 3 months commitment!';
    } else if (duration === '6months') {
        discount = 0.20;
        discountText = 'You save 20% with 6 months commitment!';
    } else if (duration === '12months') {
        discount = 0.25;
        discountText = 'You save 25% with 12 months commitment!';
    }
    
    const finalPrice = totalMonthly * (1 - discount);
    
    // Display costs
    document.getElementById('baseFee').textContent = window.app.formatCurrency(baseFee);
    document.getElementById('insuranceFee').textContent = window.app.formatCurrency(insuranceFee);
    document.getElementById('totalMonthly').textContent = window.app.formatCurrency(finalPrice);
    
    // Show discount info
    if (discount > 0) {
        document.getElementById('discountInfo').classList.remove('hidden');
        document.getElementById('discountText').textContent = discountText;
    } else {
        document.getElementById('discountInfo').classList.add('hidden');
    }
}

async function handleStorageSubmit(e, app) {
    e.preventDefault();
    
    const storageData = {
        userId: app.currentUser ? app.currentUser.uid : null,
        name: document.getElementById('storageName').value,
        phone: document.getElementById('storagePhone').value,
        email: document.getElementById('storageEmail').value,
        itemDescription: document.getElementById('itemDescription').value,
        size: document.getElementById('storageSize').value,
        duration: document.getElementById('storageDuration').value,
        customDuration: document.getElementById('customDuration').value || null,
        climateControl: document.querySelector('input[name="climateControl"]:checked').value,
        insurance: document.getElementById('insuranceRequired').checked,
        startDate: document.getElementById('startDate').value || null,
        notes: document.getElementById('storageNotes').value,
        estimatedCost: document.getElementById('totalMonthly').textContent,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    try {
        const storageRef = ref(window.database, 'storage');
        await push(storageRef, storageData);
        
        // Show success message
        document.getElementById('storageSuccess').classList.remove('hidden');
        document.getElementById('storageForm').reset();
        document.getElementById('costEstimate').style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
            document.getElementById('storageSuccess').classList.add('hidden');
        }, 8000);
        
    } catch (error) {
        console.error('Storage request error:', error);
        app.showError('Error submitting storage request. Please try again.');
    }
}

// Add custom styles for storage page
const style = document.createElement('style');
style.textContent = `
    .storage-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-bottom: 60px;
    }

    .storage-feature-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .storage-feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .storage-feature-card .feature-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }

    .storage-feature-card h4 {
        color: #2d3748;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .storage-feature-card p {
        color: #718096;
        font-size: 14px;
        line-height: 1.6;
    }

    .pricing-section {
        background: white;
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 25px;
        margin-bottom: 20px;
    }

    .pricing-card {
        background: #f7fafc;
        border-radius: 15px;
        padding: 30px 20px;
        text-align: center;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;
        position: relative;
    }

    .pricing-card:hover {
        transform: translateY(-5px);
        border-color: #667eea;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .pricing-card.popular {
        border-color: #667eea;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }

    .popular-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .size-icon {
        font-size: 42px;
        margin-bottom: 15px;
    }

    .pricing-card h3 {
        color: #2d3748;
        font-size: 24px;
        margin-bottom: 10px;
    }

    .size-dimension {
        color: #718096;
        font-size: 14px;
        margin-bottom: 15px;
    }

    .price {
        color: #667eea;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .price span {
        font-size: 14px;
        font-weight: 400;
        color: #718096;
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
    }

    .features-list li {
        padding: 8px 0;
        color: #4a5568;
        font-size: 14px;
        border-bottom: 1px solid #e2e8f0;
    }

    .features-list li:last-child {
        border-bottom: none;
    }

    .cost-estimate {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        margin: 30px 0;
        display: none;
    }

    .cost-estimate h4 {
        margin-bottom: 15px;
        font-size: 20px;
    }

    @media (max-width: 768px) {
        .storage-features {
            grid-template-columns: 1fr;
        }

        .pricing-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);
