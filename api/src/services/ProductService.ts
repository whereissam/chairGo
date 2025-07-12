import { Product, CreateProductRequest, UpdateProductRequest, PaginationParams } from '../types/api'
import { ProductModel } from '../models/ProductModel'
import { ValidationError, NotFoundError } from '../errors/ApiError'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  image_url: z.string().url().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
  tags: z.array(z.string()).optional()
})

const updateProductSchema = createProductSchema.partial()

export class ProductService {
  private productModel: ProductModel

  constructor(db: D1Database) {
    this.productModel = new ProductModel(db)
  }

  async getProducts(params: PaginationParams & { category?: string; featured?: string }): Promise<{
    products: Product[]
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0, category, featured } = params
    
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100', 'limit')
    }
    
    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative', 'offset')
    }

    const featuredBoolean = featured === 'true' ? true : featured === 'false' ? false : undefined

    return await this.productModel.findAll({
      limit,
      offset,
      category,
      featured: featuredBoolean
    })
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) {
      throw new ValidationError('Product ID is required', 'id')
    }

    const product = await this.productModel.findById(id)
    if (!product) {
      throw new NotFoundError('Product')
    }

    return product
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const validatedData = createProductSchema.parse(data)
      return await this.productModel.create(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid product data', undefined, error.errors)
      }
      throw error
    }
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    if (!id) {
      throw new ValidationError('Product ID is required', 'id')
    }

    try {
      const validatedData = updateProductSchema.parse(data)
      
      if (Object.keys(validatedData).length === 0) {
        throw new ValidationError('At least one field must be provided for update')
      }

      return await this.productModel.update(id, validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid product data', undefined, error.errors)
      }
      throw error
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Product ID is required', 'id')
    }

    const deleted = await this.productModel.delete(id)
    if (!deleted) {
      throw new NotFoundError('Product')
    }
  }

  async getProductStats(): Promise<{
    total: number
    by_category: Record<string, number>
    featured_count: number
    low_stock_count: number
  }> {
    // This would typically involve multiple queries or a more complex aggregation
    // For now, we'll implement a basic version
    const allProducts = await this.productModel.findAll({ limit: 1000, offset: 0 })
    
    const stats = {
      total: allProducts.products.length,
      by_category: {} as Record<string, number>,
      featured_count: 0,
      low_stock_count: 0
    }

    allProducts.products.forEach(product => {
      // Count by category
      stats.by_category[product.category] = (stats.by_category[product.category] || 0) + 1
      
      // Count featured products
      if (product.is_featured) {
        stats.featured_count++
      }
      
      // Count low stock products (less than 10)
      if (product.stock_quantity < 10) {
        stats.low_stock_count++
      }
    })

    return stats
  }
}