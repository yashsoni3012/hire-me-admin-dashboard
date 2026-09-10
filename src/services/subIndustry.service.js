// import api from './axiosInstance';
// import { storage } from '../utils/storage';

// const BASE_URL = '/sub-industry';

// // Helper function to generate slug from name
// const generateSlug = (name) => {
//     return name
//         .toLowerCase()
//         .trim()
//         .replace(/[^\w\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-');
// };

// // Helper function to get current user ID
// const getCurrentUserId = () => {
//     try {
//         // Try to get user from localStorage directly
//         const userStr = localStorage.getItem('user');
//         console.log('Raw user from localStorage:', userStr);

//         if (userStr) {
//             const user = JSON.parse(userStr);
//             console.log('Parsed user:', user);

//             const userId = user?.id || null;
//             console.log('User ID:', userId);

//             return userId;
//         }

//         const user = storage.getUser();
//         if (user) {
//             console.log('User from storage utility:', user);
//             return user?.id || user?.userId || user?._id || null;
//         }

//         return null;
//     } catch (error) {
//         console.error('Error getting user ID from localStorage:', error);
//         return null;
//     }
// };

// export const subIndustryService = {
//     // Get all sub-industries with pagination and search
//     getAll: async (params = {}) => {
//         try {
//             const response = await api.get(BASE_URL, { params });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get single sub-industry by ID
//     getById: async (id) => {
//         try {
//             const response = await api.get(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return null;
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Create new sub-industry with icon support
//     create: async (data) => {
//         try {
//             const userId = getCurrentUserId();

//             // Handle status - convert to boolean
//             let statusValue = true;
//             if (data.is_status === 'inactive' || data.is_status === false) {
//                 statusValue = false;
//             } else if (data.is_status === 'active' || data.is_status === true) {
//                 statusValue = true;
//             }

//             // IMPORTANT: Validate industry_id exists and is a valid number
//             const industryId = parseInt(data.industry_id);
//             if (!industryId || industryId <= 0) {
//                 throw new Error('Please select a valid parent industry');
//             }

//             // Check if we have a file to upload
//             const hasIconFile = data.iconFile && data.iconFile instanceof File;

//             let response;

//             if (hasIconFile) {
//                 console.log('Creating sub-industry with icon file upload');
//                 const formData = new FormData();
//                 formData.append('name', data.name ? data.name.trim() : '');
//                 formData.append('industry_id', industryId);
//                 formData.append('is_trending', data.is_trending || false);
//                 formData.append('is_status', statusValue);
//                 formData.append('sort_order', parseInt(data.sort_order) || 0);
//                 formData.append('created_by', userId || 1);
//                 formData.append('updated_by', userId || 1);
//                 formData.append('slug', generateSlug(data.name));

//                 if (hasIconFile) {
//                     formData.append('icon', data.iconFile);
//                 }

//                 response = await api.post(BASE_URL, formData, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             } else {
//                 console.log('Creating sub-industry without file');
//                 const submitData = {
//                     name: data.name ? data.name.trim() : '',
//                     slug: generateSlug(data.name),
//                     industry_id: industryId,
//                     is_trending: data.is_trending || false,
//                     is_status: statusValue,
//                     sort_order: parseInt(data.sort_order) || 0,
//                     created_by: userId || 1,
//                     updated_by: userId || 1
//                 };

//                 if (data.icon && typeof data.icon === 'string') {
//                     submitData.icon = data.icon;
//                 }

//                 response = await api.post(BASE_URL, submitData);
//             }

//             return response.data;
//         } catch (error) {
//             console.error('Create error:', error.response?.data);
//             throw error.response?.data || error.message;
//         }
//     },

//     // Update sub-industry
//     // update: async (id, data) => {
//     //     try {
//     //         const userId = getCurrentUserId();

//     //         // Handle status - convert to boolean
//     //         let statusValue = true;
//     //         if (data.is_status === 'inactive' || data.is_status === false) {
//     //             statusValue = false;
//     //         } else if (data.is_status === 'active' || data.is_status === true) {
//     //             statusValue = true;
//     //         }

//     //         // IMPORTANT: Validate industry_id exists and is a valid number
//     //         const industryId = data.industry_id ? parseInt(data.industry_id) : null;

//     //         // Check if we have a file to upload
//     //         const hasIconFile = data.iconFile && data.iconFile instanceof File;

