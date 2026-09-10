// import api from './api'; // or your axios instance

// export const cmsPageService = {
//   getAll: (params) => api.get('/cms-pages/', { params }),
//   getById: (id) => api.get(`/cms-pages/${id}/`),
//   create: (data) => api.post('/cms-pages/', data),
//   update: (id, data) => api.patch(`/cms-pages/${id}/`, data),
//   delete: (id) => api.delete(`/cms-pages/${id}/`),
// };

// src/services/cmsPage.service.js
import api from './api'; // Your axios instance (with baseURL and interceptors)

export const cmsPageService = {
    // GET list with pagination and filters
    getAll: (params) => api.get('/cms-pages/', { params }),

    // GET single page
    getById: (id) => api.get(`/cms-pages/${id}/`),

    // POST create (supports FormData)
    create: (data, config) => api.post('/cms-pages/', data, config),

    // PUT update (supports FormData)
    update: (id, data, config) => api.patch(`/cms-pages/${id}/`, data, config),

    // DELETE
    delete: (id) => api.delete(`/cms-pages/${id}/`),
};