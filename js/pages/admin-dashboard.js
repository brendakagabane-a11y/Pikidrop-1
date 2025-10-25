document.getElementById('totalRevenue').textContent = app.formatCurrency(totalRevenue);
            
            // Today's revenue
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const revenueToday = bookings
                .filter(b => b.status === 'Delivered' && new Date(b.completedAt) >= today)
                .reduce((sum, b) => sum + (parseFloat(b.estimatedCost) || 0), 0);
            
            document.getElementById('revenueToday').textContent = `${app.formatCurrency(revenueToday)} today`;
        }
        
        if (usersSnapshot.exists()) {
            const users = Object.values(usersSnapshot.val());
            const drivers = users.filter(u => u.role === 'driver').length;
            const regularUsers = users.filter(u => u.role === 'user').length;
            
            document.getElementById('totalDrivers').textContent = drivers;
            document.getElementById('totalUsers').textContent = regularUsers;
            
            // New users today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newToday = users.filter(u => new Date(u.createdAt) >= today).length;
            document.getElementById('newUsersToday').textContent = `${newToday} new today`;
        }
        
        // Load driver applications count
        const appsRef = ref(window.database, 'transporter_applications');
        const appsSnapshot = await get(appsRef);
        
        if (appsSnapshot.exists()) {
            const apps = Object.values(appsSnapshot.val());
            const pending = apps.filter(a => a.status === 'pending').length;
            document.getElementById('pendingDrivers').textContent = `${pending} pending approval`;
        }
        
        // Load overview
        loadOverview(app);
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

