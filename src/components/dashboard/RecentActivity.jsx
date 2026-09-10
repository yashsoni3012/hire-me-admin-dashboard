import { timeAgo } from '../../utils/date'
import { getInitials } from '../../utils/helpers'

const RecentActivity = ({ activities = [] }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
    {activities.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
    ) : (
      <ul className="space-y-3">
        {activities.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2c0eee] text-xs font-bold flex-shrink-0 mt-0.5">
              {getInitials(item.user || 'System')}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-700">{item.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.created_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default RecentActivity