//     //         let response;

//     //         if (hasIconFile) {
//     //             console.log('Updating sub-industry with icon file upload');
//     //             const formData = new FormData();
//     //             formData.append('name', data.name ? data.name.trim() : '');
//     //             if (industryId && industryId > 0) {
//     //                 formData.append('industry_id', industryId);
//     //             }
//     //             formData.append('is_trending', data.is_trending || false);
//     //             formData.append('is_status', statusValue);
//     //             formData.append('sort_order', parseInt(data.sort_order) || 0);
//     //             formData.append('updated_by', userId || 1);
//     //             formData.append('slug', generateSlug(data.name));

//     //             if (hasIconFile) {
//     //                 formData.append('icon', data.iconFile);
//     //             }

//     //             try {
//     //                 response = await api.put(`${BASE_URL}/${id}`, formData, {
//     //                     headers: { 'Content-Type': 'multipart/form-data' }
//     //                 });
//     //             } catch (putError) {
//     //                 console.log('PUT with FormData failed:', putError.response?.status);
//     //                 if (putError.response?.status === 404 || putError.response?.status === 405) {
//     //                     response = await api.patch(`${BASE_URL}/${id}`, formData, {
//     //                         headers: { 'Content-Type': 'multipart/form-data' }
//     //                     });
//     //                 } else {
//     //                     throw putError;
//     //                 }
//     //             }
//     //         } else {
//     //             console.log('Updating sub-industry without file');
//     //             const submitData = {
//     //                 name: data.name ? data.name.trim() : '',
//     //                 slug: generateSlug(data.name),
//     //                 is_trending: data.is_trending !== undefined ? data.is_trending : false,
//     //                 is_status: statusValue,
//     //                 sort_order: parseInt(data.sort_order) || 0,
//     //                 updated_by: userId || 1
//     //             };

//     //             // Only include industry_id if it exists and is valid
//     //             if (industryId && industryId > 0) {
//     //                 submitData.industry_id = industryId;
//     //             }

//     //             if (data.icon && typeof data.icon === 'string') {
//     //                 submitData.icon = data.icon;
//     //             }

//     //             try {
//     //                 response = await api.put(`${BASE_URL}/${id}`, submitData);
//     //             } catch (putError) {
//     //                 console.log('PUT failed:', putError.response?.status);
//     //                 if (putError.response?.status === 404 || putError.response?.status === 405) {
//     //                     response = await api.patch(`${BASE_URL}/${id}`, submitData);
//     //                 } else {
//     //                     throw putError;
//     //                 }
//     //             }
//     //         }

//     //         return response.data;
//     //     } catch (error) {
//     //         console.error('Update error:', error);
//     //         throw error.response?.data || error.message;
//     //     }
//     // },

//     // Update sub industry
//     update: async (id, data) => {
//         try {
//             const userId = getCurrentUserId();

//             console.log("Update data:", data);

//             const hasIconFile =
//                 data.iconFile &&
//                 data.iconFile instanceof File;

//             /*
//              * IMPORTANT:
//              * If there is a new image, send FormData.
//              * Do NOT send existing `icon` string/object in FormData.
//              */
//             if (hasIconFile) {
//                 console.log("Updating sub-industry WITH new image");

//                 const formData = new FormData();

//                 formData.append(
//                     "name",
//                     data.name ? data.name.trim() : ""
//                 );

//                 formData.append(
//                     "industry_id",
//                     String(parseInt(data.industry_id) || 0)
//                 );

//                 formData.append(
//                     "is_trending",
//                     String(Boolean(data.is_trending))
//                 );

//                 formData.append(
//                     "is_status",
//                     String(
//                         data.is_status === true ||
//                         data.is_status === "active"
//                     )
//                 );

//                 // Allow negative sort order
//                 formData.append(
//                     "sort_order",
//                     String(
//                         data.sort_order !== undefined &&
//                             data.sort_order !== null &&
//                             data.sort_order !== ""
//                             ? Number(data.sort_order)
//                             : 0
//                     )
//                 );

//                 formData.append(
//                     "updated_by",
//                     String(userId || 1)
//                 );

//                 // ONLY the new File
//                 formData.append("icon", data.iconFile);

