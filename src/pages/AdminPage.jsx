import { useState, useEffect } from 'react'
import { LoginForm } from '../components/admin/LoginForm'
import { AdminDashboard } from '../components/admin/AdminDashboard'

function AdminPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken')
    const savedUser = localStorage.getItem('adminUser')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}

export default AdminPage;
