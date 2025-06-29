# ChairGo Design System

A comprehensive design system for the ChairGo furniture e-commerce platform, built with modern web standards and accessibility in mind.

## 🎨 Design Philosophy

ChairGo's design system reflects the brand's commitment to quality furniture and exceptional user experience:

- **Modern Minimalism**: Clean, uncluttered interfaces that let products shine
- **Warmth & Comfort**: Furniture-inspired colors and materials
- **Accessibility First**: WCAG 2.1 AA compliant components
- **Responsive Design**: Mobile-first, works on all devices
- **Performance Focused**: Optimized for fast loading times

## 🏗️ Architecture

### Design Tokens
Centralized design decisions stored in `/src/config/design-tokens.js`:
- Colors (Primary, Secondary, Neutral, Semantic)
- Typography (Font families, sizes, weights)
- Spacing (8px base unit system)
- Borders & Shadows
- Animations & Transitions

### Component Library
Reusable components in `/src/components/design-system/`:
- **Button**: Multiple variants with consistent styling
- **Input**: Form inputs with validation states
- **Card**: Product cards, content cards, stats cards
- **Modal**: Overlays and dialogs
- **Navigation**: Headers, footers, breadcrumbs

## 🎨 Color System

### Primary Colors - ChairGo Blue
Used for primary actions, links, and brand elements.
```css
--color-primary-500: #3b82f6  /* Main brand color */
--color-primary-600: #2563eb  /* Hover states */
--color-primary-700: #1d4ed8  /* Active states */
```

### Secondary Colors - Accent Purple
Used for secondary actions and highlights.
```css
--color-secondary-500: #d946ef  /* Secondary brand */
--color-secondary-600: #c026d3  /* Hover states */
```

### Wood Tones - Furniture Accent
Warm colors inspired by natural wood materials.
```css
--color-wood-300: #fbd770  /* Light wood accent */
--color-wood-500: #f59e0b  /* Medium wood tone */
--color-wood-700: #b45309  /* Dark wood tone */
```

### Neutral Colors
Grayscale palette for text, borders, and backgrounds.
```css
--color-neutral-50: #fafafa   /* Light background */
--color-neutral-900: #171717  /* Dark text */
```

### Semantic Colors
Status and feedback colors.
```css
--color-success: #22c55e  /* Success states */
--color-warning: #f59e0b  /* Warning states */
--color-error: #ef4444    /* Error states */
--color-info: #3b82f6     /* Info states */
```

## 📝 Typography

### Font Stack
```css
--font-family-sans: 'Inter', system-ui, sans-serif
--font-family-serif: 'Playfair Display', Georgia, serif
--font-family-mono: 'JetBrains Mono', monospace
```

### Type Scale
Based on a modular scale for consistent hierarchy:
```css
--font-size-xs: 0.75rem    /* 12px - Captions */
--font-size-sm: 0.875rem   /* 14px - Small text */
--font-size-base: 1rem     /* 16px - Body text */
--font-size-lg: 1.125rem   /* 18px - Large body */
--font-size-xl: 1.25rem    /* 20px - Subheadings */
--font-size-2xl: 1.5rem    /* 24px - Headings */
--font-size-3xl: 1.875rem  /* 30px - Large headings */
--font-size-4xl: 2.25rem   /* 36px - Display */
--font-size-5xl: 3rem      /* 48px - Hero text */
```

### Text Hierarchy
- **H1**: Display text, hero sections (48px, bold)
- **H2**: Page titles (36px, bold)
- **H3**: Section headers (30px, semibold)
- **H4**: Subsection headers (24px, semibold)
- **H5**: Component titles (20px, medium)
- **H6**: Small headers (18px, medium)
- **Body**: Regular text (16px, normal)
- **Caption**: Small text (14px, normal)
- **Label**: Form labels (12px, medium)

## 📏 Spacing System

