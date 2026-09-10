import api from './api';

const candidateService = {
  getAll: (params) => api.get('/candidate', { params }),
  getById: (id) => api.get(`/candidate/${id}`),
  getFullProfile: (id) => api.get(`/candidate-full-profile/${id}`),
  create: (data) => api.post('/candidate', data),
  update: (id, data) => api.patch(`/candidate/${id}`, data),
  delete: (id) => api.delete(`/candidate/${id}`),
};

export default candidateService;