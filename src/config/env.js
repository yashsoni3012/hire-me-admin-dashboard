const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://apidata.hiremejobs.in',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CareerAI Admin',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
}
export default env
