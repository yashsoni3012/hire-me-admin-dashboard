import axiosInstance from './axiosInstance'
import env from '../config/env'

export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
  const data = await res.json()
  return data.secure_url
}

export const uploadToServer = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance.post('/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}
