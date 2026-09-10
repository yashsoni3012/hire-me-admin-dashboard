import { useState, useEffect } from 'react'
import notificationService from '../../services/notification.service'
import Button from '../../components/common/Button'
import { timeAgo } from '../../utils/date'
import { showSuccess, showError } from '../../utils/toast'
import { MdCheckCircle, MdNotifications, MdDelete } from 'react-icons/md'

const Notifications = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const r = await notificationService.getAll(); setData(r.data.results || r.data) }
    catch { showError('Failed to load') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const markAllRead = async () => {
    try { await notificationService.markAllRead(); showSuccess('All marked as read'); load() }
    catch { showError('Failed') }
  }

  const markRead = async (id) => {
    try { await notificationService.markRead(id); load() } catch {}
  }

  const remove = async (id) => {
    try { await notificationService.delete(id); showSuccess('Deleted'); load() }
    catch { showError('Failed') }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <Button variant="secondary" size="sm" icon={MdCheckCircle} onClick={markAllRead}>Mark All Read</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center">
            <MdNotifications size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : data.map(n => (
          <div key={n.id} className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.is_read ? 'bg-gray-300' : 'bg-[#2c0eee]'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
            </div>
            <div className="flex gap-1">
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} className="p-1.5 hover:bg-blue-100 text-[#2c0eee] rounded-lg transition-colors" title="Mark read">
                  <MdCheckCircle size={16} />
                </button>
              )}
              <button onClick={() => remove(n.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                <MdDelete size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
