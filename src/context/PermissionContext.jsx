import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const PermissionContext = createContext([])

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth()
  const permissions = user?.permissions || []
  return <PermissionContext.Provider value={permissions}>{children}</PermissionContext.Provider>
}

export const usePermissions = () => useContext(PermissionContext)
export const useCan = (perm) => useContext(PermissionContext).includes(perm)
