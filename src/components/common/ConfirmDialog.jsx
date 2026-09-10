import Button from './Button'
import Modal from './Modal'
import { MdWarning } from 'react-icons/md'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, loading = false, confirmLabel = 'Confirm', variant = 'danger' }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <MdWarning className="text-red-600" size={24} />
      </div>
      <p className="text-gray-600">{message}</p>
      <div className="flex gap-3 w-full">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant={variant} className="flex-1" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </div>
  </Modal>
)

export default ConfirmDialog
