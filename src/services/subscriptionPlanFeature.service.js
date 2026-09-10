// import api from './axiosInstance';
// import { storage } from '../utils/storage';

// const BASE_URL = '/subscription-plan-features';

// // Helper function to get current user ID
// const getCurrentUserId = () => {
//   try {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       return user?.id || null;
//     }
//     const user = storage.getUser();
//     return user?.id || user?.userId || user?._id || null;
//   } catch (error) {
//     console.error('Error getting user ID:', error);
//     return null;
//   }
// };

// // Coerce any incoming representation to a real boolean
// const toStatusBool = (value) => {
//   if (value === 'inactive' || value === false || value === 0 || value === '0') return false;
//   return true;
// };

// const toTrendingBool = (value) => {
//   return value === true || value === 1 || value === 'true' || value === '1';
// };

// export const subscriptionPlanFeatureService = {
//   // Get all subscription plan features
//   getAll: async (params = {}) => {
//     try {
//       const response = await api.get(BASE_URL, { params });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get single plan feature by ID
//   getById: async (id) => {
//     try {
//       const response = await api.get(`${BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       if (error.response?.status === 404) return null;
//       throw error.response?.data || error.message;
//     }
//   },

//   // Create new subscription plan feature
//   create: async (data) => {
//     try {
//       const userId = getCurrentUserId();

//       const submitData = {
//         subscription_plan_id: parseInt(data.subscription_plan_id),
//         subscription_features_id: parseInt(data.subscription_features_id),
//         value: data.value || "",
//         display_value: data.display_value || "",
//         value_type: data.value_type || "integer",
//         unit: data.unit || "",
//         is_unlimited: toTrendingBool(data.is_unlimited),
//         is_trending: toTrendingBool(data.is_trending),
//         status: toStatusBool(data.status),
//         created_by: userId || 1,
//         updated_by: userId || 1
//       };

//       console.log('Creating subscription plan feature with data:', submitData);
//       const response = await api.post(BASE_URL, submitData);
//       return response.data;
//     } catch (error) {
//       console.error('Create error:', error.response?.data);
//       throw error.response?.data || error.message;
//     }
//   },

//   // Update subscription plan feature with PUT/PATCH fallback
//   update: async (id, data) => {
//     try {
//       const userId = getCurrentUserId();

//       const submitData = {
//         subscription_plan_id: parseInt(data.subscription_plan_id),
//         subscription_features_id: parseInt(data.subscription_features_id),
//         value: data.value || "",
//         display_value: data.display_value || "",
//         value_type: data.value_type || "integer",
//         unit: data.unit || "",
//         is_unlimited: toTrendingBool(data.is_unlimited),
//         is_trending: toTrendingBool(data.is_trending),
//         status: toStatusBool(data.status),
//         updated_by: userId || 1
//       };

//       console.log('Updating subscription plan feature with data:', submitData);
//       console.log('Update URL:', `${BASE_URL}/${id}`);

//       let response;
//       try {
//         // Try PUT first
//         response = await api.put(`${BASE_URL}/${id}`, submitData);
//         console.log('✅ PUT successful');
//         return response.data;
//       } catch (putError) {
//         console.log('PUT failed:', putError.response?.status);
//         // If PUT fails with 404 or 405, try PATCH
//         if (putError.response?.status === 404 || putError.response?.status === 405) {
//           console.log('Trying PATCH...');
//           try {
//             response = await api.patch(`${BASE_URL}/${id}`, submitData);
//             console.log('✅ PATCH successful');
//             return response.data;
//           } catch (patchError) {
//             console.log('PATCH failed:', patchError.response?.status);
//             // If PATCH fails with 404, try alternative URLs
//             if (patchError.response?.status === 404) {
//               console.log('Trying alternative URLs...');

//               const alternativeUrls = [
//                 `/subscription-plan-feature/${id}`,
//                 `/api/subscription-plan-features/${id}`,
//                 `/api/subscription-plan-feature/${id}`,
//               ];

//               let lastError = patchError;

//               for (const url of alternativeUrls) {
//                 try {
//                   console.log(`Trying alternative URL: ${url}`);
//                   response = await api.patch(url, submitData);
//                   console.log(`✅ Success with URL: ${url}`);
//                   return response.data;
//                 } catch (err) {
//                   console.log(`Alternative URL ${url} failed:`, err.response?.status);
//                   lastError = err;
//                   if (err.response?.status === 404) {
//                     continue;
//                   }
//                   throw err;
//                 }
//               }
//               throw lastError;
//             }
//             throw patchError;
//           }
//         }
//         throw putError;
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       throw error.response?.data || error.message;
//     }
//   },

//   // Delete subscription plan feature
//   delete: async (id) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       if (error.response?.status === 404) {
//         return { success: true, message: 'Item already deleted' };
//       }
//       throw error.response?.data || error.message;
//     }
//   },

//   // Bulk delete subscription plan features
//   deleteMany: async (ids) => {
//     try {
//       const response = await api.delete(BASE_URL, { data: { ids } });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get features by plan ID
//   getByPlanId: async (planId) => {
//     try {
//       const response = await api.get(`${BASE_URL}/plan/${planId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };

// export default subscriptionPlanFeatureService;


import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/subscription-plan-features';

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

