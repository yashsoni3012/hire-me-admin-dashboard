import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: true, theme: 'light' },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebar:    (state, action) => { state.sidebarOpen = action.payload },
    toggleTheme:   (state) => { state.theme = state.theme === 'light' ? 'dark' : 'light' },
  },
})

export const { toggleSidebar, setSidebar, toggleTheme } = uiSlice.actions
export default uiSlice.reducer
