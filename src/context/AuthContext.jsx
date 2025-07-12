import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '../config/api'

const AuthContext = createContext(null)

// Secure token storage utility
const TokenStorage = {
  // Use sessionStorage by default, localStorage as fallback with encryption simulation
  setToken: (token) => {
    try {
      // In production, use httpOnly cookies. For now, use sessionStorage which is more secure than localStorage
      sessionStorage.setItem('auth_token', token)
      // Set expiration
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      sessionStorage.setItem('auth_expires', expiresAt.toString())
    } catch (error) {
      console.error('Failed to store token:', error)
    }
  },

  getToken: () => {
    try {
      const token = sessionStorage.getItem('auth_token')
      const expiresAt = sessionStorage.getItem('auth_expires')
      
      if (!token || !expiresAt) return null
      
      // Check if token is expired
      if (Date.now() > parseInt(expiresAt)) {
        TokenStorage.clearToken()
        return null
      }
      
      return token
    } catch (error) {
      console.error('Failed to retrieve token:', error)
      return null
    }
  },

  clearToken: () => {
    try {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_expires')
      sessionStorage.removeItem('auth_user')
      localStorage.removeItem('adminToken') // Clear old insecure storage
      localStorage.removeItem('adminUser')
    } catch (error) {
      console.error('Failed to clear token:', error)
    }
  },

  setUser: (user) => {
    try {
      sessionStorage.setItem('auth_user', JSON.stringify(user))
    } catch (error) {
      console.error('Failed to store user:', error)
    }
  },

  getUser: () => {
    try {
      const user = sessionStorage.getItem('auth_user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Failed to retrieve user:', error)
      return null
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Auto-logout timer
  const [logoutTimer, setLogoutTimer] = useState(null)

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000

  const resetActivityTimer = useCallback(() => {
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }

    const timer = setTimeout(() => {
      logout('Session expired due to inactivity')
    }, SESSION_TIMEOUT)

    setLogoutTimer(timer)
  }, [logoutTimer])

  // Verify token with server
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data && result.data.role === 'admin') {
          return result.data
        }
      }
      
      return null
    } catch (error) {
      console.error('Token verification failed:', error)
      return null
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Login failed')
      }

      // Verify user is admin
      if (result.data.user.role !== 'admin') {
        throw new Error('Admin access required')
      }

      // Store token and user securely
      TokenStorage.setToken(result.data.token)
      TokenStorage.setUser(result.data.user)
      
      setUser(result.data.user)
      setIsAuthenticated(true)
      
      // Start activity timer
      resetActivityTimer()
      
      return { success: true, user: result.data.user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (reason = 'User logged out') => {
    try {
      // Clear timers
      if (logoutTimer) {
        clearTimeout(logoutTimer)
        setLogoutTimer(null)
      }

      // Attempt to notify server (best effort)
      const token = TokenStorage.getToken()
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        } catch (error) {
          // Ignore errors on logout
        }
      }

      // Clear all auth data
      TokenStorage.clearToken()
      setUser(null)
      setIsAuthenticated(false)

      // Show reason if provided
      if (reason !== 'User logged out') {
        alert(reason) // In production, use a proper notification system
      }

    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setLoading(true)
      
      const token = TokenStorage.getToken()
      const storedUser = TokenStorage.getUser()

      if (!token || !storedUser) {
        setLoading(false)
        return
      }

      // Verify token with server
      const verifiedUser = await verifyToken(token)
      
      if (verifiedUser && verifiedUser.role === 'admin') {
        setUser(verifiedUser)
        setIsAuthenticated(true)
        TokenStorage.setUser(verifiedUser) // Update stored user data
        resetActivityTimer()
      } else {
        // Invalid token or user not admin
        TokenStorage.clearToken()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      TokenStorage.clearToken()
    } finally {
      setLoading(false)
    }
  }

  // Activity monitoring
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      
      const handleActivity = () => {
        resetActivityTimer()
      }

      events.forEach(event => {
        document.addEventListener(event, handleActivity, true)
      })

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true)
        })
      }
    }
  }, [isAuthenticated, resetActivityTimer])

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer)
      }
    }
  }, [logoutTimer])

  // API request wrapper with auth
  const authenticatedRequest = async (url, options = {}) => {
    const token = TokenStorage.getToken()
    
    if (!token) {
      logout('Authentication required')
      throw new Error('No authentication token')
    }

    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch(url, authOptions)
      
      // Handle auth errors
      if (response.status === 401) {
        logout('Session expired')
        throw new Error('Authentication expired')
      }

      if (response.status === 403) {
        throw new Error('Access denied')
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Request failed')
      }

      // Reset activity timer on successful request
      resetActivityTimer()

      return result.data
    } catch (error) {
      console.error('Authenticated request failed:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    authenticatedRequest,
    verifyToken: () => verifyToken(TokenStorage.getToken())
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext