import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/subscription-renewal-logs';

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

export const subscriptionRenewalLogService = {
  // Get all subscription renewal logs
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single renewal log by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error.response?.data || error.message;
    }
  },

  // ✅ CREATE with proper field mapping
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        company_subscription_id: parseInt(data.company_subscription_id),
        renewal_type: data.renewal_type || "",
        old_plan: data.old_plan || "",
        new_plan: data.new_plan || "",
        old_expiry: data.old_expiry || null,
        new_expiry: data.new_expiry || null,
        amount: parseFloat(data.amount) || 0,
        status: data.status === true || data.status === 'active' || data.status === 1,
        created_by: userId || 1,
        updated_by: userId || 1
      };

      console.log('📤 Creating renewal log with data:', submitData);
      const response = await api.post(BASE_URL, submitData);
      console.log('✅ Create successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // ✅ UPDATE with proper field mapping
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        company_subscription_id: parseInt(data.company_subscription_id),
        renewal_type: data.renewal_type || "",
        old_plan: data.old_plan || "",
        new_plan: data.new_plan || "",
        old_expiry: data.old_expiry || null,
        new_expiry: data.new_expiry || null,
        amount: parseFloat(data.amount) || 0,
        status: data.status === true || data.status === 'active' || data.status === 1,
        updated_by: userId || 1
      };

      console.log('📤 Updating renewal log with data:', submitData);

      let response;
      try {
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log('✅ PUT successful');
        return response.data;
      } catch (putError) {
        console.log('PUT failed with status:', putError.response?.status);
        if (putError.response?.status === 404 || putError.response?.status === 405) {
          console.log('Trying PATCH...');
          try {
            response = await api.patch(`${BASE_URL}/${id}`, submitData);
            console.log('✅ PATCH successful');
            return response.data;
          } catch (patchError) {
            console.log('PATCH failed:', patchError.response?.status);
            throw patchError;
          }
        }
        throw putError;
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete subscription renewal log
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

  // Bulk delete subscription renewal logs
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get renewal logs by company subscription ID
  getByCompanySubscriptionId: async (companySubscriptionId) => {
    try {
      const response = await api.get(`${BASE_URL}/company-subscription/${companySubscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get renewal logs by company ID
  getByCompanyId: async (companyId) => {
    try {
      const response = await api.get(`${BASE_URL}/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get renewal logs by renewal type
  getByRenewalType: async (renewalType) => {
    try {
      const response = await api.get(`${BASE_URL}/type/${renewalType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get renewal logs by date range
  getByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(BASE_URL, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default subscriptionRenewalLogService;