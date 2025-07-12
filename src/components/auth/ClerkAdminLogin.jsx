import React from 'react'
import {
  SignedIn,
  SignedOut,
  useUser,
  RedirectToSignIn
} from '@clerk/clerk-react'
import SocialLoginSection from './SocialLoginSection'
import { Navigate } from 'react-router-dom'

const ClerkAdminLogin = () => {
  const { user, isSignedIn } = useUser()

  // If signed in and is admin, redirect to dashboard
  if (isSignedIn && user?.publicMetadata?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  // If signed in but not admin, show access denied
  if (isSignedIn && user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You don't have admin privileges
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-2">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Admin Access Required</h3>
                <div className="text-sm text-yellow-700 mt-1">
                  <p>Your account ({user?.emailAddresses[0]?.emailAddress}) does not have admin privileges.</p>
                  <p className="mt-2">Contact your administrator to request admin access.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your admin account to continue
          </p>
        </div>

        <SignedOut>
          <SocialLoginSection showAdminAccess={true} />
        </SignedOut>

        <SignedIn>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Checking admin access...</p>
          </div>
        </SignedIn>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>🔐 Powered by Clerk Authentication</p>
          <p>• Secure social login</p>
          <p>• Enterprise-grade security</p>
          <p>• Role-based access control</p>
        </div>
      </div>
    </div>
  )
}

export default ClerkAdminLogin