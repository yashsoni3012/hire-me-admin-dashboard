// services/companyTestimonial.service.js
import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/company-testimonials";

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

export const companyTestimonialService = {
  // Get all testimonials with pagination and search
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single testimonial by ID
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

  // Create new testimonial with image support
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      // Check if we have a file to upload
      const hasImageFile = data.imageFile && data.imageFile instanceof File;

      if (hasImageFile) {
        // Use FormData for file upload
        console.log('📤 Creating testimonial with image file upload');
        const formData = new FormData();
        formData.append('name', data.name ? data.name.trim() : '');
        formData.append('email', data.email ? data.email.trim() : '');
        formData.append('description', data.description ? data.description.trim() : '');
        formData.append('rating', parseFloat(data.rating) || 0);
        formData.append('is_status', data.is_status !== undefined ? data.is_status : true);
        formData.append('created_by', userId || 1);
        formData.append('image', data.imageFile);

        const response = await api.post(BASE_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('✅ Create with image successful');
        return response.data;
      }

      // No file - use JSON
      const submitData = {
        name: data.name ? data.name.trim() : '',
        email: data.email ? data.email.trim() : '',
        description: data.description ? data.description.trim() : '',
        rating: parseFloat(data.rating) || 0,
        is_status: data.is_status !== undefined ? data.is_status : true,
        created_by: userId || 1,

      };

      // Only add image if it's a string and not null/undefined
      if (data.image && typeof data.image === 'string' &&
        data.image.trim() !== '' && data.image !== 'null' &&
        !data.image.startsWith('data:image')) {
        submitData.image = data.image;
      }

      console.log('📤 Creating testimonial with:', submitData);
      const response = await api.post(BASE_URL, submitData);
      console.log('✅ Create successful');
      return response.data;

    } catch (error) {
      console.error('Create error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Update testimonial with image support
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      // Check if we have a file to upload
      const hasImageFile = data.imageFile && data.imageFile instanceof File;

      if (hasImageFile) {
        // Use FormData for file upload
        console.log('📤 Updating testimonial with image file upload');
        const formData = new FormData();
        formData.append('name', data.name ? data.name.trim() : '');
        formData.append('email', data.email ? data.email.trim() : '');
        formData.append('description', data.description ? data.description.trim() : '');
        formData.append('rating', parseFloat(data.rating) || 0);
        formData.append('is_status', data.is_status !== undefined ? data.is_status : true);
        formData.append('updated_by', userId || 1);
        formData.append('image', data.imageFile);

        try {
          const response = await api.put(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('✅ PUT with image successful');
          return response.data;
        } catch (putError) {
          console.log('PUT with image failed, trying PATCH...');
          const response = await api.patch(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('✅ PATCH with image successful');
          return response.data;
        }
      }

      // No file - use JSON
      const submitData = {
        name: data.name ? data.name.trim() : '',
        email: data.email ? data.email.trim() : '',
        description: data.description ? data.description.trim() : '',
        rating: parseFloat(data.rating) || 0,
        is_status: data.is_status !== undefined ? data.is_status : true,
        updated_by: userId || 1
      };

      // Handle image: null = remove, string = keep existing
      if (data.image === null) {
        submitData.image = null;
      } else if (data.image && typeof data.image === 'string' &&
        data.image.trim() !== '' && data.image !== 'null' &&
        !data.image.startsWith('data:image')) {
        submitData.image = data.image;
      }

      console.log('📤 Updating testimonial with:', submitData);
      console.log('🔗 Update URL:', `${BASE_URL}/${id}`);

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

  // Delete testimonial
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

  // Bulk delete testimonials
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search testimonials
  search: async (query) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default companyTestimonialService;