# Testing Guide for ChairGo

This document outlines the comprehensive testing strategy for the ChairGo admin system, including both frontend and backend components.

## 🧪 Testing Stack

### Frontend Testing
- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **User Interactions**: @testing-library/user-event
- **DOM Assertions**: @testing-library/jest-dom
- **Mocking**: MSW (Mock Service Worker)

### Backend Testing
- **Framework**: Vitest
- **HTTP Testing**: Supertest
- **Mocking**: Built-in Vitest mocks

## 📁 Test Structure

```
src/test/
├── setup.js                    # Test environment setup
├── components/                 # Component unit tests
│   ├── LoginForm.test.jsx
│   ├── AdminDashboard.test.jsx
│   └── ProductManager.test.jsx
└── integration/               # Integration tests
    ├── auth.test.jsx
    ├── product-management.test.jsx
    └── e2e.test.jsx

api/tests/
├── auth.test.js              # Authentication API tests
├── products.test.js          # Products API tests
└── admin.test.js            # Admin API tests
```

## 🚀 Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Backend Tests

```bash
cd api

# Run all API tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Run All Tests

```bash
# Run both frontend and backend tests
npm test && cd api && npm test
```

## 📊 Test Categories

### 1. Unit Tests

**Frontend Components**
- ✅ LoginForm component behavior
- ✅ AdminDashboard navigation and state
- ✅ ProductManager CRUD operations
- ✅ Form validation and error handling

**Backend API Endpoints**
- ✅ Authentication routes
- ✅ Product management routes
- ✅ Admin routes
- ✅ Input validation
- ✅ Error responses

### 2. Integration Tests

**Authentication Flow**
- ✅ Login/logout process
- ✅ Token storage and retrieval
- ✅ Protected route access
- ✅ Session persistence

**Product Management**
- ✅ Complete CRUD workflows
- ✅ Search and filtering
- ✅ Form submission
- ✅ API error handling

### 3. End-to-End Tests

**User Workflows**
- ✅ Landing page navigation
- ✅ Admin authentication flow
- ✅ Product lifecycle management
- ✅ Error handling scenarios

**Performance & Accessibility**
- ✅ Load time testing
- ✅ Large dataset handling
- ✅ Keyboard navigation
- ✅ Semantic structure

## 🎯 Test Coverage Goals

### Current Coverage
- **Frontend**: Covers all major components and user flows
- **Backend**: Covers all API endpoints and error scenarios
- **Integration**: Covers authentication and product management workflows

### Coverage Targets
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🧩 Test Utilities

### Frontend Mocks

```javascript
// API Base URL Mock
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3001')

// GSAP Mock (for animation testing)
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    // ... other GSAP methods
  }
}))

// LocalStorage Mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)
```

### Backend Mocks

```javascript
// Database Mock
const mockEnv = {
  DB: {
    prepare: vi.fn(() => ({
      bind: vi.fn(() => ({
        first: vi.fn(),
        all: vi.fn(() => ({ results: [] })),
        run: vi.fn(() => ({ success: true }))
      }))
    }))
  },
  JWT_SECRET: 'test-secret'
}
```

## 📋 Testing Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] New features have corresponding tests
- [ ] Test coverage meets minimum thresholds
- [ ] No console errors in test output
- [ ] Integration tests verify end-to-end workflows

### Before Deploying
- [ ] All tests pass in CI/CD
- [ ] Performance tests within acceptable limits
- [ ] API tests verify all endpoints
- [ ] Authentication flows tested
- [ ] Error scenarios handled gracefully

## 🐛 Common Test Scenarios

### Authentication
```javascript
// Test login success
it('should login with valid credentials', async () => {
  // Mock successful API response
  // Fill login form
  // Verify token storage
  // Verify navigation to dashboard
})

// Test login failure
it('should handle invalid credentials', async () => {
  // Mock failed API response
  // Fill login form with invalid data
  // Verify error message display
  // Verify no navigation occurs
})
```

### Product Management
```javascript
// Test product creation
it('should create new product', async () => {
  // Open create modal
  // Fill product form
  // Submit form
  // Verify API call
  // Verify product appears in list
})

// Test product search
it('should filter products by search term', async () => {
  // Load products list
  // Enter search term
  // Verify filtered results
})
```

### Error Handling
```javascript
// Test network errors
it('should handle network failures', async () => {
  // Mock network error
  // Trigger action
  // Verify error message
  // Verify graceful degradation
})
```

## 🚨 Test Environment Setup

### Prerequisites
```bash
# Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw

# Backend dependencies
cd api
npm install -D vitest @types/supertest supertest
```

### Environment Variables
```bash
# Frontend (.env.test)
VITE_API_BASE_URL=http://localhost:3001

# Backend (test environment)
JWT_SECRET=test-secret-key
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: cd api && npm ci && npm test
```

## 🔍 Debugging Tests

### Common Issues
1. **GSAP Errors**: Mock GSAP in test setup
2. **Router Errors**: Wrap components in BrowserRouter
3. **API Timeouts**: Mock fetch calls properly
4. **LocalStorage**: Mock storage methods

### Debug Commands
```bash
# Run specific test file
npm test LoginForm.test.jsx

# Run tests with verbose output
npm test -- --reporter=verbose

# Debug specific test
npm test -- --debug
```

## 📚 Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on user interactions and outcomes
   - Avoid testing internal component state

2. **Use Descriptive Test Names**
   - Clearly state what is being tested
   - Include expected behavior

3. **Mock External Dependencies**
   - Mock API calls, timers, and browser APIs
   - Keep tests isolated and predictable

4. **Test Error Scenarios**
   - Network failures, invalid inputs, edge cases
   - Ensure graceful error handling

5. **Maintain Test Data**
   - Use realistic test data
   - Keep test fixtures up to date

## 🎉 Success Metrics

- ✅ 100% of critical user paths tested
- ✅ All API endpoints covered
- ✅ Error scenarios handled
- ✅ Performance within acceptable limits
- ✅ Accessibility requirements met
- ✅ Cross-browser compatibility verified

---

This testing strategy ensures the ChairGo admin system is robust, reliable, and maintainable. Regular test execution and maintenance keep the application quality high throughout development and deployment cycles.