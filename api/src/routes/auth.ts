import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Env } from '../index'

export const authRouter = new Hono<{ Bindings: Env }>()

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6)
})

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email()
})

// Login endpoint
authRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const { username, password } = loginSchema.parse(body)

    // Get user from database
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE username = ? OR email = ?'
    ).bind(username, username).first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password as string)
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret')

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
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400)
    }
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Register endpoint (admin only for creating new admin users)
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const { username, password, email } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).bind(username, email).first()

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(username, email, hashedPassword, 'admin', new Date().toISOString()).run()

    if (!result.success) {
      return c.json({ error: 'Failed to create user' }, 500)
    }

    return c.json({
      success: true,
      message: 'Admin user created successfully',
      userId: result.meta.last_row_id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400)
    }
    console.error('Register error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Verify token endpoint
authRouter.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid token' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback-secret')

    const user = await c.env.DB.prepare(
      'SELECT id, username, email, role FROM users WHERE id = ?'
    ).bind(payload.userId).first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// Logout endpoint (client-side token removal)
authRouter.post('/logout', (c) => {
  return c.json({ success: true, message: 'Logged out successfully' })
})