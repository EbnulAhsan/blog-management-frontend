// services/blog.service.js
import api from '@/utils/api';

export const blogService = {
    // GET /api/blogs?title=...&category=...
    getAllBlogs: async (params = {}) => {
        const res = await api.get('/blogs', { params });
        return res.data;
    },

    // GET /api/blogs/:id
    getBlogById: async (id) => {
        const res = await api.get(`/blogs/${id}`);
        return res.data;
    },

    // POST /api/blogs/create
    createBlog: async (payload) => {
        const res = await api.post('/blogs/create', payload);
        return res.data;
    },

    // PUT /api/blogs/update/:id
    updateBlog: async (id, payload) => {
        const res = await api.put(`/blogs/update/${id}`, payload);
        return res.data;
    },

    // DELETE /api/blogs/delete/:id
    deleteBlog: async (id) => {
        const res = await api.delete(`/blogs/delete/${id}`);
        return res.data;
    },
};