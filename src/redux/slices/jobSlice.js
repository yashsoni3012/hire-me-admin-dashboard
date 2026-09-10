import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import jobService from '../../services/job.service'

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (params, { rejectWithValue }) => {
  try { const res = await jobService.getAll(params); return res.data } catch (e) { return rejectWithValue(e.response?.data) }
})

const jobSlice = createSlice({
  name: 'jobs',
  initialState: { list: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending,   (s) => { s.loading = true })
      .addCase(fetchJobs.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.results || a.payload; s.total = a.payload.count || 0 })
      .addCase(fetchJobs.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
  },
})
export default jobSlice.reducer
