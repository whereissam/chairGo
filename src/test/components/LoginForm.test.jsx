import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../../components/admin/LoginForm'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('LoginForm', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  it('renders login form correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} />)

    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByText('Sign in to access the admin panel')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('shows validation for required fields', async () => {
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')

    expect(usernameInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@chairgo.com',
        role: 'admin'
      }
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<LoginForm onLogin={mockOnLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123'
          })
        }
      )
    })

    await waitFor(() => {
      expect(global.localStorage.setItem).toHaveBeenCalledWith('adminToken', 'mock-token')
      expect(global.localStorage.setItem).toHaveBeenCalledWith('adminUser', JSON.stringify(mockResponse.user))
      expect(mockOnLogin).toHaveBeenCalledWith(mockResponse.user)
    })
  })

  it('handles login failure', async () => {
    const user = userEvent.setup()
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: 'Invalid credentials'
      })
    })

    render(<LoginForm onLogin={mockOnLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
  })

  it('handles network error', async () => {
    const user = userEvent.setup()
    
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<LoginForm onLogin={mockOnLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
  })

  it('disables form during submission', async () => {
    const user = userEvent.setup()
    
    // Mock a slow response
    global.fetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, token: 'token', user: {} })
      }), 100))
    )

    render(<LoginForm onLogin={mockOnLogin} />)

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin123')
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    await user.click(submitButton)

    // Check that button shows loading state
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
    
    // Check that inputs are disabled
    expect(screen.getByLabelText('Username')).toBeDisabled()
    expect(screen.getByLabelText('Password')).toBeDisabled()
  })

  it('shows default credentials hint', () => {
    render(<LoginForm onLogin={mockOnLogin} />)

    expect(screen.getByText('Default credentials:')).toBeInTheDocument()
    expect(screen.getByText('Username: admin | Password: admin123')).toBeInTheDocument()
  })

  it('updates form fields correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)

    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'testpass')

    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('testpass')
  })
})