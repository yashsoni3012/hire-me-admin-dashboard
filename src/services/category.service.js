import api from './api'
const categoryService = {
  getAll:  (p)     => api.get('/admin/categories/', p),
  getById: (id)    => api.get(`/admin/categories/${id}/`),
  create:  (data)  => api.post('/admin/categories/', data),
  update:  (id, d) => api.put(`/admin/categories/${id}/`, d),
  delete:  (id)    => api.delete(`/admin/categories/${id}/`),
}
export default categoryService
