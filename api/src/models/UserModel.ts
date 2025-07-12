import { User } from '../types/api'
import { NotFoundError } from '../errors/ApiError'

export class UserModel {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?'
    ).bind(id).first()
    
    return result ? this.transformToUser(result) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE username = ? OR email = ?'
    ).bind(username, username).first()
    
    return result ? this.transformToUser(result) : null
  }

  async findByUsernameWithPassword(username: string): Promise<any | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE username = ? OR email = ?'
    ).bind(username, username).first()
    
    return result || null
  }

  async create(userData: {
    username: string
    email: string
    password: string
    role?: 'admin' | 'user'
  }): Promise<User> {
    const now = Date.now()
    const created = Math.floor(now / 1000)

    const result = await this.db.prepare(
      'INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      userData.username,
      userData.email,
      userData.password,
      userData.role || 'user',
      new Date(now).toISOString(),
      new Date(now).toISOString()
    ).run()

    if (!result.success) {
      throw new Error('Failed to create user')
    }

    return {
      id: result.meta.last_row_id?.toString() || '',
      object: 'user',
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      created,
      updated: created
    }
  }

  async updateRole(id: string, role: 'admin' | 'user'): Promise<User> {
    const now = new Date().toISOString()
    
    const result = await this.db.prepare(
      'UPDATE users SET role = ?, updated_at = ? WHERE id = ?'
    ).bind(role, now, id).run()

    if (result.changes === 0) {
      throw new NotFoundError('User')
    }

    const updated = await this.findById(id)
    if (!updated) {
      throw new NotFoundError('User')
    }

    return updated
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
    return result.changes > 0
  }

  async findAll(params: { limit?: number; offset?: number }): Promise<{
    users: User[]
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0 } = params
    
    const result = await this.db.prepare(
      'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all()

    const users = result.results?.map(this.transformToUser) || []

    // Check if there are more results
    const nextResult = await this.db.prepare(
      'SELECT id FROM users ORDER BY created_at DESC LIMIT 1 OFFSET ?'
    ).bind(limit + offset).all()
    
    const hasMore = (nextResult.results?.length || 0) > 0

    return { users, hasMore }
  }

  async checkExists(username: string, email: string): Promise<boolean> {
    const result = await this.db.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).bind(username, email).first()
    
    return !!result
  }

  private transformToUser(row: any): User {
    return {
      id: row.id?.toString() || '',
      object: 'user',
      username: row.username,
      email: row.email,
      role: row.role,
      created: Math.floor(new Date(row.created_at).getTime() / 1000),
      updated: Math.floor(new Date(row.updated_at).getTime() / 1000)
    }
  }
}