async function loadOverview(app) {
    try {
        const bookingsRef = ref(window.database, 'bookings');
        const snapshot = await get(bookingsRef);
        
        if (snapshot.exists()) {
            const bookings = Object.entries(snapshot.val())
                .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
            
            // Recent bookings
            const recentContainer = document.getElementById('recentBookings');
            recentContainer.innerHTML = '';
            
            bookings.slice(0, 5).forEach(([id, booking]) => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div>
                        <strong>#${booking.trackingId}</strong>
                        <small>${app.formatDate(booking.timestamp)}</small>
                    </div>
                    <span class="status-badge ${getStatusClass(booking.status)}">${booking.status}</span>
                `;
                recentContainer.appendChild(item);
            });
            
            // Pending actions
            const pendingContainer = document.getElementById('pendingActions');
            pendingContainer.innerHTML = '';
            
            const pendingBookings = bookings.filter(([id, b]) => b.status === 'Pending Pickup');
            
            if (pendingBookings.length === 0) {
                pendingContainer.innerHTML = '<p style="color: #718096; padding: 20px; text-align: center;">No pending actions</p>';
            } else {
                pendingBookings.slice(0, 5).forEach(([id, booking]) => {
                    const item = document.createElement('div');
                    item.className = 'activity-item';
                    item.innerHTML = `
                        <div>
                            <strong>#${booking.trackingId}</strong>
                            <small>Waiting for driver</small>
                        </div>
                        <button class="btn-small" onclick="window.adminDashboard.viewBooking('${id}')">View</button>
                    `;
                    pendingContainer.appendChild(item);
                });
            }
            
            // Quick stats
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const todayDeliveries = bookings.filter(([id, b]) => 
                b.status === 'Delivered' && new Date(b.completedAt) >= today
            ).length;
            
            const weekDeliveries = bookings.filter(([id, b]) => 
                b.status === 'Delivered' && new Date(b.completedAt) >= weekAgo
            ).length;
            
            const completed = bookings.filter(([id, b]) => b.status === 'Delivered').length;
            const total = bookings.length;
            const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            document.getElementById('todayDeliveries').textContent = todayDeliveries;
            document.getElementById('weekDeliveries').textContent = weekDeliveries;
            document.getElementById('successRate').textContent = successRate + '%';
            document.getElementById('avgDeliveryTime').textContent = '2-4 hours';
        }
    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

async function loadAllBookings(app) {
    try {
        const bookingsRef = ref(window.database, 'bookings');
        const snapshot = await get(bookingsRef);
        
        const container = document.getElementById('allBookings');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const filter = document.getElementById('bookingStatusFilter').value;
            let bookings = Object.entries(snapshot.val())
                .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
            
            if (filter !== 'all') {
                bookings = bookings.filter(([id, b]) => b.status === filter);
            }
            
            if (bookings.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No bookings found</p>';
                return;
            }
            
            const table = document.createElement('div');
            table.className = 'admin-table';
            table.innerHTML = `
                <div class="admin-table-header">
                    <div>Tracking ID</div>
                    <div>Customer</div>
                    <div>Route</div>
                    <div>Driver</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
            `;
            
            bookings.forEach(([id, booking]) => {
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <div><strong>#${booking.trackingId}</strong></div>
                    <div>${booking.senderName}<br><small>${booking.senderPhone}</small></div>
                    <div><small>${booking.pickupLocation.substring(0, 30)}...<br>→ ${booking.deliveryLocation.substring(0, 30)}...</small></div>
                    <div>${booking.driverName || '<span style="color: #718096;">Unassigned</span>'}</div>
                    <div>${app.formatCurrency(parseFloat(booking.estimatedCost))}</div>
                    <div><span class="status-badge ${getStatusClass(booking.status)}">${booking.status}</span></div>
                    <div>
                        <button class="btn-small btn-view" onclick="window.adminDashboard.viewBooking('${id}')">View</button>
                        ${booking.status !== 'Delivered' ? `<button class="btn-small btn-delete" onclick="window.adminDashboard.deleteBooking('${id}')">Delete</button>` : ''}
                    </div>
                `;
                table.appendChild(row);
            });
            
            container.appendChild(table);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No bookings yet</p>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

async function loadAllDrivers(app) {
    try {
        const usersRef = ref(window.database, 'users');
        const snapshot = await get(usersRef);
        
        const container = document.getElementById('allDrivers');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const filter = document.getElementById('driverStatusFilter').value;
            let drivers = Object.entries(snapshot.val())
                .filter(([id, user]) => user.role === 'driver');
            
            if (filter !== 'all') {
                drivers = drivers.filter(([id, d]) => (d.status || 'active') === filter);
            }
            
            if (drivers.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No drivers found</p>';
                return;
            }
            
            const table = document.createElement('div');
            table.className = 'admin-table';
            table.innerHTML = `
                <div class="admin-table-header">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Joined</div>
                    <div>Deliveries</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
            `;
            
            // Get delivery count for each driver
            const bookingsRef = ref(window.database, 'bookings');
            const bookingsSnapshot = await get(bookingsRef);
            
            drivers.forEach(([id, driver]) => {
                let deliveryCount = 0;
                if (bookingsSnapshot.exists()) {
                    const bookings = Object.values(bookingsSnapshot.val());
                    deliveryCount = bookings.filter(b => b.driverId === id).length;
                }
                
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <div><strong>${driver.name}</strong></div>
                    <div>${driver.email}<br><small>${driver.phone}</small></div>
                    <div>${app.formatDate(driver.createdAt)}</div>
                    <div><strong>${deliveryCount}</strong> deliveries</div>
                    <div><span class="status-badge ${(driver.status || 'active') === 'active' ? 'status-accepted' : 'status-pending'}">${driver.status || 'active'}</span></div>
                    <div>
                        <button class="btn-small btn-view" onclick="window.adminDashboard.viewDriver('${id}')">View</button>
                        <button class="btn-small ${(driver.status || 'active') === 'active' ? 'btn-delete' : 'btn-approve'}" onclick="window.adminDashboard.toggleDriverStatus('${id}', '${driver.status || 'active'}')">
                            ${(driver.status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                    </div>
                `;
                table.appendChild(row);
            });
            
            container.appendChild(table);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No drivers yet</p>';
        }
    } catch (error) {
        console.error('Error loading drivers:', error);
    }
}

async function loadAllUsers(app) {
    try {
        const usersRef = ref(window.database, 'users');
        const snapshot = await get(usersRef);
        
        const container = document.getElementById('allUsers');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const users = Object.entries(snapshot.val())
                .filter(([id, user]) => user.role === 'user')
                .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));
            
            if (users.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No users found</p>';
                return;
            }
            
            const table = document.createElement('div');
            table.className = 'admin-table';
            table.innerHTML = `
                <div class="admin-table-header">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Joined</div>
                    <div>Bookings</div>
                    <div>Actions</div>
                </div>
            `;
            
            // Get booking count for each user
            const bookingsRef = ref(window.database, 'bookings');
            const bookingsSnapshot = await get(bookingsRef);
            
            users.forEach(([id, user]) => {
                let bookingCount = 0;
                if (bookingsSnapshot.exists()) {
                    const bookings = Object.values(bookingsSnapshot.val());
                    bookingCount = bookings.filter(b => b.userId === id).length;
                }
                
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <div><strong>${user.name}</strong></div>
                    <div>${user.email}<br><small>${user.phone}</small></div>
                    <div>${app.formatDate(user.createdAt)}</div>
                    <div><strong>${bookingCount}</strong> bookings</div>
                    <div>
                        <button class="btn-small btn-view" onclick="window.adminDashboard.viewUser('${id}')">View</button>
                    </div>
                `;
                table.appendChild(row);
            });
            
            container.appendChild(table);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No users yet</p>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadStorageRequests(app) {
    try {
        const storageRef = ref(window.database, 'storage');
        const snapshot = await get(storageRef);
        
        const container = document.getElementById('storageRequests');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const requests = Object.entries(snapshot.val())
                .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
            
            const table = document.createElement('div');
            table.className = 'admin-table';
            table.innerHTML = `
                <div class="admin-table-header">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Item Description</div>
                    <div>Size</div>
                    <div>Duration</div>
                    <div>Cost</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
            `;
            
            requests.forEach(([id, request]) => {
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <div><strong>${request.name}</strong></div>
                    <div>${request.phone}<br><small>${request.email || 'N/A'}</small></div>
                    <div><small>${request.itemDescription.substring(0, 50)}...</small></div>
                    <div>${request.size}</div>
                    <div>${request.duration}</div>
                    <div>${request.estimatedCost}</div>
                    <div><span class="status-badge ${request.status === 'approved' ? 'status-completed' : 'status-pending'}">${request.status}</span></div>
                    <div>
                        <button class="btn-small btn-view" onclick="window.adminDashboard.viewStorage('${id}')">View</button>
                        ${request.status === 'pending' ? `
                            <button class="btn-small btn-approve" onclick="window.adminDashboard.approveStorage('${id}')">Approve</button>
                        ` : ''}
                    </div>
                `;
                table.appendChild(row);
            });
            
            container.appendChild(table);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No storage requests yet</p>';
        }
    } catch (error) {
        console.error('Error loading storage requests:', error);
    }
}

async function loadDriverApplications(app) {
    try {
        const appsRef = ref(window.database, 'transporter_applications');
        const snapshot = await get(appsRef);
        
        const container = document.getElementById('driverApplications');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const applications = Object.entries(snapshot.val())
                .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
            
            const table = document.createElement('div');
            table.className = 'admin-table';
            table.innerHTML = `
                <div class="admin-table-header">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Vehicle</div>
                    <div>Experience</div>
                    <div>Area</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
            `;
            
            applications.forEach(([id, app]) => {
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <div><strong>${app.name}</strong></div>
                    <div>${app.phone}<br><small>${app.email}</small></div>
                    <div>${app.vehicleType}</div>
                    <div>${app.experience}</div>
                    <div>${app.operationArea}</div>
                    <div><span class="status-badge ${app.status === 'approved' ? 'status-completed' : app.status === 'rejected' ? 'status-pending' : 'status-accepted'}">${app.status}</span></div>
                    <div>
                        <button class="btn-small btn-view" onclick="window.adminDashboard.viewApplication('${id}')">View</button>
                        ${app.status === 'pending' ? `
                            <button class="btn-small btn-approve" onclick="window.adminDashboard.approveApplication('${id}')">Approve</button>
                            <button class="btn-small btn-delete" onclick="window.adminDashboard.rejectApplication('${id}')">Reject</button>
                        ` : ''}
                    </div>
                `;
                table.appendChild(row);
            });
            
            container.appendChild(table);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">No applications yet</p>';
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

async function loadAnalytics(app) {
    try {
        const bookingsRef = ref(window.database, 'bookings');
        const snapshot = await get(bookingsRef);
        
        const container = document.getElementById('deliveryStats');
        container.innerHTML = '';
        
        if (snapshot.exists()) {
            const bookings = Object.values(snapshot.val());
            
            const stats = [
                { label: 'Total Deliveries', value: bookings.length },
                { label: 'Completed', value: bookings.filter(b => b.status === 'Delivered').length },
                { label: 'In Progress', value: bookings.filter(b => b.status === 'In Transit' || b.status === 'Accepted').length },
                { label: 'Pending', value: bookings.filter(b => b.status === 'Pending Pickup').length },
                { label: 'Average Distance', value: (bookings.reduce((sum, b) => sum + (b.distance || 0), 0) / bookings.length).toFixed(2) + ' km' },
                { label: 'Total Distance', value: bookings.reduce((sum, b) => sum + (b.distance || 0), 0).toFixed(2) + ' km' }
            ];
            
            stats.forEach(stat => {
                const item = document.createElement('div');
                item.className = 'stat-item';
                item.innerHTML = `
                    <span>${stat.label}:</span>
                    <strong>${stat.value}</strong>
                `;
                container.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function getStatusClass(status) {
    const classes = {
        'Pending Pickup': 'status-pending',
        'Accepted': 'status-accepted',
        'In Transit': 'status-intransit',
        'Delivered': 'status-completed'
    };
    return classes[status] || '';
}

// Admin actions
window.adminDashboard = {
    viewBooking(id) {
        alert('View booking details for: ' + id);
        // Implement detailed view modal
    },
    
    async deleteBooking(id) {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        
        try {
            const bookingRef = ref(window.database, 'bookings/' + id);
            await remove(bookingRef);
            window.app.showSuccess('Booking deleted successfully');
            loadAdminData(window.app);
            loadAllBookings(window.app);
        } catch (error) {
            window.app.showError('Error deleting booking');
        }
    },
    
    viewDriver(id) {
        alert('View driver details for: ' + id);
    },
    
    async toggleDriverStatus(id, currentStatus) {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        
        if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this driver?`)) return;
        
        try {
            const driverRef = ref(window.database, 'users/' + id);
            await update(driverRef, { status: newStatus });
            window.app.showSuccess(`Driver ${newStatus} successfully`);
            loadAllDrivers(window.app);
        } catch (error) {
            window.app.showError('Error updating driver status');
        }
    },
    
    viewUser(id) {
        alert('View user details for: ' + id);
    },
    
    viewStorage(id) {
        alert('View storage request for: ' + id);
    },
    
    async approveStorage(id) {
        if (!confirm('Approve this storage request?')) return;
        
        try {
            const storageRef = ref(window.database, 'storage/' + id);
            await update(storageRef, { status: 'approved', approvedAt: new Date().toISOString() });
            window.app.showSuccess('Storage request approved');
            loadStorageRequests(window.app);
        } catch (error) {
            window.app.showError('Error approving storage request');
        }
    },
    
    viewApplication(id) {
        alert('View application details for: ' + id);
    },
    
    async approveApplication(id) {
        if (!confirm('Approve this driver application?')) return;
        
        try {
            const appRef = ref(window.database, 'transporter_applications/' + id);
            await update(appRef, { status: 'approved', approvedAt: new Date().toISOString() });
            window.app.showSuccess('Application approved! The driver can now create an account.');
            loadDriverApplications(window.app);
            loadAdminData(window.app);
        } catch (error) {
            window.app.showError('Error approving application');
        }
    },
    
    async rejectApplication(id) {
        if (!confirm('Reject this driver application?')) return;
        
        try {
            const appRef = ref(window.database, 'transporter_applications/' + id);
            await update(appRef, { status: 'rejected', rejectedAt: new Date().toISOString() });
            window.app.showSuccess('Application rejected');
            loadDriverApplications(window.app);
        } catch (error) {
            window.app.showError('Error rejecting application');
        }
    },
    
    refreshBookings() {
        loadAllBookings(window.app);
    }
};

// Add custom styles for admin dashboard
const style = document.createElement('style');
style.textContent = `
    .admin-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .admin-stat-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .admin-stat-card .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
    }

    .stat-details h3 {
        font-size: 32px;
        color: #2d3748;
        margin-bottom: 5px;
    }

    .stat-details p {
        color: #718096;
        font-size: 14px;
        margin-bottom: 5px;
    }

    .stat-details small {
        color: #a0aec0;
        font-size: 12px;
    }

    .admin-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
        overflow-x: auto;
    }

    .admin-tab {
        padding: 12px 20px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: #4a5568;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .admin-tab.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
    }

    .admin-tab-content {
        display: none;
    }

    .admin-tab-content.active {
        display: block;
    }

    .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .overview-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .overview-card h3 {
        color: #2d3748;
        margin-bottom: 20px;
        font-size: 18px;
    }

    .activity-list {
        display: grid;
        gap: 15px;
    }

    .activity-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f7fafc;
        border-radius: 10px;
        gap: 10px;
    }

    .activity-item small {
        display: block;
        color: #718096;
        font-size: 12px;
        margin-top: 3px;
    }

    .quick-stats {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }

    .quick-stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f7fafc;
        border-radius: 10px;
    }

    .admin-table-container {
        background: white;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
    }

    .admin-table {
        min-width: 1000px;
    }

    .admin-table-header,
    .admin-table-row {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1.5fr 1fr 0.8fr 0.8fr 1fr;
        gap: 15px;
        padding: 15px;
        align-items: center;
    }

    .admin-table-header {
        font-weight: 700;
        color: #2d3748;
        border-bottom: 2px solid #e2e8f0;
    }

    .admin-table-row {
        border-bottom: 1px solid #f7fafc;
        transition: background 0.3s ease;
    }

    .admin-table-row:hover {
        background: #f7fafc;
    }

    .btn-small {
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        margin-right: 5px;
    }

    .btn-view {
        background: #4299e1;
        color: white;
    }

    .btn-view:hover {
        background: #3182ce;
    }

    .btn-delete {
        background: #f56565;
        color: white;
    }

    .btn-delete:hover {
        background: #e53e3e;
    }

    .btn-approve {
        background: #48bb78;
        color: white;
    }

    .btn-approve:hover {
        background: #38a169;
    }

    .filter-select {
        padding: 10px 15px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #4a5568;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    .filter-select:focus {
        outline: none;
        border-color: #667eea;
    }

    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
    }

    .analytics-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .analytics-card h4 {
        color: #2d3748;
        margin-bottom: 20px;
        font-size: 18px;
    }

    .stats-list {
        display: grid;
        gap: 15px;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 15px;
        background: #f7fafc;
        border-radius: 8px;
    }

    @media (max-width: 768px) {
        .admin-stats-grid {
            grid-template-columns: 1fr;
        }

        .admin-tabs {
            flex-direction: column;
        }

        .admin-tab {
            width: 100%;
        }

        .overview-grid {
            grid-template-columns: 1fr;
        }

        .quick-stats {
            grid-template-columns: 1fr;
        }

        .admin-table-header,
        .admin-table-row {
            grid-template-columns: repeat(7, 1fr);
            font-size: 12px;
        }

        .analytics-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);/**
 * PIKIDROP - Admin Dashboard Page Module
 * Complete admin dashboard for managing the entire platform
 */

import { ref, get, set, remove, update } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

let currentTab = 'overview';

export function getPageHTML() {
    return `
        <div id="adminDashboardPage" class="page">
            <h1 class="page-title">Admin Dashboard</h1>
            <p style="text-align: center; color: #718096; max-width: 600px; margin: 0 auto 40px;">
                Manage deliveries, drivers, users, and monitor platform performance
            </p>
            
            <!-- Statistics Overview -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="stat-icon" style="background: #667eea;">📦</div>
                    <div class="stat-details">
                        <h3 id="totalBookings">0</h3>
                        <p>Total Bookings</p>
                        <small id="pendingBookings">0 pending</small>
                    </div>
                </div>
                
                <div class="admin-stat-card">
                    <div class="stat-icon" style="background: #48bb78;">🚗</div>
                    <div class="stat-details">
                        <h3 id="totalDrivers">0</h3>
                        <p>Active Drivers</p>
                        <small id="pendingDrivers">0 pending approval</small>
                    </div>
                </div>
                
                <div class="admin-stat-card">
                    <div class="stat-icon" style="background: #4299e1;">👥</div>
                    <div class="stat-details">
                        <h3 id="totalUsers">0</h3>
                        <p>Total Users</p>
                        <small id="newUsersToday">0 new today</small>
                    </div>
                </div>
                
                <div class="admin-stat-card">
                    <div class="stat-icon" style="background: #ed8936;">💰</div>
                    <div class="stat-details">
                        <h3 id="totalRevenue">UGX 0</h3>
                        <p>Total Revenue</p>
                        <small id="revenueToday">UGX 0 today</small>
                    </div>
                </div>
            </div>

            <!-- Admin Tabs -->
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="overview">📊 Overview</button>
                <button class="admin-tab" data-tab="bookings">📦 All Bookings</button>
                <button class="admin-tab" data-tab="drivers">🚗 Drivers</button>
                <button class="admin-tab" data-tab="users">👥 Users</button>
                <button class="admin-tab" data-tab="storage">🏪 Storage</button>
                <button class="admin-tab" data-tab="applications">📝 Applications</button>
                <button class="admin-tab" data-tab="analytics">📈 Analytics</button>
            </div>

            <!-- Overview Tab -->
            <div id="overviewTab" class="admin-tab-content active">
                <div class="overview-grid">
                    <!-- Recent Activity -->
                    <div class="overview-card">
                        <h3>Recent Bookings</h3>
                        <div id="recentBookings" class="activity-list"></div>
                    </div>
                    
                    <!-- Pending Actions -->
                    <div class="overview-card">
                        <h3>Pending Actions</h3>
                        <div id="pendingActions" class="activity-list"></div>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="quick-stat-item">
                        <span>Today's Deliveries:</span>
                        <strong id="todayDeliveries">0</strong>
                    </div>
                    <div class="quick-stat-item">
                        <span>Completed This Week:</span>
                        <strong id="weekDeliveries">0</strong>
                    </div>
                    <div class="quick-stat-item">
                        <span>Average Delivery Time:</span>
                        <strong id="avgDeliveryTime">-</strong>
                    </div>
                    <div class="quick-stat-item">
                        <span>Success Rate:</span>
                        <strong id="successRate">-</strong>
                    </div>
                </div>
            </div>

            <!-- Bookings Tab -->
            <div id="bookingsTab" class="admin-tab-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                    <h2 style="color: #2d3748; margin: 0;">All Bookings</h2>
                    <div style="display: flex; gap: 10px;">
                        <select id="bookingStatusFilter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="Pending Pickup">Pending Pickup</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <button class="nav-btn" onclick="window.adminDashboard.refreshBookings()">🔄 Refresh</button>
                    </div>
                </div>
                <div id="allBookings" class="admin-table-container"></div>
            </div>

            <!-- Drivers Tab -->
            <div id="driversTab" class="admin-tab-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                    <h2 style="color: #2d3748; margin: 0;">Driver Management</h2>
                    <select id="driverStatusFilter" class="filter-select">
                        <option value="all">All Drivers</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <div id="allDrivers" class="admin-table-container"></div>
            </div>

            <!-- Users Tab -->
            <div id="usersTab" class="admin-tab-content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">User Management</h2>
                <div id="allUsers" class="admin-table-container"></div>
            </div>

            <!-- Storage Tab -->
            <div id="storageTab" class="admin-tab-content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Storage Requests</h2>
                <div id="storageRequests" class="admin-table-container"></div>
            </div>

            <!-- Applications Tab -->
            <div id="applicationsTab" class="admin-tab-content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Driver Applications</h2>
                <div id="driverApplications" class="admin-table-container"></div>
            </div>

            <!-- Analytics Tab -->
            <div id="analyticsTab" class="admin-tab-content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Platform Analytics</h2>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Revenue Trend</h4>
                        <div id="revenueTrend" class="chart-container">
                            <p style="color: #718096; text-align: center; padding: 40px;">Coming soon...</p>
                        </div>
                    </div>
                    <div class="analytics-card">
                        <h4>Delivery Statistics</h4>
                        <div id="deliveryStats" class="stats-list"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initPage(app) {
    // Check if user is admin
    checkAdminAccess(app);
    
    // Setup tab switching
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName, app);
        });
    });
    
    // Setup filters
    document.getElementById('bookingStatusFilter')?.addEventListener('change', () => loadAllBookings(app));
    document.getElementById('driverStatusFilter')?.addEventListener('change', () => loadAllDrivers(app));
    
    // Load initial data
    loadAdminData(app);
    
    console.log('Admin dashboard initialized');
}

async function checkAdminAccess(app) {
    if (!app.currentUser) {
        app.showError('Please login to access the admin dashboard');
        app.showHome();
        return;
    }
    
    try {
        const userRef = ref(window.database, 'users/' + app.currentUser.uid);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists() || snapshot.val().role !== 'admin') {
            app.showError('Access denied. Admin privileges required.');
            app.showHome();
            return;
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        app.showHome();
    }
}

function switchTab(tabName, app) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'overview':
            loadOverview(app);
            break;
        case 'bookings':
            loadAllBookings(app);
            break;
        case 'drivers':
            loadAllDrivers(app);
            break;
        case 'users':
            loadAllUsers(app);
            break;
        case 'storage':
            loadStorageRequests(app);
            break;
        case 'applications':
            loadDriverApplications(app);
            break;
        case 'analytics':
            loadAnalytics(app);
            break;
    }
}

async function loadAdminData(app) {
    try {
        // Load bookings
        const bookingsRef = ref(window.database, 'bookings');
        const bookingsSnapshot = await get(bookingsRef);
        
        // Load users
        const usersRef = ref(window.database, 'users');
        const usersSnapshot = await get(usersRef);
        
        if (bookingsSnapshot.exists()) {
            const bookings = Object.values(bookingsSnapshot.val());
            const pending = bookings.filter(b => b.status === 'Pending Pickup').length;
            
            document.getElementById('totalBookings').textContent = bookings.length;
            document.getElementById('pendingBookings').textContent = `${pending} pending`;
            
            const totalRevenue = bookings
                .filter(b => b.status === 'Delivered')
                .reduce((sum, b) => sum + (parseFloat(b.estimatedCost) || 0), 0);
            
            document.getElementById('totalRevenue').textContent = app.formatCurrency(totalRevenue);
            
            // Today's revenue
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const revenue
