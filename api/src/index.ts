import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRouter } from './routes/auth'
import { productRouter } from './routes/products'
import { adminRouter } from './routes/admin'

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
    version: '1.0.0'
  })
})

// Routes
app.route('/api/auth', authRouter)
app.route('/api/products', productRouter)
app.route('/api/admin', adminRouter)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app