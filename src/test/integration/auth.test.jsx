import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AdminPage } from '../../pages/AdminPage'

// Mock child components
vi.mock('../../components/admin/LoginForm', () => ({
  LoginForm: ({ onLogin }) => (
    <div data-testid="login-form">
      <button onClick={() => onLogin({ id: 1, username: 'admin', role: 'admin' })}>
        Mock Login
      </button>
    </div>
  )
}))

vi.mock('../../components/admin/AdminDashboard', () => ({
  AdminDashboard: ({ user, onLogout }) => (
    <div data-testid="admin-dashboard">
      <span>Welcome {user.username}</span>
      <button onClick={onLogout}>Mock Logout</button>
    </div>
  )
}))

const AdminPageWrapper = () => (
  <BrowserRouter>
    <AdminPage />
  </BrowserRouter>
)

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  it('shows login form when not authenticated', () => {
    global.localStorage.getItem.mockReturnValue(null)

    render(<AdminPageWrapper />)

    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
  })

  it('shows dashboard when authenticated with valid token', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' }
    global.localStorage.getItem
      .mockReturnValueOnce('valid-token')
      .mockReturnValueOnce(JSON.stringify(mockUser))

    render(<AdminPageWrapper />)

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome admin')).toBeInTheDocument()
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
  })

  it('handles login flow correctly', async () => {
    const user = userEvent.setup()
    global.localStorage.getItem.mockReturnValue(null)

    render(<AdminPageWrapper />)

    // Initially shows login form
    expect(screen.getByTestId('login-form')).toBeInTheDocument()

    // Click mock login button
    await user.click(screen.getByText('Mock Login'))

    // Should now show dashboard
    await waitFor(() => {
      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
      expect(screen.getByText('Welcome admin')).toBeInTheDocument()
    })
  })

  it('handles logout flow correctly', async () => {
    const user = userEvent.setup()
    const mockUser = { id: 1, username: 'admin', role: 'admin' }
    
    global.localStorage.getItem
      .mockReturnValueOnce('valid-token')
      .mockReturnValueOnce(JSON.stringify(mockUser))

    render(<AdminPageWrapper />)

    // Initially shows dashboard
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()

    // Click logout
    await user.click(screen.getByText('Mock Logout'))

    // Should now show login form
    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
    })
  })

  it('handles invalid stored user data', () => {
    global.localStorage.getItem
      .mockReturnValueOnce('valid-token')
      .mockReturnValueOnce('invalid-json')

    render(<AdminPageWrapper />)

    // Should show login form due to invalid JSON
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('adminToken')
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('adminUser')
  })

  it('shows loading state initially', () => {
    // Mock that we're checking localStorage
    global.localStorage.getItem.mockReturnValue(null)

    render(<AdminPageWrapper />)

    // Should eventually show login form (after loading)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('preserves authentication state between renders', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' }
    global.localStorage.getItem
      .mockReturnValue('valid-token')
      .mockReturnValue(JSON.stringify(mockUser))

    const { rerender } = render(<AdminPageWrapper />)

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()

    // Rerender component
    rerender(<AdminPageWrapper />)

    // Should still show dashboard
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  it('handles missing token with valid user data', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' }
    global.localStorage.getItem
      .mockReturnValueOnce(null) // No token
      .mockReturnValueOnce(JSON.stringify(mockUser)) // But has user data

    render(<AdminPageWrapper />)

    // Should show login form since token is missing
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('handles valid token with missing user data', () => {
    global.localStorage.getItem
      .mockReturnValueOnce('valid-token') // Has token
      .mockReturnValueOnce(null) // But no user data

    render(<AdminPageWrapper />)

    // Should show login form since user data is missing
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})