import authService from '../services/auth.service'
import { storage } from '../utils/storage'
import { showSuccess, showError } from '../utils/toast'

export const handleLogin = async (credentials, navigate, dispatch) => {
  try {
    const res = await authService.login(credentials)
    storage.setToken(res.data.access)
    storage.setRefreshToken(res.data.refresh)
    storage.setUser(res.data.user)
    showSuccess('Welcome back!')
    navigate('/dashboard')
    return { success: true }
  } catch (err) {
    const msg = err.response?.data?.detail || 'Login failed. Check credentials.'
    showError(msg)
    return { success: false, error: msg }
  }
}

export const handleLogout = async (navigate) => {
  try { await authService.logout() } catch {}
  storage.clearAll()
  navigate('/login')
}
