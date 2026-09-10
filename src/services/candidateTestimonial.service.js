// src/services/candidateTestimonial.service.js
import api from "./axiosInstance";

const BASE_URL = "/candidate-testimonials";

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user?.id || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

export const candidateTestimonialService = {
    // Get all testimonials
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single testimonial
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error.response?.data || error.message;
        }
    },

    // Create testimonial
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            const formData = new FormData();
            formData.append("name", data.name || "");
            formData.append("email", data.email || "");
            formData.append("description", data.description || "");
            formData.append("rating", parseFloat(data.rating) || 0);
            formData.append("is_status", data.is_status ? "true" : "false");
            formData.append("created_by", userId || 1);

            if (data.imageFile instanceof File) {
                formData.append("image", data.imageFile);
            }

            const response = await api.post(BASE_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update testimonial
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            if (data.imageFile instanceof File) {
                const formData = new FormData();
                formData.append("name", data.name || "");
                formData.append("email", data.email || "");
                formData.append("description", data.description || "");
                formData.append("rating", parseFloat(data.rating) || 0);
                formData.append("is_status", data.is_status ? "true" : "false");
                formData.append("updated_by", userId || 1);
                formData.append("image", data.imageFile);

                try {
                    const response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    return response.data;
                } catch (putError) {
                    const response = await api.patch(`${BASE_URL}/${id}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    return response.data;
                }
            }

            const submitData = {
                name: data.name || "",
                email: data.email || "",
                description: data.description || "",
                rating: parseFloat(data.rating) || 0,
                is_status: data.is_status,
                updated_by: userId || 1,
            };

            if (data.image === null) {
                submitData.image = null;
            } else if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
                submitData.image = data.image;
            }

            try {
                const response = await api.put(`${BASE_URL}/${id}`, submitData);
                return response.data;
            } catch (putError) {
                const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                return response.data;
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete testimonial
    delete: async (id) => {
        try {
            const response = await api.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { success: true, message: 'Item already deleted' };
            }
            throw error.response?.data || error.message;
        }
    },
};

export default candidateTestimonialService;