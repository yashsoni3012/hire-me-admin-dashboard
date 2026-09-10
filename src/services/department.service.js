import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/departments';

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

export const departmentService = {
    // Get all departments with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single department by ID
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

    // Create new department
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

            // Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            // Check if we have a file to upload
            const hasImageFile = data.iconFile && data.iconFile instanceof File;

            let response;

            if (hasImageFile) {
                // Use FormData for file upload
                console.log('Creating department with image file upload');
                const formData = new FormData();
                formData.append('department_name', data.department_name ? data.department_name.trim() : '');
                formData.append('status', statusValue); // Changed from is_status to status
                formData.append('is_trending', trendingValue);
                formData.append('created_by', userId || null);
                formData.append('icon', data.iconFile);

                response = await api.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Use JSON for no file
                console.log('Creating department without file');
                const submitData = {
                    department_name: data.department_name ? data.department_name.trim() : '',
                    status: statusValue, // Changed from is_status to status
                    is_trending: trendingValue,
                    created_by: userId || null
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

    // Update department with PUT/PATCH fallback
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

            // Convert is_trending to integer (0 or 1)
            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            // Check if we have a file to upload
            const hasImageFile = data.iconFile && data.iconFile instanceof File;

            let response;

            if (hasImageFile) {
                // Use FormData for file upload
                console.log('Updating department with image file upload');
                const formData = new FormData();
                formData.append('department_name', data.department_name ? data.department_name.trim() : '');
                formData.append('status', statusValue); // Changed from is_status to status
                formData.append('is_trending', trendingValue);
                formData.append('updated_by', userId || null);
                formData.append('icon', data.iconFile);

                try {
                    response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    console.log('✅ PUT with FormData successful');
                    return response.data;
                } catch (putError) {
                    console.log('PUT with FormData failed:', putError.response?.status);
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        response = await api.patch(`${BASE_URL}/${id}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        console.log('✅ PATCH with FormData successful');
                        return response.data;
                    }
                    throw putError;
                }
            } else {
                // Use JSON for no file
                console.log('Updating department without file');
                const submitData = {
                    department_name: data.department_name ? data.department_name.trim() : '',
                    status: statusValue, // Changed from is_status to status
                    is_trending: trendingValue,
                    updated_by: userId || null
                };

                // Only add icon if it's a string and not null/undefined
                if (data.icon && typeof data.icon === 'string' && data.icon.trim() !== '' && data.icon !== 'null') {
                    submitData.icon = data.icon;
                }

                console.log('Update data:', submitData);
                console.log('Update URL:', `${BASE_URL}/${id}`);

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
                                    `/department/${id}`,
                                    `/api/departments/${id}`,
                                    `/api/department/${id}`,
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
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete department
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

    // Bulk delete departments
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search departments
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default departmentService;