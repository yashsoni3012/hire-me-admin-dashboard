import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import authService from '../../services/auth.service'
import { showSuccess, showError } from '../../utils/toast'
import { getInitials } from '../../utils/helpers'
import { MdPerson, MdLock } from 'react-icons/md'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_password: '' })

  const handleProfileSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await authService.updateProfile(form); showSuccess('Profile updated') }
    catch { showError('Failed to update profile') } finally { setSaving(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm_password) { showError('Passwords do not match'); return }
    setSaving(true)
    try { await authService.changePassword(pwForm); showSuccess('Password changed'); setPwForm({ old_password: '', new_password: '', confirm_password: '' }) }
    catch { showError('Failed to change password') } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Profile</h2>

      {/* Avatar Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#2c0eee] flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(`${form.first_name} ${form.last_name}`)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{form.first_name} {form.last_name}</h3>
          <p className="text-gray-500">{form.email}</p>
          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#2c0eee] capitalize">{user?.role || 'Admin'}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[{ id: 'profile', label: 'Profile Info', icon: MdPerson }, { id: 'password', label: 'Change Password', icon: MdLock }].map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === t.id ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                <Icon size={16} />{t.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                <Input label="Last Name" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
              </div>
              <Input label="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <Input label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <Button type="submit" loading={saving}>Save Changes</Button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <Input label="Current Password" type="password" required value={pwForm.old_password} onChange={e => setPwForm({...pwForm, old_password: e.target.value})} />
              <Input label="New Password" type="password" required value={pwForm.new_password} onChange={e => setPwForm({...pwForm, new_password: e.target.value})} />
              <Input label="Confirm New Password" type="password" required value={pwForm.confirm_password} onChange={e => setPwForm({...pwForm, confirm_password: e.target.value})} />
              <Button type="submit" loading={saving}>Change Password</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
