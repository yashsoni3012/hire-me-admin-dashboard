// import api from './axiosInstance';
// import { storage } from '../utils/storage';

// const BASE_URL = '/role';

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

// export const roleService = {
//   // Get all roles with pagination and search
//   getAll: async (params = {}) => {
//     try {
//       const response = await api.get(BASE_URL, { params });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get single role by ID
//   getById: async (id) => {
//     try {
//       const response = await api.get(`${BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       if (error.response?.status === 404) {
//         return null;
//       }
//       throw error.response?.data || error.message;
//     }
//   },

//   // Create new role
//   create: async (data) => {
//     try {
//       const userId = getCurrentUserId();

//       // Handle status - convert to string 'active' or 'inactive'
//       let statusValue = 'active';
//       if (data.status === 'inactive' || data.status === false || data.status === 0) {
//         statusValue = 'inactive';
//       } else if (data.status === 'active' || data.status === true || data.status === 1) {
//         statusValue = 'active';
//       }

//       const submitData = {
//         role_name: data.role_name ? data.role_name.trim() : '',
//         status: statusValue,
//         created_by: userId || 1,
//       };

//       console.log('Creating role with data:', submitData);
//       const response = await api.post(BASE_URL, submitData);
//       return response.data;
//     } catch (error) {
//       console.error('Create error:', error.response?.data);
//       throw error.response?.data || error.message;
//     }
//   },

//   // Update role
//   update: async (id, data) => {
//     try {
//       const userId = getCurrentUserId();

//       // Handle status - convert to string 'active' or 'inactive'
//       let statusValue = 'active';
//       if (data.status === 'inactive' || data.status === false || data.status === 0) {
//         statusValue = 'inactive';
//       } else if (data.status === 'active' || data.status === true || data.status === 1) {
//         statusValue = 'active';
//       }

//       const submitData = {
//         role_name: data.role_name ? data.role_name.trim() : '',
//         status: statusValue,
//         updated_by: userId || 1
//       };

//       console.log('Updating role with data:', submitData);
//       console.log('Update URL:', `${BASE_URL}/${id}`);

//       let response;
//       try {
//         response = await api.put(`${BASE_URL}/${id}`, submitData);
//         return response.data;
//       } catch (putError) {
//         console.log('PUT failed, trying PATCH...');
//         try {
//           response = await api.patch(`${BASE_URL}/${id}`, submitData);
//           return response.data;
//         } catch (patchError) {
//           console.log('PATCH failed, trying alternative URLs...');

//           const alternativeUrls = [
//             `${BASE_URL}/update/${id}`,
//             `${BASE_URL}/edit/${id}`,
//             `/roles/update/${id}`,
//             `/roles/edit/${id}`,
//           ];

//           let lastError = patchError;

//           for (const url of alternativeUrls) {
//             try {
//               console.log(`Trying alternative URL: ${url}`);
//               response = await api.put(url, submitData);
//               return response.data;
//             } catch (err) {
//               console.log(`Alternative URL ${url} failed:`, err.response?.status);
//               lastError = err;
//             }
//           }
//           throw lastError;
//         }
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       throw error.response?.data || error.message;
//     }
//   },

//   // Delete role
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

//   // Bulk delete roles
//   deleteMany: async (ids) => {
//     try {
//       const response = await api.delete(BASE_URL, { data: { ids } });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Search roles
//   search: async (query) => {
//     try {
//       const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };

// export default roleService;


import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/role";

// Get current logged-in user ID
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

// Normalize status
const normalizeStatus = (status) => {
  if (
    status === true ||
    status === 1 ||
    String(status).toLowerCase() === "active"
  ) {
    return "active";
  }

  return "inactive";
};

export const roleService = {
  // Get all roles
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single role
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

  // Create role
  create: async (data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        role_name: data.role_name?.trim() || "",
        status: normalizeStatus(data.status),
        created_by: userId || 1,
      };

      console.log("Creating role:", submitData);

      const response = await api.post(BASE_URL, submitData);

      return response.data;
    } catch (error) {
      console.error("Create error:", error.response?.data);

      throw error.response?.data || error.message;
    }
  },

  // Full role update - used by Edit page
  // Update role
  update: async (id, data) => {
    try {
      const userId = getCurrentUserId();

      const submitData = {
        status:
          data.status === "inactive" ||
            data.status === false ||
            data.status === 0
            ? "inactive"
            : "active",
        updated_by: userId || 1,
      };

      // Only send role_name when it is actually provided
      if (data.role_name !== undefined) {
        submitData.role_name = data.role_name.trim();
      }

      console.log("Updating role:", {
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data: submitData,
      });

      const response = await api.patch(
        `${BASE_URL}/${id}`,
        submitData
      );

      console.log("Update response:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Update error:",
        error?.response?.data || error
      );

      throw error.response?.data || error.message;
    }
  },

  // Update ONLY status - used by toggle
  // Update only role status
  updateStatus: async (id, status) => {
    try {
      const submitData = {
        status:
          status === "inactive" ||
            status === false ||
            status === 0
            ? "inactive"
            : "active",
      };

      console.log("Updating role status:", {
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        data: submitData,
      });

      const response = await api.patch(
        `${BASE_URL}/${id}`,
        submitData
      );

      console.log("Status update response:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Status update error:",
        error?.response?.data || error
      );

      throw error.response?.data || error.message;
    }
  },

  // Delete role
  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          message: "Item already deleted",
        };
      }

      throw error.response?.data || error.message;
    }
  },

  // Bulk delete
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, {
        data: { ids },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search roles
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

export default roleService;