import api from '@/utils/api';

export const userService = {
    // GET /api/users/profile
    getProfile: async () => {
        const res = await api.get('/users/profile');
        return res.data;
    },

    // PUT /api/users/profile/update
    updateProfile: async (payload) => {
        const res = await api.put('/users/profile/update', payload);
        return res.data;
    },

    // PATCH /api/users/profile/image (multipart/form-data)
    uploadAvatar: async (formData) => {
        const res = await api.patch('/users/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },

    // PATCH /api/users/password
    changePassword: async (payload) => {
        const res = await api.patch('/users/password', payload);
        return res.data;
    },

    // Admin APIs (Section 27, 28, 29)
    getAllUsers: async () => {
        const res = await api.get('/users');
        return res.data;
    },

    getUserById: async (id) => {
        const res = await api.get(`/users/${id}`);
        return res.data;
    },

    updateUserStatus: async (id, isActive) => {
        const res = await api.patch(`/users/${id}/status`, { isActive });
        return res.data;
    },
};