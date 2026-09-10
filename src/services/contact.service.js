// services/contact.service.js
import api from './api';

const API_URL = '/contact-us';

export const contactService = {
    // Get all contacts with pagination and filters
    getAll: async (params = {}) => {
        const response = await api.get(API_URL, { params });
        return response.data;
    },

    // Get single contact by ID
    getById: async (id) => {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },


    getByRole: async (role, params = {}) => {
        const response = await api.get(`${API_URL}/role/${role}`, { params });
        return response.data;
    },

    // Update contact
    // update: async (id, data) => {
    //     const response = await api.put(`${API_URL}/${id}`, data);
    //     return response.data;
    // },

    update: async (id, data) => {
        console.log('UPDATE ID:', id);
        console.log('UPDATE URL:', `${API_URL}/contact-us/${id}`);
        console.log('UPDATE DATA:', data);

        const response = await api.patch(
            `${API_URL}/${id}`,
            data
        );

        return response.data;
    },

    assign: async (id, userId) => {
        const response = await api.patch(
            `${API_URL}/${id}`,
            {
                assigned_to: userId,
            }
        );

        return response.data;
    },

    // Delete contact
    delete: async (id) => {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Update contact status
    updateStatus: async (id, status) => {
        const response = await api.patch(`${API_URL}/${id}/status`, { status });
        return response.data;
    },

    // Assign contact to admin
    // assign: async (id, adminId) => {
    //     const response = await api.patch(`${API_URL}/${id}/assign`, { assigned_to: adminId });
    //     return response.data;
    // },

    // Add admin remarks
    addRemarks: async (id, remarks) => {
        const response = await api.patch(`${API_URL}/${id}/remarks`, { admin_remarks: remarks });
        return response.data;
    },

    // Resolve contact
    resolve: async (id) => {
        const response = await api.patch(`${API_URL}/${id}/resolve`);
        return response.data;
    }
};