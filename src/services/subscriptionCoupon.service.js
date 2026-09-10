import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/subscription-coupons';

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

// Coerce any incoming representation to a real boolean
const toStatusBool = (value) => {
  if (value === 'inactive' || value === false || value === 0 || value === '0') return false;
  return true;
};

const toTrendingBool = (value) => {
  return value === true || value === 1 || value === 'true' || value === '1';
};

export const subscriptionCouponService = {
  // Get all subscription coupons
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single coupon by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error.response?.data || error.message;
    }
  },

  // Create new subscription coupon
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        coupon_code: data.coupon_code?.trim().toUpperCase() || "",
        title: data.title?.trim() || "",
        discount_type: data.discount_type || "percentage",
        discount_value: parseFloat(data.discount_value) || 0,
        minimum_amount: parseFloat(data.minimum_amount) || 0,
        max_discount: data.max_discount ? parseFloat(data.max_discount) : null,
        valid_from: data.valid_from || null,
        valid_to: data.valid_to || null,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        per_company_limit: parseInt(data.per_company_limit) || 1,
        status: toStatusBool(data.status),
        is_trending: toTrendingBool(data.is_trending),
        created_by: userId || 1
      };

      console.log('Creating subscription coupon with data:', submitData);
      const response = await api.post(BASE_URL, submitData);
      return response.data;
    } catch (error) {
      console.error('Create error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Update subscription coupon with PUT/PATCH fallback
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        coupon_code: data.coupon_code?.trim().toUpperCase() || "",
        title: data.title?.trim() || "",
        discount_type: data.discount_type || "percentage",
        discount_value: parseFloat(data.discount_value) || 0,
        minimum_amount: parseFloat(data.minimum_amount) || 0,
        max_discount: data.max_discount ? parseFloat(data.max_discount) : null,
        valid_from: data.valid_from || null,
        valid_to: data.valid_to || null,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        per_company_limit: parseInt(data.per_company_limit) || 1,
        status: toStatusBool(data.status),
        is_trending: toTrendingBool(data.is_trending),
        updated_by: userId || 1
      };

      console.log('Updating subscription coupon with data:', submitData);
      console.log('Update URL:', `${BASE_URL}/${id}`);

      let response;
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
                `/subscription-coupon/${id}`,
                `/api/subscription-coupons/${id}`,
                `/api/subscription-coupon/${id}`,
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
    } catch (error) {
      console.error('Update error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete subscription coupon
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

  // Bulk delete subscription coupons
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search subscription coupons
  search: async (query) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Validate coupon
  validate: async (code, amount) => {
    try {
      const response = await api.post(`${BASE_URL}/validate`, { code, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default subscriptionCouponService;