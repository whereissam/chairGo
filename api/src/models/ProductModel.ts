import { Product, CreateProductRequest, UpdateProductRequest, PaginationParams } from '../types/api'
import { NotFoundError } from '../errors/ApiError'

export class ProductModel {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findAll(params: PaginationParams & { category?: string; featured?: boolean }): Promise<{
    products: Product[]
    hasMore: boolean
    total?: number
  }> {
    const { limit = 20, offset = 0, category, featured } = params
    
    let query = 'SELECT * FROM products WHERE 1=1'
    const queryParams: any[] = []

    if (category) {
      query += ' AND category = ?'
      queryParams.push(category)
    }

    if (featured !== undefined) {
      query += ' AND is_featured = ?'
      queryParams.push(featured ? 1 : 0)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    queryParams.push(limit, offset)

    const result = await this.db.prepare(query).bind(...queryParams).all()
    const products = result.results?.map(this.transformToProduct) || []

    // Check if there are more results
    const nextResult = await this.db.prepare(query.replace('LIMIT ? OFFSET ?', 'LIMIT 1 OFFSET ?'))
      .bind(...queryParams.slice(0, -2), limit + offset).all()
    
    const hasMore = (nextResult.results?.length || 0) > 0

    return { products, hasMore }
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
    return result ? this.transformToProduct(result) : null
  }

  async create(data: CreateProductRequest): Promise<Product> {
    const now = Date.now()
    const created = Math.floor(now / 1000)

    const result = await this.db.prepare(`
      INSERT INTO products (
        name, description, price, category, image_url, 
        stock_quantity, is_featured, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.description,
      data.price,
      data.category,
      data.image_url || null,
      data.stock_quantity || 0,
      data.is_featured ? 1 : 0,
      JSON.stringify(data.tags || []),
      new Date(now).toISOString(),
      new Date(now).toISOString()
    ).run()

    if (!result.success) {
      throw new Error('Failed to create product')
    }

    return {
      id: result.meta.last_row_id?.toString() || '',
      object: 'product',
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image_url: data.image_url,
      stock_quantity: data.stock_quantity || 0,
      is_featured: data.is_featured || false,
      tags: data.tags || [],
      created,
      updated: created
    }
  }

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const existing = await this.findById(id)
    if (!existing) {
      throw new NotFoundError('Product')
    }

    const updateFields: string[] = []
    const params: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags') {
          updateFields.push(`${key} = ?`)
          params.push(JSON.stringify(value))
        } else if (key === 'is_featured') {
          updateFields.push(`${key} = ?`)
          params.push(value ? 1 : 0)
        } else {
          updateFields.push(`${key} = ?`)
          params.push(value)
        }
      }
    })

    if (updateFields.length === 0) {
      return existing
    }

    const now = Date.now()
    updateFields.push('updated_at = ?')
    params.push(new Date(now).toISOString())
    params.push(id)

    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`
    const result = await this.db.prepare(query).bind(...params).run()

    if (!result.success) {
      throw new Error('Failed to update product')
    }

    const updated = await this.findById(id)
    if (!updated) {
      throw new NotFoundError('Product')
    }

    return updated
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    return result.changes > 0
  }

  private transformToProduct(row: any): Product {
    return {
      id: row.id?.toString() || '',
      object: 'product',
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      image_url: row.image_url,
      stock_quantity: row.stock_quantity,
      is_featured: Boolean(row.is_featured),
      tags: row.tags ? JSON.parse(row.tags) : [],
      created: Math.floor(new Date(row.created_at).getTime() / 1000),
      updated: Math.floor(new Date(row.updated_at).getTime() / 1000)
    }
  }
}