8px base unit system for consistent spacing:
```css
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-4: 1rem     /* 16px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
```

### Usage Guidelines
- Use `space-4` (16px) for most component internal spacing
- Use `space-6` (24px) for section spacing
- Use `space-8` (32px) for large section breaks
- Use `space-12` (48px) for page-level spacing

## 🔲 Component Guidelines

### Buttons

```jsx
// Primary action button
<Button variant="primary" size="default">
  Add to Cart
</Button>

// Secondary action button
<Button variant="secondary" size="default">
  View Details
</Button>

// Destructive action button
<Button variant="destructive" size="default">
  Remove Item
</Button>
```

### Input Fields

```jsx
// Standard input with label
<InputField 
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// Input with error state
<InputField 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>
```

### Cards

```jsx
// Product card
<ProductCard
  image="/product-image.jpg"
  title="Ergonomic Office Chair"
  price={299.99}
  originalPrice={399.99}
  rating={4.5}
  reviews={127}
  onSale={true}
  onClick={handleViewProduct}
  onAddToCart={handleAddToCart}
/>

// Content card
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Product Features</CardTitle>
    <CardDescription>Key benefits of this chair</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px   /* Mobile landscape */
--breakpoint-md: 768px   /* Tablet portrait */
--breakpoint-lg: 1024px  /* Tablet landscape */
--breakpoint-xl: 1280px  /* Desktop */
--breakpoint-2xl: 1536px /* Large desktop */
```

### Mobile-First Approach
- Design for mobile screens first (320px+)
- Progressively enhance for larger screens
- Touch-friendly interface elements (44px minimum)
- Readable text sizes (16px minimum)

## ♿ Accessibility

### Color Contrast
- **AA**: Minimum 4.5:1 for normal text
- **AA**: Minimum 3:1 for large text (18px+ or bold 14px+)
- **AAA**: Minimum 7:1 for enhanced contrast

### Focus Management
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

### Semantic HTML
- Use proper heading hierarchy (h1-h6)
- Include alt text for images
- Use semantic elements (nav, main, section, article)
- Provide aria-labels for interactive elements

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Clear focus indicators
- Skip links for main content

## 🎭 Animation & Motion

### Transition Durations
```css
--duration-150: 150ms  /* Quick interactions */
--duration-300: 300ms  /* Standard transitions */
--duration-500: 500ms  /* Complex animations */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1)     /* Standard easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) /* Smooth easing */
```

### Motion Guidelines
- Use subtle animations to enhance UX
- Respect `prefers-reduced-motion` setting
- Keep animations under 300ms for interactions
- Use consistent easing across the interface

## 🧪 Testing & Quality

### Component Testing
Each design system component includes:
- Unit tests for functionality
- Visual regression tests
- Accessibility tests
- Performance tests

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Usage

### Installation
```bash
# Install required dependencies
npm install class-variance-authority clsx tailwind-merge

# Import design system styles
import './styles/design-system.css'
```

### Component Usage
```jsx
import { Button, Card, Input } from '@/components/design-system'
import { cn } from '@/utils/cn'

function MyComponent() {
  return (
    <Card className={cn('custom-class')}>
      <Input placeholder="Search products..." />
      <Button variant="primary">Search</Button>
    </Card>
  )
}
```

## 🔄 Updates & Maintenance

### Version Control
- Follow semantic versioning (major.minor.patch)
- Document breaking changes
- Provide migration guides
- Maintain backwards compatibility when possible

### Contributing
1. Follow the established patterns
2. Include comprehensive tests
3. Update documentation
4. Consider accessibility impact
5. Test across supported browsers

## 📚 Resources

### Design Tools
- **Figma**: Component library and design tokens
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing

### Documentation
- Component API documentation
- Usage examples and patterns
- Accessibility guidelines
- Performance best practices

---

*This design system is a living document that evolves with the ChairGo platform. For questions or contributions, please reach out to the design system team.*