import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/banners";

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

// Helper to convert base64 to File object
const base64ToFile = (base64String, filename = "banner.jpg") => {
  if (!base64String) return null;

  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const extension = mimeType.split("/")[1] || "jpg";
    return new File([blob], `${filename}.${extension}`, { type: mimeType });
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    return null;
  }
};

export const bannerService = {
  // Get all banners with pagination and search
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single banner by ID
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

  // Create new banner using FormData
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

      let imageFile = null;
      if (data.imageFile && data.imageFile instanceof File) {
        imageFile = data.imageFile;
      } else if (data.image && data.image.startsWith("data:image")) {
        imageFile = base64ToFile(data.image, data.title || "banner");
      }

      const formData = new FormData();
      formData.append("title", data.title?.trim() || "");
      formData.append("cta_link", data.link?.trim() || "");
      formData.append("status", statusValue ? "true" : "false");
      formData.append("created_by", userId || 1);
      formData.append("updated_by", userId || 1);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (
        data.image &&
        typeof data.image === "string" &&
        !data.image.startsWith("data:image")
      ) {
        formData.append("image", data.image);
      }

      console.log("Creating banner with FormData");

      const response = await api.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Create error:", error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Update banner with PUT/PATCH fallback
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

      // Check if we have a file to upload
      const hasImageFile = data.imageFile && data.imageFile instanceof File;

      let response;

      if (hasImageFile) {
        // Use FormData for file upload
        console.log('Updating banner with image file upload');
        const formData = new FormData();
        formData.append('title', data.title ? data.title.trim() : '');
        formData.append('cta_link', data.link ? data.link.trim() : '');
        formData.append('status', statusValue ? "true" : "false");
        formData.append('updated_by', userId || 1);
        formData.append('image', data.imageFile);

        try {
          response = await api.put(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('✅ PUT with FormData successful');
          return response.data;
        } catch (putError) {
          console.log('PUT with FormData failed:', putError.response?.status);
          if (putError.response?.status === 404 || putError.response?.status === 405) {
            response = await api.patch(`${BASE_URL}/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('✅ PATCH with FormData successful');
            return response.data;
          }
          throw putError;
        }
      } else {
        // Use JSON for no file
        console.log('Updating banner without file');
        const submitData = {
          title: data.title ? data.title.trim() : '',
          cta_link: data.link ? data.link.trim() : '',
          status: statusValue,
          updated_by: userId || 1
        };

        console.log('Update data:', submitData);
        console.log('Update URL:', `${BASE_URL}/${id}`);

        try {
          // Try PUT first
          response = await api.put(`${BASE_URL}/${id}`, submitData);
          console.log('✅ PUT successful');
          return response.data;
        } catch (putError) {
          console.log('PUT failed:', putError.response?.status);
          // If PUT fails with 404 or 405, try PATCH
          if (putError.response?.status === 404 || putError.response?.status === 405) {
            console.log('Trying PATCH...');
            try {
              response = await api.patch(`${BASE_URL}/${id}`, submitData);
              console.log('✅ PATCH successful');
              return response.data;
            } catch (patchError) {
              console.log('PATCH failed:', patchError.response?.status);
              // If PATCH fails with 404, try alternative URLs
              if (patchError.response?.status === 404) {
                console.log('Trying alternative URLs...');
                
                const alternativeUrls = [
                  `/banner/${id}`,
                  `/api/banners/${id}`,
                  `/api/banner/${id}`,
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
      }
    } catch (error) {
      console.error('Update error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete banner
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

  // Bulk delete banners
  deleteMany: async (ids) => {
    try {
      const response = await api.delete(BASE_URL, { data: { ids } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search banners
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

export default bannerService;