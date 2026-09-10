import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/application-statuses';

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

export const applicationStatusService = {
    // Get all application statuses with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single application status by ID
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

    // Create new application status
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean for is_status
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                status: data.status || 'active',
                is_trending: data.is_trending || false,
                is_status: statusValue,
                created_by: userId || 1
            };

            console.log('Creating application status with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update application status with PUT/PATCH fallback
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean for is_status
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                status: data.status || 'active',
                is_trending: data.is_trending || false,
                is_status: statusValue,
                updated_by: userId || 1
            };

            console.log('Updating application status with data:', submitData);
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
                        console.log('PATCH response:', response.data);
                        return response.data;
                    } catch (patchError) {
                        console.log('PATCH failed:', patchError.response?.status);
                        // If PATCH fails with 404, try alternative URLs
                        if (patchError.response?.status === 404) {
                            console.log('Trying alternative URLs...');

                            const alternativeUrls = [
                                `/application-status/${id}`,
                                `/api/application-statuses/${id}`,
                                `/api/application-status/${id}`,
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

    // Delete application status
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

    // Bulk delete application statuses
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search application statuses
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default applicationStatusService;