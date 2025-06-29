import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminDashboard } from '../../components/admin/AdminDashboard'

// Mock child components
vi.mock('../../components/admin/DashboardStats', () => ({
  DashboardStats: ({ stats, loading }) => (
    <div data-testid="dashboard-stats">
      {loading ? 'Loading stats...' : `Stats: ${stats?.totalProducts || 0} products`}
    </div>
  )
}))

vi.mock('../../components/admin/ProductManager', () => ({
  ProductManager: () => <div data-testid="product-manager">Product Manager</div>
}))

vi.mock('../../components/admin/UserManager', () => ({
  UserManager: () => <div data-testid="user-manager">User Manager</div>
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('AdminDashboard', () => {
  const mockUser = {
    id: 1,
    username: 'admin',
    email: 'admin@chairgo.com',
    role: 'admin'
  }

  const mockOnLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.localStorage = {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  it('renders dashboard header correctly', () => {
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    expect(screen.getByText('ChairGo Admin')).toBeInTheDocument()
    expect(screen.getByText('Welcome, admin')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('renders navigation menu', () => {
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows dashboard stats by default', () => {
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument()
  })

  it('fetches dashboard stats on mount', async () => {
    const mockStats = {
      totalProducts: 25,
      totalUsers: 5,
      recentProducts: [],
      lowStockProducts: []
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ stats: mockStats })
    })

    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/admin/dashboard',
        {
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        }
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Stats: 25 products')).toBeInTheDocument()
    })
  })

  it('handles navigation between tabs', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    // Initially shows dashboard
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument()

    // Click on Products tab
    await user.click(screen.getByText('Products'))
    expect(screen.getByTestId('product-manager')).toBeInTheDocument()

    // Click on Users tab
    await user.click(screen.getByText('Users'))
    expect(screen.getByTestId('user-manager')).toBeInTheDocument()

    // Click on Settings tab
    await user.click(screen.getByText('Settings'))
    expect(screen.getByText('Settings coming soon...')).toBeInTheDocument()

    // Click back to Dashboard
    await user.click(screen.getByText('Dashboard'))
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument()
  })

  it('handles logout correctly', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    expect(global.localStorage.removeItem).toHaveBeenCalledWith('adminToken')
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('adminUser')
    expect(mockOnLogout).toHaveBeenCalled()
  })

  it('highlights active navigation item', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    const dashboardTab = screen.getByText('Dashboard').closest('button')
    const productsTab = screen.getByText('Products').closest('button')

    // Dashboard should be active by default
    expect(dashboardTab).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(productsTab).not.toHaveClass('bg-blue-50', 'text-blue-700')

    // Click Products tab
    await user.click(screen.getByText('Products'))

    expect(productsTab).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(dashboardTab).not.toHaveClass('bg-blue-50', 'text-blue-700')
  })

  it('handles stats fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Should still render the dashboard but with default stats
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    // Mock a pending fetch
    global.fetch.mockImplementation(() => new Promise(() => {}))

    render(<AdminDashboard user={mockUser} onLogout={mockOnLogout} />)

    expect(screen.getByText('Loading stats...')).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    const customUser = {
      id: 2,
      username: 'testadmin',
      email: 'test@chairgo.com',
      role: 'admin'
    }

    render(<AdminDashboard user={customUser} onLogout={mockOnLogout} />)

    expect(screen.getByText('Welcome, testadmin')).toBeInTheDocument()
  })
})