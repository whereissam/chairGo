import { z } from 'zod'
import { CustomerAddress, CreateAddressRequest } from '../types/api'
import { CustomerAddressModel } from '../models/CustomerAddressModel'
import { ValidationError, NotFoundError } from '../errors/ApiError'

const createAddressSchema = z.object({
  address_type: z.enum(['shipping', 'billing']),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  street_address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postal_code: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  is_default: z.boolean().default(false)
})

export class CustomerService {
  private addressModel: CustomerAddressModel

  constructor(db: D1Database) {
    this.addressModel = new CustomerAddressModel(db)
  }

  async createAddress(userId: string, data: CreateAddressRequest): Promise<CustomerAddress> {
    try {
      const validatedData = createAddressSchema.parse(data)
      return await this.addressModel.create({
        user_id: userId,
        ...validatedData
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid address data', undefined, error.errors)
      }
      throw error
    }
  }

  async getAddressById(id: string): Promise<CustomerAddress> {
    const address = await this.addressModel.findById(id)
    if (!address) {
      throw new NotFoundError('Address')
    }
    return address
  }

  async getUserAddresses(userId: string, addressType?: 'shipping' | 'billing'): Promise<CustomerAddress[]> {
    return await this.addressModel.findByUserId(userId, addressType)
  }

  async getDefaultAddress(userId: string, addressType: 'shipping' | 'billing'): Promise<CustomerAddress | null> {
    return await this.addressModel.findDefaultAddress(userId, addressType)
  }

  async updateAddress(id: string, userId: string, data: Partial<CreateAddressRequest>): Promise<CustomerAddress> {
    const address = await this.addressModel.findById(id)
    if (!address) {
      throw new NotFoundError('Address')
    }

    if (address.user_id !== userId) {
      throw new ValidationError('Unauthorized to update this address')
    }

    try {
      const validatedData = createAddressSchema.partial().parse(data)
      return await this.addressModel.update(id, validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid address data', undefined, error.errors)
      }
      throw error
    }
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    const address = await this.addressModel.findById(id)
    if (!address) {
      throw new NotFoundError('Address')
    }

    if (address.user_id !== userId) {
      throw new ValidationError('Unauthorized to delete this address')
    }

    return await this.addressModel.delete(id)
  }
}