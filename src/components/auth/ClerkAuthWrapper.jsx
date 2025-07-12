import React from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react'
import { useAuth as useInternalAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

const ClerkAuthWrapper = ({ children }) => {
  const { user: clerkUser, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const { login, logout, isAuthenticated } = useInternalAuth()

  // Sync Clerk auth state with internal auth system
  useEffect(() => {
    if (isSignedIn && clerkUser && !isAuthenticated) {
      // User signed in with Clerk but not with internal system
      // Auto-login with internal system if user has admin role
      const syncClerkWithInternal = async () => {
        try {
          // Check if user has admin metadata in Clerk
          const isAdmin = clerkUser.publicMetadata?.role === 'admin' || 
                         clerkUser.privateMetadata?.role === 'admin'
          
          if (isAdmin) {
            // Sync with internal auth system
            const result = await login({
              username: clerkUser.emailAddresses[0]?.emailAddress || clerkUser.username,
              clerkUserId: clerkUser.id,
              fromClerk: true
            })
            
            if (!result.success) {
              console.warn('Failed to sync Clerk user with internal system')
            }
          }
        } catch (error) {
          console.error('Error syncing Clerk auth:', error)
        }
      }
      
      syncClerkWithInternal()
    } else if (!isSignedIn && isAuthenticated) {
      // User signed out of Clerk but still authenticated internally
      logout('Clerk session ended')
    }
  }, [isSignedIn, clerkUser, isAuthenticated, login, logout])

  return children
}

export default ClerkAuthWrapper