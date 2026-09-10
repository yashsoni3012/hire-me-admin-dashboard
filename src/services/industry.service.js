  import api from './axiosInstance';
  import { storage } from '../utils/storage';

  const BASE_URL = '/industry';

  // Helper function to generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

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

  export const industryService = {
    // Get all industries with pagination and search
    getAll: async (params = {}) => {
      try {
        const response = await api.get(BASE_URL, { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single industry by ID
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

    // Create new industry with icon support
    create: async (data) => {
      try {
        const userId = getCurrentUserId();

        // Handle status - convert to boolean
        let statusValue = true;
        if (data.status === 'inactive' || data.status === false) {
          statusValue = false;
        } else if (data.status === 'active' || data.status === true) {
          statusValue = true;
        }

        // Check if we have a file to upload
        const hasIconFile = data.iconFile && data.iconFile instanceof File;

        let response;

        if (hasIconFile) {
          // Use FormData for file upload
          console.log('Creating industry with icon file upload');
          const formData = new FormData();
          formData.append('name', data.name ? data.name.trim() : '');
          formData.append('description', data.description?.trim() || '');
          formData.append('is_trending', data.is_trending || false);
          formData.append('is_status', statusValue);
          formData.append('created_by', userId || 1);
          formData.append('updated_by', userId || 1);
          formData.append('slug', generateSlug(data.name));
          formData.append('icon', data.iconFile);

          response = await api.post(BASE_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          // Use JSON for no file
          console.log('Creating industry without file');
          const submitData = {
            name: data.name ? data.name.trim() : '',
            description: data.description?.trim() || '',
            slug: generateSlug(data.name),
            is_trending: data.is_trending || false,
            is_status: statusValue,
            created_by: userId || 1,
          };

          // If there's an icon URL, include it
          if (data.icon && typeof data.icon === 'string') {
            submitData.icon = data.icon;
          }

          response = await api.post(BASE_URL, submitData);
        }

        return response.data;
      } catch (error) {
        console.error('Create error:', error.response?.data);
        throw error.response?.data || error.message;
      }
    },

    // Update industry - FIXED for image upload
    update: async (id, data) => {
      try {
        const userId = getCurrentUserId();

        // Handle status - convert to boolean
        let statusValue = true;
        if (data.status === 'inactive' || data.status === false) {
          statusValue = false;
        } else if (data.status === 'active' || data.status === true) {
          statusValue = true;
        }

        // Check if we have a NEW file to upload
        const hasIconFile = data.iconFile && data.iconFile instanceof File;

        // First, try to update without the image (for non-image updates)
        // This handles the case when user just updates text fields
        if (!hasIconFile) {
          console.log('Updating industry without new image');
          const submitData = {
            name: data.name ? data.name.trim() : '',
            description: data.description?.trim() || '',
            slug: generateSlug(data.name),
            is_trending: data.is_trending !== undefined ? data.is_trending : false,
            is_status: statusValue,
            updated_by: userId || 1
          };

          // If there's an existing icon URL, keep it
          if (data.icon && typeof data.icon === 'string') {
            submitData.icon = data.icon;
          }

          try {
            const response = await api.put(`${BASE_URL}/${id}`, submitData);
            console.log('PUT successful (no image):', response.data);
            return response.data;
          } catch (putError) {
            console.log('PUT failed with status:', putError.response?.status);

            // Try PATCH as fallback
            if (putError.response?.status === 404 || putError.response?.status === 405) {
              try {
                const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                console.log('PATCH successful (no image):', response.data);
                return response.data;
              } catch (patchError) {
                console.log('PATCH failed:', patchError.response?.status);
                throw patchError;
              }
            }
            throw putError;
          }
        }

        // If we have a new image, use FormData for upload
        console.log('Updating industry with new image upload');
        const formData = new FormData();
        formData.append('name', data.name ? data.name.trim() : '');
        formData.append('description', data.description?.trim() || '');
        formData.append('is_trending', data.is_trending !== undefined ? data.is_trending : false);
        formData.append('is_status', statusValue);
        formData.append('updated_by', userId || 1);
        formData.append('slug', generateSlug(data.name));

        // Add the new image file
        if (hasIconFile) {
          formData.append('icon', data.iconFile);
        }

        // Try PUT with FormData
        try {
          console.log('Attempting PUT with FormData...');
          const response = await api.put(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('PUT with FormData successful:', response.data);
          return response.data;
        } catch (putError) {
          console.log('PUT with FormData failed with status:', putError.response?.status);

          // If PUT fails, try POST to a different endpoint
          if (putError.response?.status === 404 || putError.response?.status === 405) {
            try {
              // Try alternative endpoints
              const altEndpoints = [
                `${BASE_URL}/update/${id}`,
                `${BASE_URL}/edit/${id}`,
                `/industries/${id}`,
                `/industry/update/${id}`,
              ];

              for (const endpoint of altEndpoints) {
                try {
                  console.log(`Trying alternative endpoint: ${endpoint}`);
                  const response = await api.post(endpoint, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  console.log(`Alternative endpoint ${endpoint} successful:`, response.data);
                  return response.data;
                } catch (altError) {
                  console.log(`Alternative endpoint ${endpoint} failed:`, altError.response?.status);
                }
              }

              // If all alternatives fail, try PATCH with FormData
              try {
                console.log('Attempting PATCH with FormData...');
                const response = await api.patch(`${BASE_URL}/${id}`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log('PATCH with FormData successful:', response.data);
                return response.data;
              } catch (patchError) {
                console.log('PATCH with FormData failed:', patchError.response?.status);
                throw patchError;
              }
            } catch (error) {
              throw error;
            }
          }
          throw putError;
        }
      } catch (error) {
        console.error('Update error:', error);
        console.error('Error response:', error.response?.data);
        throw error.response?.data || error.message;
      }
    },

    // Delete industry
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

    // Bulk delete industries
    deleteMany: async (ids) => {
      try {
        const response = await api.delete(BASE_URL, { data: { ids } });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Search industries
    search: async (query) => {
      try {
        const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  };

  export default industryService;