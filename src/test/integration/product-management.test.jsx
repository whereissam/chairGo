import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductManager } from '../../components/admin/ProductManager'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('Product Management Integration', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Chair',
      nameEn: 'Test Chair EN',
      description: 'A test chair',
      descriptionEn: 'A test chair EN',
      price: 299.99,
      category: 'office',
      images: ['https://example.com/chair.jpg'],
      inStock: true,
      is_featured: false,
      rating: 4.5,
      reviews: 100,
      specifications: {
        material: '網布',
        materialEn: 'Mesh',
        dimensions: '66x66x96cm',
        dimensionsEn: '26"W x 26"D x 38"H',
        weight: '15kg',
        weightEn: '15kg',
        color: ['黑色', '灰色'],
        colorEn: ['Black', 'Gray']
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.localStorage = {
      getItem: vi.fn(() => 'mock-admin-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.confirm = vi.fn(() => true)

    // Default mock for products fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts })
    })
  })

  describe('Product CRUD Operations', () => {
    it('completes full product creation flow', async () => {
      const user = userEvent.setup()

      // Mock successful creation
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, productId: 2 }) }) // Create
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [...mockProducts, { id: 2, name: 'New Chair' }] }) }) // Refetch

      render(<ProductManager />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Open create modal
      await user.click(screen.getByRole('button', { name: /add product/i }))
      expect(screen.getByText('Create New Product')).toBeInTheDocument()

      // Fill out form
      await user.type(screen.getByLabelText('Name (Chinese)'), 'New Test Chair')
      await user.type(screen.getByLabelText('Name (English)'), 'New Test Chair EN')
      await user.selectOptions(screen.getByLabelText('Category'), 'office')
      await user.type(screen.getByLabelText('Description (Chinese)'), 'A new test chair')
      await user.type(screen.getByLabelText('Price ($)'), '399.99')
      await user.type(screen.getByLabelText('Stock Quantity'), '15')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create/i }))

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-admin-token'
          },
          body: expect.stringContaining('New Test Chair')
        })
      })
    })

    it('completes full product edit flow', async () => {
      const user = userEvent.setup()

      // Mock successful update
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Update
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [{ ...mockProducts[0], name: 'Updated Chair' }] }) }) // Refetch

      render(<ProductManager />)

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Find and click edit button
      const editButtons = screen.getAllByRole('button')
      const editButton = editButtons.find(button => 
        button.querySelector('svg') && 
        !button.className.includes('text-red-600')
      )
      
      await user.click(editButton)

      // Should open edit modal with pre-filled data
      expect(screen.getByText('Edit Product')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Chair')).toBeInTheDocument()

      // Update the name
      const nameInput = screen.getByDisplayValue('Test Chair')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Test Chair')

      // Submit changes
      await user.click(screen.getByRole('button', { name: /update/i }))

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-admin-token'
          },
          body: expect.stringContaining('Updated Test Chair')
        })
      })
    })

    it('completes full product deletion flow', async () => {
      const user = userEvent.setup()

      // Mock successful deletion
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Delete
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [] }) }) // Refetch

      render(<ProductManager />)

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('svg') && 
        button.className.includes('text-red-600')
      )

      await user.click(deleteButton)

      // Verify confirmation and API call
      expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?')
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/1', {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer mock-admin-token'
          }
        })
      })
    })
  })

  describe('Product Search and Filtering', () => {
    const multipleProducts = [
      { ...mockProducts[0], id: 1, name: 'Office Chair', category: 'office' },
      { ...mockProducts[0], id: 2, name: 'Dining Chair', category: 'dining' },
      { ...mockProducts[0], id: 3, name: 'Living Room Sofa', category: 'living' }
    ]

    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ products: multipleProducts })
      })
    })

    it('filters products by search term', async () => {
      const user = userEvent.setup()
      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Office Chair')).toBeInTheDocument()
        expect(screen.getByText('Dining Chair')).toBeInTheDocument()
        expect(screen.getByText('Living Room Sofa')).toBeInTheDocument()
      })

      // Search for "office"
      const searchInput = screen.getByPlaceholderText('Search products...')
      await user.type(searchInput, 'office')

      // Should only show office chair
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
      expect(screen.queryByText('Dining Chair')).not.toBeInTheDocument()
      expect(screen.queryByText('Living Room Sofa')).not.toBeInTheDocument()
    })

    it('filters products by category', async () => {
      const user = userEvent.setup()
      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Office Chair')).toBeInTheDocument()
        expect(screen.getByText('Dining Chair')).toBeInTheDocument()
        expect(screen.getByText('Living Room Sofa')).toBeInTheDocument()
      })

      // Filter by dining category
      const categorySelect = screen.getByDisplayValue('All Categories')
      await user.selectOptions(categorySelect, 'dining')

      // Should only show dining chair
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
      expect(screen.getByText('Dining Chair')).toBeInTheDocument()
      expect(screen.queryByText('Living Room Sofa')).not.toBeInTheDocument()
    })

    it('combines search and category filters', async () => {
      const user = userEvent.setup()
      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Office Chair')).toBeInTheDocument()
        expect(screen.getByText('Dining Chair')).toBeInTheDocument()
        expect(screen.getByText('Living Room Sofa')).toBeInTheDocument()
      })

      // Search for "chair" and filter by office
      const searchInput = screen.getByPlaceholderText('Search products...')
      await user.type(searchInput, 'chair')

      const categorySelect = screen.getByDisplayValue('All Categories')
      await user.selectOptions(categorySelect, 'office')

      // Should only show office chair
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
      expect(screen.queryByText('Dining Chair')).not.toBeInTheDocument()
      expect(screen.queryByText('Living Room Sofa')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      render(<ProductManager />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // Should still render the component
      expect(screen.getByText('Product Management')).toBeInTheDocument()
    })

    it('handles creation errors', async () => {
      const user = userEvent.setup()

      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Validation failed' }) }) // Failed creation

      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Open create modal and try to submit invalid data
      await user.click(screen.getByRole('button', { name: /add product/i }))
      await user.click(screen.getByRole('button', { name: /create/i }))

      // Should handle the error gracefully
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products', expect.any(Object))
      })
    })

    it('handles update errors', async () => {
      const user = userEvent.setup()

      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Product not found' }) }) // Failed update

      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Try to edit product
      const editButtons = screen.getAllByRole('button')
      const editButton = editButtons.find(button => 
        button.querySelector('svg') && 
        !button.className.includes('text-red-600')
      )
      
      await user.click(editButton)
      await user.click(screen.getByRole('button', { name: /update/i }))

      // Should handle the error gracefully
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/1', expect.any(Object))
      })
    })

    it('handles deletion errors', async () => {
      const user = userEvent.setup()

      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ products: mockProducts }) }) // Initial fetch
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Product not found' }) }) // Failed deletion

      render(<ProductManager />)

      await waitFor(() => {
        expect(screen.getByText('Test Chair')).toBeInTheDocument()
      })

      // Try to delete product
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('svg') && 
        button.className.includes('text-red-600')
      )

      await user.click(deleteButton)

      // Should handle the error gracefully
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/1', expect.any(Object))
      })
    })
  })
})