import api from "./axiosInstance";
const BASE_URL = "/company-faq";


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

export const companyFaqService = {
    // Get all FAQs
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single FAQ
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

    // Create FAQ
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                question: data.question ? data.question.trim() : '',
                answer: data.answer ? data.answer.trim() : '',
                order: parseInt(data.order) || 0,
                is_trending: data.is_trending || false,
                is_status: data.is_status !== undefined ? data.is_status : true,
                created_by: userId || 1,
            };

            console.log('📤 Creating Company FAQ:', submitData);
            const response = await api.post(BASE_URL, submitData);
            console.log('✅ Company FAQ created successfully');
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update FAQ
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                question: data.question ? data.question.trim() : '',
                answer: data.answer ? data.answer.trim() : '',
                order: parseInt(data.order) || 0,
                is_trending: data.is_trending || false,
                is_status: data.is_status !== undefined ? data.is_status : true,
                updated_by: userId || 1,
            };

            console.log(`📤 Updating Company FAQ ID ${id}:`, submitData);

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

    // Delete FAQ
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
export default companyFaqService;