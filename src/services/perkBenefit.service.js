import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/perk-benefit';

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

export const perkBenefitService = {
    // Get all perk benefits with pagination and search
    // getAll: async (params = {}) => {
    //     try {
    //         const response = await api.get(BASE_URL, { params });
    //         return response.data;
    //     } catch (error) {
    //         throw error.response?.data || error.message;
    //     }
    // },

    // Get ALL perk benefits from all API pages
    getAll: async (params = {}) => {
        try {
            const allData = [];
            let page = 1;

            while (true) {
                const response = await api.get(BASE_URL, {
                    params: {
                        ...params,
                        page,
                    },
                });

                const responseData = response.data;

                // Get current page data
                const pageData =
                    responseData?.data?.data ||
                    responseData?.data?.results ||
                    responseData?.data ||
                    responseData?.results ||
                    [];

                if (Array.isArray(pageData)) {
                    allData.push(...pageData);
                }

                // Get pagination information
                const pagination = responseData?.pagination;

                // Stop if there is no next page
                if (!pagination?.links?.next || page >= pagination.totalPages) {
                    break;
                }

                page++;
            }

            // Return in the same structure your existing frontend expects
            return {
                success: true,
                message: "Perk Benefits fetched successfully",
                data: allData,
                pagination: {
                    total: allData.length,
                    page: 1,
                    limit: allData.length,
                    totalPages: 1,
                },
            };

        } catch (error) {
            console.error("Get all perk benefits error:", error);
            throw error.response?.data || error.message;
        }
    },

    // Get single perk benefit by ID
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

    // Get perk benefits by category ID
    getByCategoryId: async (categoryId) => {
        try {
            const response = await api.get(`${BASE_URL}/perk-benefit-category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new perk benefit
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

            const submitData = {
                name: data.name ? data.name.trim() : '',
                category_id: parseInt(data.category_id) || 0,
                is_trending: data.is_trending || false,
                is_status: statusValue,
                created_by: userId || 1,
            };

            console.log('Creating perk benefit with data:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update perk benefit
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

            // Only include category_id if it has a valid value
            const categoryId = data.category_id && data.category_id !== '' ? parseInt(data.category_id) : undefined;

            const submitData = {
                name: data.name ? data.name.trim() : '',
                is_trending: data.is_trending !== undefined ? data.is_trending : false,
                is_status: statusValue,
                updated_by: userId || 1
            };

            // Only add category_id if it exists
            if (categoryId && categoryId > 0) {
                submitData.category_id = categoryId;
            }

            console.log('Updating perk benefit with data:', submitData);
            console.log('Update URL:', `${BASE_URL}/${id}`);

            let response;
            try {
                response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('PUT successful:', response.data);
                return response.data;
            } catch (putError) {
                console.log('PUT failed with status:', putError.response?.status);

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
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete perk benefit
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

    // Bulk delete perk benefits
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search perk benefits
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default perkBenefitService;