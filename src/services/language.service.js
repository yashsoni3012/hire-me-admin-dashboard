// services/language.service.js
import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/language';

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

// Coerce any incoming representation (bool, 'active'/'inactive', 1/0, '1'/'0') to a real boolean
const toStatusBool = (value) => {
    if (value === 'inactive' || value === false || value === 0 || value === '0') return false;
    return true; // 'active', true, 1, '1', or anything else defaults active
};

const toTrendingBool = (value) => {
    return value === true || value === 1 || value === 'true' || value === '1';
};

export const languageService = {
    // Get all languages with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single language by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) return null;
            throw error.response?.data || error.message;
        }
    },

    // ─── CREATE - Only send created_by ──────────────────────────
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                language_name: data.language_name ? data.language_name.trim() : '',
                status: toStatusBool(data.status),
                is_trending: toTrendingBool(data.is_trending),
                created_by: userId || 1,
                // ─── REMOVED: updated_by ──────────────────────────────
                // updated_by: userId || 1
            };

            console.log('Creating language with data:', submitData);
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

            const submitData = {
                language_name: data.language_name ? data.language_name.trim() : '',
                status: toStatusBool(data.status),
                is_trending: toTrendingBool(data.is_trending),
                updated_by: userId || 1
                // ─── REMOVED: created_by ──────────────────────────────
            };

            console.log('Updating language with data:', submitData);
            console.log('Update URL:', `${BASE_URL}/${id}`);

            let response;
            try {
                response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('✅ PUT successful');
                return response.data;
            } catch (putError) {
                console.log('PUT failed:', putError.response?.status);
                if (putError.response?.status === 404 || putError.response?.status === 405) {
                    console.log('Trying PATCH...');
                    try {
                        response = await api.patch(`${BASE_URL}/${id}`, submitData);
                        console.log('✅ PATCH successful');
                        return response.data;
                    } catch (patchError) {
                        console.log('PATCH failed:', patchError.response?.status);
                        if (patchError.response?.status === 404) {
                            console.log('Trying alternative URLs...');

                            const alternativeUrls = [
                                `/languages/${id}`,
                                `/api/language/${id}`,
                                `/api/languages/${id}`,
                            ];

                            let lastError = patchError;

                            for (const url of alternativeUrls) {
                                try {
                                    console.log(`Trying alternative URL: ${url}`);
                                    response = await api.patch(url, submitData);
                                    console.log(`✅ Success with URL: ${url}`);
                                    return response.data;
                                } catch (err) {
                                    console.log(`Alternative URL ${url} failed:`, err.response?.status);
                                    lastError = err;
                                    if (err.response?.status === 404) {
                                        continue;
                                    }
                                    throw err;
                                }
                            }
                            throw lastError;
                        }
                        throw patchError;
                    }
                }
                throw putError;
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete language
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

    // Bulk delete languages
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search languages
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default languageService;