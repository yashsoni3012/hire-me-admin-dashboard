import api from './api';

const jobTypeService = {
  getAll: (params) => api.get('/job-types', { params }),
  getById: (id) => api.get(`/job-types/${id}`),
  create: (data) => api.post('/job-types', data),
  // Use PUT instead of PATCH for update
  update: (id, data) => api.patch(`/job-types/${id}`, data),
  delete: (id) => api.delete(`/job-types/${id}`),
};

export default jobTypeService;