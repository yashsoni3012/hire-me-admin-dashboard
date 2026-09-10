// services/companySubscription.service.js
import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/company-subscriptions";

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

export const companySubscriptionService = {
  // Get all company subscriptions
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single company subscription by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error.response?.data || error.message;
    }
  },

  // CREATE
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        company_id: parseInt(data.company_id),
        subscription_plans_id: parseInt(data.subscription_plans_id),
        subscription_type: data.subscription_type || "New",
        subscription_status: data.subscription_status || "pending",
        start_date: data.start_date || null,
        expiry_date: data.expiry_date || null,
        cancel_reason: data.cancel_reason || null,
        cancelled_at: data.cancelled_at || null,
        // FIX: Send as direct IDs, not objects
        // FIX: Send as direct IDs, not objects
        previous_subscription_id: data.PreviousSubscriptionPlan
          ? parseInt(data.PreviousSubscriptionPlan)
          : null,
        next_subscription_plans_id: data.NextSubscriptionPlan
          ? parseInt(data.NextSubscriptionPlan)
          : null,
        is_trial: data.is_trial || false,
        auto_renew: data.auto_renew || false,
        is_status:
          data.is_status === true ||
          data.is_status === "active" ||
          data.is_status === 1,
        created_by: userId || 1,
      };

      console.log(
        "📤 Creating subscription:",
        JSON.stringify(submitData, null, 2),
      );

      const response = await api.post(BASE_URL, submitData);
      console.log("✅ Create successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Create error:", error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // UPDATE
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        company_id: parseInt(data.company_id),
        subscription_plans_id: parseInt(data.subscription_plans_id),
        subscription_type: data.subscription_type || "New",
        subscription_status: data.subscription_status || "pending",
        start_date: data.start_date || null,
        expiry_date: data.expiry_date || null,
        cancel_reason: data.cancel_reason || null,
        cancelled_at: data.cancelled_at || null,
        // FIX: Send as direct IDs, not objects
        // FIX: Send as direct IDs, not objects
        previous_subscription_id: data.PreviousSubscriptionPlan
          ? parseInt(data.PreviousSubscriptionPlan)
          : null,
        next_subscription_plans_id: data.NextSubscriptionPlan
          ? parseInt(data.NextSubscriptionPlan)
          : null,
        is_trial: data.is_trial || false,
        auto_renew: data.auto_renew || false,
        is_status:
          data.is_status === true ||
          data.is_status === "active" ||
          data.is_status === 1,
        updated_by: userId || 1,
      };

      console.log(
        "📤 Updating subscription:",
        JSON.stringify(submitData, null, 2),
      );

      let response;
      try {
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log("✅ PUT successful");
        return response.data;
      } catch (putError) {
        console.log("PUT failed with status:", putError.response?.status);
        if (
          putError.response?.status === 404 ||
          putError.response?.status === 405
        ) {
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
      console.error("❌ Update error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Delete company subscription
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

  // Get subscriptions by company ID
  getByCompanyId: async (companyId) => {
    try {
      const response = await api.get(`${BASE_URL}/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get subscriptions by plan ID
  getBySubscriptionPlansId: async (subscriptionPlansId) => {
    try {
      const response = await api.get(
        `${BASE_URL}/subscription-plan/${subscriptionPlansId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk delete
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search
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

export default companySubscriptionService;
