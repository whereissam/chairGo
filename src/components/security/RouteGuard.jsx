import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const RouteGuard = ({ children, allowUnauthenticated = false }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If route allows unauthenticated users, render children
  if (allowUnauthenticated) {
    return children
  }

  // If user is authenticated, render children
  if (isAuthenticated) {
    return children
  }

  // If user is not authenticated and route requires auth, redirect
  return <Navigate to="/admin" replace />
}

export default RouteGuard