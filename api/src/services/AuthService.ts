import { sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/api'
import { UserModel } from '../models/UserModel'
import { ValidationError, AuthenticationError, NotFoundError } from '../errors/ApiError'

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6)
})

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email()
})

export class AuthService {
  private userModel: UserModel
  private jwtSecret: string

  constructor(db: D1Database, jwtSecret: string) {
    this.userModel = new UserModel(db)
    this.jwtSecret = jwtSecret
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const { username, password } = loginSchema.parse(data)

      // Get user with password for verification
      const userWithPassword = await this.userModel.findByUsernameWithPassword(username)
      if (!userWithPassword) {
        throw new AuthenticationError('Invalid credentials')
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userWithPassword.password)
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials')
      }

      // Generate JWT token
      const payload = {
        userId: userWithPassword.id,
        username: userWithPassword.username,
        role: userWithPassword.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }

      const token = await sign(payload, this.jwtSecret)

      // Get user without password
      const user = await this.userModel.findById(userWithPassword.id.toString())
      if (!user) {
        throw new NotFoundError('User')
      }

      return { token, user }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid login data', undefined, error.errors)
      }
      throw error
    }
  }

  async register(data: RegisterRequest): Promise<User> {
    try {
      const { username, password, email } = registerSchema.parse(data)

      // Check if user already exists
      const existingUser = await this.userModel.checkExists(username, email)
      if (existingUser) {
        throw new ValidationError('User already exists with this username or email')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user (default role: user for customer registration)
      return await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid registration data', undefined, error.errors)
      }
      throw error
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = await verify(token, this.jwtSecret) as any
      
      const user = await this.userModel.findById(payload.userId.toString())
      if (!user) {
        throw new AuthenticationError('User not found')
      }

      return user
    } catch (error) {
      throw new AuthenticationError('Invalid token')
    }
  }

  async verifyAdminToken(token: string): Promise<User> {
    const user = await this.verifyToken(token)
    
    if (user.role !== 'admin') {
      throw new AuthenticationError('Admin access required')
    }

    return user
  }

  extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header')
    }

    return authHeader.substring(7)
  }
}