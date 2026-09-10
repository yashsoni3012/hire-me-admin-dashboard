// import api from './axiosInstance';
// import { storage } from '../utils/storage';

// const BASE_URL = '/subscription-transactions';

// // Helper function to get current user ID
// const getCurrentUserId = () => {
//     try {
//         const userStr = localStorage.getItem('user');
//         if (userStr) {
//             const user = JSON.parse(userStr);
//             return user?.id || null;
//         }
//         const user = storage.getUser();
//         return user?.id || user?.userId || user?._id || null;
//     } catch (error) {
//         console.error('Error getting user ID:', error);
//         return null;
//     }
// };

// export const subscriptionTransactionService = {
//     // Get all subscription transactions with pagination and search
//     getAll: async (params = {}) => {
//         try {
//             const response = await api.get(BASE_URL, { params });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get single subscription transaction by ID
//     getById: async (id) => {
//         try {
//             const response = await api.get(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return null;
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Create new subscription transaction
//     create: async (data) => {
//         try {
//             const userId = getCurrentUserId();

//             const submitData = {
//                 base_price: data.base_price || 0,
//                 discount: data.discount || 0,
//                 gst: data.gst || 0,
//                 final_amount: data.final_amount || 0,
//                 payment_gateway: data.payment_gateway || 'Razorpay',
//                 payment_status: data.payment_status || 'Success',
//                 invoice_no: data.invoice_no || '',
//                 payment_response: data.payment_response || '',
//                 payment_reference: data.payment_reference || '',
//                 gateway_order_id: data.gateway_order_id || '',
//                 is_status: data.is_status !== undefined ? data.is_status : true,
//                 created_by: userId || 1,
//                 updated_by: userId || 1
//             };

//             console.log('Creating subscription transaction with data:', submitData);
//             const response = await api.post(BASE_URL, submitData);
//             return response.data;
//         } catch (error) {
//             console.error('Create error:', error.response?.data);
//             throw error.response?.data || error.message;
//         }
//     },

//     // Update subscription transaction
//     update: async (id, data) => {
//         try {
//             const userId = getCurrentUserId();

//             const submitData = {
//                 base_price: data.base_price || 0,
//                 discount: data.discount || 0,
//                 gst: data.gst || 0,
//                 final_amount: data.final_amount || 0,
//                 payment_gateway: data.payment_gateway || 'Razorpay',
//                 payment_status: data.payment_status || 'Success',
//                 invoice_no: data.invoice_no || '',
//                 payment_response: data.payment_response || '',
//                 payment_reference: data.payment_reference || '',
//                 gateway_order_id: data.gateway_order_id || '',
//                 is_status: data.is_status !== undefined ? data.is_status : true,
//                 updated_by: userId || 1
//             };

//             console.log('Updating subscription transaction with data:', submitData);
//             console.log('Update URL:', `${BASE_URL}/${id}`);

//             let response;
//             try {
//                 response = await api.put(`${BASE_URL}/${id}`, submitData);
//                 console.log('PUT successful:', response.data);
//                 return response.data;
//             } catch (putError) {
//                 console.log('PUT failed with status:', putError.response?.status);

//                 if (putError.response?.status === 404 || putError.response?.status === 405) {
//                     try {
//                         response = await api.patch(`${BASE_URL}/${id}`, submitData);
//                         console.log('PATCH successful:', response.data);
//                         return response.data;
//                     } catch (patchError) {
//                         console.log('PATCH failed:', patchError.response?.status);
//                         throw patchError;
//                     }
//                 }
//                 throw putError;
//             }
//         } catch (error) {
//             console.error('Update error:', error);
//             throw error.response?.data || error.message;
//         }
//     },

//     // Delete subscription transaction
//     delete: async (id) => {
//         try {
//             const response = await api.delete(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return { success: true, message: 'Item already deleted' };
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Bulk delete subscription transactions
//     deleteMany: async (ids) => {
//         try {
//             const response = await api.delete(BASE_URL, { data: { ids } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Search subscription transactions
//     search: async (query) => {
//         try {
//             const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     }
// };

// export default subscriptionTransactionService;


import api from './axiosInstance';

const BASE_URL = '/subscription-transactions';

export const subscriptionTransactionService = {
    // Get all subscription transactions with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single subscription transaction by ID
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

    // Search subscription transactions
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default subscriptionTransactionService;