import api from '@/utils/api';

export const authService = {
    // POST /api/auth/register
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // POST /api/auth/login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // POST /api/auth/forgot-password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // PATCH /api/auth/reset-password/:token
    resetPassword: async (token, password) => {
        const response = await api.patch(`/auth/reset-password/${token}`, { password });
        return response.data;
    },
};