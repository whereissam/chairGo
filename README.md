# ChairGo - Modern Furniture Store 🪑

A modern, responsive e-commerce furniture store built with React and Tailwind CSS, featuring multilingual support, advanced animations, and a powerful admin system.

## ✨ Features

- **Modern React Architecture**: Built with React 19 and latest best practices
- **Stunning Animations**: Advanced GSAP scroll animations and effects
- **Responsive Design**: Fully responsive design that works on all devices
- **Multilingual Support**: Built-in internationalization with i18next
- **Shopping Cart**: Full-featured shopping cart with persistent storage
- **Product Management**: Complete product catalog with filtering and search
- **Checkout Process**: Streamlined checkout flow
- **Admin System**: Cloudflare Workers-based admin API with JWT authentication
- **Theme Support**: Dark/light theme toggle
- **Performance Optimized**: Fast loading with code splitting and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, React Router 7
- **Styling**: Tailwind CSS 4, Tailwind CSS Animate
- **Animations**: GSAP (GreenSock) with ScrollTrigger
- **UI Components**: Radix UI, Heroicons, Lucide React
- **State Management**: React Context API
- **Internationalization**: i18next, react-i18next
- **Build Tool**: Vite 7
- **Package Manager**: npm

### Backend (Admin API)
- **Framework**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Runtime**: Cloudflare Workers

## 📦 Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd chairGo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Admin API Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Install Wrangler CLI:
```bash
npm install -g wrangler
```

4. Login to Cloudflare:
```bash
wrangler login
```

5. Create D1 Database:
```bash
# Create the database
wrangler d1 create chairgo-database

# Update wrangler.toml with the database ID returned
```

6. Initialize Database:
```bash
# Run the schema
wrangler d1 execute chairgo-database --file=./schema.sql

# For local development
wrangler d1 execute chairgo-database --local --file=./schema.sql
```

7. Set up environment variables in `wrangler.toml`:
```toml
[vars]
JWT_SECRET = "your-super-secret-jwt-key-here"
```

8. Start local API development:
```bash
npm run dev
```

9. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## 🚀 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Admin API (in `/api` directory)
- `npm run dev` - Start local API server
- `npm run build` - Build API
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm test` - Run API tests

## 🌐 Supported Languages

- English (en)
- Traditional Chinese (zh-tw)
- Simplified Chinese (zh-cn)

## 📱 Key Components

### Frontend Components
- **Landing Page**: Modern animated landing with GSAP effects
- **Product Catalog**: Browse and filter furniture products
- **Shopping Cart**: Add, remove, and manage cart items
- **Checkout**: Complete purchase flow
- **Admin Panel**: Product and order management interface
- **Responsive Navigation**: Modern glassmorphic navigation with animations

### Backend API
- **Authentication System**: JWT-based admin login
- **Product Management**: Full CRUD operations for products
- **User Management**: Admin user management
- **Dashboard**: Statistics and analytics

## 🎨 Design Features

- **Modern Animations**: Advanced GSAP scroll animations with dramatic effects
- **Glassmorphic Design**: Modern navbar with backdrop blur and gradients
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Interactive Elements**: Hover effects, floating particles, and sparkles
- **Performance Optimized**: Lazy loading and code splitting

## 🔐 Admin System

### Default Admin Credentials
- **Username**: `admin`
- **Email**: `admin@chairgo.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

### API Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/products` - Get products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Local Testing
```bash
# Test login endpoint
curl http://localhost:8787/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.
