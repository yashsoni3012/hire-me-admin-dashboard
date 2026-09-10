import userService from '../services/user.service'
import { showSuccess, showError } from '../utils/toast'

export const createUser = async (data) => {
  try {
    const res = await userService.create(data)
    showSuccess('User created successfully')
    return { success: true, data: res.data }
  } catch (err) {
    showError(err.response?.data?.detail || 'Failed to create user')
    return { success: false }
  }
}

export const updateUser = async (id, data) => {
  try {
    const res = await userService.update(id, data)
    showSuccess('User updated successfully')
    return { success: true, data: res.data }
  } catch (err) {
    showError(err.response?.data?.detail || 'Failed to update user')
    return { success: false }
  }
}

export const deleteUser = async (id) => {
  try {
    await userService.delete(id)
    showSuccess('User deleted successfully')
    return { success: true }
  } catch (err) {
    showError('Failed to delete user')
    return { success: false }
  }
}

export const toggleUserStatus = async (id) => {
  try {
    const res = await userService.toggleStatus(id)
    showSuccess('User status updated')
    return { success: true, data: res.data }
  } catch (err) {
    showError('Failed to update status')
    return { success: false }
  }
}
