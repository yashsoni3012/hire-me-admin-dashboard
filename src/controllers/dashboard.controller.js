import api from '../services/api'

export const fetchDashboardStats = async () => {
  try {
    const res = await api.get('/admin/dashboard/stats/')
    return { success: true, data: res.data }
  } catch {
    return { success: false, data: null }
  }
}

export const fetchRecentActivities = async () => {
  try {
    const res = await api.get('/admin/dashboard/activities/')
    return { success: true, data: res.data }
  } catch {
    return { success: false, data: [] }
  }
}
