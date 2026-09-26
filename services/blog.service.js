import api from '@/utils/api';

export const blogService = {
    // GET /api/blogs (supports ?title=...&category=...)
    getAllBlogs: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.title) query.append('title', params.title);
        if (params.category && params.category !== 'All') query.append('category', params.category);

        const queryString = query.toString();
        const endpoint = queryString ? `/blogs?${queryString}` : '/blogs';
        const response = await api.get(endpoint);
        return response.data;
    },

    // GET /api/blogs/:id
    getBlogById: async (id) => {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    // POST /api/blogs/create
    // Important Rule: Frontend must NOT send userId!
    createBlog: async (blogData) => {
        const response = await api.post('/blogs/create', blogData);
        return response.data;
    },

    // PUT /api/blogs/update/:id
    updateBlog: async (id, blogData) => {
        const response = await api.put(`/blogs/update/${id}`, blogData);
        return response.data;
    },

    // DELETE /api/blogs/delete/:id
    deleteBlog: async (id) => {
        const response = await api.delete(`/blogs/delete/${id}`);
        return response.data;
    },
};