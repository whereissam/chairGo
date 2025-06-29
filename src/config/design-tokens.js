// ChairGo Design Tokens
// Centralized design configuration for consistent theming

export const designTokens = {
  // === COLORS ===
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',  // Accent color
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    wood: {
      50: '#fefdf8',
      100: '#fef7e0',
      200: '#fdecc8',
      300: '#fbd770',  // Wood accent for furniture
      400: '#f9c23c',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  
  // === TYPOGRAPHY ===
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display', 'Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  
  // === SPACING ===
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },
  
  // === BORDERS ===
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  borderWidth: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  
  // === SHADOWS ===
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // === ANIMATIONS ===
  animations: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // === BREAKPOINTS ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // === Z-INDEX ===
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    modal: 1000,
    popover: 1010,
    tooltip: 1020,
    toast: 1030,
  },
}

// === COMPONENT VARIANTS ===
export const componentVariants = {
  // Button variants
  button: {
    primary: {
      bg: 'bg-primary-600',
      hover: 'hover:bg-primary-700',
      text: 'text-white',
      border: 'border-transparent',
    },
    secondary: {
      bg: 'bg-white',
      hover: 'hover:bg-neutral-50',
      text: 'text-neutral-900',
      border: 'border-neutral-300',
    },
    outline: {
      bg: 'bg-transparent',
      hover: 'hover:bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-600',
    },
    ghost: {
      bg: 'bg-transparent',
      hover: 'hover:bg-neutral-100',
      text: 'text-neutral-600',
      border: 'border-transparent',
    },
  },
  
  // Input variants
  input: {
    default: {
      bg: 'bg-white',
      border: 'border-neutral-300',
      focus: 'focus:border-primary-500 focus:ring-primary-500',
      text: 'text-neutral-900',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-300',
      focus: 'focus:border-red-500 focus:ring-red-500',
      text: 'text-neutral-900',
    },
  },
  
  // Card variants
  card: {
    default: {
      bg: 'bg-white',
      border: 'border-neutral-200',
      shadow: 'shadow-md',
      rounded: 'rounded-lg',
    },
    elevated: {
      bg: 'bg-white',
      border: 'border-neutral-200',
      shadow: 'shadow-xl',
      rounded: 'rounded-xl',
    },
    flat: {
      bg: 'bg-white',
      border: 'border-neutral-200',
      shadow: 'shadow-none',
      rounded: 'rounded-lg',
    },
  },
}

// === FURNITURE-SPECIFIC TOKENS ===
export const furnitureTokens = {
  materials: {
    wood: {
      light: '#fbd770',
      medium: '#d97706',
      dark: '#92400e',
    },
    metal: {
      chrome: '#e5e7eb',
      bronze: '#92400e',
      black: '#1f2937',
    },
    fabric: {
      neutral: '#f3f4f6',
      warm: '#fef3c7',
      cool: '#dbeafe',
    },
  },
  
  categories: {
    office: {
      primary: '#1e40af',
      accent: '#3b82f6',
      bg: '#eff6ff',
    },
    living: {
      primary: '#92400e',
      accent: '#d97706',
      bg: '#fef7e0',
    },
    dining: {
      primary: '#86198f',
      accent: '#c026d3',
      bg: '#fdf4ff',
    },
    bedroom: {
      primary: '#1e3a8a',
      accent: '#3b82f6',
      bg: '#eff6ff',
    },
    outdoor: {
      primary: '#166534',
      accent: '#22c55e',
      bg: '#f0fdf4',
    },
  },
}

export default designTokens