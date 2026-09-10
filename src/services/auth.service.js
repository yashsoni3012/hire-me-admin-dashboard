import { storage } from '../utils/storage'

const STATIC_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123',
}

const initialUser = {
  id: 1,
  first_name: 'CareerAI',
  last_name: 'Admin',
  email: STATIC_CREDENTIALS.email,
  role: 'Admin',
  phone: '',
}

let staticUser = storage.getUser() || initialUser
let staticPassword = STATIC_CREDENTIALS.password

const authService = {
  login: (data) => new Promise((resolve, reject) => {
    const { email, password } = data
    setTimeout(() => {
      if (email === STATIC_CREDENTIALS.email && password === staticPassword) {
        storage.setUser(staticUser)
        resolve({ data: { access: 'static-access-token', refresh: 'static-refresh-token', user: staticUser } })
      } else {
        reject({ response: { data: { detail: 'Invalid email or password' } } })
      }
    }, 200)
  }),

  logout: () => Promise.resolve({ data: { success: true } }),

  getProfile: () => new Promise((resolve, reject) => {
    const token = storage.getToken()
    if (token) {
      resolve({ data: staticUser })
    } else {
      reject({ response: { status: 401, data: { detail: 'Unauthorized' } } })
    }
  }),

  updateProfile: (data) => new Promise((resolve, reject) => {
    const token = storage.getToken()
    if (!token) {
      return reject({ response: { status: 401, data: { detail: 'Unauthorized' } } })
    }
    staticUser = { ...staticUser, ...data }
    storage.setUser(staticUser)
    resolve({ data: staticUser })
  }),

  changePassword: (data) => new Promise((resolve, reject) => {
    const token = storage.getToken()
    if (!token) {
      return reject({ response: { status: 401, data: { detail: 'Unauthorized' } } })
    }

    if (data.old_password !== staticPassword) {
      return reject({ response: { data: { detail: 'Current password is incorrect' } } })
    }

    if (!data.new_password) {
      return reject({ response: { data: { detail: 'New password is required' } } })
    }

    staticPassword = data.new_password
    resolve({ data: { success: true } })
  }),

  forgotPassword: (data) => new Promise((resolve, reject) => {
    if (data.email === staticUser.email) {
      resolve({ data: { detail: 'Password reset instructions have been sent to your email.' } })
    } else {
      reject({ response: { data: { detail: 'Email not found' } } })
    }
  }),

  resetPassword: (data) => new Promise((resolve, reject) => {
    if (!data.password) {
      return reject({ response: { data: { detail: 'Password is required' } } })
    }
    staticPassword = data.password
    resolve({ data: { success: true } })
  }),
}

export default authService
