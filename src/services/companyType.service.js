
import api from "./api";

const API_URL = "/company-types";

export const companyTypeService = {
  // Get all company types
  getAll: async (params = {}) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  // Get single company type
  getById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create company type
  create: async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  // Update company type
  update: async (id, data) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // Delete company type
  delete: async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  },
};