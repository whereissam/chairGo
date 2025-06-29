import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { z } from 'zod'
import { Env } from '../index'

export const productRouter = new Hono<{ Bindings: Env }>()

// Validation schemas
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

// Middleware to verify admin token
const verifyAdmin = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid token' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback-secret')

    const user = await c.env.DB.prepare(
      'SELECT role FROM users WHERE id = ?'
    ).bind(payload.userId).first()

    if (!user || user.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    c.set('userId', payload.userId)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

// Get all products (public)
productRouter.get('/', async (c) => {
  try {
    const { limit = '20', offset = '0', category, featured } = c.req.query()
    
    let query = 'SELECT * FROM products WHERE 1=1'
    const params: any[] = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (featured === 'true') {
      query += ' AND is_featured = 1'
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const products = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      products: products.results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })

  } catch (error) {
    console.error('Get products error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get single product (public)
productRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const product = await c.env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first()

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Get product error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Create product (admin only)
productRouter.post('/', verifyAdmin, async (c) => {
  try {
    const body = await c.req.json()
    const productData = createProductSchema.parse(body)

    const result = await c.env.DB.prepare(`
      INSERT INTO products (
        name, description, price, category, image_url, 
        stock_quantity, is_featured, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productData.name,
      productData.description,
      productData.price,
      productData.category,
      productData.image_url || null,
      productData.stock_quantity,
      productData.is_featured ? 1 : 0,
      JSON.stringify(productData.tags || []),
      new Date().toISOString(),
      new Date().toISOString()
    ).run()

    if (!result.success) {
      return c.json({ error: 'Failed to create product' }, 500)
    }

    return c.json({
      success: true,
      message: 'Product created successfully',
      productId: result.meta.last_row_id
    }, 201)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400)
    }
    console.error('Create product error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update product (admin only)
productRouter.put('/:id', verifyAdmin, async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const productData = updateProductSchema.parse(body)

    // Check if product exists
    const existingProduct = await c.env.DB.prepare(
      'SELECT id FROM products WHERE id = ?'
    ).bind(id).first()

    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404)
    }

    // Build dynamic update query
    const updateFields = []
    const params = []

    for (const [key, value] of Object.entries(productData)) {
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
    }

    if (updateFields.length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }

    updateFields.push('updated_at = ?')
    params.push(new Date().toISOString())
    params.push(id)

    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`
    
    const result = await c.env.DB.prepare(query).bind(...params).run()

    if (!result.success) {
      return c.json({ error: 'Failed to update product' }, 500)
    }

    return c.json({
      success: true,
      message: 'Product updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400)
    }
    console.error('Update product error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete product (admin only)
productRouter.delete('/:id', verifyAdmin, async (c) => {
  try {
    const id = c.req.param('id')

    const result = await c.env.DB.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(id).run()

    if (result.changes === 0) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})