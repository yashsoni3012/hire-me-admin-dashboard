import api from './api';

const moduleService = {
  getAll: (params) => api.get('/module', params),
  getById: (id) => api.get(`/module/${id}`),
  create: (data) => api.post('/module', data),
  update: (id, data) => api.patch(`/module/${id}`, data),
  delete: (id) => api.delete(`/module/${id}`),
};

export default moduleService;