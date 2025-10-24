/**
 * PIKIDROP - Home Page Module
 * Homepage with service cards and navigation
 */

export function getPageHTML() {
    return `
        <div id="homePage" class="page">
            <h1 class="page-title">Choose Your Service</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Welcome to Pikidrop! Select a service below to get started with fast, reliable deliveries.
            </p>
            
            <div class="button-grid">
                <div class="service-card" data-page="bookDelivery">
                    <div class="service-icon">📦</div>
                    <h3>Book a Delivery</h3>
                    <p>Send packages anywhere, anytime with our reliable delivery service. Track in real-time.</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <small style="color: #667eea; font-weight: 600;">Starting from UGX 5,000</small>
                    </div>
                </div>
                
                <div class="service-card" data-page="trackDelivery">
                    <div class="service-icon">📍</div>
                    <h3>Track a Delivery</h3>
                    <p>Monitor your package in real-time from pickup to delivery. Stay updated every step.</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <small style="color: #667eea; font-weight: 600;">Real-time tracking</small>
                    </div>
                </div>
                
                <div class="service-card" data-page="storeGoods">
                    <div class="service-icon">🏪</div>
                    <h3>Store Goods</h3>
                    <p>Secure storage solutions for your items with flexible options and 24/7 access.</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <small style="color: #667eea; font-weight: 600;">Safe & Secure</small>
                    </div>
                </div>
                
                <div class="service-card" data-page="becomeTransporter">
                    <div class="service-icon">🏍️</div>
                    <h3>Become a Transporter</h3>
                    <p>Join our team and earn money delivering packages. Flexible hours, great earnings.</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <small style="color: #667eea; font-weight: 600;">Earn while you drive</small>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div style="margin-top: 60px;">
                <h2 style="text-align: center; color: #2d3748; margin-bottom: 40px; font-size: 32px;">
                    Why Choose Pikidrop?
                </h2>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">⚡</div>
                        <h4>Fast Delivery</h4>
                        <p>Same-day and express delivery options available for urgent packages.</p>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">🔒</div>
                        <h4>Secure & Safe</h4>
                        <p>Your packages are insured and handled with maximum care and security.</p>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <h4>Affordable Rates</h4>
                        <p>Transparent pricing with no hidden charges. Pay only for what you need.</p>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">📱</div>
                        <h4>Easy Tracking</h4>
                        <p>Track your deliveries in real-time with our advanced tracking system.</p>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">👥</div>
                        <h4>Professional Drivers</h4>
                        <p>Verified and trained drivers ensure safe and timely deliveries.</p>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">🌟</div>
                        <h4>24/7 Support</h4>
                        <p>Our customer support team is always available to help you.</p>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div style="margin-top: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 40px; color: white;">
                <h2 style="text-align: center; margin-bottom: 40px; font-size: 32px;">
                    Pikidrop by the Numbers
                </h2>
                
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-number">10,000+</div>
                        <div class="stat-label">Deliveries Completed</div>
                    </div>
                    
                    <div class="stat-box">
                        <div class="stat-number">500+</div>
                        <div class="stat-label">Active Drivers</div>
                    </div>
                    
                    <div class="stat-box">
                        <div class="stat-number">5,000+</div>
                        <div class="stat-label">Happy Customers</div>
                    </div>
                    
                    <div class="stat-box">
                        <div class="stat-number">98%</div>
                        <div class="stat-label">On-Time Delivery</div>
                    </div>
                </div>
            </div>

            <!-- Call to Action -->
            <div style="margin-top: 60px; text-align: center; padding: 40px 20px; background: white; border-radius: 20px;">
                <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 32px;">
                    Ready to Get Started?
                </h2>
                <p style="color: #718096; margin-bottom: 30px; font-size: 18px; max-width: 600px; margin-left: auto; margin-right: auto;">
                    Book your first delivery today and experience the convenience of Pikidrop's reliable delivery service.
                </p>
                <button class="btn-primary" onclick="window.app.loadPage('bookDelivery')" style="max-width: 300px;">
                    Book a Delivery Now
                </button>
            </div>
        </div>
    `;
}

export function initPage(app) {
    // Add click event listeners to service cards
    const serviceCards = document.querySelectorAll('.service-card[data-page]');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            app.loadPage(pageName);
        });
    });

    // Add animation to cards on scroll (optional)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    serviceCards.forEach(card => observer.observe(card));

    // Observe feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => observer.observe(item));

    // Add hover effect sound or haptic feedback (optional)
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    console.log('Home page initialized');
}

// Add custom styles specific to home page
const style = document.createElement('style');
style.textContent = `
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .feature-item {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .feature-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }

    .feature-item h4 {
        color: #2d3748;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .feature-item p {
        color: #718096;
        font-size: 14px;
        line-height: 1.6;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .stat-box {
        text-align: center;
        padding: 20px;
    }

    .stat-number {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 10px;
    }

    .stat-label {
        font-size: 16px;
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .features-grid {
            grid-template-columns: 1fr;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .stat-number {
            font-size: 36px;
        }

        .stat-label {
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);
