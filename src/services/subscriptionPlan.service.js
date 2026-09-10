import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/subscription-plans";

// Helper function to get current user ID
const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.id || null;
    }
    const user = storage.getUser();
    return user?.id || user?.userId || user?._id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

// Coerce any incoming representation (bool, 'active'/'inactive', 1/0, '1'/'0') to a real boolean
const toStatusBool = (value) => {
  if (value === "inactive" || value === false || value === 0 || value === "0")
    return false;
  return true;
};

const toTrendingBool = (value) => {
  return value === true || value === 1 || value === "true" || value === "1";
};

// ─── FIX: Never hand-set "Content-Type: multipart/form-data" — it has no
// boundary and breaks the upload. Setting it to `undefined` clears any
// default JSON header from the axios instance and lets axios/the browser
// compute the correct header (with boundary) for this specific FormData body.
const multipartHeaders = { "Content-Type": undefined };

export const subscriptionPlanService = {
  // Get all subscription plans
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single plan by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error.response?.data || error.message;
    }
  },

  // Create new subscription plan (with or without file)
  create: async (data) => {
    try {
      // Check if we have a File object or FormData
      if (data instanceof FormData) {
        const userId = getCurrentUserId();
        data.append("created_by", userId || 1);

        const response = await api.post(BASE_URL, data, {
          headers: multipartHeaders,
        });
        return response.data;
      }

      // Check if data has iconFile (File object)
      if (data.iconFile && data.iconFile instanceof File) {
        const formData = new FormData();
        const userId = getCurrentUserId();

        const textFields = {
          plan_name: data.plan_name ? data.plan_name.trim() : "",
          plan_code: data.plan_code ? data.plan_code.trim().toUpperCase() : "",
          description: data.description ? data.description.trim() : "",
          plan_type: data.plan_type || "fixed",
          duration_days: parseInt(data.duration_days) || 30,
          price: parseFloat(data.price) || 0,
          gst_percentage: parseFloat(data.gst_percentage) || 18,
          display_order: parseInt(data.display_order) || 1,
          badge: data.badge ? data.badge.trim() : "",
          is_popular: toTrendingBool(data.is_popular),
          is_display_in_front:
            data.is_display_in_front !== undefined
              ? data.is_display_in_front
              : true,
          is_free_trial: toTrendingBool(data.is_free_trial),
          trial_days: data.is_free_trial ? parseInt(data.trial_days) || 7 : 0,
          button_text: data.button_text
            ? data.button_text.trim()
            : "Get Started",
          button_color: data.button_color || "#FFFFFF",
          background_color: data.background_color || "#2463EB",
          is_status: toStatusBool(data.status),
          created_by: userId || 1,
        };

        Object.keys(textFields).forEach((key) => {
          formData.append(key, textFields[key]);
        });

        formData.append("icon", data.iconFile);

        console.log("Creating subscription plan with file:", textFields);
        const response = await api.post(BASE_URL, formData, {
          headers: multipartHeaders,
        });
        return response.data;
      }

      // Regular JSON submission (no file)
      const userId = getCurrentUserId();

      const submitData = {
        plan_name: data.plan_name ? data.plan_name.trim() : "",
        plan_code: data.plan_code ? data.plan_code.trim().toUpperCase() : "",
        description: data.description ? data.description.trim() : "",
        plan_type: data.plan_type || "fixed",
        duration_days: parseInt(data.duration_days) || 30,
        price: parseFloat(data.price) || 0,
        gst_percentage: parseFloat(data.gst_percentage) || 18,
        display_order: parseInt(data.display_order) || 1,
        badge: data.badge ? data.badge.trim() : "",
        is_popular: toTrendingBool(data.is_popular),
        is_display_in_front:
          data.is_display_in_front !== undefined
            ? data.is_display_in_front
            : true,
        is_free_trial: toTrendingBool(data.is_free_trial),
        trial_days: data.is_free_trial ? parseInt(data.trial_days) || 7 : 0,
        button_text: data.button_text ? data.button_text.trim() : "Get Started",
        button_color: data.button_color || "#FFFFFF",
        background_color: data.background_color || "#2463EB",
        icon: data.icon || "",
        is_status: toStatusBool(data.status),
        created_by: userId || 1,
      };

      console.log("Creating subscription plan with data:", submitData);
      const response = await api.post(BASE_URL, submitData);
      return response.data;
    } catch (error) {
      console.error("Create error:", error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // ─── Update subscription plan ──────────────────────────────────────
  update: async (id, data) => {
    try {
      // Check if we have a File object or FormData (file upload handling)
      if (data instanceof FormData) {
        const userId = getCurrentUserId();
        data.append("updated_by", userId || 1);

        let response;
        try {
          response = await api.put(`${BASE_URL}/${id}`, data, {
            headers: multipartHeaders,
          });
          return response.data;
        } catch (putError) {
          response = await api.patch(`${BASE_URL}/${id}`, data, {
            headers: multipartHeaders,
          });
          return response.data;
        }
      }

      if (data.iconFile && data.iconFile instanceof File) {
        const formData = new FormData();
        const userId = getCurrentUserId();

        const textFields = {
          plan_name: data.plan_name ? data.plan_name.trim() : "",
          plan_code: data.plan_code ? data.plan_code.trim().toUpperCase() : "",
          description: data.description ? data.description.trim() : "",
          plan_type: data.plan_type || "fixed",
          duration_days: parseInt(data.duration_days) || 30,
          price: parseFloat(data.price) || 0,
          gst_percentage: parseFloat(data.gst_percentage) || 18,
          display_order: parseInt(data.display_order) || 1,
          badge: data.badge ? data.badge.trim() : "",
          is_popular: toTrendingBool(data.is_popular),
          is_display_in_front: data.is_display_in_front !== undefined ? data.is_display_in_front : true,
          is_free_trial: toTrendingBool(data.is_free_trial),
          trial_days: data.is_free_trial ? parseInt(data.trial_days) || 7 : 0,
          button_text: data.button_text ? data.button_text.trim() : "Get Started",
          button_color: data.button_color || "#FFFFFF",
          background_color: data.background_color || "#2463EB",
          is_status: data.status === true || data.status === 1 || data.status === "1" ? 1 : 0,
          updated_by: userId || 1,
        };

        Object.keys(textFields).forEach((key) => {
          formData.append(key, textFields[key]);
        });

        formData.append("icon", data.iconFile);

        let response;
        try {
          response = await api.put(`${BASE_URL}/${id}`, formData, {
            headers: multipartHeaders,
          });
          return response.data;
        } catch (putError) {
          response = await api.patch(`${BASE_URL}/${id}`, formData, {
            headers: multipartHeaders,
          });
          return response.data;
        }
      }

      // ─── Regular JSON submission (no file) ─────────────────────────
      const userId = getCurrentUserId();

      const submitData = {
        plan_name: data.plan_name ? data.plan_name.trim() : "",
        plan_code: data.plan_code ? data.plan_code.trim().toUpperCase() : "",
        description: data.description ? data.description.trim() : "",
        plan_type: data.plan_type || "fixed",
        duration_days: parseInt(data.duration_days) || 30,
        price: parseFloat(data.price) || 0,
        gst_percentage: parseFloat(data.gst_percentage) || 18,
        display_order: parseInt(data.display_order) || 1,
        badge: data.badge ? data.badge.trim() : "",
        is_popular: toTrendingBool(data.is_popular),
        is_display_in_front: data.is_display_in_front !== undefined ? data.is_display_in_front : true,
        is_free_trial: toTrendingBool(data.is_free_trial),
        trial_days: data.is_free_trial ? parseInt(data.trial_days) || 7 : 0,
        button_text: data.button_text ? data.button_text.trim() : "Get Started",
        button_color: data.button_color || "#FFFFFF",
        background_color: data.background_color || "#2463EB",
        is_status: data.status === true || data.status === 1 || data.status === "1" ? 1 : 0,
        updated_by: userId || 1,
      };

      // Handle icon properly
      if (data.icon !== undefined) {
        submitData.icon = data.icon;
      }

      console.log("📤 Updating subscription plan with data:", submitData);

      let response;
      try {
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log("✅ PUT successful");
        return response.data;
      } catch (putError) {
        console.log("PUT failed:", putError.response?.status);
        if (putError.response?.status === 404 || putError.response?.status === 405) {
          console.log("Trying PATCH...");
          try {
            response = await api.patch(`${BASE_URL}/${id}`, submitData);
            console.log("✅ PATCH successful");
            return response.data;
          } catch (patchError) {
            console.log("PATCH failed:", patchError.response?.status);
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

  // Delete subscription plan
  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, message: "Item already deleted" };
      }
      throw error.response?.data || error.message;
    }
  },

  // Bulk delete subscription plans
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search subscription plans
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

export default subscriptionPlanService;