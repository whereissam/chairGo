import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

// Card variants
const cardVariants = cva(
  'rounded-lg bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border shadow-sm',
        elevated: 'border shadow-lg',
        outline: 'border-2',
        ghost: 'border-0 shadow-none bg-transparent',
        filled: 'border-0 shadow-sm bg-muted/50',
      },
      size: {
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Base Card component
const Card = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  hover = false,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      cardVariants({ variant, size }),
      hover && 'transition-shadow duration-200 hover:shadow-md',
      className
    )}
    {...props}
  />
))

Card.displayName = 'Card'

// Card Header component
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

// Card Title component
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

// Card Description component
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

// Card Content component
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pb-6', className)}
    {...props}
  />
))

CardContent.displayName = 'CardContent'

// Card Footer component
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
))

CardFooter.displayName = 'CardFooter'

// Product Card specialized component
const ProductCard = React.forwardRef(({
  image,
  title,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  onSale = false,
  inStock = true,
  onClick,
  onAddToCart,
  className,
  ...props
}, ref) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card
      ref={ref}
      variant="default"
      hover
      className={cn(
        'group cursor-pointer overflow-hidden transition-all duration-200',
        !inStock && 'opacity-75',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {onSale && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              SALE
            </span>
          )}
          {badge && (
            <span className="bg-primary-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {badge}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 text-sm font-semibold rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <CardContent size="sm" className="pt-4">
        {/* Title */}
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviews && (
              <span className="text-xs text-muted-foreground">({reviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg text-primary">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Add to Cart Button */}
      {inStock && onAddToCart && (
        <CardFooter className="pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart()
            }}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </CardFooter>
      )}
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

// Stats Card component
const StatsCard = React.forwardRef(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
  ...props
}, ref) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card ref={ref} className={cn('', className)} {...props}>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={cn('text-xs', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className="h-8 w-8 text-muted-foreground" />
        )}
      </CardContent>
    </Card>
  )
})

StatsCard.displayName = 'StatsCard'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ProductCard,
  StatsCard,
  cardVariants,
}

export default Card