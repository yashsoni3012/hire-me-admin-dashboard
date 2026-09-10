import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/job-sub-categories';

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        // Try to get user from localStorage directly
        const userStr = localStorage.getItem('user');
        console.log('Raw user from localStorage:', userStr); // Debug log

        if (userStr) {
            const user = JSON.parse(userStr);
            console.log('Parsed user:', user); // Debug log

            // Get user ID from the user object
            const userId = user?.id || null;
            console.log('User ID:', userId); // Debug log

            return userId;
        }

        // Fallback: try storage utility
        const user = storage.getUser();
        if (user) {
            console.log('User from storage utility:', user);
            return user?.id || user?.userId || user?._id || null;
        }

        return null;
    } catch (error) {
        console.error('Error getting user ID from localStorage:', error);
        return null;
    }
};


export const jobSubCategoryService = {
    // Get all job sub categories with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single job sub category by ID
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

    // Get job sub categories by category ID
    getByCategoryId: async (categoryId) => {
        try {
            const endpoints = [
                `${BASE_URL}/job-category/${categoryId}`,
                `${BASE_URL}/category/${categoryId}`,
                `${BASE_URL}?category_id=${categoryId}`,
                `/job-sub-category/category/${categoryId}`,
                `/job-sub-category?category_id=${categoryId}`,
            ];

            let response;
            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying to fetch sub-categories with endpoint: ${endpoint}`);
                    response = await api.get(endpoint);
                    if (response.data) {
                        return response.data;
                    }
                } catch (err) {
                    console.log(`Endpoint ${endpoint} failed:`, err.response?.status);
                }
            }

            console.warn('Could not fetch sub-categories for category ID:', categoryId);
            return { data: [], results: [] };
        } catch (error) {
            console.error('Error fetching sub-categories by category:', error);
            return { data: [], results: [] };
        }
    },

    // Create new job sub category
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = true;
            if (data.is_status === 'inactive' || data.is_status === false) {
                statusValue = false;
            } else if (data.is_status === 'active' || data.is_status === true) {
                statusValue = true;
            }

            // Check if we have files to upload
            const hasIconFile = data.iconFile && data.iconFile instanceof File;
            const hasImageFile = data.imageFile && data.imageFile instanceof File;

            let response;

            if (hasIconFile || hasImageFile) {
                // Use FormData for file uploads
                console.log('Creating job sub category with file upload');
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('category_id', parseInt(data.category_id) || 0);
                formData.append('is_trending', data.is_trending || false);
                formData.append('is_status', statusValue);
                formData.append('created_by', userId || 1);
                formData.append('updated_by', userId || 1);

                if (hasIconFile) {
                    formData.append('icon', data.iconFile);
                }
                if (hasImageFile) {
                    formData.append('image', data.imageFile);
                }

                response = await api.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Use JSON for no files
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    category_id: parseInt(data.category_id) || 0,
                    is_trending: data.is_trending || false,
                    is_status: statusValue,
                    created_by: userId || 1,
                };

                // Only add icon/image if they are strings
                if (data.icon && typeof data.icon === 'string') {
                    submitData.icon = data.icon;
                }
                if (data.image && typeof data.image === 'string') {
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

    // Update job sub category
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = true;
            if (data.is_status === 'inactive' || data.is_status === false) {
                statusValue = false;
            } else if (data.is_status === 'active' || data.is_status === true) {
                statusValue = true;
            }

            // Check if we have files to upload
            const hasIconFile = data.iconFile && data.iconFile instanceof File;
            const hasImageFile = data.imageFile && data.imageFile instanceof File;

            let response;

            if (hasIconFile || hasImageFile) {
                // Use FormData for file uploads
                console.log('Updating job sub category with file upload');
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('category_id', parseInt(data.category_id) || 0);
                formData.append('is_trending', data.is_trending || false);
                formData.append('is_status', statusValue);
                formData.append('updated_by', userId || 1);

                if (hasIconFile) {
                    formData.append('icon', data.iconFile);
                }
                if (hasImageFile) {
                    formData.append('image', data.imageFile);
                }

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
                // Use JSON for no files
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    category_id: parseInt(data.category_id) || 0,
                    is_trending: data.is_trending !== undefined ? data.is_trending : false,
                    is_status: statusValue,
                    updated_by: userId || 1
                };

                // Only add icon/image if they are strings
                if (data.icon && typeof data.icon === 'string') {
                    submitData.icon = data.icon;
                }
                if (data.image && typeof data.image === 'string') {
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

    // Delete job sub category
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

    // Bulk delete job sub categories
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search job sub categories
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default jobSubCategoryService;