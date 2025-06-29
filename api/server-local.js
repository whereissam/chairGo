// Simple local server for testing the admin system
import { serve } from '@hono/node-server'
import app from './src/index.js'

// Mock environment for local testing
const env = {
  DB: {
    // Mock D1 database methods
    prepare: (query) => ({
      bind: (...params) => ({
        first: async () => {
          // Mock user data for login
          if (query.includes('SELECT * FROM users WHERE username')) {
            return {
              id: 1,
              username: 'admin',
              email: 'admin@chairgo.com',
              password: '$2a$12$rOKvVFXuT3/XZ9Z9Z9Z9ZOQ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', // admin123
              role: 'admin',
              created_at: new Date().toISOString()
            }
          }
          
          if (query.includes('SELECT role FROM users WHERE id')) {
            return { role: 'admin' }
          }
          
          if (query.includes('COUNT(*) as count FROM products')) {
            return { count: 25 }
          }
          
          if (query.includes('COUNT(*) as count FROM users')) {
            return { count: 5 }
          }
          
          return null
        },
        all: async () => {
          // Mock products data
          if (query.includes('SELECT * FROM products')) {
            return {
              results: [
                {
                  id: 1,
                  name: '人體工學行政辦公椅',
                  description: '高級人體工學辦公椅，配備腰部支撐和可調節功能',
                  price: 299.99,
                  category: 'office',
                  image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
                  stock_quantity: 25,
                  is_featured: 1,
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
                  is_featured: 1,
                  created_at: new Date().toISOString()
                }
              ]
            }
          }
          
          // Mock users data
          if (query.includes('SELECT id, username, email, role')) {
            return {
              results: [
                {
                  id: 1,
                  username: 'admin',
                  email: 'admin@chairgo.com',
                  role: 'admin',
                  created_at: new Date().toISOString()
                },
                {
                  id: 2,
                  username: 'user1',
                  email: 'user1@example.com',
                  role: 'user',
                  created_at: new Date().toISOString()
                }
              ]
            }
          }
          
          // Mock recent products
          if (query.includes('ORDER BY created_at DESC LIMIT 5')) {
            return {
              results: [
                { id: 1, name: '人體工學辦公椅', price: 299.99, created_at: new Date().toISOString() },
                { id: 2, name: '現代沙發', price: 899.99, created_at: new Date().toISOString() }
              ]
            }
          }
          
          // Mock low stock products
          if (query.includes('stock_quantity < 10')) {
            return {
              results: [
                { id: 2, name: '現代沙發', stock_quantity: 8 }
              ]
            }
          }
          
          return { results: [] }
        },
        run: async () => ({
          success: true,
          changes: 1,
          meta: { last_row_id: Math.floor(Math.random() * 1000) }
        })
      })
    })
  },
  JWT_SECRET: 'local-development-secret-key'
}

// Create a wrapper that injects the mock environment
const wrappedApp = new Proxy(app, {
  get(target, prop) {
    if (prop === 'fetch') {
      return (request, env_param, ctx) => {
        return target.fetch(request, env, ctx)
      }
    }
    return target[prop]
  }
})

const port = 3001
console.log(`🚀 Local ChairGo API Server running on http://localhost:${port}`)
console.log('📊 Mock admin credentials:')
console.log('   Username: admin')
console.log('   Password: admin123')
console.log('')
console.log('🔗 Test endpoints:')
console.log('   POST http://localhost:3001/api/auth/login')
console.log('   GET  http://localhost:3001/api/products')
console.log('   GET  http://localhost:3001/api/admin/dashboard')

serve({
  fetch: wrappedApp.fetch.bind(wrappedApp),
  port
})