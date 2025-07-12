import { User, PaginationParams } from '../types/api'
import { UserModel } from '../models/UserModel'
import { ProductService } from './ProductService'
import { ValidationError, NotFoundError } from '../errors/ApiError'

export class AdminService {
  private userModel: UserModel
  private productService: ProductService

  constructor(db: D1Database) {
    this.userModel = new UserModel(db)
    this.productService = new ProductService(db)
  }

  async getDashboardStats(): Promise<{
    users: {
      total: number
      admins: number
      regular_users: number
    }
    products: {
      total: number
      by_category: Record<string, number>
      featured_count: number
      low_stock_count: number
    }
  }> {
    // Get all users for stats (assuming small user base)
    const allUsers = await this.userModel.findAll({ limit: 1000, offset: 0 })
    
    const userStats = {
      total: allUsers.users.length,
      admins: allUsers.users.filter(u => u.role === 'admin').length,
      regular_users: allUsers.users.filter(u => u.role === 'user').length
    }

    const productStats = await this.productService.getProductStats()

    return {
      users: userStats,
      products: productStats
    }
  }

  async getUsers(params: PaginationParams): Promise<{
    users: User[]
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0 } = params
    
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100', 'limit')
    }
    
    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative', 'offset')
    }

    return await this.userModel.findAll({ limit, offset })
  }

  async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<User> {
    if (!userId) {
      throw new ValidationError('User ID is required', 'userId')
    }

    if (!['admin', 'user'].includes(role)) {
      throw new ValidationError('Role must be either "admin" or "user"', 'role')
    }

    return await this.userModel.updateRole(userId, role)
  }

  async deleteUser(userId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError('User ID is required', 'userId')
    }

    const deleted = await this.userModel.delete(userId)
    if (!deleted) {
      throw new NotFoundError('User')
    }
  }

  async bulkUpdateProducts(operations: Array<{
    action: 'update_stock' | 'update_category' | 'toggle_featured'
    productIds: string[]
    data?: any
  }>): Promise<{ success: number; failed: number; errors: any[] }> {
    let success = 0
    let failed = 0
    const errors: any[] = []

    for (const operation of operations) {
      for (const productId of operation.productIds) {
        try {
          switch (operation.action) {
            case 'update_stock':
              if (typeof operation.data?.stock_quantity !== 'number') {
                throw new ValidationError('stock_quantity must be a number')
              }
              await this.productService.updateProduct(productId, {
                stock_quantity: operation.data.stock_quantity
              })
              break

            case 'update_category':
              if (!operation.data?.category) {
                throw new ValidationError('category is required')
              }
              await this.productService.updateProduct(productId, {
                category: operation.data.category
              })
              break

            case 'toggle_featured':
              const product = await this.productService.getProductById(productId)
              await this.productService.updateProduct(productId, {
                is_featured: !product.is_featured
              })
              break

            default:
              throw new ValidationError(`Unknown action: ${operation.action}`)
          }
          success++
        } catch (error) {
          failed++
          errors.push({
            productId,
            action: operation.action,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    return { success, failed, errors }
  }
}