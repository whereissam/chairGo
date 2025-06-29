import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

// Button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-orange-600 text-white hover:bg-orange-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        fit: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      width: 'auto',
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  width,
  loading = false,
  disabled = false,
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, width, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

// Button group component for related actions
const ButtonGroup = ({ children, className, orientation = 'horizontal', ...props }) => {
  const orientationClasses = {
    horizontal: 'flex-row space-x-0 [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none [&>button:not(:last-child)]:border-r-0',
    vertical: 'flex-col space-y-0 [&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none [&>button:not(:last-child)]:border-b-0',
  }

  return (
    <div 
      className={cn(
        'inline-flex',
        orientationClasses[orientation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Icon button component
const IconButton = React.forwardRef(({ 
  icon: Icon, 
  'aria-label': ariaLabel,
  tooltip,
  ...props 
}, ref) => {
  const button = (
    <Button
      ref={ref}
      size="icon"
      aria-label={ariaLabel}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  if (tooltip) {
    return (
      <div className="relative group">
        {button}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    )
  }

  return button
})

IconButton.displayName = 'IconButton'

export { Button, ButtonGroup, IconButton, buttonVariants }
export default Button