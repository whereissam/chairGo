import { Order, OrderItem, CreateOrderRequest } from '../types/api'
import { NotFoundError } from '../errors/ApiError'

export class OrderModel {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async create(orderData: CreateOrderRequest): Promise<Order> {
    const now = new Date().toISOString()
    const orderNumber = `ORDER-${Date.now()}`

    const orderResult = await this.db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, total_amount, currency, status, payment_status, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderNumber,
      orderData.user_id || null,
      orderData.customer_name,
      orderData.customer_email,
      orderData.customer_phone || null,
      orderData.shipping_address,
      orderData.total_amount,
      orderData.currency || 'USD',
      'pending',
      'pending',
      orderData.notes || null,
      now,
      now
    ).run()

    if (!orderResult.success) {
      throw new Error('Failed to create order')
    }

    const orderId = orderResult.meta.last_row_id!

    for (const item of orderData.items) {
      await this.db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_price, quantity, subtotal, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId,
        item.product_id,
        item.product_name,
        item.product_price,
        item.quantity,
        item.subtotal,
        now
      ).run()
    }

    const order = await this.findById(orderId.toString())
    if (!order) {
      throw new Error('Failed to retrieve created order')
    }

    return order
  }

  async findById(id: string): Promise<Order | null> {
    const orderResult = await this.db.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(id).first()

    if (!orderResult) {
      return null
    }

    const itemsResult = await this.db.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(id).all()

    const items: OrderItem[] = itemsResult.results?.map(item => ({
      id: item.id?.toString() || '',
      product_id: item.product_id?.toString() || '',
      product_name: item.product_name as string,
      product_price: item.product_price as number,
      quantity: item.quantity as number,
      subtotal: item.subtotal as number
    })) || []

    return this.transformToOrder(orderResult, items)
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const orderResult = await this.db.prepare(`
      SELECT * FROM orders WHERE order_number = ?
    `).bind(orderNumber).first()

    if (!orderResult) {
      return null
    }

    const itemsResult = await this.db.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(orderResult.id).all()

    const items: OrderItem[] = itemsResult.results?.map(item => ({
      id: item.id?.toString() || '',
      product_id: item.product_id?.toString() || '',
      product_name: item.product_name as string,
      product_price: item.product_price as number,
      quantity: item.quantity as number,
      subtotal: item.subtotal as number
    })) || []

    return this.transformToOrder(orderResult, items)
  }

  async findByUserId(userId: string, params: { limit?: number; offset?: number }): Promise<{
    orders: Order[]
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0 } = params

    const ordersResult = await this.db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all()

    const orders: Order[] = []
    
    for (const orderRow of ordersResult.results || []) {
      const itemsResult = await this.db.prepare(`
        SELECT * FROM order_items WHERE order_id = ?
      `).bind(orderRow.id).all()

      const items: OrderItem[] = itemsResult.results?.map(item => ({
        id: item.id?.toString() || '',
        product_id: item.product_id?.toString() || '',
        product_name: item.product_name as string,
        product_price: item.product_price as number,
        quantity: item.quantity as number,
        subtotal: item.subtotal as number
      })) || []

      orders.push(this.transformToOrder(orderRow, items))
    }

    const nextResult = await this.db.prepare(`
      SELECT id FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1 OFFSET ?
    `).bind(userId, limit + offset).all()
    
    const hasMore = (nextResult.results?.length || 0) > 0

    return { orders, hasMore }
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const now = new Date().toISOString()
    
    const result = await this.db.prepare(`
      UPDATE orders SET status = ?, updated_at = ? WHERE id = ?
    `).bind(status, now, id).run()

    if (!result.success) {
      throw new NotFoundError('Order')
    }

    const updated = await this.findById(id)
    if (!updated) {
      throw new NotFoundError('Order')
    }

    return updated
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const now = new Date().toISOString()
    
    const result = await this.db.prepare(`
      UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?
    `).bind(paymentStatus, now, id).run()

    if (!result.success) {
      throw new NotFoundError('Order')
    }

    const updated = await this.findById(id)
    if (!updated) {
      throw new NotFoundError('Order')
    }

    return updated
  }

  async findAll(params: { limit?: number; offset?: number }): Promise<{
    orders: Order[]
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0 } = params

    const ordersResult = await this.db.prepare(`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    const orders: Order[] = []
    
    for (const orderRow of ordersResult.results || []) {
      const itemsResult = await this.db.prepare(`
        SELECT * FROM order_items WHERE order_id = ?
      `).bind(orderRow.id).all()

      const items: OrderItem[] = itemsResult.results?.map(item => ({
        id: item.id?.toString() || '',
        product_id: item.product_id?.toString() || '',
        product_name: item.product_name as string,
        product_price: item.product_price as number,
        quantity: item.quantity as number,
        subtotal: item.subtotal as number
      })) || []

      orders.push(this.transformToOrder(orderRow, items))
    }

    const nextResult = await this.db.prepare(`
      SELECT id FROM orders 
      ORDER BY created_at DESC 
      LIMIT 1 OFFSET ?
    `).bind(limit + offset).all()
    
    const hasMore = (nextResult.results?.length || 0) > 0

    return { orders, hasMore }
  }

  private transformToOrder(orderRow: any, items: OrderItem[]): Order {
    return {
      id: orderRow.id?.toString() || '',
      object: 'order',
      order_number: orderRow.order_number,
      user_id: orderRow.user_id?.toString() || null,
      customer_name: orderRow.customer_name,
      customer_email: orderRow.customer_email,
      customer_phone: orderRow.customer_phone,
      shipping_address: orderRow.shipping_address,
      total_amount: orderRow.total_amount,
      currency: orderRow.currency,
      status: orderRow.status,
      payment_status: orderRow.payment_status,
      notes: orderRow.notes,
      items,
      created: Math.floor(new Date(orderRow.created_at).getTime() / 1000),
      updated: Math.floor(new Date(orderRow.updated_at).getTime() / 1000)
    }
  }
}