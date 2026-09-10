import api from './api'
const permissionService = {
  getAll:  (p)     => api.get('/admin/permissions/', p),
  create:  (data)  => api.post('/admin/permissions/', data),
  update:  (id, d) => api.put(`/admin/permissions/${id}/`, d),
  delete:  (id)    => api.delete(`/admin/permissions/${id}/`),
}
export default permissionService
