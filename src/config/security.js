// Security Configuration
export const SECURITY_CONFIG = {
  // Session management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  
  // Login security
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL_CHARS: true,
  
  // API security
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  
  // Audit logging
  AUDIT_LOG_RETENTION: 30 * 24 * 60 * 60 * 1000, // 30 days
  MAX_AUDIT_LOGS: 10000,
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
  
  // Content Security Policy
  CSP_POLICY: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://api.openai.com']
  }
}

// Security utility functions
export const SecurityUtils = {
  // Validate password strength
  validatePassword: (password) => {
    const errors = []
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`)
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  // Generate secure random string
  generateSecureToken: (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },
  
  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  },
  
  // Check if IP is suspicious (basic implementation)
  isSuspiciousIP: (ip) => {
    // In production, integrate with threat intelligence APIs
    const suspiciousPatterns = [
      /^10\./, // Private networks (for demo)
      /^192\.168\./, // Private networks (for demo)
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(ip))
  },
  
  // Rate limiting check
  checkRateLimit: (key, maxRequests = 100, windowMs = 60000) => {
    const now = Date.now()
    const stored = localStorage.getItem(`rateLimit_${key}`)
    
    if (!stored) {
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify({
        count: 1,
        resetTime: now + windowMs
      }))
      return { allowed: true, remaining: maxRequests - 1 }
    }
    
    const { count, resetTime } = JSON.parse(stored)
    
    if (now > resetTime) {
      // Reset window
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify({
        count: 1,
        resetTime: now + windowMs
      }))
      return { allowed: true, remaining: maxRequests - 1 }
    }
    
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0, resetIn: resetTime - now }
    }
    
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify({
      count: count + 1,
      resetTime
    }))
    
    return { allowed: true, remaining: maxRequests - count - 1 }
  }
}

// Security event types for audit logging
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  SESSION_EXPIRED: 'session_expired',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ADMIN_ACTION: 'admin_action',
  DATA_ACCESS: 'data_access',
  SECURITY_VIOLATION: 'security_violation'
}