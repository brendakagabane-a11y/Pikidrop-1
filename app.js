/**
 * PIKIDROP - Core Application Logic
 * Main app controller and routing
 */

import { ref, get } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

class PikidropApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.database = window.database;
        this.auth = window.auth;
        
        this.init();
    }

    init() {
        // Setup auth state observer
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.updateUIForLoggedInUser(user);
            } else {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        });

        // Setup loader and landing page
        this.setupInitialLoad();
    }

    setupInitialLoad() {
        window.addEventListener('load', () => {
            // Hide loader after 2 seconds
            setTimeout(() => {
                document.getElementById('loader').classList.add('fade-out');
                setTimeout(() => {
                    document.getElementById('loader').style.display = 'none';
                }, 500);
            }, 2000);

            // Hide landing page and show main app after 5 seconds
            setTimeout(() => {
                document.getElementById('landingPage').style.display = 'none';
                document.getElementById('mainApp').classList.add('active');
                this.loadPage('home');
            }, 5000);
        });
    }

    async updateUIForLoggedInUser(user) {
        document.getElementById('authButtons').classList.add('hidden');
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('userName').textContent = user.displayName || user.email;
        document.getElementById('userAvatar').textContent = (user.displayName || user.email).charAt(0).toUpperCase();
        
        // Check if user is a driver
        try {
            const userRef = ref(this.database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.role === 'driver') {
                    this.loadPage('driverDashboard');
                }
            }
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    }

    updateUIForLoggedOutUser() {
        document.getElementById('authButtons').classList.remove('hidden');
        document.getElementById('userInfo').classList.add('hidden');
    }

    async logout() {
        try {
            await this.auth.signOut();
            this.showHome();
            alert('Logged out successfully!');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }

    // Page Navigation
    async loadPage(pageName) {
        this.currentPage = pageName;
        const content = document.getElementById('mainContent');
        
        try {
            // Import the page module dynamically
            const pageModule = await import(`./pages/${pageName}.js`);
            content.innerHTML = pageModule.getPageHTML();
            
            // Initialize page-specific functionality
            if (pageModule.initPage) {
                pageModule.initPage(this);
            }
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);
            content.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2 style="color: #e53e3e; margin-bottom: 20px;">⚠️ Page Not Found</h2>
                    <p style="color: #718096; margin-bottom: 30px;">The page you're looking for doesn't exist yet.</p>
                    <button class="btn-primary" onclick="app.showHome()" style="max-width: 300px;">Go to Home</button>
                </div>
            `;
        }
    }

    showHome() {
        this.loadPage('home');
    }

    showPage(pageName) {
        this.loadPage(pageName);
    }

    // Auth Modal Methods
    openAuthModal(tab = 'login', userType = 'user') {
        document.getElementById('authModal').classList.add('active');
        this.switchAuthTab(tab);
        if (userType === 'driver') {
            document.getElementById('loginAsDriver').checked = true;
            document.getElementById('signupAsDriver').checked = true;
        }
    }

    closeAuthModal() {
        document.getElementById('authModal').classList.remove('active');
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
        document.getElementById('loginError').classList.add('hidden');
        document.getElementById('signupError').classList.add('hidden');
    }

    switchAuthTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    // Utility Methods
    showSuccess(message, duration = 5000) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const content = document.getElementById('mainContent');
        content.insertBefore(successDiv, content.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, duration);
    }

    showError(message, duration = 5000) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const content = document.getElementById('mainContent');
        content.insertBefore(errorDiv, content.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, duration);
    }

    // Helper method to check authentication
    requireAuth(callback) {
        if (!this.currentUser) {
            this.openAuthModal('login');
            return false;
        }
        if (callback) callback();
        return true;
    }

    // Generate tracking ID
    generateTrackingId() {
        return 'PKD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Calculate distance between two coordinates
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Pricing Configuration
    getPricing() {
        return {
            baseFare: 5000,
            perKm: 2000,
            vehicleTypes: {
                bicycle: 0,
                motorcycle: 3000,
                car: 8000,
                van: 15000,
                truck: 25000
            },
            packageSizes: {
                tiny: 0,
                small: 2000,
                medium: 5000,
                large: 10000,
                xlarge: 20000
            },
            deliveryTime: {
                immediate: 10000,
                sameday: 5000,
                scheduled: 0
            }
        };
    }

    // Calculate delivery price
    calculatePrice(distance, vehicleType, packageSize, deliveryTime) {
        const pricing = this.getPricing();
        
        const baseFare = pricing.baseFare;
        const distanceCharge = distance * pricing.perKm;
        const vehicleCharge = pricing.vehicleTypes[vehicleType] || 0;
        const packageCharge = pricing.packageSizes[packageSize] || 0;
        const priorityCharge = pricing.deliveryTime[deliveryTime] || 0;
        
        return {
            baseFare,
            distanceCharge,
            vehicleCharge,
            packageCharge,
            priorityCharge,
            total: baseFare + distanceCharge + vehicleCharge + packageCharge + priorityCharge
        };
    }

    // Format currency
    formatCurrency(amount) {
        return `UGX ${Math.round(amount).toLocaleString()}`;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the app
const app = new PikidropApp();

// Make app globally accessible
window.app = app;

// Export for modules
export default app;