//                 // Debug FormData
//                 for (const [key, value] of formData.entries()) {
//                     console.log(
//                         "FormData:",
//                         key,
//                         value instanceof File
//                             ? value.name
//                             : value
//                     );
//                 }

//                 let response;

//                 try {
//                     response = await api.put(
//                         `${BASE_URL}/${id}`,
//                         formData,
//                         {
//                             headers: {
//                                 "Content-Type": "multipart/form-data",
//                             },
//                         }
//                     );
//                 } catch (putError) {
//                     console.log(
//                         "PUT image update failed:",
//                         putError.response?.status,
//                         putError.response?.data
//                     );

//                     if (
//                         putError.response?.status === 404 ||
//                         putError.response?.status === 405
//                     ) {
//                         response = await api.patch(
//                             `${BASE_URL}/${id}`,
//                             formData,
//                             {
//                                 headers: {
//                                     "Content-Type":
//                                         "multipart/form-data",
//                                 },
//                             }
//                         );
//                     } else {
//                         throw putError;
//                     }
//                 }

//                 return response.data;
//             }

//             /*
//              * No new image.
//              *
//              * IMPORTANT:
//              * Don't send icon at all.
//              * Backend already has the old icon.
//              */
//             console.log("Updating sub-industry WITHOUT new image");

//             const submitData = {
//                 name: data.name ? data.name.trim() : "",
//                 industry_id: parseInt(data.industry_id) || 0,

//                 is_trending:
//                     data.is_trending !== undefined
//                         ? Boolean(data.is_trending)
//                         : false,

//                 is_status:
//                     data.is_status !== undefined
//                         ? (
//                             data.is_status === true ||
//                             data.is_status === "active"
//                         )
//                         : true,

//                 sort_order:
//                     data.sort_order !== undefined &&
//                         data.sort_order !== null &&
//                         data.sort_order !== ""
//                         ? Number(data.sort_order)
//                         : 0,

//                 updated_by: userId || 1,
//             };

//             console.log("JSON update data:", submitData);

//             let response;

//             try {
//                 response = await api.put(
//                     `${BASE_URL}/${id}`,
//                     submitData
//                 );
//             } catch (putError) {
//                 console.log(
//                     "PUT failed:",
//                     putError.response?.status,
//                     putError.response?.data
//                 );

//                 if (
//                     putError.response?.status === 404 ||
//                     putError.response?.status === 405
//                 ) {
//                     response = await api.patch(
//                         `${BASE_URL}/${id}`,
//                         submitData
//                     );
//                 } else {
//                     throw putError;
//                 }
//             }

//             return response.data;

//         } catch (error) {
//             console.error(
//                 "Update error:",
//                 error.response?.data || error
//             );

//             throw (
//                 error.response?.data ||
//                 error.message
//             );
//         }
//     },

//     // Delete sub-industry
//     delete: async (id) => {
//         try {
//             const response = await api.delete(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return { success: true, message: 'Item already deleted' };
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Bulk delete sub-industries
//     deleteMany: async (ids) => {
//         try {
//             const response = await api.delete(BASE_URL, { data: { ids } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Search sub-industries
//     search: async (query) => {
//         try {
//             const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get sub-industries by industry ID
//     getByIndustryId: async (industryId) => {
//         try {
//             const response = await api.get(`${BASE_URL}/industry/${industryId}`);
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     }
// };

// export default subIndustryService;

import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/sub-industry';

// Generate a URL-safe slug from a name
const generateSlug = (name) => {
    return (name || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

// Get current user id from localStorage
const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user?.id || null;
        }

        const user = storage.getUser();
        if (user) {
            return user?.id || user?.userId || user?._id || null;
        }

        return null;
    } catch (error) {
        console.error('Error reading user id from storage:', error);
        return null;
    }
};

// Pull the real server payload out of a failed request and log it in full,
// so a 400/422 shows you the actual validation message instead of a
// collapsed "Object" in the console.
const extractErrorPayload = (error, context) => {
    const serverData = error?.response?.data;
    console.error(
        `${context}:`,
        serverData ? JSON.stringify(serverData, null, 2) : error.message
    );
    return serverData || error.message || 'Something went wrong';
};

