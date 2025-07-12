import { CustomerAddress } from '../types/api'
import { NotFoundError } from '../errors/ApiError'

export class CustomerAddressModel {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async create(addressData: {
    user_id: string
    address_type: 'shipping' | 'billing'
    first_name: string
    last_name: string
    street_address: string
    city: string
    state?: string
    postal_code: string
    country: string
    phone?: string
    is_default?: boolean
  }): Promise<CustomerAddress> {
    const now = new Date().toISOString()

    if (addressData.is_default) {
      await this.db.prepare(`
        UPDATE customer_addresses SET is_default = FALSE 
        WHERE user_id = ? AND address_type = ?
      `).bind(addressData.user_id, addressData.address_type).run()
    }

    const result = await this.db.prepare(`
      INSERT INTO customer_addresses (
        user_id, address_type, first_name, last_name, street_address,
        city, state, postal_code, country, phone, is_default, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      addressData.user_id,
      addressData.address_type,
      addressData.first_name,
      addressData.last_name,
      addressData.street_address,
      addressData.city,
      addressData.state || null,
      addressData.postal_code,
      addressData.country,
      addressData.phone || null,
      addressData.is_default || false,
      now,
      now
    ).run()

    if (!result.success) {
      throw new Error('Failed to create address')
    }

    const created = await this.findById(result.meta.last_row_id!.toString())
    if (!created) {
      throw new Error('Failed to retrieve created address')
    }

    return created
  }

  async findById(id: string): Promise<CustomerAddress | null> {
    const result = await this.db.prepare(`
      SELECT * FROM customer_addresses WHERE id = ?
    `).bind(id).first()

    return result ? this.transformToAddress(result) : null
  }

  async findByUserId(userId: string, addressType?: 'shipping' | 'billing'): Promise<CustomerAddress[]> {
    let query = 'SELECT * FROM customer_addresses WHERE user_id = ?'
    const params = [userId]

    if (addressType) {
      query += ' AND address_type = ?'
      params.push(addressType)
    }

    query += ' ORDER BY is_default DESC, created_at DESC'

    const result = await this.db.prepare(query).bind(...params).all()

    return result.results?.map(this.transformToAddress) || []
  }

  async findDefaultAddress(userId: string, addressType: 'shipping' | 'billing'): Promise<CustomerAddress | null> {
    const result = await this.db.prepare(`
      SELECT * FROM customer_addresses 
      WHERE user_id = ? AND address_type = ? AND is_default = TRUE
    `).bind(userId, addressType).first()

    return result ? this.transformToAddress(result) : null
  }

  async update(id: string, addressData: Partial<{
    first_name: string
    last_name: string
    street_address: string
    city: string
    state: string
    postal_code: string
    country: string
    phone: string
    is_default: boolean
  }>): Promise<CustomerAddress> {
    const now = new Date().toISOString()

    if (addressData.is_default) {
      const existing = await this.findById(id)
      if (existing) {
        await this.db.prepare(`
          UPDATE customer_addresses SET is_default = FALSE 
          WHERE user_id = ? AND address_type = ? AND id != ?
        `).bind(existing.user_id, existing.address_type, id).run()
      }
    }

    const setClause = Object.keys(addressData).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(addressData), now, id]

    const result = await this.db.prepare(`
      UPDATE customer_addresses SET ${setClause}, updated_at = ? WHERE id = ?
    `).bind(...values).run()

    if (!result.success) {
      throw new NotFoundError('Address')
    }

    const updated = await this.findById(id)
    if (!updated) {
      throw new NotFoundError('Address')
    }

    return updated
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM customer_addresses WHERE id = ?').bind(id).run()
    return result.success
  }

  private transformToAddress(row: any): CustomerAddress {
    return {
      id: row.id?.toString() || '',
      object: 'customer_address',
      user_id: row.user_id?.toString() || '',
      address_type: row.address_type,
      first_name: row.first_name,
      last_name: row.last_name,
      street_address: row.street_address,
      city: row.city,
      state: row.state,
      postal_code: row.postal_code,
      country: row.country,
      phone: row.phone,
      is_default: !!row.is_default,
      created: Math.floor(new Date(row.created_at).getTime() / 1000),
      updated: Math.floor(new Date(row.updated_at).getTime() / 1000)
    }
  }
}