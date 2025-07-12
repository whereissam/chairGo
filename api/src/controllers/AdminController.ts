import type { Context } from 'hono'
import { AdminService } from '../services/AdminService'
import { AuthService } from '../services/AuthService'
import { ApiError } from '../errors/ApiError'
import { ApiResponse, ResponseMeta } from '../types/api'

export class AdminController {
  private adminService: AdminService
  private authService: AuthService

  constructor(db: D1Database, jwtSecret: string) {
    this.adminService = new AdminService(db)
    this.authService = new AuthService(db, jwtSecret)
  }

  async getDashboard(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const stats = await this.adminService.getDashboardStats()

      const response: ApiResponse = {
        data: stats,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async getUsers(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const { limit = '20', offset = '0' } = c.req.query()
      
      const result = await this.adminService.getUsers({
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const meta: ResponseMeta = {
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: result.hasMore
        },
        timestamp: Math.floor(Date.now() / 1000)
      }

      const response: ApiResponse = {
        data: result.users,
        meta
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async updateUserRole(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const userId = c.req.param('id')
      const { role } = await c.req.json()
      
      const user = await this.adminService.updateUserRole(userId, role)

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

  async deleteUser(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const userId = c.req.param('id')
      await this.adminService.deleteUser(userId)

      const response: ApiResponse = {
        data: { deleted: true },
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async bulkUpdateProducts(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const { operations } = await c.req.json()
      const result = await this.adminService.bulkUpdateProducts(operations)

      const response: ApiResponse = {
        data: result,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  private handleError(c: Context, error: any): Response {
    if (error instanceof ApiError) {
      const response: ApiResponse = {
        error: error.toJSON(),
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }
      return c.json(response, error.statusCode as any)
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
    return c.json(response, 500 as any)
  }
}