export const subIndustryService = {
    // Get all sub-industries with pagination and search
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Get all sub-industries error');
        }
    },

    // Get single sub-industry by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            throw extractErrorPayload(error, 'Get sub-industry error');
        }
    },

    // Create new sub-industry with icon support
    create: async (data) => {
        try {
            const userId = getCurrentUserId();

            let statusValue = true;
            if (data.is_status === 'inactive' || data.is_status === false) {
                statusValue = false;
            } else if (data.is_status === 'active' || data.is_status === true) {
                statusValue = true;
            }

            const industryId = parseInt(data.industry_id);
            if (!industryId || industryId <= 0) {
                throw new Error('Please select a valid parent industry');
            }

            const hasIconFile = data.iconFile instanceof File;
            let response;

            if (hasIconFile) {
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('slug', generateSlug(data.name));
                formData.append('industry_id', industryId);
                formData.append('is_trending', data.is_trending || false);
                formData.append('is_status', statusValue);
                formData.append('sort_order', parseInt(data.sort_order) || 0);
                formData.append('created_by', userId || 1);
                formData.append('icon', data.iconFile);

                response = await api.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    slug: generateSlug(data.name),
                    industry_id: industryId,
                    is_trending: data.is_trending || false,
                    is_status: statusValue,
                    sort_order: parseInt(data.sort_order) || 0,
                    created_by: userId || 1,
                };

                if (data.icon && typeof data.icon === 'string') {
                    submitData.icon = data.icon;
                }

                response = await api.post(BASE_URL, submitData);
            }

            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Create sub-industry error');
        }
    },

    // Update sub-industry
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();
            const hasIconFile = data.iconFile instanceof File;

            const isStatusValue = String(
                data.is_status === true || data.is_status === 'active'
            );
            const sortOrderValue = String(
                data.sort_order !== undefined &&
                    data.sort_order !== null &&
                    data.sort_order !== ''
                    ? Number(data.sort_order)
                    : 0
            );

            let response;

            if (hasIconFile) {
                // New icon selected -> multipart request.
                // IMPORTANT: send `slug` here too. create() always sends it;
                // this update path previously didn't, which is the most
                // likely reason the backend was rejecting it with a 400.
                const formData = new FormData();
                formData.append('name', data.name ? data.name.trim() : '');
                formData.append('slug', generateSlug(data.name));
                formData.append('industry_id', String(parseInt(data.industry_id) || 0));
                formData.append('is_trending', String(Boolean(data.is_trending)));
                formData.append('is_status', isStatusValue);
                formData.append('sort_order', sortOrderValue);
                formData.append('updated_by', String(userId || 1));
                formData.append('icon', data.iconFile);

                try {
                    response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } catch (putError) {
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        response = await api.patch(`${BASE_URL}/${id}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                    } else {
                        throw putError;
                    }
                }
            } else {
                // No new icon -> plain JSON; backend keeps the existing icon
                // since we don't send the `icon` field at all.
                const submitData = {
                    name: data.name ? data.name.trim() : '',
                    slug: generateSlug(data.name),
                    industry_id: parseInt(data.industry_id) || 0,
                    is_trending: data.is_trending !== undefined ? Boolean(data.is_trending) : false,
                    is_status:
                        data.is_status !== undefined
                            ? data.is_status === true || data.is_status === 'active'
                            : true,
                    sort_order: Number(sortOrderValue),
                    updated_by: userId || 1,
                };

                try {
                    response = await api.put(`${BASE_URL}/${id}`, submitData);
                } catch (putError) {
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        response = await api.patch(`${BASE_URL}/${id}`, submitData);
                    } else {
                        throw putError;
                    }
                }
            }

            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Update sub-industry error');
        }
    },

    // Delete sub-industry
    delete: async (id) => {
        try {
            const response = await api.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { success: true, message: 'Item already deleted' };
            }
            throw extractErrorPayload(error, 'Delete sub-industry error');
        }
    },

    // Bulk delete sub-industries
    deleteMany: async (ids) => {
        try {
            const response = await api.delete(BASE_URL, { data: { ids } });
            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Bulk delete sub-industries error');
        }
    },

    // Search sub-industries
    search: async (query) => {
        try {
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Search sub-industries error');
        }
    },

    // Get sub-industries by industry ID
    getByIndustryId: async (industryId) => {
        try {
            const response = await api.get(`${BASE_URL}/industry/${industryId}`);
            return response.data;
        } catch (error) {
            throw extractErrorPayload(error, 'Get sub-industries by industry error');
        }
    },
};

export default subIndustryService;