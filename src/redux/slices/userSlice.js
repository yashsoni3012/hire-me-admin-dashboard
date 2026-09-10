import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/user.service'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await userService.getAll(params); return res.data } catch (e) { return rejectWithValue(e.response?.data) }
})

const userSlice = createSlice({
  name: 'users',
  initialState: { list: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (s) => { s.loading = true })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.results || a.payload; s.total = a.payload.count || 0 })
      .addCase(fetchUsers.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
  },
})
export default userSlice.reducer
