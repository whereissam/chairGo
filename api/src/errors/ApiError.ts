import { ApiError as ApiErrorType } from '../types/api'

export class ApiError extends Error {
  public readonly type: ApiErrorType['type']
  public readonly code?: string
  public readonly param?: string
  public readonly details?: any
  public readonly statusCode: number

  constructor(
    type: ApiErrorType['type'],
    message: string,
    statusCode: number,
    code?: string,
    param?: string,
    details?: any
  ) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.code = code
    this.param = param
    this.details = details
    this.statusCode = statusCode
  }

  toJSON(): ApiErrorType {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      param: this.param,
      details: this.details
    }
  }
}

// Specific error classes
export class ValidationError extends ApiError {
  constructor(message: string, param?: string, details?: any) {
    super('validation_error', message, 400, 'validation_failed', param, details)
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super('authentication_error', message, 401, 'authentication_failed')
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super('authorization_error', message, 403, 'authorization_failed')
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super('not_found_error', `${resource} not found`, 404, 'not_found')
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super('rate_limit_error', message, 429, 'rate_limit_exceeded')
  }
}