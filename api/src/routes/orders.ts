import { Hono } from 'hono'
import { OrderService } from '../services/OrderService'
import { AuthService } from '../services/AuthService'
import { ApiResponse } from '../types/api'

export const ordersRouter = new Hono<{ Bindings: CloudflareBindings }>()

ordersRouter.post('/', async (c) => {
  try {
    const orderService = new OrderService(c.env.DB)
    const data = await c.req.json()
    
    const order = await orderService.createOrder(data)
    
    const response: ApiResponse = {
      data: order,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response, 201)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'ValidationError' ? 'validation_error' : 'api_error',
        message: error.message,
        details: error.details
      }
    }
    return c.json(response, error.statusCode || 400)
  }
})

ordersRouter.get('/my-orders', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const orderService = new OrderService(c.env.DB)
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')
    
    const result = await orderService.getUserOrders(user.id, { limit, offset })
    
    const response: ApiResponse = {
      data: result,
      meta: {
        pagination: {
          limit,
          offset,
          has_more: result.hasMore
        },
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'AuthenticationError' ? 'authentication_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 401)
  }
})

ordersRouter.get('/:id', async (c) => {
  try {
    const orderService = new OrderService(c.env.DB)
    const order = await orderService.getOrderById(c.req.param('id'))
    
    const response: ApiResponse = {
      data: order,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'NotFoundError' ? 'not_found_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 404)
  }
})

ordersRouter.get('/number/:orderNumber', async (c) => {
  try {
    const orderService = new OrderService(c.env.DB)
    const order = await orderService.getOrderByNumber(c.req.param('orderNumber'))
    
    const response: ApiResponse = {
      data: order,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'NotFoundError' ? 'not_found_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 404)
  }
})

ordersRouter.patch('/:id/status', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    await authService.verifyAdminToken(token)

    const orderService = new OrderService(c.env.DB)
    const { status } = await c.req.json()
    
    const order = await orderService.updateOrderStatus(c.req.param('id'), status)
    
    const response: ApiResponse = {
      data: order,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'AuthenticationError' ? 'authentication_error' : 
               error.name === 'NotFoundError' ? 'not_found_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 400)
  }
})

ordersRouter.patch('/:id/payment-status', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    await authService.verifyAdminToken(token)

    const orderService = new OrderService(c.env.DB)
    const { payment_status } = await c.req.json()
    
    const order = await orderService.updatePaymentStatus(c.req.param('id'), payment_status)
    
    const response: ApiResponse = {
      data: order,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'AuthenticationError' ? 'authentication_error' : 
               error.name === 'NotFoundError' ? 'not_found_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 400)
  }
})