import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAuditLogger } from './AuditLogger'
import { SECURITY_CONFIG, SecurityUtils, SECURITY_EVENTS } from '../../config/security'

const SecurityMonitor = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const { logAction } = useAuditLogger()
  const [securityAlerts, setSecurityAlerts] = useState([])

  useEffect(() => {
    if (!isAuthenticated) return

    let securityChecks = []

    // Monitor for suspicious activities
    const monitorActivity = () => {
      // Check for multiple tabs/sessions
      const handleStorageChange = (e) => {
        if (e.key === 'auth_token' && e.newValue !== e.oldValue) {
          if (e.newValue === null) {
            // Token removed in another tab
            logAction(SECURITY_EVENTS.LOGOUT, 'session', { reason: 'token_removed_other_tab' })
          } else if (e.oldValue && e.newValue && e.oldValue !== e.newValue) {
            // Token changed in another tab (possible session hijacking)
            setSecurityAlerts(prev => [...prev, {
              id: Date.now(),
              type: 'warning',
              message: 'Session detected in another tab. Please verify this is you.',
              timestamp: new Date().toISOString()
            }])
            logAction(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, 'session', { reason: 'token_changed_other_tab' })
          }
        }
      }

      window.addEventListener('storage', handleStorageChange)
      securityChecks.push(() => window.removeEventListener('storage', handleStorageChange))

      // Monitor for rapid API requests (potential bot behavior)
      let requestCount = 0
      const requestWindow = 60000 // 1 minute
      
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        requestCount++
        
        // Reset counter every minute
        setTimeout(() => requestCount = Math.max(0, requestCount - 1), requestWindow)
        
        // Alert if too many requests
        if (requestCount > 100) { // 100 requests per minute
          setSecurityAlerts(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            message: 'Unusual activity detected. Please refresh the page.',
            timestamp: new Date().toISOString()
          }])
          logAction(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, 'api', { 
            reason: 'high_request_rate', 
            count: requestCount 
          })
        }
        
        return originalFetch(...args)
      }

      securityChecks.push(() => {
        window.fetch = originalFetch
      })

      // Monitor for console access (potential script injection)
      const originalConsoleLog = console.log
      console.log = (...args) => {
        // Check for suspicious console usage
        const message = args.join(' ')
        if (message.includes('token') || message.includes('password') || message.includes('admin')) {
          logAction(SECURITY_EVENTS.SECURITY_VIOLATION, 'console', { 
            reason: 'suspicious_console_access',
            message: message.substring(0, 100) 
          })
        }
        return originalConsoleLog(...args)
      }

      securityChecks.push(() => {
        console.log = originalConsoleLog
      })

      // Monitor for DOM manipulation attempts
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.tagName === 'SCRIPT') {
                setSecurityAlerts(prev => [...prev, {
                  id: Date.now(),
                  type: 'error',
                  message: 'Unauthorized script detected. Session will be terminated.',
                  timestamp: new Date().toISOString()
                }])
                logAction(SECURITY_EVENTS.SECURITY_VIOLATION, 'dom', { 
                  reason: 'script_injection_attempt' 
                })
                logout('Security violation detected')
              }
            })
          }
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      securityChecks.push(() => observer.disconnect())

      // Check for browser developer tools
      let devtools = false
      const checkDevTools = () => {
        const before = new Date()
        debugger
        const after = new Date()
        
        if (after - before > 100) { // DevTools open
          if (!devtools) {
            devtools = true
            setSecurityAlerts(prev => [...prev, {
              id: Date.now(),
              type: 'warning',
              message: 'Developer tools detected. Admin actions are monitored.',
              timestamp: new Date().toISOString()
            }])
            logAction(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, 'browser', { 
              reason: 'developer_tools_detected' 
            })
          }
        } else {
          devtools = false
        }
      }

      const devToolsInterval = setInterval(checkDevTools, 5000)
      securityChecks.push(() => clearInterval(devToolsInterval))
    }

    // Initialize monitoring
    monitorActivity()

    // Log successful authentication
    logAction(SECURITY_EVENTS.LOGIN_SUCCESS, 'admin_panel', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })

    // Cleanup on unmount
    return () => {
      securityChecks.forEach(cleanup => cleanup())
    }
  }, [isAuthenticated, user, logAction, logout])

  // Auto-dismiss security alerts
  useEffect(() => {
    securityAlerts.forEach(alert => {
      setTimeout(() => {
        setSecurityAlerts(prev => prev.filter(a => a.id !== alert.id))
      }, 10000) // Dismiss after 10 seconds
    })
  }, [securityAlerts])

  return (
    <div>
      {/* Security Alerts */}
      {securityAlerts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {securityAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${
                alert.type === 'error' 
                  ? 'bg-red-100 border border-red-400 text-red-700'
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2">
                  {alert.type === 'error' ? '🚨' : '⚠️'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Security Alert</div>
                  <div className="text-sm mt-1">{alert.message}</div>
                  <div className="text-xs mt-2 opacity-75">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => setSecurityAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  className="ml-2 text-lg leading-none hover:opacity-75"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  )
}

export default SecurityMonitor