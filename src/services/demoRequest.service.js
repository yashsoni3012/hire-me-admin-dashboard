import api from './axiosInstance';
import { storage } from '../utils/storage';

const BASE_URL = '/demo-requests';

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

// ─── FIX: date/datetime conversion helpers ─────────────────────────────
// The API returns full ISO strings like "2026-08-07T10:00:00.000Z".
// <input type="datetime-local"> only accepts "YYYY-MM-DDTHH:mm" (local time,
// no seconds/ms/timezone) and <input type="date"> only accepts "YYYY-MM-DD".
// Feeding the raw ISO string to either input makes the browser silently
// render it blank — which is why edited/prefilled dates looked "missing"
// and why re-saving the form nulled them out (blank field -> empty string
// -> `|| null` -> overwritten).

// ISO string -> value for <input type="datetime-local">
export const toDatetimeLocalInput = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ISO string -> value for <input type="date">
export const toDateInput = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// <input type="datetime-local"> value -> full ISO string for the API
const fromDatetimeLocalInput = (localValue) => {
    if (!localValue) return null;
    const d = new Date(localValue);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
};

export const demoRequestService = {
    // Get all demo requests
    getAll: async (params = {}) => {
        try {
            const response = await api.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single demo request by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) return null;
            throw error.response?.data || error.message;
        }
    },

    // Create new demo request
    create: async (data) => {
        try {
            const submitData = {
                name: data.name?.trim() || '',
                email: data.email?.trim() || '',
                mobile: data.mobile?.trim() || '',
                company_name: data.company_name?.trim() || '',
                designation: data.designation?.trim() || '',
                company_size_id: data.company_size_id ? parseInt(data.company_size_id) : null,
                industry_id: data.industry_id ? parseInt(data.industry_id) : null,
                city_id: data.city_id ? parseInt(data.city_id) : null,
                job_hiring_volume: data.job_hiring_volume ? parseInt(data.job_hiring_volume) : null,
                hiring_frequency: data.hiring_frequency || '',
                interested_plan: data.interested_plan?.trim() || '',
                // date-only input, already "YYYY-MM-DD" — send as-is
                preferred_demo_date: data.preferred_demo_date || null,
                preferred_demo_time: data.preferred_demo_time || '',
                message: data.message?.trim() || '',
                source: data.source || '',
                status: data.status || 'new',
                priority: data.priority || 'medium',
                assigned_to: data.assigned_to ? parseInt(data.assigned_to) : null,
                admin_remarks: data.admin_remarks?.trim() || '',
                // FIX: convert datetime-local -> full ISO before sending
                demo_scheduled_at: fromDatetimeLocalInput(data.demo_scheduled_at),
                demo_completed_at: fromDatetimeLocalInput(data.demo_completed_at),
                follow_up_at: fromDatetimeLocalInput(data.follow_up_at),
            }; 

            console.log('📤 Creating demo request:', submitData);
            const response = await api.post(BASE_URL, submitData);
            return response.data;
        } catch (error) {
            console.error('Create error:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update demo request
    update: async (id, data) => {
        try {
            const userId = getCurrentUserId();

            const submitData = {
                name: data.name?.trim() || '',
                email: data.email?.trim() || '',
                mobile: data.mobile?.trim() || '',
                company_name: data.company_name?.trim() || '',
                designation: data.designation?.trim() || '',
                company_size_id: data.company_size_id ? parseInt(data.company_size_id) : null,
                industry_id: data.industry_id ? parseInt(data.industry_id) : null,
                city_id: data.city_id ? parseInt(data.city_id) : null,
                job_hiring_volume: data.job_hiring_volume ? parseInt(data.job_hiring_volume) : null,
                hiring_frequency: data.hiring_frequency || '',
                interested_plan: data.interested_plan?.trim() || '',
                preferred_demo_date: data.preferred_demo_date || null,
                preferred_demo_time: data.preferred_demo_time || '',
                message: data.message?.trim() || '',
                source: data.source || '',
                status: data.status || 'new',
                priority: data.priority || 'medium',
                assigned_to: data.assigned_to ? parseInt(data.assigned_to) : null,
                admin_remarks: data.admin_remarks?.trim() || '',
                // FIX: convert datetime-local -> full ISO before sending
                demo_scheduled_at: fromDatetimeLocalInput(data.demo_scheduled_at),
                demo_completed_at: fromDatetimeLocalInput(data.demo_completed_at),
                follow_up_at: fromDatetimeLocalInput(data.follow_up_at),
                updated_by: userId || 1
            };

            console.log('📤 Updating demo request:', submitData);

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

    // Delete demo request
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
            const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default demoRequestService;