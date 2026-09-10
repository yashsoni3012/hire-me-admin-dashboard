import api from './api'
const notificationService = {
  getAll:       (p)    => api.get('/admin/notifications/', p),
  markRead:     (id)   => api.patch(`/admin/notifications/${id}/read/`),
  markAllRead:  ()     => api.post('/admin/notifications/mark-all-read/'),
  delete:       (id)   => api.delete(`/admin/notifications/${id}/`),
}
export default notificationService
