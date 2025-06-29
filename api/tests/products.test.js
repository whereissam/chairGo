import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { Hono } from 'hono'
import { productRouter } from '../src/routes/products.js'

// Mock environment
const mockEnv = {
  DB: {
    prepare: vi.fn(() => ({
      bind: vi.fn(() => ({
        first: vi.fn(),
        all: vi.fn(() => ({ results: [] })),
        run: vi.fn(() => ({ success: true, changes: 1, meta: { last_row_id: 1 } }))
      }))
    }))
  },
  JWT_SECRET: 'test-secret'
}

// Create test app
const app = new Hono()
app.route('/api/products', productRouter)

// Wrap app to inject mock environment
const testApp = {
  fetch: (request) => app.fetch(request, mockEnv)
}

const mockProducts = [
  {
    id: 1,
    name: '人體工學辦公椅',
    description: '高級辦公椅',
    price: 299.99,
    category: 'office',
    image_url: 'https://example.com/chair1.jpg',
    stock_quantity: 25,
    is_featured: 1,
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: '現代沙發',
    description: '舒適沙發',
    price: 899.99,
    category: 'living',
    image_url: 'https://example.com/sofa1.jpg',
    stock_quantity: 8,
    is_featured: 0,
    created_at: '2024-01-02T00:00:00.000Z'
  }
]

// Mock JWT token for admin tests
const mockAdminToken = 'Bearer mock-admin-token'

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: mockProducts })

      const response = await request(testApp)
        .get('/api/products')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.products).toEqual(mockProducts)
    })

    it('should filter products by category', async () => {
      const officeProducts = mockProducts.filter(p => p.category === 'office')
      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: officeProducts })

      const response = await request(testApp)
        .get('/api/products?category=office')

      expect(response.status).toBe(200)
      expect(response.body.products).toEqual(officeProducts)
    })

    it('should filter featured products', async () => {
      const featuredProducts = mockProducts.filter(p => p.is_featured === 1)
      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: featuredProducts })

      const response = await request(testApp)
        .get('/api/products?featured=true')

      expect(response.status).toBe(200)
      expect(response.body.products).toEqual(featuredProducts)
    })

    it('should handle pagination', async () => {
      mockEnv.DB.prepare().bind().all.mockResolvedValue({ results: [mockProducts[0]] })

      const response = await request(testApp)
        .get('/api/products?limit=1&offset=0')

      expect(response.status).toBe(200)
      expect(response.body.pagination.limit).toBe(1)
      expect(response.body.pagination.offset).toBe(0)
    })
  })

  describe('GET /api/products/:id', () => {
    it('should get single product', async () => {
      mockEnv.DB.prepare().bind().first.mockResolvedValue(mockProducts[0])

      const response = await request(testApp)
        .get('/api/products/1')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.product).toEqual(mockProducts[0])
    })

    it('should return 404 for non-existent product', async () => {
      mockEnv.DB.prepare().bind().first.mockResolvedValue(null)

      const response = await request(testApp)
        .get('/api/products/999')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Product not found')
    })
  })

  describe('POST /api/products (Admin Only)', () => {
    beforeEach(() => {
      // Mock admin user verification
      mockEnv.DB.prepare().bind().first.mockResolvedValue({ role: 'admin' })
    })

    it('should create new product with valid data', async () => {
      const newProduct = {
        name: 'New Chair',
        description: 'A new comfortable chair',
        price: 199.99,
        category: 'office',
        image_url: 'https://example.com/new-chair.jpg',
        stock_quantity: 10,
        is_featured: false
      }

      const response = await request(testApp)
        .post('/api/products')
        .set('Authorization', mockAdminToken)
        .send(newProduct)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Product created successfully')
      expect(response.body.productId).toBeDefined()
    })

    it('should reject invalid product data', async () => {
      const invalidProduct = {
        name: '', // empty name
        price: -100, // negative price
        category: 'office'
      }

      const response = await request(testApp)
        .post('/api/products')
        .set('Authorization', mockAdminToken)
        .send(invalidProduct)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid input')
    })

    it('should reject request without admin token', async () => {
      const response = await request(testApp)
        .post('/api/products')
        .send({ name: 'Test Product' })

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Missing or invalid token')
    })

    it('should reject request from non-admin user', async () => {
      // Mock non-admin user
      mockEnv.DB.prepare().bind().first.mockResolvedValue({ role: 'user' })

      const response = await request(testApp)
        .post('/api/products')
        .set('Authorization', mockAdminToken)
        .send({ name: 'Test Product' })

      expect(response.status).toBe(403)
      expect(response.body.error).toBe('Admin access required')
    })
  })

  describe('PUT /api/products/:id (Admin Only)', () => {
    beforeEach(() => {
      // Mock admin user verification
      mockEnv.DB.prepare().bind().first
        .mockResolvedValueOnce({ role: 'admin' }) // For auth
        .mockResolvedValueOnce({ id: 1 }) // For product existence check
    })

    it('should update existing product', async () => {
      const updateData = {
        name: 'Updated Chair Name',
        price: 349.99
      }

      const response = await request(testApp)
        .put('/api/products/1')
        .set('Authorization', mockAdminToken)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Product updated successfully')
    })

    it('should return 404 for non-existent product', async () => {
      // Mock product not found
      mockEnv.DB.prepare().bind().first
        .mockResolvedValueOnce({ role: 'admin' }) // For auth
        .mockResolvedValueOnce(null) // For product existence check

      const response = await request(testApp)
        .put('/api/products/999')
        .set('Authorization', mockAdminToken)
        .send({ name: 'Updated Name' })

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Product not found')
    })

    it('should reject empty update', async () => {
      const response = await request(testApp)
        .put('/api/products/1')
        .set('Authorization', mockAdminToken)
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('No fields to update')
    })
  })

  describe('DELETE /api/products/:id (Admin Only)', () => {
    beforeEach(() => {
      // Mock admin user verification
      mockEnv.DB.prepare().bind().first.mockResolvedValue({ role: 'admin' })
    })

    it('should delete existing product', async () => {
      // Mock successful deletion
      mockEnv.DB.prepare().bind().run.mockResolvedValue({ changes: 1 })

      const response = await request(testApp)
        .delete('/api/products/1')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Product deleted successfully')
    })

    it('should return 404 for non-existent product', async () => {
      // Mock no changes (product not found)
      mockEnv.DB.prepare().bind().run.mockResolvedValue({ changes: 0 })

      const response = await request(testApp)
        .delete('/api/products/999')
        .set('Authorization', mockAdminToken)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Product not found')
    })
  })
})