export const subscriptionPlanFeatureService = {
  // Get all subscription plan features
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single plan feature by ID
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error.response?.data || error.message;
    }
  },

  // Create new subscription plan feature
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        subscription_plan_id: parseInt(data.subscription_plan_id),
        subscription_features_id: parseInt(data.subscription_features_id),
        value: data.value || "",
        display_value: data.display_value || "",
        value_type: data.value_type || "integer",
        unit: data.unit || "",
        is_unlimited: toTrendingBool(data.is_unlimited),
        is_trending: toTrendingBool(data.is_trending),
        status: toStatusBool(data.status),
        created_by: userId || 1,
        updated_by: userId || 1
      };

      console.log('Creating subscription plan feature with data:', submitData);
      const response = await api.post(BASE_URL, submitData);
      return response.data;
    } catch (error) {
      console.error('Create error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // NEW: Bulk create subscription plan features with all features pre-selected
  createBulk: async (data) => {
    try {
      const userId = getCurrentUserId();

      // Validate plan ID
      if (!data.subscription_plan_id || isNaN(data.subscription_plan_id)) {
        throw new Error('Valid subscription_plan_id is required');
      }

      // Validate features array
      if (!Array.isArray(data.features) || data.features.length === 0) {
        throw new Error('At least one feature is required');
      }

      // Process features - handle null/undefined values
      const features = data.features.map((feature, index) => {
        if (!feature.subscription_features_id || isNaN(feature.subscription_features_id)) {
          throw new Error(`Feature ID missing at index ${index}`);
        }

        // FIX: Handle null/undefined values properly
        // If value is null or undefined, keep it as null (will be sent as null)
        // If value is empty string, convert to null
        let value = feature.value;
        if (value === undefined || value === null || value === '') {
          value = null;
        }

        return {
          subscription_plan_id: parseInt(data.subscription_plan_id),
          subscription_features_id: parseInt(feature.subscription_features_id),
          value: value, // Can be null
          display_value: feature.display_value || null,
          value_type: feature.value_type || "string",
          unit: feature.unit || null,
          is_unlimited: toTrendingBool(feature.is_unlimited),
          is_trending: toTrendingBool(feature.is_trending),
          status: toStatusBool(feature.status),
        };
      });

      const submitData = {
        subscription_plan_id: parseInt(data.subscription_plan_id),
        features: features,
        created_by: userId || 1,
        updated_by: userId || 1
      };

      console.log('✅ Final Bulk Payload:', JSON.stringify(submitData, null, 2));

      const response = await api.post(`${BASE_URL}/bulk`, submitData);
      return response.data;

    } catch (error) {
      console.error('❌ Bulk create error:', error);

      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add features";

      // Smart error handling
      if (error.response?.data?.error?.includes('foreign key constraint')) {
        errorMessage = "❌ Invalid Plan ID: This subscription plan does not exist in database.";
      }

      if (error.response?.data?.error?.includes('subscription_features_id')) {
        errorMessage = "❌ Invalid Feature ID: One or more features do not exist.";
      }

      throw {
        ...(error.response?.data || {}),
        message: errorMessage,
      };
    }
  },

  // Update subscription plan feature
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        subscription_plan_id: parseInt(data.subscription_plan_id),
        subscription_features_id: parseInt(data.subscription_features_id),
        value: data.value || "",
        display_value: data.display_value || "",
        value_type: data.value_type || "integer",
        unit: data.unit || "",
        is_unlimited: toTrendingBool(data.is_unlimited),
        is_trending: toTrendingBool(data.is_trending),
        status: toStatusBool(data.status),
        updated_by: userId || 1
      };

      console.log('Updating subscription plan feature with data:', submitData);
      console.log('Update URL:', `${BASE_URL}/${id}`);

      let response;
      try {
        response = await api.put(`${BASE_URL}/${id}`, submitData);
        console.log('✅ PUT successful');
        return response.data;
      } catch (putError) {
        console.log('PUT failed:', putError.response?.status);
        if (putError.response?.status === 404 || putError.response?.status === 405) {
          console.log('Trying PATCH...');
          try {
            response = await api.patch(`${BASE_URL}/${id}`, submitData);
            console.log('✅ PATCH successful');
            return response.data;
          } catch (patchError) {
            console.log('PATCH failed:', patchError.response?.status);
            if (patchError.response?.status === 404) {
              console.log('Trying alternative URLs...');
              const alternativeUrls = [
                `/subscription-plan-feature/${id}`,
                `/api/subscription-plan-features/${id}`,
                `/api/subscription-plan-feature/${id}`,
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

  // Delete subscription plan feature
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

  // Bulk delete subscription plan features
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get features by plan ID
  // getByPlanId: async (planId) => {
  //   try {
  //     const response = await api.get(`${BASE_URL}/${planId}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // }

  // getByPlanId: async (planId) => {
  //   try {
  //     const response = await api.get(BASE_URL, {
  //       params: {
  //         subscription_plan_id: planId,
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error("Get subscription features error:", error);
  //     throw error.response?.data || error.message;
  //   }
  // },
  getByPlanId: async (planId) => {
    try {
      let allFeatures = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await api.get(BASE_URL, {
          params: {
            subscription_plan_id: planId,
            page,
          },
        });

        const result = response.data;

        // Get current page data
        const pageData = Array.isArray(result?.data)
          ? result.data
          : [];

        // Add current page records
        allFeatures = [...allFeatures, ...pageData];

        // Get total pages from API pagination
        totalPages = result?.pagination?.totalPages || 1;

        page++;
      } while (page <= totalPages);

      return allFeatures;
    } catch (error) {
      console.error("Get subscription features error:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default subscriptionPlanFeatureService;