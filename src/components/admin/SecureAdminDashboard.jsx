import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthGuard from '../security/AuthGuard'
import SecurityMonitor from '../security/SecurityMonitor'
import DashboardStats from './DashboardStats'
import ProductManager from './ProductManager'
import UserManager from './UserManager'
import AuditLogViewer from './AuditLogViewer'

const SecureAdminDashboard = () => {
  const { user, logout, authenticatedRequest } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sessionInfo, setSessionInfo] = useState({
    loginTime: null,
    lastActivity: null
  })

  useEffect(() => {
    // Set session info
    setSessionInfo({
      loginTime: new Date().toLocaleString(),
      lastActivity: new Date().toLocaleString()
    })

    // Update last activity periodically
    const interval = setInterval(() => {
      setSessionInfo(prev => ({
        ...prev,
        lastActivity: new Date().toLocaleString()
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', component: DashboardStats },
    { id: 'products', name: 'Products', icon: '📦', component: ProductManager },
    { id: 'users', name: 'Users', icon: '👥', component: UserManager },
    { id: 'audit', name: 'Audit Logs', icon: '🔍', component: AuditLogViewer }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <SecurityMonitor>
      <div className="min-h-screen bg-gray-50">
      {/* Security Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🔐 Secure Admin Panel
              </h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Protected
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Session Info */}
              <div className="hidden md:block text-sm text-gray-500">
                <div>Welcome, <span className="font-medium">{user?.username}</span></div>
                <div className="text-xs">Role: {user?.role}</div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Status Bar */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-blue-700">
              <span>🕒 Session: Active</span>
              <span>📍 Last Activity: {sessionInfo.lastActivity}</span>
              <span>🔄 Auto-logout: 30min inactivity</span>
            </div>
            <div className="text-blue-600">
              🔒 Secure Connection
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Security Notice */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
              <div className="text-sm text-yellow-700 mt-1">
                You are accessing a secured admin area. All actions are logged and monitored.
                Sessions expire after 30 minutes of inactivity.
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content with Authorization Guards */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'dashboard' && (
            <AuthGuard action="view" resource="dashboard">
              <DashboardStats />
            </AuthGuard>
          )}
          
          {activeTab === 'products' && (
            <AuthGuard action="manage" resource="products">
              <ProductManager />
            </AuthGuard>
          )}
          
          {activeTab === 'users' && (
            <AuthGuard action="manage" resource="users">
              <UserManager />
            </AuthGuard>
          )}
          
          {activeTab === 'audit' && (
            <AuthGuard action="view" resource="audit-logs">
              <AuditLogViewer />
            </AuthGuard>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div>
              🔐 ChairGo Admin - Secured with enterprise-grade authentication
            </div>
            <div className="flex items-center space-x-4">
              <span>Session ID: {user?.id}</span>
              <span>Login Time: {sessionInfo.loginTime}</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </SecurityMonitor>
  )
}

export default SecureAdminDashboard