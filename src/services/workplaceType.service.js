// services/workplaceType.service.js
import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/workplace-types';

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

export const workplaceTypeService = {
    // Get all workplace types with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single workplace type by ID
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
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                is_trending: data.is_trending || false,
                is_status: statusValue,
                // ─── Only send created_by ──────────────────────────
                created_by: data.created_by || userId || 1,
                // ─── NO updated_by on create ─────────────────────────
            };

            console.log('Creating workplace type with data:', submitData);
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
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                is_trending: data.is_trending || false,
                is_status: statusValue,
                // ─── Only send updated_by ──────────────────────────
                updated_by: userId || 1
                // ─── NO created_by on update ─────────────────────────
            };

            console.log('Updating workplace type with data:', submitData);
            console.log('Update URL:', `${BASE_URL}/${id}`);

            let response;
            try {
                // Try PUT first
                response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('✅ PUT successful');
                return response.data;
            } catch (putError) {
                console.log('PUT failed:', putError.response?.status);
                // If PUT fails with 404 or 405, try PATCH
                if (putError.response?.status === 404 || putError.response?.status === 405) {
                    console.log('Trying PATCH...');
                    try {
                        response = await api.patch(`${BASE_URL}/${id}`, submitData);
                        console.log('✅ PATCH successful');
                        return response.data;
                    } catch (patchError) {
                        console.log('PATCH failed:', patchError.response?.status);
                        // If PATCH fails with 404, try alternative URLs
                        if (patchError.response?.status === 404) {
                            console.log('Trying alternative URLs...');

                            const alternativeUrls = [
                                `/workplace-type/${id}`,
                                `/api/workplace-types/${id}`,
                                `/api/workplace-type/${id}`,
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

    // Delete workplace type
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

    // Bulk delete workplace types
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search workplace types
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default workplaceTypeService;