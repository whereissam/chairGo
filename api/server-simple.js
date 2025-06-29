// Simple mock server for testing admin frontend
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import bcrypt from 'bcryptjs'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5176'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@chairgo.com',
    password: '$2a$12$5EjJ3rO3pY2WY2WY2WY2WOmBYY3j3j3j3j3j3j3j3j3j3j3j3j3j3j', // admin123
    role: 'admin',
    created_at: new Date().toISOString()
  }
]

const mockProducts = [
  {
    id: 1,
    name: '人體工學行政辦公椅',
    description: '高級人體工學辦公椅，配備腰部支撐和可調節功能',
    price: 299.99,
    category: 'office',
    image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
    stock_quantity: 25,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '現代轉角沙發',
    description: '現代L型轉角沙發，配有貴妃椅',
    price: 899.99,
    category: 'living',
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
    stock_quantity: 8,
    is_featured: true,
    created_at: new Date().toISOString()
  }
]

// Routes
app.get('/', (c) => {
  return c.json({ 
    message: 'ChairGo Mock API is running!',
    timestamp: new Date().toISOString()
  })
})

// Auth routes
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    const user = mockUsers.find(u => u.username === username || u.email === username)
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // For mock server, just check if password is 'admin123'
    if (password !== 'admin123') {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now()

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Products routes
app.get('/api/products', (c) => {
  return c.json({
    success: true,
    products: mockProducts
  })
})

// Admin routes
app.get('/api/admin/dashboard', (c) => {
  return c.json({
    success: true,
    stats: {
      totalProducts: mockProducts.length,
      totalUsers: mockUsers.length,
      recentProducts: mockProducts.slice(0, 5),
      lowStockProducts: mockProducts.filter(p => p.stock_quantity < 10)
    }
  })
})

app.get('/api/admin/users', (c) => {
  return c.json({
    success: true,
    users: mockUsers.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      created_at: u.created_at
    }))
  })
})

// Product management
app.post('/api/products', (c) => {
  return c.json({ success: true, message: 'Product created (mock)', productId: Date.now() }, 201)
})

app.put('/api/products/:id', (c) => {
  return c.json({ success: true, message: 'Product updated (mock)' })
})

app.delete('/api/products/:id', (c) => {
  return c.json({ success: true, message: 'Product deleted (mock)' })
})

const port = 3001
console.log(`🚀 Mock ChairGo API Server running on http://localhost:${port}`)
console.log('📊 Mock admin credentials:')
console.log('   Username: admin')
console.log('   Password: admin123')

serve({
  fetch: app.fetch,
  port
})