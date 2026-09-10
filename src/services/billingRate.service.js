// services/billingRate.service.js
import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/billing-rates';

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

export const billingRateService = {
    // Get all billing rates with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single billing rate by ID
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

    // ─── CREATE ──────────────────────────────────────────────────
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to integer (0 or 1)
            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // ─── Handle display_order - ensure default 0 ──────────
            let displayOrderValue = 0;
            if (data.display_order !== undefined && data.display_order !== null && data.display_order !== '') {
                displayOrderValue = parseInt(data.display_order) || 0;
            }

            const submitData = {
                display_text: data.display_text ? data.display_text.trim() : '',
                amount: parseFloat(data.amount) || 0,
                display_order: displayOrderValue,
                status: statusValue,
                created_by: userId || 1,
                updated_by: userId || 1
            };

            console.log('Creating billing rate with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // ─── UPDATE ──────────────────────────────────────────────────
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to integer (0 or 1)
            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // ─── Handle display_order - ensure default 0 ──────────
            let displayOrderValue = 0;
            if (data.display_order !== undefined && data.display_order !== null && data.display_order !== '') {
                displayOrderValue = parseInt(data.display_order) || 0;
            }

            const submitData = {
                display_text: data.display_text ? data.display_text.trim() : '',
                amount: parseFloat(data.amount) || 0,
                display_order: displayOrderValue,
                status: statusValue,
                updated_by: userId || 1
            };

            console.log('Updating billing rate with data:', submitData);
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
                                `/billing-rate/${id}`,
                                `/api/billing-rates/${id}`,
                                `/api/billing-rate/${id}`,
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

    // Delete billing rate
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

    // Bulk delete billing rates
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search billing rates
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default billingRateService;