import api from '@/utils/api';

export const authService = {
    // POST /api/auth/register
    register: async (userData) => {
        // Backend expects lowercase keys: firstname, lastname, email, password
        const payload = {
            firstname: userData.firstname || userData.firstName || '',
            lastname: userData.lastname || userData.lastName || '',
            email: userData.email?.trim(),
            password: userData.password,
        };

        const response = await api.post('/auth/register', payload);
        return response.data;
    },

    // POST /api/auth/login
    login: async (credentials) => {
        const payload = {
            email: credentials.email?.trim(),
            password: credentials.password,
        };

        const response = await api.post('/auth/login', payload);

        // Save token if returned directly
        const token = response.data?.token || response.data?.data?.token;
        if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }

        return response.data;
    },

    // POST /api/auth/forgot-password
    forgotPassword: async (emailOrPayload) => {
        const email =
            typeof emailOrPayload === 'string'
                ? emailOrPayload.trim()
                : emailOrPayload?.email?.trim();

        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // PATCH /api/auth/reset-password/:token
    resetPassword: async (token, passwordOrPayload) => {
        const password =
            typeof passwordOrPayload === 'string'
                ? passwordOrPayload
                : passwordOrPayload?.password;

        const response = await api.patch(`/auth/reset-password/${token}`, {
            password,
        });
        return response.data;
    },


    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Helper method: Get Current Token
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },
};

export default authService;