import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const SecureLoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)

  const { login, isAuthenticated } = useAuth()
  const location = useLocation()

  // Rate limiting - block after 5 failed attempts for 15 minutes
  const MAX_ATTEMPTS = 5
  const BLOCK_DURATION = 15 * 60 * 1000 // 15 minutes

  useEffect(() => {
    // Check if user is blocked
    const blockUntil = localStorage.getItem('loginBlockUntil')
    if (blockUntil) {
      const blockTime = parseInt(blockUntil)
      const now = Date.now()
      
      if (now < blockTime) {
        setIsBlocked(true)
        setBlockTimeRemaining(Math.ceil((blockTime - now) / 1000))
        
        // Update countdown
        const interval = setInterval(() => {
          const remaining = Math.ceil((blockTime - Date.now()) / 1000)
          if (remaining <= 0) {
            setIsBlocked(false)
            setBlockTimeRemaining(0)
            localStorage.removeItem('loginBlockUntil')
            localStorage.removeItem('loginAttempts')
            setAttempts(0)
            clearInterval(interval)
          } else {
            setBlockTimeRemaining(remaining)
          }
        }, 1000)

        return () => clearInterval(interval)
      } else {
        // Block expired
        localStorage.removeItem('loginBlockUntil')
        localStorage.removeItem('loginAttempts')
      }
    }

    // Get current attempts
    const currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0')
    setAttempts(currentAttempts)
  }, [])

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from || '/admin/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError(`Too many failed attempts. Try again in ${Math.ceil(blockTimeRemaining / 60)} minutes.`)
      return
    }

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      })

      if (result.success) {
        // Clear failed attempts on successful login
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginBlockUntil')
        setAttempts(0)
        
        // Redirect will happen automatically via AuthContext
      } else {
        // Increment failed attempts
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem('loginAttempts', newAttempts.toString())

        if (newAttempts >= MAX_ATTEMPTS) {
          // Block user
          const blockUntil = Date.now() + BLOCK_DURATION
          localStorage.setItem('loginBlockUntil', blockUntil.toString())
          setIsBlocked(true)
          setBlockTimeRemaining(BLOCK_DURATION / 1000)
          setError(`Too many failed attempts. Account blocked for ${BLOCK_DURATION / 60000} minutes.`)
        } else {
          setError(result.error || 'Invalid credentials')
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure authentication required
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={isBlocked || loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isBlocked || loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="text-red-400 mr-2">⚠️</div>
                <div className="text-sm text-red-800">{error}</div>
              </div>
            </div>
          )}

          {isBlocked && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex items-center">
                <div className="text-yellow-400 mr-2">🔒</div>
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    Account Temporarily Blocked
                  </div>
                  <div className="text-sm text-yellow-700">
                    Time remaining: {formatTime(blockTimeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {attempts > 0 && attempts < MAX_ATTEMPTS && !isBlocked && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="text-sm text-yellow-800">
                Failed attempts: {attempts}/{MAX_ATTEMPTS}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isBlocked || loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : isBlocked ? (
                'Account Blocked'
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>⚠️ Security Notice:</p>
            <p>• Sessions expire after 30 minutes of inactivity</p>
            <p>• Maximum {MAX_ATTEMPTS} login attempts allowed</p>
            <p>• All admin actions are logged</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecureLoginForm