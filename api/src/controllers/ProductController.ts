import { Context } from 'hono'
import { ProductService } from '../services/ProductService'
import { AuthService } from '../services/AuthService'
import { ApiError } from '../errors/ApiError'
import { ApiResponse, ResponseMeta } from '../types/api'

export class ProductController {
  private productService: ProductService
  private authService: AuthService

  constructor(db: D1Database, jwtSecret: string) {
    this.productService = new ProductService(db)
    this.authService = new AuthService(db, jwtSecret)
  }

  async getProducts(c: Context): Promise<Response> {
    try {
      const { limit = '20', offset = '0', category, featured } = c.req.query()
      
      const result = await this.productService.getProducts({
        limit: parseInt(limit),
        offset: parseInt(offset),
        category,
        featured
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
        data: result.products,
        meta
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async getProduct(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      const product = await this.productService.getProductById(id)

      const response: ApiResponse = {
        data: product,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async createProduct(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const body = await c.req.json()
      const product = await this.productService.createProduct(body)

      const response: ApiResponse = {
        data: product,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response, 201)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async updateProduct(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const id = c.req.param('id')
      const body = await c.req.json()
      const product = await this.productService.updateProduct(id, body)

      const response: ApiResponse = {
        data: product,
        meta: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      }

      return c.json(response)
    } catch (error) {
      return this.handleError(c, error)
    }
  }

  async deleteProduct(c: Context): Promise<Response> {
    try {
      // Verify admin authentication
      const authHeader = c.req.header('Authorization')
      const token = this.authService.extractTokenFromHeader(authHeader)
      await this.authService.verifyAdminToken(token)

      const id = c.req.param('id')
      await this.productService.deleteProduct(id)

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