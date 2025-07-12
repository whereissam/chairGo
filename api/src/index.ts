import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRouter } from './routes/auth'
import { productRouter } from './routes/products'
import { adminRouter } from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

export interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use('*', logger())

// Health Check
app.get('/', (c) => {
  return c.json({ 
    message: 'ChairGo API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    api_version: 'v1',
    endpoints: {
      v1: '/api/v1',
      legacy: '/api'
    }
  })
})

// API Versioning
const v1 = new Hono<{ Bindings: Env }>()
v1.route('/auth', authRouter)
v1.route('/products', productRouter)
v1.route('/admin', adminRouter)

// Mount versioned API
app.route('/api/v1', v1)

// Legacy routes (for backward compatibility)
app.route('/api/auth', authRouter)
app.route('/api/products', productRouter)
app.route('/api/admin', adminRouter)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError(errorHandler)

export default app