import { showSuccess, showError, showInfo } from '../utils/toast'
const useToast = () => ({ success: showSuccess, error: showError, info: showInfo })
export default useToast
