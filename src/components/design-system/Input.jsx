import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

// Input variants
const inputVariants = cva(
  'flex w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input bg-background',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Base Input component
const Input = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  error,
  ...props 
}, ref) => {
  const inputVariant = error ? 'error' : variant

  return (
    <input
      className={cn(inputVariants({ variant: inputVariant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

// Input with label component
const InputField = React.forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className,
  ...props
}, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label 
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Input
        ref={ref}
        id={id}
        error={error}
        {...props}
      />
      {(error || helperText) && (
        <div className="flex items-center space-x-1 text-xs">
          {error && <AlertCircle className="h-3 w-3 text-destructive" />}
          <span className={error ? 'text-destructive' : 'text-muted-foreground'}>
            {error || helperText}
          </span>
        </div>
      )}
    </div>
  )
})

InputField.displayName = 'InputField'

// Password input with toggle visibility
const PasswordInput = React.forwardRef(({
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

// Search input with icon
const SearchInput = React.forwardRef(({
  className,
  placeholder = 'Search...',
  onClear,
  ...props
}, ref) => {
  const [value, setValue] = React.useState(props.value || '')

  const handleChange = (e) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  const handleClear = () => {
    setValue('')
    onClear?.()
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn('pl-10 pr-8', className)}
        {...props}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

// Textarea component
const Textarea = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

// Input group for combining inputs with addons
const InputGroup = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn('flex rounded-md shadow-sm', className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0
          const isLast = index === React.Children.count(children) - 1
          
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              !isFirst && 'rounded-l-none border-l-0',
              !isLast && 'rounded-r-none'
            )
          })
        }
        return child
      })}
    </div>
  )
}

// Input addon components
const InputAddon = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-input',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { 
  Input, 
  InputField, 
  PasswordInput, 
  SearchInput, 
  Textarea,
  InputGroup,
  InputAddon,
  inputVariants 
}
export default Input