import React from 'react'

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className={`
          animate-spin rounded-full border-2 border-gray-300 border-t-blue-600
          ${sizeClasses[size]} ${className}
        `}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner