import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants'

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearAll: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_TOKEN_KEY); localStorage.removeItem(USER_KEY) },
}
