import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/subscription-feature-categories';

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

// Helper function to generate slug from name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export const subscriptionFeatureCategoryService = {
    // Get all subscription feature categories with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single subscription feature category by ID
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

    // Create new subscription feature category
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // FIX: Convert status to integer (0 or 1)
            let statusValue = 1; // Default to active
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // FIX: Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            // Check if we have a file to upload
            const hasIconFile = data.iconFile && data.iconFile instanceof File;

            let response;

            if (hasIconFile) {
                // Use FormData for file upload
                console.log('Creating subscription feature category with icon file upload');
                const formData = new FormData();
                formData.append('category_name', data.category_name ? data.category_name.trim() : '');
                formData.append('category_code', data.category_code ? generateSlug(data.category_name) : '');
                formData.append('description', data.description?.trim() || '');
                formData.append('display_order', parseInt(data.display_order) || 0);
                formData.append('status', statusValue);
                formData.append('is_trending', trendingValue);
                formData.append('created_by', userId || 1);
                formData.append('updated_by', userId || 1);
                formData.append('icon', data.iconFile);

                response = await api.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Use JSON for no file
                console.log('Creating subscription feature category without file');
                const submitData = {
                    category_name: data.category_name ? data.category_name.trim() : '',
                    category_code: data.category_code ? generateSlug(data.category_name) : '',
                    description: data.description?.trim() || '',
                    display_order: parseInt(data.display_order) || 0,
                    status: statusValue,
                    is_trending: trendingValue,
                    created_by: userId || 1,
                };

                // Only add icon if it's a string and not null/undefined
                if (data.icon && typeof data.icon === 'string' && data.icon.trim() !== '' && data.icon !== 'null') {
                    submitData.icon = data.icon;
                }

                response = await api.post(BASE_URL, submitData);
            }

            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update subscription feature category
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // FIX: Convert status to integer (0 or 1)
            let statusValue = 1; // Default to active
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            // FIX: Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            // Check if we have a file to upload
            const hasIconFile = data.iconFile && data.iconFile instanceof File;

            let response;

            // First, try with FormData (for file upload)
            if (hasIconFile) {
                console.log('Updating subscription feature category with icon file upload');
                const formData = new FormData();
                formData.append('category_name', data.category_name ? data.category_name.trim() : '');
                formData.append('category_code', data.category_code ? generateSlug(data.category_name) : '');
                formData.append('description', data.description?.trim() || '');
                formData.append('display_order', parseInt(data.display_order) || 0);
                formData.append('status', statusValue);
                formData.append('is_trending', trendingValue);
                formData.append('updated_by', userId || 1);
                formData.append('icon', data.iconFile);

                try {
                    response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    console.log('PUT successful:', response.data);
                    return response.data;
                } catch (putError) {
                    console.log('PUT with FormData failed:', putError.response?.status);
                    // Try PATCH as fallback
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        try {
                            response = await api.patch(`${BASE_URL}/${id}`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            console.log('PATCH successful:', response.data);
                            return response.data;
                        } catch (patchError) {
                            console.log('PATCH with FormData failed:', patchError.response?.status);
                            throw patchError;
                        }
                    }
                    throw putError;
                }
            } else {
                // Use JSON for no file
                console.log('Updating subscription feature category without file');
                const submitData = {
                    category_name: data.category_name ? data.category_name.trim() : '',
                    category_code: data.category_code ? generateSlug(data.category_name) : '',
                    description: data.description?.trim() || '',
                    display_order: parseInt(data.display_order) || 0,
                    status: statusValue,
                    is_trending: trendingValue,
                    updated_by: userId || 1
                };

                // Only add icon if it's a string and not null/undefined
                if (data.icon && typeof data.icon === 'string' && data.icon.trim() !== '' && data.icon !== 'null') {
                    submitData.icon = data.icon;
                }

                try {
                    response = await api.put(`${BASE_URL}/${id}`, submitData);
                    console.log('PUT successful:', response.data);
                    return response.data;
                } catch (putError) {
                    console.log('PUT failed:', putError.response?.status);
                    // Try PATCH as fallback
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        try {
                            response = await api.patch(`${BASE_URL}/${id}`, submitData);
                            console.log('PATCH successful:', response.data);
                            return response.data;
                        } catch (patchError) {
                            console.log('PATCH failed:', patchError.response?.status);
                            throw patchError;
                        }
                    }
                    throw putError;
                }
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete subscription feature category
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

    // Bulk delete subscription feature categories
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search subscription feature categories
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default subscriptionFeatureCategoryService;