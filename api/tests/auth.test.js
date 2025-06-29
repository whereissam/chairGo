import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Hono } from 'hono'
import { authRouter } from '../src/routes/auth.js'

// Mock environment
const mockEnv = {
  DB: {
    prepare: vi.fn(() => ({
      bind: vi.fn(() => ({
        first: vi.fn(),
        run: vi.fn(() => ({ success: true, meta: { last_row_id: 1 } }))
      }))
    }))
  },
  JWT_SECRET: 'test-secret'
}

// Create test app
const app = new Hono()
app.route('/api/auth', authRouter)

// Helper function to make test requests
const makeRequest = async (method, path, body = null, headers = {}) => {
  const url = `http://localhost${path}`
  const request = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  
  return await app.fetch(request, mockEnv)
}

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@chairgo.com',
        password: '$2a$12$rOKvVFXuT3/XZ9Z9Z9Z9ZOQ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
        role: 'admin'
      }

      mockEnv.DB.prepare().bind().first.mockResolvedValue(mockUser)

      const response = await makeRequest('POST', '/api/auth/login', {
        username: 'admin',
        password: 'admin123'
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.success).toBe(true)
      expect(json.token).toBeDefined()
      expect(json.user).toEqual({
        id: 1,
        username: 'admin',
        email: 'admin@chairgo.com',
        role: 'admin'
      })
    })

    it('should reject invalid credentials', async () => {
      mockEnv.DB.prepare().bind().first.mockResolvedValue(null)

      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Invalid credentials')
    })

    it('should validate input data', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'ab', // too short
          password: '123'  // too short
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid input')
    })

    it('should handle missing fields', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid input')
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register new admin user', async () => {
      // Mock user doesn't exist
      mockEnv.DB.prepare().bind().first.mockResolvedValue(null)

      const response = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'newadmin',
          email: 'newadmin@chairgo.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Admin user created successfully')
      expect(response.body.userId).toBeDefined()
    })

    it('should reject duplicate user', async () => {
      // Mock user already exists
      mockEnv.DB.prepare().bind().first.mockResolvedValue({ id: 1 })

      const response = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'admin',
          email: 'admin@chairgo.com',
          password: 'password123'
        })

      expect(response.status).toBe(409)
      expect(response.body.error).toBe('User already exists')
    })

    it('should validate email format', async () => {
      const response = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'invalid-email',
          password: 'password123'
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid input')
    })
  })

  describe('GET /api/auth/verify', () => {
    it('should verify valid token', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@chairgo.com',
        role: 'admin'
      }

      mockEnv.DB.prepare().bind().first.mockResolvedValue(mockUser)

      // First login to get a token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })

      const token = loginResponse.body.token

      // Then verify the token
      const response = await request(testApp)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user).toEqual(mockUser)
    })

    it('should reject missing token', async () => {
      const response = await request(testApp)
        .get('/api/auth/verify')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Missing or invalid token')
    })

    it('should reject invalid token format', async () => {
      const response = await request(testApp)
        .get('/api/auth/verify')
        .set('Authorization', 'InvalidToken')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Missing or invalid token')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(testApp)
        .post('/api/auth/logout')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logged out successfully')
    })
  })
})