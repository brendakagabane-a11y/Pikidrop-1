/**
 * PIKIDROP - Authentication Module
 * Handles user login, signup, and session management
 */

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { ref, set, get } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

class AuthManager {
    constructor() {
        this.auth = window.auth;
        this.database = window.database;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const isDriver = document.getElementById('loginAsDriver').checked;
        const isAdmin = document.getElementById('loginAsAdmin').checked;
        const errorDiv = document.getElementById('loginError');

        // Clear previous errors
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        // Validate inputs
        if (!email || !password) {
            this.showLoginError('Please fill in all fields');
            return;
        }

        try {
            // Sign in user
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            
            // Check user role if logging in as driver or admin
            const userRef = ref(this.database, 'users/' + userCredential.user.uid);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // Verify admin role
                if (isAdmin && userData.role !== 'admin') {
                    this.showLoginError('This account is not registered as an admin. Please uncheck "Login as Admin".');
                    await this.auth.signOut();
                    return;
                }
                
                // Verify driver role if driver login is selected
                if (isDriver && userData.role !== 'driver') {
                    this.showLoginError('This account is not registered as a driver. Please uncheck "Login as Driver" or create a driver account.');
                    await this.auth.signOut();
                    return;
                }
                
                // Verify user role if regular user login
                if (!isDriver && !isAdmin && userData.role !== 'user') {
                    this.showLoginError(`This is a ${userData.role} account. Please check the appropriate box to continue.`);
                    await this.auth.signOut();
                    return;
                }
            }
            
            // Close modal on successful login
            window.app.closeAuthModal();
            window.app.showSuccess('Login successful! Welcome back.');
            
            // Redirect based on role
            if (isAdmin) {
                window.app.loadPage('adminDashboard');
            } else if (isDriver) {
                window.app.loadPage('driverDashboard');
            } else {
                window.app.showHome();
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle specific error codes
            switch (error.code) {
                case 'auth/invalid-email':
                    this.showLoginError('Invalid email address format');
                    break;
                case 'auth/user-disabled':
                    this.showLoginError('This account has been disabled');
                    break;
                case 'auth/user-not-found':
                    this.showLoginError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    this.showLoginError('Incorrect password');
                    break;
                case 'auth/invalid-credential':
                    this.showLoginError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    this.showLoginError('Too many failed attempts. Please try again later');
                    break;
                default:
                    this.showLoginError('Login failed: ' + error.message);
            }
        }
    }

    async handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const isDriver = document.getElementById('signupAsDriver').checked;
        const errorDiv = document.getElementById('signupError');

        // Clear previous errors
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        // Validate inputs
        if (!name || !email || !phone || !password || !confirmPassword) {
            this.showSignupError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showSignupError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showSignupError('Password must be at least 6 characters long');
            return;
        }

        // Validate phone number (basic validation)
        if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
            this.showSignupError('Please enter a valid phone number');
            return;
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showSignupError('Please enter a valid email address');
            return;
        }

        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            
            // Update display name
            await updateProfile(userCredential.user, { displayName: name });
            
            // Save user data to database
            const userData = {
                name: name,
                email: email,
                phone: phone,
                role: isDriver ? 'driver' : 'user',
                createdAt: new Date().toISOString(),
                status: isDriver ? 'pending' : 'active'
            };
            
            await set(ref(this.database, 'users/' + userCredential.user.uid), userData);
            
            // Close modal on successful signup
            window.app.closeAuthModal();
            
            if (isDriver) {
                window.app.showSuccess('Driver account created successfully! Your application is pending approval.');
                window.app.loadPage('driverDashboard');
            } else {
                window.app.showSuccess('Account created successfully! Welcome to Pikidrop.');
                window.app.showHome();
            }
            
        } catch (error) {
            console.error('Signup error:', error);
            
            // Handle specific error codes
            switch (error.code) {
                case 'auth/email-already-in-use':
                    this.showSignupError('An account with this email already exists');
                    break;
                case 'auth/invalid-email':
                    this.showSignupError('Invalid email address format');
                    break;
                case 'auth/operation-not-allowed':
                    this.showSignupError('Email/password accounts are not enabled');
                    break;
                case 'auth/weak-password':
                    this.showSignupError('Password is too weak. Please use a stronger password');
                    break;
                default:
                    this.showSignupError('Signup failed: ' + error.message);
            }
        }
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showSignupError(message) {
        const errorDiv = document.getElementById('signupError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

// Initialize auth manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AuthManager();
    });
} else {
    new AuthManager();
}

export default AuthManager;
