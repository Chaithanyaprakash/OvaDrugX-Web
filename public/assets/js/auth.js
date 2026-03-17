/**
 * auth.js - Centralized authentication logic for OvaDrugX web
 */

const API_BASE_URL = 'http://localhost:5000';

const auth = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.setItem('user', JSON.stringify(result.data));
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Register user
     * @param {Object} userData 
     */
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.setItem('pending_email', userData.email);
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Verify account with OTP
     * @param {string} email 
     * @param {string} otp 
     */
    async verifyAccount(email, otp) {
        try {
            const response = await fetch(`${API_BASE_URL}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.removeItem('pending_email');
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Verification failed' };
            }
        } catch (error) {
            console.error('Verification error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Request password reset OTP
     * @param {string} email 
     */
    async forgotPassword(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.setItem('reset_email', email);
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Request failed' };
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Verify password reset OTP
     * @param {string} email 
     * @param {string} otp 
     */
    async verifyResetOtp(email, otp) {
        try {
            const response = await fetch(`${API_BASE_URL}/verify-reset-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'OTP verification failed' };
            }
        } catch (error) {
            console.error('Verify reset OTP error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Reset password
     * @param {string} email 
     * @param {string} newPassword 
     */
    async resetPassword(email, new_password) {
        try {
            const response = await fetch(`${API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, new_password })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.removeItem('reset_email');
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Reset failed' };
            }
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Get account details
     * @param {string} email 
     */
    async getAccount(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/get-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message || 'Fetch failed' };
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Update user profile

     * @param {Object} userData 
     */
    async updateAccount(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/update-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                // Update local storage user data
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.full_name = userData.full_name;
                    user.mobile = userData.mobile;
                    // Note: bio is mapped to department in backend but we keep it in context
                    user.bio = userData.bio; 
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message || 'Update failed' };
            }
        } catch (error) {
            console.error('Update error:', error);
            return { success: false, message: 'Could not connect to server' };
        }
    },

    /**
     * Check if user is authenticated
     */

    checkAuth() {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = 'signin.html';
            return null;
        }
        return JSON.parse(user);
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('user');
        window.location.href = 'signin.html';
    }
};

window.auth = auth;
