import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { Hono } from 'hono'
import { adminRouter } from '../src/routes/admin.js'

// Mock environment
const mockEnv = {
  DB: {
    prepare: vi.fn(() => ({
      bind: vi.fn(() => ({
        first: vi.fn(),
        all: vi.fn(() => ({ results: [] })),
        run: vi.fn(() => ({ success: true, changes: 1 }))
      }))
    }))
  },
  JWT_SECRET: 'test-secret'
}

// Create test app
const app = new Hono()
app.route('/api/admin', adminRouter)

// Wrap app to inject mock environment
const testApp = {
  fetch: (request) => app.fetch(request, mockEnv)
}

const mockAdminToken = 'Bearer mock-admin-token'

describe('Admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock admin user verification for all tests
    mockEnv.DB.prepare().bind().first.mockResolvedValue({ role: 'admin' })
  })

  describe('GET /api/admin/dashboard', () => {
    it('should return dashboard statistics', async () => {
      // Mock dashboard data
      mockEnv.DB.prepare().bind().first
        .mockResolvedValueOnce({ count: 25 }) // products count
        .mockResolvedValueOnce({ count: 5 })  // users count

      mockEnv.DB.prepare().bind().all
        .mockResolvedValueOnce({ // recent products
          results: [
            { id: 1, name: 'Chair 1', price: 299.99, created_at: '2024-01-01' },
            { id: 2, name: 'Chair 2', price: 399.99, created_at: '2024-01-02' }
          ]
        })
        .mockResolvedValueOnce({ // low stock products
          results: [
            { id: 3, name: 'Chair 3', stock_quantity: 5 }
          ]
        })

      const response = await request(testApp)
        .get('/api/admin/dashboard')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.stats).toEqual({
        totalProducts: 25,
        totalUsers: 5,
        recentProducts: [
          { id: 1, name: 'Chair 1', price: 299.99, created_at: '2024-01-01' },
          { id: 2, name: 'Chair 2', price: 399.99, created_at: '2024-01-02' }
        ],
        lowStockProducts: [
          { id: 3, name: 'Chair 3', stock_quantity: 5 }
        ]
      })
    })

    it('should reject non-admin users', async () => {
      // Mock non-admin user
      mockEnv.DB.prepare().bind().first.mockResolvedValue({ role: 'user' })

      const response = await request(testApp)
        .get('/api/admin/dashboard')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(403)
      expect(response.body.error).toBe('Admin access required')
    })

    it('should reject requests without token', async () => {
      const response = await request(testApp)
        .get('/api/admin/dashboard')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Missing or invalid token')
    })
  })

  describe('GET /api/admin/users', () => {
    it('should return list of users', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@chairgo.com',
          role: 'admin',
          created_at: '2024-01-01'
        },
        {
          id: 2,
          username: 'user1',
          email: 'user1@example.com',
          role: 'user',
          created_at: '2024-01-02'
        }
      ]

      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: mockUsers })

      const response = await request(testApp)
        .get('/api/admin/users')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.users).toEqual(mockUsers)
    })

    it('should handle pagination', async () => {
      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: [] })

      const response = await request(testApp)
        .get('/api/admin/users?limit=10&offset=0')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.pagination.limit).toBe(10)
      expect(response.body.pagination.offset).toBe(0)
    })
  })

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role', async () => {
      const response = await request(testApp)
        .put('/api/admin/users/2/role')
        .set('Authorization', mockAdminToken)
        .send({ role: 'admin' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User role updated successfully')
    })

    it('should reject invalid roles', async () => {
      const response = await request(testApp)
        .put('/api/admin/users/2/role')
        .set('Authorization', mockAdminToken)
        .send({ role: 'invalid_role' })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid role')
    })

    it('should return 404 for non-existent user', async () => {
      mockEnv.DB.prepare().bind().run.mockResolvedValue({ changes: 0 })

      const response = await request(testApp)
        .put('/api/admin/users/999/role')
        .set('Authorization', mockAdminToken)
        .send({ role: 'user' })

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('User not found')
    })
  })

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user', async () => {
      const response = await request(testApp)
        .delete('/api/admin/users/2')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User deleted successfully')
    })

    it('should prevent admin from deleting themselves', async () => {
      // Mock that current user ID is 1
      const response = await request(testApp)
        .delete('/api/admin/users/1')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Cannot delete your own account')
    })

    it('should return 404 for non-existent user', async () => {
      mockEnv.DB.prepare().bind().run.mockResolvedValue({ changes: 0 })

      const response = await request(testApp)
        .delete('/api/admin/users/999')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('User not found')
    })
  })

  describe('GET /api/admin/products/stats', () => {
    it('should return product statistics', async () => {
      const mockCategoryStats = [
        { category: 'office', count: 15, avg_price: 350.00 },
        { category: 'living', count: 8, avg_price: 750.00 }
      ]

      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: mockCategoryStats })
      mockEnv.DB.prepare().bind().first
        .mockResolvedValueOnce({ count: 5 })  // featured count
        .mockResolvedValueOnce({ count: 2 })  // out of stock count

      const response = await request(testApp)
        .get('/api/admin/products/stats')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.stats).toEqual({
        categoryStats: mockCategoryStats,
        featuredCount: 5,
        outOfStockCount: 2
      })
    })
  })

  describe('POST /api/admin/products/bulk-update', () => {
    it('should bulk update products', async () => {
      const bulkUpdateData = {
        productIds: [1, 2, 3],
        updates: {
          is_featured: true,
          category: 'premium'
        }
      }

      mockEnv.DB.prepare().bind().run.mockResolvedValue({ changes: 3 })

      const response = await request(testApp)
        .post('/api/admin/products/bulk-update')
        .set('Authorization', mockAdminToken)
        .send(bulkUpdateData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('3 products updated successfully')
    })

    it('should reject empty product IDs', async () => {
      const response = await request(testApp)
        .post('/api/admin/products/bulk-update')
        .set('Authorization', mockAdminToken)
        .send({
          productIds: [],
          updates: { is_featured: true }
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Product IDs required')
    })

    it('should reject empty updates', async () => {
      const response = await request(testApp)
        .post('/api/admin/products/bulk-update')
        .set('Authorization', mockAdminToken)
        .send({
          productIds: [1, 2],
          updates: {}
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('No fields to update')
    })
  })
})