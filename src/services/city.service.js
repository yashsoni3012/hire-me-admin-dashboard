import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/cities';
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

export const cityService = {
    // Get all cities with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single city by ID
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

    // Get cities by state ID
    getByStateId: async (stateId) => {
        try {
            const response = await api.get(`${BASE_URL}/state/${stateId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new city with image upload support
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

            // Check if we have a file to upload
            const hasImageFile = data.imageFile && data.imageFile instanceof File;

            let response;

            if (hasImageFile) {
                // Use FormData for file upload
                console.log('Creating city with image file upload');
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('state_id', parseInt(data.state_id));
                formData.append('is_status', statusValue);
                formData.append('is_trending', trendingValue);
                formData.append('created_by', userId || null);
                formData.append('image', data.imageFile);

                response = await api.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Use JSON for no file
                console.log('Creating city without file');
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    state_id: parseInt(data.state_id),
                    is_status: statusValue,
                    is_trending: trendingValue,
                    created_by: userId || null,
                };

                // Only add image if it's a string and not null/undefined
                if (data.image && typeof data.image === 'string' && data.image.trim() !== '' && data.image !== 'null') {
                    submitData.image = data.image;
                }

                response = await api.post(BASE_URL, submitData);
            }

            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update city with image upload support
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

            // Check if we have a file to upload
            const hasImageFile = data.imageFile && data.imageFile instanceof File;

            let response;

            if (hasImageFile) {
                // Use FormData for file upload
                console.log('Updating city with image file upload');
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('state_id', parseInt(data.state_id));
                formData.append('is_status', statusValue);
                formData.append('is_trending', trendingValue);
                formData.append('updated_by', userId || null);
                formData.append('image', data.imageFile);

                try {
                    response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } catch (putError) {
                    console.log('PUT with FormData failed:', putError.response?.status);
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        response = await api.patch(`${BASE_URL}/${id}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } else {
                        throw putError;
                    }
                }
            } else {
                // Use JSON for no file
                console.log('Updating city without file');
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    state_id: parseInt(data.state_id),
                    is_status: statusValue,
                    is_trending: trendingValue,
                    updated_by: userId || null
                };

                // Only add image if it's a string and not null/undefined
                if (data.image && typeof data.image === 'string' && data.image.trim() !== '' && data.image !== 'null') {
                    submitData.image = data.image;
                }

                try {
                    response = await api.put(`${BASE_URL}/${id}`, submitData);
                } catch (putError) {
                    console.log('PUT failed:', putError.response?.status);
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        response = await api.patch(`${BASE_URL}/${id}`, submitData);
                    } else {
                        throw putError;
                    }
                }
            }

            return response.data;
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete city
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

    // Bulk delete cities
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search cities
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default cityService;