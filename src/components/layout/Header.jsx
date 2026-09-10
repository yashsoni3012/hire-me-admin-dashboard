import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/slices/uiSlice'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { MdMenu, MdNotifications, MdSearch, MdLogout, MdPerson } from 'react-icons/md'
import { getInitials } from '../../utils/helpers'
import { useState } from 'react'

const Header = ({ title }) => {
  const dispatch = useDispatch()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-[#4529f7] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <MdMenu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <MdSearch size={20} />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <MdNotifications size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative ml-1">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#2c0eee] flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.first_name + ' ' + user?.last_name || 'Admin')}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.first_name || 'Admin'}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-12 z-20 bg-white rounded-xl shadow-lg border border-gray-100 w-48 py-1">
                <button onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <MdPerson size={18} /> My Profile
                </button>
                <button onClick={() => { navigate('/settings'); setDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  ⚙️ Settings
                </button>
                <hr className="my-1 border-gray-100" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <MdLogout size={18} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
