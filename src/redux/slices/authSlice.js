import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/auth.service'
import { storage } from '../../utils/storage'

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const res = await authService.login(creds)
    storage.setToken(res.data.access)
    storage.setRefreshToken(res.data.refresh)
    storage.setUser(res.data.user)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Login failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout() } catch {}
  storage.clearAll()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storage.getUser(),
    token: storage.getToken(),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.access })
      .addCase(loginUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
