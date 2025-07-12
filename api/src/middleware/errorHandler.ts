import { Context } from 'hono'
import { ApiError } from '../errors/ApiError'
import { ApiResponse } from '../types/api'

export const errorHandler = (err: Error, c: Context) => {
  console.error('Error:', err)

  if (err instanceof ApiError) {
    const response: ApiResponse = {
      error: err.toJSON(),
      meta: {
        timestamp: Math.floor(Date.now() / 1000)
      }
    }
    return c.json(response, err.statusCode)
  }

  // Handle unknown errors
  const response: ApiResponse = {
    error: {
      type: 'api_error',
      message: 'Internal server error'
    },
    meta: {
      timestamp: Math.floor(Date.now() / 1000)
    }
  }
  return c.json(response, 500)
}