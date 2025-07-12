import React from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser
} from '@clerk/clerk-react'

const UserSocialLogin = ({ className = "" }) => {
  const { user, isSignedIn } = useUser()

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <SignedOut>
        <div className="flex items-center space-x-3">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Sign In
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-700">
            Welcome, {user?.firstName || user?.username || 'User'}!
          </div>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  )
}

export default UserSocialLogin