import api from './api'
const blogService = {
  getAll:  (p)     => api.get('/admin/blogs/', p),
  getById: (id)    => api.get(`/admin/blogs/${id}/`),
  create:  (data)  => api.post('/admin/blogs/', data),
  update:  (id, d) => api.put(`/admin/blogs/${id}/`, d),
  delete:  (id)    => api.delete(`/admin/blogs/${id}/`),
}
export default blogService
