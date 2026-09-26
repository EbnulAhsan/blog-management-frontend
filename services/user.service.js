import api from '@/utils/api';

export const userService = {
    // GET /api/users/profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // PUT /api/users/profile/update
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile/update', profileData);
        return response.data;
    },

    // PATCH /api/users/profile/image (multipart/form-data)
    uploadProfileImage: async (formData) => {
        const response = await api.patch('/users/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // PATCH /api/users/password
    changePassword: async (password) => {
        const response = await api.patch('/users/password', { password });
        return response.data;
    },

    // --- Admin Endpoints ---
    // GET /api/users
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // GET /api/users/:id
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // PATCH /api/users/:id/status
    updateUserStatus: async (id, isActive) => {
        const response = await api.patch(`/users/${id}/status`, { isActive });
        return response.data;
    },
};