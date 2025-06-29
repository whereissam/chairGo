import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductManager } from '../../components/admin/ProductManager'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('ProductManager', () => {
  const mockProducts = [
    {
      id: 1,
      name: '人體工學辦公椅',
      nameEn: 'Ergonomic Office Chair',
      description: '高級辦公椅',
      price: 299.99,
      category: 'office',
      images: ['https://example.com/chair1.jpg'],
      inStock: true,
      is_featured: true,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      name: '現代沙發',
      nameEn: 'Modern Sofa',
      description: '舒適沙發',
      price: 899.99,
      category: 'living',
      images: ['https://example.com/sofa1.jpg'],
      inStock: true,
      is_featured: false,
      rating: 4.6,
      reviews: 89
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.localStorage = {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }

    // Mock successful products fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts })
    })
  })

  it('renders product manager correctly', async () => {
    render(<ProductManager />)

    expect(screen.getByText('Product Management')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
      expect(screen.getByText('現代沙發')).toBeInTheDocument()
    })
  })

  it('fetches products on mount', async () => {
    render(<ProductManager />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products')
    })
  })

  it('displays product information correctly', async () => {
    render(<ProductManager />)

    await waitFor(() => {
      // Check product names
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
      expect(screen.getByText('Ergonomic Office Chair')).toBeInTheDocument()
      
      // Check prices
      expect(screen.getByText('$299.99')).toBeInTheDocument()
      expect(screen.getByText('$899.99')).toBeInTheDocument()
      
      // Check categories
      expect(screen.getByText('辦公家具')).toBeInTheDocument()
      
      // Check stock status
      expect(screen.getAllByText('In Stock')).toHaveLength(2)
      
      // Check featured status
      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('Regular')).toBeInTheDocument()
      
      // Check ratings
      expect(screen.getByText('4.8 (156)')).toBeInTheDocument()
      expect(screen.getByText('4.6 (89)')).toBeInTheDocument()
    })
  })

  it('filters products by search term', async () => {
    const user = userEvent.setup()
    render(<ProductManager />)

    await waitFor(() => {
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
      expect(screen.getByText('現代沙發')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search products...')
    await user.type(searchInput, '辦公椅')

    // Should only show the office chair
    expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
    expect(screen.queryByText('現代沙發')).not.toBeInTheDocument()
  })

  it('filters products by category', async () => {
    const user = userEvent.setup()
    render(<ProductManager />)

    await waitFor(() => {
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
      expect(screen.getByText('現代沙發')).toBeInTheDocument()
    })

    const categorySelect = screen.getByDisplayValue('All Categories')
    await user.selectOptions(categorySelect, 'office')

    // Should only show office products
    expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
    expect(screen.queryByText('現代沙發')).not.toBeInTheDocument()
  })

  it('opens create product modal', async () => {
    const user = userEvent.setup()
    render(<ProductManager />)

    const addButton = screen.getByRole('button', { name: /add product/i })
    await user.click(addButton)

    expect(screen.getByText('Create New Product')).toBeInTheDocument()
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
  })

  it('handles product deletion', async () => {
    const user = userEvent.setup()
    
    // Mock window.confirm
    global.confirm = vi.fn(() => true)
    
    // Mock successful deletion
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Delete request
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [mockProducts[1]] }) }) // Refetch

    render(<ProductManager />)

    await waitFor(() => {
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg') && 
      button.className.includes('text-red-600')
    )

    await user.click(deleteButton)

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?')

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products/1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      })
    })
  })

  it('opens edit product modal', async () => {
    const user = userEvent.setup()
    render(<ProductManager />)

    await waitFor(() => {
      expect(screen.getByText('人體工學辦公椅')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(button => 
      button.querySelector('svg') && 
      !button.className.includes('text-red-600')
    )

    await user.click(editButton)

    expect(screen.getByText('Edit Product')).toBeInTheDocument()
    expect(screen.getByDisplayValue('人體工學辦公椅')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    // Mock pending fetch
    global.fetch.mockImplementation(() => new Promise(() => {}))

    render(<ProductManager />)

    expect(screen.getByText('Product Management')).toBeInTheDocument()
    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('handles fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<ProductManager />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Should still render the component
    expect(screen.getByText('Product Management')).toBeInTheDocument()
  })

  it('displays correct table headers', async () => {
    render(<ProductManager />)

    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('shows fallback image when no image available', async () => {
    const productsWithoutImages = [
      { ...mockProducts[0], images: [], image_url: '' }
    ]

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: productsWithoutImages })
    })

    render(<ProductManager />)

    await waitFor(() => {
      expect(document.querySelector('.bg-gray-200')).toBeInTheDocument()
    })
  })
})