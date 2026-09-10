import departmentService from '../services/department.service'
import { showSuccess, showError } from '../utils/toast'

export const createDepartment = async (data) => {
  try { const res = await departmentService.create(data); showSuccess('Department created'); return { success: true, data: res.data } }
  catch { showError('Failed to create department'); return { success: false } }
}
export const updateDepartment = async (id, data) => {
  try { const res = await departmentService.update(id, data); showSuccess('Department updated'); return { success: true, data: res.data } }
  catch { showError('Failed to update department'); return { success: false } }
}
export const deleteDepartment = async (id) => {
  try { await departmentService.delete(id); showSuccess('Department deleted'); return { success: true } }
  catch { showError('Failed to delete department'); return { success: false } }
}
