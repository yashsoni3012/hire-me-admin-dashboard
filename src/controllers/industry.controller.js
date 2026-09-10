import industryService from '../services/industry.service'
import { showSuccess, showError } from '../utils/toast'

export const createIndustry = async (data) => {
  try {
    const res = await industryService.create(data)
    showSuccess('Industry created')
    return { success: true, data: res.data }
  } catch { showError('Failed to create industry'); return { success: false } }
}

export const updateIndustry = async (id, data) => {
  try {
    const res = await industryService.update(id, data)
    showSuccess('Industry updated')
    return { success: true, data: res.data }
  } catch { showError('Failed to update industry'); return { success: false } }
}

export const deleteIndustry = async (id) => {
  try {
    await industryService.delete(id)
    showSuccess('Industry deleted')
    return { success: true }
  } catch { showError('Failed to delete industry'); return { success: false } }
}
