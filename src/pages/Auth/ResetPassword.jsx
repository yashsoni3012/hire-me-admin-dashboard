import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import authService from '../../services/auth.service'
import { showSuccess, showError } from '../../utils/toast'

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { showError('Passwords do not match'); return }
    setLoading(true)
    try {
      await authService.resetPassword({ password: form.password, token: params.get('token') })
      showSuccess('Password reset successfully')
      navigate('/login')
    } catch { showError('Reset link expired or invalid') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#2c0eee] to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Set New Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New Password" type="password" required placeholder="Enter new password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <Input label="Confirm Password" type="password" required placeholder="Confirm new password"
              value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
            <Button type="submit" className="w-full justify-center py-3" loading={loading}>Reset Password</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
