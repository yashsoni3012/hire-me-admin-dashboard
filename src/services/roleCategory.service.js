import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/function-roles';

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        const user = storage.getUser();
        return user?.id || user?.userId || user?._id || null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

export const roleCategoryService = {
    // Get all role categories with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single role category by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new role category
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                name: data.name.trim(),
                is_trending: data.is_trending || false,
                status: data.status !== undefined ? data.status : true,
                created_by: userId,
            };

            console.log('Creating role category with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update role category
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                name: data.name.trim(),
                is_trending: data.is_trending || false,
                status: data.status !== undefined ? data.status : true,
                updated_by: userId
            };

            console.log('Updating role category with data:', submitData);

            let response;
            try {
                response = await api.put(`${BASE_URL}/${id}`, submitData);
            } catch (err) {
                // If PUT fails, try PATCH
                if (err.response?.status === 404) {
                    response = await api.patch(`${BASE_URL}/${id}`, submitData);
                } else {
                    throw err;
                }
            }
            return response.data;
        } catch (error) {
            console.error('Update error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Delete role category
    delete: async (id) => {
        try {
            const response = await api.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk delete role categories
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search role categories
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default roleCategoryService;