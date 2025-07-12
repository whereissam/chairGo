import { z } from 'zod'
import { Order, CreateOrderRequest } from '../types/api'
import { OrderModel } from '../models/OrderModel'
import { ValidationError, NotFoundError } from '../errors/ApiError'

const createOrderSchema = z.object({
  user_id: z.string().optional(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().optional(),
  shipping_address: z.string().min(1),
  total_amount: z.number().positive(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    product_price: z.number().positive(),
    quantity: z.number().positive(),
    subtotal: z.number().positive()
  })).min(1)
})

export class OrderService {
  private orderModel: OrderModel

  constructor(db: D1Database) {
    this.orderModel = new OrderModel(db)
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const validatedData = createOrderSchema.parse(data)
      return await this.orderModel.create(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid order data', undefined, error.errors)
      }
      throw error
    }
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
    if (!order) {
      throw new NotFoundError('Order')
    }
    return order
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel.findByOrderNumber(orderNumber)
    if (!order) {
      throw new NotFoundError('Order')
    }
    return order
  }

  async getUserOrders(userId: string, params: { limit?: number; offset?: number }) {
    return await this.orderModel.findByUserId(userId, params)
  }

  async getAllOrders(params: { limit?: number; offset?: number }) {
    return await this.orderModel.findAll(params)
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid order status')
    }

    return await this.orderModel.updateStatus(id, status)
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const validStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (!validStatuses.includes(paymentStatus)) {
      throw new ValidationError('Invalid payment status')
    }

    return await this.orderModel.updatePaymentStatus(id, paymentStatus)
  }
}