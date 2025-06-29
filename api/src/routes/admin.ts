import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { Env } from '../index'

export const adminRouter = new Hono<{ Bindings: Env }>()

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

// Apply admin middleware to all routes
adminRouter.use('*', verifyAdmin)

// Dashboard stats
adminRouter.get('/dashboard', async (c) => {
  try {
    // Get total products
    const totalProducts = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM products'
    ).first()

    // Get total users
    const totalUsers = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM users'
    ).first()

    // Get recent products
    const recentProducts = await c.env.DB.prepare(
      'SELECT id, name, price, created_at FROM products ORDER BY created_at DESC LIMIT 5'
    ).all()

    // Get low stock products
    const lowStockProducts = await c.env.DB.prepare(
      'SELECT id, name, stock_quantity FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity ASC LIMIT 5'
    ).all()

    return c.json({
      success: true,
      stats: {
        totalProducts: totalProducts?.count || 0,
        totalUsers: totalUsers?.count || 0,
        recentProducts: recentProducts.results,
        lowStockProducts: lowStockProducts.results
      }
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get all users
adminRouter.get('/users', async (c) => {
  try {
    const { limit = '20', offset = '0' } = c.req.query()

    const users = await c.env.DB.prepare(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(parseInt(limit), parseInt(offset)).all()

    return c.json({
      success: true,
      users: users.results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update user role
adminRouter.put('/users/:id/role', async (c) => {
  try {
    const id = c.req.param('id')
    const { role } = await c.req.json()

    if (!['admin', 'user'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400)
    }

    const result = await c.env.DB.prepare(
      'UPDATE users SET role = ?, updated_at = ? WHERE id = ?'
    ).bind(role, new Date().toISOString(), id).run()

    if (result.changes === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      message: 'User role updated successfully'
    })

  } catch (error) {
    console.error('Update user role error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete user
adminRouter.delete('/users/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const currentUserId = c.get('userId')

    // Prevent admin from deleting themselves
    if (id === currentUserId.toString()) {
      return c.json({ error: 'Cannot delete your own account' }, 400)
    }

    const result = await c.env.DB.prepare(
      'DELETE FROM users WHERE id = ?'
    ).bind(id).run()

    if (result.changes === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Product management stats
adminRouter.get('/products/stats', async (c) => {
  try {
    // Get products by category
    const categoryStats = await c.env.DB.prepare(`
      SELECT category, COUNT(*) as count, AVG(price) as avg_price
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `).all()

    // Get featured products count
    const featuredCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM products WHERE is_featured = 1'
    ).first()

    // Get out of stock products
    const outOfStockCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM products WHERE stock_quantity = 0'
    ).first()

    return c.json({
      success: true,
      stats: {
        categoryStats: categoryStats.results,
        featuredCount: featuredCount?.count || 0,
        outOfStockCount: outOfStockCount?.count || 0
      }
    })

  } catch (error) {
    console.error('Product stats error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Bulk update products
adminRouter.post('/products/bulk-update', async (c) => {
  try {
    const { productIds, updates } = await c.req.json()

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return c.json({ error: 'Product IDs required' }, 400)
    }

    const updateFields = []
    const params = []

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        if (key === 'is_featured') {
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

    const placeholders = productIds.map(() => '?').join(',')
    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id IN (${placeholders})`
    
    const result = await c.env.DB.prepare(query).bind(...params, ...productIds).run()

    return c.json({
      success: true,
      message: `${result.changes} products updated successfully`
    })

  } catch (error) {
    console.error('Bulk update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})