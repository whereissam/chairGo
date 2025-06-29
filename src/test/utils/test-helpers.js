// Test helper utilities for ChairGo testing

/**
 * Mock API response helper
 */
export const mockApiResponse = (data, options = {}) => {
  const { status = 200, ok = true, delay = 0 } = options
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data)
      })
    }, delay)
  })
}

/**
 * Mock API error helper
 */
export const mockApiError = (error = 'Network error', delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(error))
    }, delay)
  })
}

/**
 * Mock localStorage for tests
 */
export const createMockLocalStorage = () => {
  const store = new Map()
  
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, value)),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    get length() { return store.size },
    key: vi.fn((index) => Array.from(store.keys())[index] || null)
  }
}

/**
 * Mock admin user data
 */
export const mockAdminUser = {
  id: 1,
  username: 'admin',
  email: 'admin@chairgo.com',
  role: 'admin'
}

/**
 * Mock regular user data
 */
export const mockRegularUser = {
  id: 2,
  username: 'user1',
  email: 'user1@example.com',
  role: 'user'
}

/**
 * Mock product data
 */
export const mockProduct = {
  id: 1,
  name: '人體工學辦公椅',
  nameEn: 'Ergonomic Office Chair',
  description: '高級人體工學辦公椅，配備腰部支撐和可調節功能',
  descriptionEn: 'Premium ergonomic office chair with lumbar support',
  price: 299.99,
  category: 'office',
  images: ['https://example.com/chair1.jpg'],
  image_url: 'https://example.com/chair1.jpg',
  stock_quantity: 25,
  inStock: true,
  is_featured: true,
  rating: 4.8,
  reviews: 156,
  specifications: {
    material: '網布和金屬',
    materialEn: 'Mesh and Metal',
    dimensions: '寬66公分 x 深66公分 x 高96-107公分',
    dimensionsEn: '26"W x 26"D x 38-42"H',
    weight: '15公斤',
    weightEn: '15kg',
    color: ['黑色', '灰色'],
    colorEn: ['Black', 'Gray']
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
}

/**
 * Generate multiple mock products
 */
export const generateMockProducts = (count = 5) => {
  const categories = ['office', 'living', 'dining', 'bedroom', 'outdoor']
  
  return Array.from({ length: count }, (_, index) => ({
    ...mockProduct,
    id: index + 1,
    name: `Test Chair ${index + 1}`,
    nameEn: `Test Chair ${index + 1} EN`,
    price: 100 + (index * 50),
    category: categories[index % categories.length],
    stock_quantity: Math.floor(Math.random() * 50),
    is_featured: Math.random() > 0.5,
    rating: 3.5 + (Math.random() * 1.5),
    reviews: Math.floor(Math.random() * 200)
  }))
}

/**
 * Mock dashboard stats
 */
export const mockDashboardStats = {
  totalProducts: 25,
  totalUsers: 5,
  recentProducts: [
    { id: 1, name: 'Chair 1', price: 299.99, created_at: '2024-01-01' },
    { id: 2, name: 'Chair 2', price: 399.99, created_at: '2024-01-02' }
  ],
  lowStockProducts: [
    { id: 3, name: 'Chair 3', stock_quantity: 5 },
    { id: 4, name: 'Chair 4', stock_quantity: 2 }
  ]
}

/**
 * Wait for element helper
 */
export const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element ${selector} not found within ${timeout}ms`))
    }, timeout)
  })
}

/**
 * Setup authenticated admin environment
 */
export const setupAuthenticatedAdmin = () => {
  const mockToken = 'mock-admin-token-123'
  const localStorage = createMockLocalStorage()
  
  localStorage.setItem('adminToken', mockToken)
  localStorage.setItem('adminUser', JSON.stringify(mockAdminUser))
  
  global.localStorage = localStorage
  
  return { mockToken, localStorage, user: mockAdminUser }
}

/**
 * Setup unauthenticated environment
 */
export const setupUnauthenticated = () => {
  const localStorage = createMockLocalStorage()
  global.localStorage = localStorage
  return { localStorage }
}

/**
 * Mock fetch with common responses
 */
export const setupMockFetch = () => {
  const mockFetch = vi.fn()
  
  // Default responses
  const responses = {
    login: mockApiResponse({
      success: true,
      token: 'mock-token',
      user: mockAdminUser
    }),
    products: mockApiResponse({
      products: generateMockProducts(3)
    }),
    dashboard: mockApiResponse({
      stats: mockDashboardStats
    }),
    users: mockApiResponse({
      users: [mockAdminUser, mockRegularUser]
    })
  }
  
  // Setup default mock behavior
  mockFetch.mockImplementation((url, options = {}) => {
    if (url.includes('/api/auth/login')) return responses.login
    if (url.includes('/api/products') && options.method !== 'POST') return responses.products
    if (url.includes('/api/admin/dashboard')) return responses.dashboard
    if (url.includes('/api/admin/users')) return responses.users
    
    // Default success response
    return mockApiResponse({ success: true })
  })
  
  global.fetch = mockFetch
  
  return {
    mockFetch,
    setResponse: (key, response) => {
      responses[key] = response
    },
    getResponse: (key) => responses[key]
  }
}

/**
 * Form input helper
 */
export const fillForm = async (user, fields) => {
  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(label)
    
    if (input.type === 'checkbox') {
      if (value && !input.checked) {
        await user.click(input)
      } else if (!value && input.checked) {
        await user.click(input)
      }
    } else if (input.tagName === 'SELECT') {
      await user.selectOptions(input, value)
    } else {
      await user.clear(input)
      if (value) {
        await user.type(input, value.toString())
      }
    }
  }
}

/**
 * Assert error message helper
 */
export const expectErrorMessage = (message) => {
  expect(screen.getByText(message)).toBeInTheDocument()
}

/**
 * Assert success message helper
 */
export const expectSuccessMessage = (message) => {
  expect(screen.getByText(message)).toBeInTheDocument()
}

/**
 * Create test wrapper with providers
 */
export const createTestWrapper = (providers = []) => {
  return function TestWrapper({ children }) {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    )
  }
}

/**
 * Performance testing helper
 */
export const measurePerformance = async (fn) => {
  const start = performance.now()
  await fn()
  const end = performance.now()
  return end - start
}

/**
 * Accessibility testing helper
 */
export const checkAccessibility = (container) => {
  // Check for basic accessibility attributes
  const images = container.querySelectorAll('img')
  images.forEach(img => {
    expect(img).toHaveAttribute('alt')
  })
  
  const buttons = container.querySelectorAll('button')
  buttons.forEach(button => {
    expect(button).toBeVisible()
    expect(button).not.toHaveAttribute('disabled', 'true')
  })
  
  const inputs = container.querySelectorAll('input')
  inputs.forEach(input => {
    if (input.type !== 'hidden') {
      expect(input).toHaveAccessibleName()
    }
  })
}

export default {
  mockApiResponse,
  mockApiError,
  createMockLocalStorage,
  mockAdminUser,
  mockRegularUser,
  mockProduct,
  generateMockProducts,
  mockDashboardStats,
  waitForElement,
  setupAuthenticatedAdmin,
  setupUnauthenticated,
  setupMockFetch,
  fillForm,
  expectErrorMessage,
  expectSuccessMessage,
  createTestWrapper,
  measurePerformance,
  checkAccessibility
}