import { useAuth } from '../../context/AuthContext'

class AuditLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000 // Keep last 1000 logs in memory
  }

  log(action, resource, details = {}, user = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      user: user ? {
        id: user.id,
        username: user.username,
        role: user.role
      } : null,
      action,
      resource,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side', // In production, get from server
      sessionId: sessionStorage.getItem('auth_token')?.substring(0, 8) + '...'
    }

    this.logs.unshift(logEntry)
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Store in localStorage for persistence
    try {
      const recentLogs = this.logs.slice(0, 100) // Store only 100 recent logs
      localStorage.setItem('admin_audit_logs', JSON.stringify(recentLogs))
    } catch (error) {
      console.warn('Failed to store audit logs:', error)
    }

    // In production, also send to server
    this.sendToServer(logEntry)
  }

  async sendToServer(logEntry) {
    try {
      // In production, send audit logs to secure endpoint
      // await fetch('/api/v1/admin/audit-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // })
      
      console.log('Audit Log:', logEntry) // For development
    } catch (error) {
      console.error('Failed to send audit log to server:', error)
    }
  }

  getLogs(limit = 50) {
    return this.logs.slice(0, limit)
  }

  getLogsByUser(userId, limit = 50) {
    return this.logs
      .filter(log => log.user?.id === userId)
      .slice(0, limit)
  }

  getLogsByAction(action, limit = 50) {
    return this.logs
      .filter(log => log.action === action)
      .slice(0, limit)
  }

  clearLogs() {
    this.logs = []
    localStorage.removeItem('admin_audit_logs')
  }

  // Load persisted logs on initialization
  loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('admin_audit_logs')
      if (stored) {
        this.logs = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load persisted audit logs:', error)
    }
  }
}

// Global audit logger instance
const auditLogger = new AuditLogger()
auditLogger.loadPersistedLogs()

// Hook for easy access in components
export const useAuditLogger = () => {
  const { user } = useAuth()

  const logAction = (action, resource, details = {}) => {
    auditLogger.log(action, resource, details, user)
  }

  return {
    logAction,
    getLogs: () => auditLogger.getLogs(),
    getLogsByUser: (userId) => auditLogger.getLogsByUser(userId),
    getLogsByAction: (action) => auditLogger.getLogsByAction(action),
    clearLogs: () => auditLogger.clearLogs()
  }
}

export default auditLogger