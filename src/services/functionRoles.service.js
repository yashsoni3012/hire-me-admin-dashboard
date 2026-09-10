import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/function-roles';

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


export const functionRolesService = {
    // Get all function roles with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single function role by ID
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

    // Get function roles by role category ID
    getByRoleCategoryId: async (roleCategoryId) => {
        try {
            const endpoints = [
                `${BASE_URL}/role-category/${roleCategoryId}`,
                `${BASE_URL}?roles_category_id=${roleCategoryId}`,
                `${BASE_URL}?roleCategoryId=${roleCategoryId}`,
                `/function-role-category/${roleCategoryId}/roles`,
            ];

            let response;
            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying to fetch function roles with endpoint: ${endpoint}`);
                    response = await api.get(endpoint);
                    if (response.data) {
                        return response.data;
                    }
                } catch (err) {
                    console.log(`Endpoint ${endpoint} failed:`, err.response?.status);
                }
            }

            console.warn('Could not fetch function roles for role category ID:', roleCategoryId);
            return { data: [], results: [] };
        } catch (error) {
            console.error('Error fetching function roles by role category:', error);
            return { data: [], results: [] };
        }
    },

    // Create new function role
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                roles_category_id: parseInt(data.roles_category_id) || 0,
                is_trending: data.is_trending || false,
                status: statusValue,
                created_by: userId || 1,
            };

            console.log('Creating function role with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update function role
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            // Handle status - convert to boolean
            let statusValue = true;
            if (data.status === 'inactive' || data.status === false) {
                statusValue = false;
            } else if (data.status === 'active' || data.status === true) {
                statusValue = true;
            }

            const submitData = {
                name: data.name ? data.name.trim() : '',
                roles_category_id: parseInt(data.roles_category_id) || 0,
                is_trending: data.is_trending !== undefined ? data.is_trending : false,
                status: statusValue,
                updated_by: userId || 1
            };

            console.log('Updating function role with data:', submitData);
            console.log('Update URL:', `${BASE_URL}/${id}`);

            let response;
            try {
                response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('PUT successful:', response.data);
                return response.data;
            } catch (putError) {
                console.log('PUT failed with status:', putError.response?.status);

                if (putError.response?.status === 404) {
                    console.log('PUT not supported, trying PATCH...');
                    try {
                        response = await api.patch(`${BASE_URL}/${id}`, submitData);
                        console.log('PATCH successful:', response.data);
                        return response.data;
                    } catch (patchError) {
                        console.log('PATCH failed with status:', patchError.response?.status);
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

    // Delete function role
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

    // Bulk delete function roles
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search function roles
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default functionRolesService;