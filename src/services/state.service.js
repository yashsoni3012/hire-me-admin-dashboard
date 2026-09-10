// services/state.service.js
import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/states';

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user?.id || null;
        }
        const user = storage.getUser();
        return user?.id || user?.userId || user?._id || null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

export const stateService = {
    // Get all states with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single state by ID
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

    // ─── CREATE - Only send created_by ──────────────────────────
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                is_status: statusValue,
                is_trending: trendingValue,
                created_by: userId || 1,
                // ─── REMOVED: updated_by ──────────────────────────────
                // updated_by: userId || 1
            };

            console.log('Creating state with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // ─── UPDATE - Only send updated_by ──────────────────────────
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                is_status: statusValue,
                is_trending: trendingValue,
                updated_by: userId || 1
                // ─── REMOVED: created_by ──────────────────────────────
            };

            console.log('Updating state with data:', submitData);
            console.log('Update URL:', `${BASE_URL}/${id}`);

            let response;
            try {
                response = await api.put(`${BASE_URL}/${id}`, submitData);
                return response.data;
            } catch (putError) {
                console.log('PUT failed, trying PATCH...');
                try {
                    response = await api.patch(`${BASE_URL}/${id}`, submitData);
                    return response.data;
                } catch (patchError) {
                    console.log('PATCH failed, trying alternative URLs...');

                    const alternativeUrls = [
                        `${BASE_URL}/update/${id}`,
                        `${BASE_URL}/edit/${id}`,
                        `/states/update/${id}`,
                        `/states/edit/${id}`,
                    ];

                    let lastError = patchError;

                    for (const url of alternativeUrls) {
                        try {
                            console.log(`Trying alternative URL: ${url}`);
                            response = await api.put(url, submitData);
                            return response.data;
                        } catch (err) {
                            console.log(`Alternative URL ${url} failed:`, err.response?.status);
                            lastError = err;
                        }
                    }
                    throw lastError;
                }
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete state
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

    // Bulk delete states
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search states
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default stateService;