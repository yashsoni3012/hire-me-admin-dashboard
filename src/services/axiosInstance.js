import axios from 'axios'
import { storage } from '../utils/storage'
import env from '../config/env'

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      storage.clearAll()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
