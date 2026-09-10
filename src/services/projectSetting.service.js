// services/projectSetting.service.js

import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/project-settings";

// =========================================================
// GET CURRENT USER ID
// =========================================================

const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.id || user?.userId || user?._id || null;
    }

    const user = storage.getUser();
    return user?.id || user?.userId || user?._id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

// =========================================================
// CREATE JSON PAYLOAD
// =========================================================

const createJsonPayload = (data, includeCreatedBy = true) => {
  const userId = getCurrentUserId();

  const payload = {
    setting_group: data.setting_group?.trim() || "",
    setting_key: data.setting_key?.trim() || "",
    setting_value: data.setting_value !== undefined && data.setting_value !== null ? data.setting_value : "",
    value_type: data.value_type || "string",
    description: data.description?.trim() || "",
    is_public: data.is_public ? 1 : 0,
    display_order: parseInt(data.display_order, 10) || 0,
    status: data.status === true || data.status === 1 || data.status === "1" || data.status === "active" ? 1 : 0,
    updated_by: userId || 1,
  };

  if (includeCreatedBy) {
    payload.created_by = userId || 1;
  }

  return payload;
};

// =========================================================
// CREATE UPDATE JSON PAYLOAD
// =========================================================

const createUpdateJsonPayload = (data) => {
  const userId = getCurrentUserId();

  const payload = {
    setting_group: data.setting_group?.trim() || "",
    setting_key: data.setting_key?.trim() || "",
    setting_value: data.setting_value !== undefined && data.setting_value !== null ? data.setting_value : "",
    value_type: data.value_type || "string",
    description: data.description?.trim() || "",
    is_public: data.is_public ? 1 : 0,
    display_order: parseInt(data.display_order, 10) || 0,
    status: data.status === true || data.status === 1 || data.status === "1" || data.status === "active" ? 1 : 0,
    updated_by: userId || 1,
  };

  return payload;
};

// =========================================================
// CREATE FORM DATA FOR FILE UPLOAD
// =========================================================

const createFormData = (data, includeCreatedBy = true) => {
  const userId = getCurrentUserId();

  const formData = new FormData();

  formData.append("setting_group", data.setting_group?.trim() || "");
  formData.append("setting_key", data.setting_key?.trim() || "");
  formData.append("value_type", "file");
  formData.append("description", data.description?.trim() || "");
  formData.append("is_public", data.is_public ? "1" : "0");
  formData.append("display_order", String(parseInt(data.display_order, 10) || 0));
  formData.append("status", data.status === true || data.status === 1 || data.status === "1" || data.status === "active" ? "1" : "0");

  if (includeCreatedBy) {
    formData.append("created_by", String(userId || 1));
  }

  formData.append("updated_by", String(userId || 1));

  if (data.setting_file instanceof File) {
    formData.append("setting_value", data.setting_file);
  } else {
    formData.append("setting_value", data.setting_value || "");
  }

  return formData;
};

// =========================================================
// UPDATE FORM DATA FOR FILE
// =========================================================

const createUpdateFormData = (data) => {
  const userId = getCurrentUserId();

  const formData = new FormData();

  formData.append("setting_group", data.setting_group?.trim() || "");
  formData.append("setting_key", data.setting_key?.trim() || "");
  formData.append("value_type", "file");
  formData.append("description", data.description?.trim() || "");
  formData.append("is_public", data.is_public ? "1" : "0");
  formData.append("display_order", String(parseInt(data.display_order, 10) || 0));
  formData.append("status", data.status === true || data.status === 1 || data.status === "1" || data.status === "active" ? "1" : "0");
  formData.append("updated_by", String(userId || 1));

  if (data.setting_file instanceof File) {
    formData.append("setting_value", data.setting_file);
  } else {
    formData.append("setting_value", data.setting_value || "");
  }

  return formData;
};

// =========================================================
// SERVICE
// =========================================================

export const projectSettingService = {

  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error("Get all project settings error:", error);
      throw error.response?.data || error.message;
    }
  },

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

  create: async (data) => {
    try {
      console.log("📤 Creating project setting:", data);

      if (data.value_type === "file" && data.setting_file instanceof File) {
        const formData = createFormData(data, true);

        console.log("📁 Uploading file:", data.setting_file.name);

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`FormData ${key}: File (${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`FormData ${key}:`, value);
          }
        }

        const response = await api.post(BASE_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("✅ File upload successful:", response.data);
        return response.data;
      }

      const submitData = createJsonPayload(data, true);
      console.log("📤 Sending JSON:", submitData);

      const response = await api.post(BASE_URL, submitData);
      console.log("✅ Project setting created:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Create project setting error:", error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },

  // ─── FIXED UPDATE METHOD ──────────────────────────────────────────────
  update: async (id, data) => {
    try {
      console.log(`📤 Updating project setting ${id}:`, data);

      // ─── FILE UPDATE ──────────────────────────────────────────────────
      if (data.value_type === "file" && data.setting_file instanceof File) {
        const formData = createUpdateFormData(data);

        console.log("📁 Updating with file:", data.setting_file.name);
        console.log("📁 Updated by (user ID):", getCurrentUserId());

        let response;

        try {
          response = await api.put(`${BASE_URL}/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("✅ PUT file update successful");
          return response.data;
        } catch (putError) {
          console.log("PUT file update failed:", putError.response?.status);

          if (putError.response?.status === 404 || putError.response?.status === 405) {
            response = await api.patch(`${BASE_URL}/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("✅ PATCH file update successful");
            return response.data;
          }

          throw putError;
        }
      }

      // ─── JSON UPDATE ────
      const submitData = createUpdateJsonPayload(data);
      console.log("📤 Updating with JSON:", submitData);

      let response;

      try {
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log("✅ PUT update successful");
        return response.data;
      } catch (putError) {
        console.log("PUT failed:", putError.response?.status);

        if (putError.response?.status === 404 || putError.response?.status === 405) {
          response = await api.patch(`${BASE_URL}/${id}`, submitData);
          console.log("✅ PATCH update successful");
          return response.data;
        }

        throw putError;
      }
    } catch (error) {
      console.error("❌ Update project setting error:", error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },

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

  getByGroup: async (group) => {
    try {
      const response = await api.get(`${BASE_URL}/group/${group}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (query) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default projectSettingService;