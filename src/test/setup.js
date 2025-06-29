import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({
      revert: vi.fn()
    })),
    timeline: vi.fn(() => ({
      from: vi.fn(() => ({ from: vi.fn() })),
      to: vi.fn(() => ({ to: vi.fn() }))
    })),
    from: vi.fn(),
    to: vi.fn()
  },
  ScrollTrigger: {}
}))

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock environment variables
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3001')