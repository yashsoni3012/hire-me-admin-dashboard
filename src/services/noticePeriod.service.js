import api from "./api";

const API_URL = "/notice-periods";

export const noticePeriodService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // Update with multiple fallback methods
  update: async (id, data) => {
    try {
      // Try PUT first (most common)
      const response = await api.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      // If PUT fails with 404, try POST
      if (error.response?.status === 404) {
        console.log('PUT failed, trying POST...');
        try {
          const response = await api.post(`${API_URL}/${id}`, data);
          return response.data;
        } catch (postError) {
          // If POST fails, try PATCH as last resort
          console.log('POST failed, trying PATCH...');
          const response = await api.patch(`${API_URL}/${id}`, data);
          return response.data;
        }
      }
      throw error;
    }
  },

  delete: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default noticePeriodService;