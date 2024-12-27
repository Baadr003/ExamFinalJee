import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';
const AUTH_KEY = 'authData';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const authService = {
    login: async (credentials) => {
        try {
            console.log('Login attempt:', { username: credentials.username });
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response.data);

            if (response.data.success) {
                const authData = {
                    userId: response.data.userId,
                    username: credentials.username,
                    isAuthenticated: true,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
                console.log('Auth data stored:', authData);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            console.log('Registration attempt:', { username: userData.username, email: userData.email });
            const response = await api.post('/auth/register', userData);
            console.log('Registration response:', response.data);

            if (response.data.success) {
                return {
                    success: true,
                    userId: response.data.userId,
                    message: 'Inscription réussie'
                };
            } else {
                throw new Error(response.data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    },

    logout: () => {
        console.log('Logging out user');
        localStorage.removeItem(AUTH_KEY);
    },

    isAuthenticated: () => {
        const authData = localStorage.getItem(AUTH_KEY);
        if (!authData) return false;

        const parsed = JSON.parse(authData);
        const now = new Date().getTime();
        const elapsed = now - parsed.timestamp;

        if (elapsed > SESSION_DURATION) {
            console.log('Session expired');
            authService.logout();
            return false;
        }

        return parsed.isAuthenticated;
    },

    getUserId: () => {
        const authData = localStorage.getItem(AUTH_KEY);
        if (!authData) return null;

        const parsed = JSON.parse(authData);
        return parsed.userId;
    },

    getSession: () => {
        const authData = localStorage.getItem(AUTH_KEY);
        if (!authData) return null;

        const parsed = JSON.parse(authData);
        const now = new Date().getTime();
        const elapsed = now - parsed.timestamp;

        if (elapsed > SESSION_DURATION) {
            authService.logout();
            return null;
        }

        return parsed;
    },

    verifyEmail: async (email, code) => {
        try {
            console.log('Verification attempt:', { email, code });
            const response = await api.post('/auth/verify', null, {
                params: {
                    email,
                    code
                }
            });
            
            if (response.data.success) {
                return {
                    success: true,
                    message: 'Email vérifié avec succès'
                };
            } else {
                throw new Error(response.data.message || 'Erreur lors de la vérification');
            }
        } catch (error) {
            console.error('Verification error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification');
        }
    },
    
    resendVerificationCode: async (email) => {
        try {
            const response = await api.post('/auth/resend-verification', null, {
                params: { email }
            });
            
            return response.data;
        } catch (error) {
            console.error('Resend verification code error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du code');
        }
    },

    updateProfile: async (userId, userData) => {
        try {
            const response = await api.put(`/auth/user/${userId}`, {
                username: userData.username,
                currentPassword: userData.currentPassword,
                newPassword: userData.newPassword
            });
            
            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Profil mis à jour avec succès'
                };
            }
            throw new Error(response.data.message);
        } catch (error) {
            console.error('Update profile error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    },

    requestPasswordReset: async (email) => {
        try {
            console.log('Requesting password reset for:', email);
            const response = await api.post('/auth/request-reset', null, {
                params: { email }
            });
            return response.data;
        } catch (error) {
            console.error('Password reset request error:', error.response);
            throw new Error(error.response?.data?.message || 'Erreur lors de la demande de réinitialisation');
        }
    },
    resetPassword: async (resetData) => {
        try {
            const response = await api.post('/auth/reset-password', {
                email: resetData.email,
                code: resetData.code,
                newPassword: resetData.newPassword
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
        }
    
    }
};

export default authService;