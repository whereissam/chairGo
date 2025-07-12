import { Context } from 'hono'
import { AuthService } from '../services/AuthService'
import { ApiError } from '../errors/ApiError'
import { ApiResponse, ResponseMeta } from '../types/api'

export class AuthController {
  private authService: AuthService

  constructor(db: D1Database, jwtSecret: string) {
    this.authService = new AuthService(db, jwtSecret)
  }

  async login(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const authResponse = await this.authService.login(body)

      const response: ApiResponse = {
        data: authResponse,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async register(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const user = await this.authService.register(body)

      const response: ApiResponse = {
        data: user,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response, 201)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async verify(c: Context): Promise<Response> {
    try {
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      const user = await this.authService.verifyToken(token)

      const response: ApiResponse = {
        data: user,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async logout(c: Context): Promise<Response> {
    const response: ApiResponse = {
      data: { message: 'Logged out successfully' },
      meta: {
        timestamp: Math.floor(Date.now() / 1000)
      }
    }

    return c.json(response)
  }

  private handleError(c: Context, error: any): Response {
    if (error instanceof ApiError) {
      const response: ApiResponse = {
        error: error.toJSON(),
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }
      return c.json(response, error.statusCode)
    }

    console.error('Unexpected error:', error)
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
}