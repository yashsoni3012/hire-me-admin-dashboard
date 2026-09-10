import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/subscription-features';

const multipartHeaders = { 'Content-Type': undefined };

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

// ─── HELPER: Extract just the filename from icon path ──────────
const extractFilename = (iconPath) => {
    if (!iconPath) return null;
    if (typeof iconPath !== 'string') return null;
    
    let path = iconPath.trim();
    if (!path || path === 'null' || path === '') return null;
    
    // Remove domain if a full URL was passed
    path = path.replace(/^https?:\/\/[^/]+/i, '');
    
    // Remove ALL leading slashes and /uploads/ prefixes
    path = path.replace(/^\/+/, '');
    path = path.replace(/^uploads\/+/i, '');
    path = path.replace(/^uploads\/+/i, '');
    
    // Return just the filename (no /uploads/ prefix)
    return path;
};

export const subscriptionFeatureService = {
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
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
            const userId = getCurrentUserId();

            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            const submitData = {
                feature_name: data.feature_name ? data.feature_name.trim() : '',
                feature_key: data.feature_key ? data.feature_key.trim() : '',
                feature_type: data.feature_type || 'TEXT',
                subscription_feature_categories_id: parseInt(data.subscription_feature_categories_id) || 0,
                description: data.description?.trim() || '',
                default_unit: data.default_unit || '',
                default_value: data.default_value || '',
                options_json: data.options_json || null,
                is_usage_track: data.is_usage_track || 'no',
                is_required: data.is_required ? 1 : 0,
                is_display: data.is_display !== undefined ? (data.is_display ? 1 : 0) : 1,
                display_order: parseInt(data.display_order) || 0,
                status: statusValue,
                is_trending: trendingValue,
                created_by: userId || 1,
            };

            const hasIconFile = data.iconFile && data.iconFile instanceof File;
            let response;

            if (hasIconFile) {
                const formData = new FormData();
                Object.keys(submitData).forEach(key => {
                    if (submitData[key] !== null && submitData[key] !== undefined) {
                        formData.append(key, submitData[key]);
                    }
                });
                formData.append('icon', data.iconFile);

                response = await api.post(BASE_URL, formData, {
                    headers: multipartHeaders,
                });
            } else {
                // ─── FIX: Send only filename, not full path ─────────
                if (data.icon && typeof data.icon === 'string') {
                    const filename = extractFilename(data.icon);
                    if (filename) {
                        submitData.icon = filename; // Just the filename
                        console.log('📤 Sending icon filename:', filename);
                    }
                }
                response = await api.post(BASE_URL, submitData);
            }

            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    update: async (id, data) => {
        try {
            console.log('📤 Update request data:', data);
            
            const userId = getCurrentUserId();

            let statusValue = 1;
            if (data.status === 'inactive' || data.status === false || data.status === 0) {
                statusValue = 0;
            } else if (data.status === 'active' || data.status === true || data.status === 1) {
                statusValue = 1;
            }

            let trendingValue = 0;
            if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                trendingValue = 1;
            }

            const submitData = {
                feature_name: data.feature_name ? data.feature_name.trim() : '',
                feature_key: data.feature_key ? data.feature_key.trim() : '',
                feature_type: data.feature_type || 'TEXT',
                subscription_feature_categories_id: parseInt(data.subscription_feature_categories_id) || 0,
                description: data.description?.trim() || '',
                default_unit: data.default_unit || '',
                default_value: data.default_value || '',
                options_json: data.options_json || null,
                is_usage_track: data.is_usage_track || 'no',
                is_required: data.is_required ? 1 : 0,
                is_display: data.is_display !== undefined ? (data.is_display ? 1 : 0) : 1,
                display_order: parseInt(data.display_order) || 0,
                status: statusValue,
                is_trending: trendingValue,
                updated_by: userId || 1
            };

            // ─── CHECK FOR NEW IMAGE FILE ──────────────────────────
            const hasIconFile = data.iconFile && data.iconFile instanceof File;

            if (hasIconFile) {
                // ─── CASE 1: User uploaded a new image ─────────────
                const formData = new FormData();

                Object.keys(submitData).forEach((key) => {
                    if (submitData[key] !== null && submitData[key] !== undefined) {
                        formData.append(key, submitData[key]);
                    }
                });

                formData.append('icon', data.iconFile);

                console.log('📤 Updating with NEW icon file:', data.iconFile.name);

                try {
                    const response = await api.put(`${BASE_URL}/${id}`, formData, {
                        headers: multipartHeaders,
                    });
                    return response.data;
                } catch (putError) {
                    if (putError.response?.status === 404 || putError.response?.status === 405) {
                        const response = await api.patch(`${BASE_URL}/${id}`, formData, {
                            headers: multipartHeaders,
                        });
                        return response.data;
                    }
                    throw putError;
                }
            }

            // ─── CASE 2: Handle icon based on what's passed ────────
            if (data.icon !== undefined) {
                console.log('📌 Icon data received:', data.icon);
                
                // ─── User wants to REMOVE the icon ──────────────────
                if (data.icon === null || data.icon === 'null' || data.icon === '') {
                    submitData.icon = null;
                    console.log('🗑️ Icon removed by user - sending null');
                } 
                // ─── User wants to KEEP the icon ────────────────────
                else if (typeof data.icon === 'string' && data.icon.trim() !== '' && data.icon !== 'null') {
                    // ─── FIX: Send only filename, not full path ─────
                    const filename = extractFilename(data.icon);
                    if (filename) {
                        submitData.icon = filename; // Just the filename
                        console.log('📌 Keeping icon filename:', filename);
                    }
                }
            }
            // ─── CASE 3: icon NOT in data - DO NOT send icon field ──
            else {
                console.log('ℹ️ No icon data provided - server will keep existing icon');
            }

            console.log('📤 Final update payload:', submitData);

            try {
                const response = await api.put(`${BASE_URL}/${id}`, submitData);
                console.log('✅ Update successful:', response.data);
                return response.data;
            } catch (putError) {
                if (putError.response?.status === 404 || putError.response?.status === 405) {
                    console.log('🔄 PUT failed, trying PATCH...');
                    const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                    console.log('✅ PATCH successful:', response.data);
                    return response.data;
                }
                throw putError;
            }
        } catch (error) {
            console.error('❌ Update error:', error);
            throw error.response?.data || error.message;
        }
    },

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
    }
};

export default subscriptionFeatureService;