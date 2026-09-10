import api from './api';

const userService = {
  getAll: (params) => api.get('/user', { params }),
  getById: (id) => api.get(`/user/${id}`),
  create: (data) => api.post('/user', data),
  update: (id, data) => api.patch(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
  getRoles: () => {
    console.log('Fetching roles from API...');
    return api.get('/role');
  },
};

export default userService;