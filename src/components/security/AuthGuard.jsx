import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AuthGuard = ({ children, action, resource }) => {
  const { user, isAuthenticated } = useAuth()
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Basic permission checking - can be extended with more complex rules
    const checkPermission = () => {
      if (!isAuthenticated || !user) {
        setHasPermission(false)
        return
      }

      // Admin has all permissions
      if (user.role === 'admin') {
        setHasPermission(true)
        return
      }

      // Add more granular permission logic here
      // For now, only admins have access
      setHasPermission(false)
    }

    checkPermission()
  }, [user, isAuthenticated, action, resource])

  if (!hasPermission) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-yellow-600 mr-2">⚠️</div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Insufficient Permissions
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              You don't have permission to {action} {resource}.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default AuthGuard