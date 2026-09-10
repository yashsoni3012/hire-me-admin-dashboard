// services/experienceLevel.service.js
import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/experience-levels";

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

export const experienceLevelService = {
  // ─── Get all experience levels ──────────────────────────────────
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      // Return the full response so components can access response.data
      return response;
    } catch (error) {
      console.error("GetAll error:", error);
      throw error.response?.data || error.message;
    }
  },

  // ─── Get single experience level by ID ──────────────────────────
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      // Return the full response so components can access response.data
      return response;
    } catch (error) {
      console.error("GetById error:", error);
      if (error.response?.status === 404) {
        return { data: null };
      }
      throw error.response?.data || error.message;
    }
  },

  // ─── Create new experience level ─────────────────────────────────
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      // Handle status - convert to boolean
      let statusValue = true;
      if (data.status === 'inactive' || data.status === false || data.status === 0) {
        statusValue = false;
      } else if (data.status === 'active' || data.status === true || data.status === 1) {
        statusValue = true;
      }

      const submitData = {
        name: data.name ? data.name.trim() : '',
        min_year: parseInt(data.min_year) || 0,
        max_year: parseInt(data.max_year) || 1,
        is_trending: data.is_trending || false,
        is_status: statusValue,
        created_by: userId || 1
      };

      console.log("Creating experience level with data:", submitData);
      const response = await api.post(BASE_URL, submitData);
      return response;
    } catch (error) {
      console.error("Create error:", error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // ─── Update experience level ─────────────────────────────────────
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      // Handle status - convert to boolean
      let statusValue = true;
      if (data.status === 'inactive' || data.status === false || data.status === 0) {
        statusValue = false;
      } else if (data.status === 'active' || data.status === true || data.status === 1) {
        statusValue = true;
      }

      // Also check if is_status is provided directly
      if (data.is_status !== undefined) {
        statusValue = data.is_status === true || data.is_status === 1 || data.is_status === "true";
      }

      const submitData = {
        name: data.name ? data.name.trim() : '',
        min_year: parseInt(data.min_year) || 0,
        max_year: parseInt(data.max_year) || 1,
        is_trending: data.is_trending || false,
        is_status: statusValue,
        updated_by: userId || 1
      };

      console.log("Updating experience level with data:", submitData);
      console.log("Update URL:", `${BASE_URL}/${id}`);

      let response;
      try {
        // Try PUT first
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log('✅ PUT successful');
        return response;
      } catch (putError) {
        console.log('PUT failed:', putError.response?.status);
        // If PUT fails with 404 or 405, try PATCH
        if (putError.response?.status === 404 || putError.response?.status === 405) {
          console.log('Trying PATCH...');
          try {
            response = await api.patch(`${BASE_URL}/${id}`, submitData);
            console.log('✅ PATCH successful');
            return response;
          } catch (patchError) {
            console.log('PATCH failed:', patchError.response?.status);
            // If PATCH fails with 404, try alternative URLs
            if (patchError.response?.status === 404) {
              console.log('Trying alternative URLs...');

              const alternativeUrls = [
                `/experience-level/${id}`,
                `/api/experience-levels/${id}`,
                `/api/experience-level/${id}`,
              ];

              let lastError = patchError;

              for (const url of alternativeUrls) {
                try {
                  console.log(`Trying alternative URL: ${url}`);
                  response = await api.patch(url, submitData);
                  console.log(`✅ Success with URL: ${url}`);
                  return response;
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
      console.error("Update error:", error);
      throw error.response?.data || error.message;
    }
  },

  // ─── Delete experience level ─────────────────────────────────────
  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 404) {
        return { data: { success: true, message: 'Item already deleted' } };
      }
      throw error.response?.data || error.message;
    }
  },

  // ─── Bulk delete experience levels ──────────────────────────────
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response;
    } catch (error) {
      console.error("DeleteMany error:", error);
      throw error.response?.data || error.message;
    }
  },

  // ─── Search experience levels ────────────────────────────────────
  search: async (query) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, {
        params: { q: query },
      });
      return response;
    } catch (error) {
      console.error("Search error:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default experienceLevelService;