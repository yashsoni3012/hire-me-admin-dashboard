import api from "./axiosInstance";

const BASE_URL = "/salary-dropdown-options";

const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user?.id || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

export const salaryService = {
    // Get all salary options
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single salary option
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

    // Create salary option
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                label: data.label ? data.label.trim() : '',
                amount: data.amount ? parseFloat(data.amount) : 0,
                display_order: data.display_order ? parseInt(data.display_order) : 0,
                status: data.status !== undefined ? data.status : 1,
                created_by: userId || 1,
            };

            console.log('📤 Creating Salary Option:', submitData);
            const response = await api.post(BASE_URL, submitData);
            console.log('✅ Salary option created successfully');
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update salary option
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                label: data.label ? data.label.trim() : '',
                amount: data.amount ? parseFloat(data.amount) : 0,
                display_order: data.display_order ? parseInt(data.display_order) : 0,
                status: data.status !== undefined ? data.status : 1,
                updated_by: userId || 1,
            };

            console.log(`📤 Updating Salary Option ID ${id}:`, submitData);

            try {
                const response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('✅ PUT successful');
                return response.data;
            } catch (putError) {
                console.log('PUT failed, trying PATCH...');
                const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                console.log('✅ PATCH successful');
                return response.data;
            }
        } catch (error) {
            console.error('Update error:', error);
            throw error.response?.data || error.message;
        }
    },

    // Delete salary option
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
};

export default salaryService;