import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

const PrivateRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="lg" /></div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
