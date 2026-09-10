
// import api from "./api";

// const API_URL = "/company-sizes";

// export const companySizeService = {
//   // Get all company sizes
//   getAll: async (params = {}) => {
//     const response = await api.get(API_URL, { params });
//     return response.data;
//   },


//   getById: async (id) => {
//     const response = await api.get(`${API_URL}/${id}`);
//     return response.data;
//   },

//   // Create company size
//   create: async (data) => {
//     const response = await api.post(API_URL, data);
//     return response.data;
//   },

//   // Update company size
//   update: async (id, data) => {
//     const response = await api.put(`${API_URL}/${id}`, data);
//     return response.data;
//   },

//   // Delete company size
//   delete: async (id) => {
//     const response = await api.delete(`${API_URL}/${id}`);
//     return response.data;
//   },
// };
// services/companySize.service.js
import api from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://apidata.hiremejobs.in';

// Helper: Get current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || 1;
  } catch {
    return 1;
  }
};

export const companySizeService = {
  // Get all company sizes
  getAll: async (params = {}) => {
    const response = await api.get('/company-sizes', { params });
    return response.data;
  },

  // Get single company size
  getById: async (id) => {
    const response = await api.get(`/company-sizes/${id}`);
    return response.data;
  },

  // Create company size
  create: async (data) => {
    const userId = getCurrentUserId();
    const payload = {
      ...data,
      created_by: userId,
    };
    const response = await api.post('/company-sizes', payload);
    return response.data;
  },

  // Update company size
  update: async (id, data) => {
    const userId = getCurrentUserId();
    const payload = {
      ...data,
      updated_by: userId,
    };
    const response = await api.put(`/company-sizes/${id}`, payload);
    return response.data;
  },

  // Delete company size
  delete: async (id) => {
    const response = await api.delete(`/company-sizes/${id}`);
    return response.data;
  },

  // Toggle status
  toggleStatus: async (id, status) => {
    const userId = getCurrentUserId();
    const response = await api.put(`/company-sizes/${id}`, {
      is_status: status,
      status: status,
      updated_by: userId,
    });
    return response.data;
  },

  // Toggle trending
  toggleTrending: async (id, isTrending) => {
    const userId = getCurrentUserId();
    const response = await api.put(`/company-sizes/${id}`, {
      is_trending: isTrending,
      updated_by: userId,
    });
    return response.data;
  },
};