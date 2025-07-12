// Stripe-style API types and interfaces

export interface BaseResource {
  id: string
  object: string
  created: number
  updated?: number
}

export interface ApiResponse<T = any> {
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

export interface ApiError {
  type: 'validation_error' | 'authentication_error' | 'authorization_error' | 'not_found_error' | 'rate_limit_error' | 'api_error'
  message: string
  code?: string
  param?: string
  details?: any
}

export interface ResponseMeta {
  pagination?: {
    limit: number
    offset: number
    total?: number
    has_more: boolean
  }
  request_id?: string
  timestamp: number
}

export interface PaginationParams {
  limit?: number
  offset?: number
  starting_after?: string
}

// Product types
export interface Product extends BaseResource {
  object: 'product'
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  stock_quantity: number
  is_featured: boolean
  tags: string[]
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  stock_quantity?: number
  is_featured?: boolean
  tags?: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// User types
export interface User extends BaseResource {
  object: 'user'
  username: string
  email: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}