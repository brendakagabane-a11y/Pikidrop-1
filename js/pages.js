/**
 * PIKIDROP - Pages Registry
 * Central registry for all application pages
 */

// This file exports references to all page modules
// Each page is loaded dynamically when needed

export const pages = {
    home: './js/pages/home.js',
    bookDelivery: './js/pages/bookings.js',
    trackDelivery: './js/pages/tracking.js',
    storeGoods: './js/pages/storage.js',
    becomeTransporter: './js/pages/transporter.js',
    driverDashboard: './js/pages/driver-dashboard.js',
    adminDashboard: './js/pages/admin-dashboard.js'
};

// Page titles for SEO and display
export const pageTitles = {
    home: 'Pikidrop - Home',
    bookDelivery: 'Book a Delivery - Pikidrop',
    trackDelivery: 'Track Delivery - Pikidrop',
    storeGoods: 'Store Goods - Pikidrop',
    becomeTransporter: 'Become a Transporter - Pikidrop',
    driverDashboard: 'Driver Dashboard - Pikidrop',
    adminDashboard: 'Admin Dashboard - Pikidrop'
};

// Update document title
export function updatePageTitle(pageName) {
    document.title = pageTitles[pageName] || 'Pikidrop - For On-Time Deliveries';
}

export default pages;
