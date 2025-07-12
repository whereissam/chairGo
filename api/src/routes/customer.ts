import { Hono } from 'hono'
import { CustomerService } from '../services/CustomerService'
import { AuthService } from '../services/AuthService'
import { ApiResponse } from '../types/api'

export const customerRouter = new Hono<{ Bindings: CloudflareBindings }>()

customerRouter.post('/addresses', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    const data = await c.req.json()
    
    const address = await customerService.createAddress(user.id, data)
    
    const response: ApiResponse = {
      data: address,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response, 201)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'ValidationError' ? 'validation_error' : 
               error.name === 'AuthenticationError' ? 'authentication_error' : 'api_error',
        message: error.message,
        details: error.details
      }
    }
    return c.json(response, error.statusCode || 400)
  }
})

customerRouter.get('/addresses', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    const addressType = c.req.query('type') as 'shipping' | 'billing' | undefined
    
    const addresses = await customerService.getUserAddresses(user.id, addressType)
    
    const response: ApiResponse = {
      data: addresses,
      meta: {
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

customerRouter.get('/addresses/:id', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    const address = await customerService.getAddressById(c.req.param('id'))
    
    if (address.user_id !== user.id) {
      const response: ApiResponse = {
        error: {
          type: 'authorization_error',
          message: 'Unauthorized to access this address'
        }
      }
      return c.json(response, 403)
    }
    
    const response: ApiResponse = {
      data: address,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'NotFoundError' ? 'not_found_error' : 
               error.name === 'AuthenticationError' ? 'authentication_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 404)
  }
})

customerRouter.put('/addresses/:id', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    const data = await c.req.json()
    
    const address = await customerService.updateAddress(c.req.param('id'), user.id, data)
    
    const response: ApiResponse = {
      data: address,
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'ValidationError' ? 'validation_error' : 
               error.name === 'NotFoundError' ? 'not_found_error' : 
               error.name === 'AuthenticationError' ? 'authentication_error' : 'api_error',
        message: error.message,
        details: error.details
      }
    }
    return c.json(response, error.statusCode || 400)
  }
})

customerRouter.delete('/addresses/:id', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    
    const success = await customerService.deleteAddress(c.req.param('id'), user.id)
    
    const response: ApiResponse = {
      data: { deleted: success },
      meta: {
        timestamp: Date.now()
      }
    }
    
    return c.json(response)
  } catch (error: any) {
    const response: ApiResponse = {
      error: {
        type: error.name === 'NotFoundError' ? 'not_found_error' : 
               error.name === 'AuthenticationError' ? 'authentication_error' : 'api_error',
        message: error.message
      }
    }
    return c.json(response, error.statusCode || 404)
  }
})

customerRouter.get('/addresses/default/:type', async (c) => {
  try {
    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET)
    const authHeader = c.req.header('Authorization')
    const token = authService.extractTokenFromHeader(authHeader)
    const user = await authService.verifyToken(token)

    const customerService = new CustomerService(c.env.DB)
    const addressType = c.req.param('type') as 'shipping' | 'billing'
    
    if (!['shipping', 'billing'].includes(addressType)) {
      const response: ApiResponse = {
        error: {
          type: 'validation_error',
          message: 'Invalid address type. Must be shipping or billing.'
        }
      }
      return c.json(response, 400)
    }
    
    const address = await customerService.getDefaultAddress(user.id, addressType)
    
    const response: ApiResponse = {
      data: address,
      meta: {
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